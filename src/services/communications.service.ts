import DB from "@/database";
import { EmailSendingService } from "@/communications/services/email-sending.service";
import { IntegrationsService } from "@/communications/services/integrations.service";

const emailSendingService = new EmailSendingService();
const integrationsService = new IntegrationsService();

export class CommunicationService {
  public async findByStudentId(studentDbId: string | number) {
    return await DB("communications")
      .where("student_db_id", studentDbId)
      .orderBy("created_at", "desc");
  }

  public async findAll() {
    return await DB("communications")
      .orderBy("created_at", "desc");
  }

  public async findById(id: string | number) {
    const row = await DB("communications").where("id", id).first();
    return row || null;
  }

  public async create(communicationData: any) {
    const insertObj = {
      student_db_id: communicationData.student_db_id,
      type: communicationData.type,
      status: communicationData.status,
      content: communicationData.content,
      sender: communicationData.sender,
    };

    const res = await DB("communications").insert(insertObj).returning("*");
    const communication = res && res[0] ? res[0] : null;

    // Trigger actual email sending if type is Email
    if (communication && communication.type.toLowerCase() === 'email') {
      try {
        // Fetch student email
        const student = await DB("students").where("id", communication.student_db_id).first();
        if (student && student.email) {
          // Send email
          await emailSendingService.sendEmail({
            to: student.email,
            subject: communicationData.subject || "Message from Student Marketplace",
            html: communication.content,
            text: communication.content.replace(/<[^>]*>?/gm, '')
          });
          
          // Update status to sent (if it wasn't already)
          await DB("communications").where("id", communication.id).update({ status: 'sent' });
          communication.status = 'sent';
        }
      } catch (error) {
        console.error('Failed to send email for communication:', error);
        await DB("communications").where("id", communication.id).update({ status: 'failed' });
        communication.status = 'failed';
      }
    }

    return communication;
  }

  public async update(id: string | number, communicationData: any) {
    const updateObj = {
      type: communicationData.type,
      status: communicationData.status,
      content: communicationData.content,
      sender: communicationData.sender,
      updated_at: DB.fn.now(),
    };

    const res = await DB("communications").where("id", id).update(updateObj).returning("*");
    return res && res[0] ? res[0] : null;
  }

  public async delete(id: string | number) {
    const res = await DB("communications").where("id", id).del().returning("*");
    return !!(res && res.length > 0);
  }
}

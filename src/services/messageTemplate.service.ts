import { MessageTemplate } from '@/interfaces/messageTemplate.interface';
import DB from '@/database';
import { Tables } from '@/database/tables';

class MessageTemplateService {
  public async getTemplates(): Promise<MessageTemplate[]> {
    const templates: MessageTemplate[] = await DB(Tables.MESSAGE_TEMPLATES).select('*').orderBy('template_id', 'asc');
    return templates;
  }

  public async getTemplateById(id: string): Promise<MessageTemplate> {
    const template: MessageTemplate = await DB(Tables.MESSAGE_TEMPLATES).where({ template_id: id }).first();
    return template;
  }

  public async createTemplate(templateData: MessageTemplate): Promise<MessageTemplate> {
    const [id] = await DB(Tables.MESSAGE_TEMPLATES).insert(templateData).returning('id');
    return { ...templateData, id };
  }

  public async updateTemplate(id: string, templateData: Partial<MessageTemplate>): Promise<MessageTemplate> {
    await DB(Tables.MESSAGE_TEMPLATES).where({ template_id: id }).update({ ...templateData, updated_at: new Date() });
    return this.getTemplateById(id);
  }

  public async deleteTemplate(id: string): Promise<void> {
    await DB(Tables.MESSAGE_TEMPLATES).where({ template_id: id }).delete();
  }
}

export default MessageTemplateService;

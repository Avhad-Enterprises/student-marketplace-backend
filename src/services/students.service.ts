import DB from "@/database";
import * as fs from 'fs';
import * as path from 'path';

export class StudentService {
  // GET all students with pagination and filters
  public async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    risk_level?: string,
    sort: string = "created_at",
    order: string = "desc"
  ) {
    const offset = (page - 1) * limit;

    // Build count query
    const countQuery = DB('students as s').countDistinct('s.id as count');

    // Build data query with left join to applications
    const dataQuery = DB('students as s')
      .leftJoin('applications as a', 's.id', 'a.student_db_id')
      .select('s.*')
      .count({ applications_count: 'a.id' })
      .groupBy('s.id');

    if (search) {
      const term = `%${search}%`;
      countQuery.where(function () {
        this.whereILike('s.first_name', term)
          .orWhereILike('s.last_name', term)
          .orWhereILike('s.email', term)
          .orWhereILike('s.student_id', term);
      });

      dataQuery.where(function () {
        this.whereILike('s.first_name', term)
          .orWhereILike('s.last_name', term)
          .orWhereILike('s.email', term)
          .orWhereILike('s.student_id', term);
      });
    }

    if (status) {
      const isActive = status === 'active';
      countQuery.where('s.account_status', isActive);
      dataQuery.where('s.account_status', isActive);
    }

    if (risk_level) {
      countQuery.where('s.risk_level', risk_level);
      dataQuery.where('s.risk_level', risk_level);
    }

    const totalRes = await countQuery.first();
    const total = parseInt((totalRes && (totalRes as any).count) || '0');

    const validSortFields = ['first_name', 'last_name', 'email', 'created_at', 'student_id'];
    const finalSort = validSortFields.includes(sort) ? `s.${sort}` : 's.created_at';
    const finalOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const rows = await dataQuery.orderBy(finalSort, finalOrder).limit(limit).offset(offset);

    return {
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET student metrics
  public async getMetrics() {
    const totalStudents = await DB('students').count('* as count').first();
    const activeStudents = await DB('students').where('account_status', true).count('* as count').first();
    const atRiskStudents = await DB('students').where('risk_level', 'high').count('* as count').first();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentlyAdded = await DB('students').where('created_at', '>=', thirtyDaysAgo).count('* as count').first();
    const applicationsInProgress = await DB('applications').where('status', 'in-progress').count('* as count').first();

    return {
      totalStudents: parseInt((totalStudents as any).count || 0),
      activeStudents: parseInt((activeStudents as any).count || 0),
      atRiskStudents: parseInt((atRiskStudents as any).count || 0),
      recentlyAdded: parseInt((recentlyAdded as any).count || 0),
      applicationsInProgress: parseInt((applicationsInProgress as any).count || 0),
    };
  }

  // GET student by ID
  public async findById(id: string | number) {
    const result = await DB('students').where('id', id).first();
    return result || null;
  }

  // CREATE student
  public async create(studentData: any) {
    const student_id = `STU-${Date.now()}`;

    const payload = {
      student_id,
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      email: studentData.email,
      date_of_birth: studentData.dateOfBirth || null,
      country_code: studentData.countryCode,
      phone_number: studentData.phoneNumber,
      nationality: studentData.nationality,
      current_country: studentData.currentCountry,
      primary_destination: studentData.primaryDestination,
      intended_intake: studentData.intendedIntake,
      current_stage: studentData.currentStage,
      assigned_counselor: studentData.assignedCounselor,
      risk_level: studentData.riskLevel || 'low',
      lead_source: studentData.leadSource,
      campaign: studentData.campaign,
      country_preferences: JSON.stringify(studentData.countryPreferences || []),
      notes: studentData.notes,
      account_status: studentData.accountStatus !== undefined ? studentData.accountStatus : true,
    } as any;

    console.log('students.service.create - inserting payload:', payload);
    const inserted = await DB('students').insert(payload).returning(['id', 'student_id']);
    return Array.isArray(inserted) ? inserted[0] : inserted;
  }

  // UPDATE student
  public async update(id: string | number, studentData: any) {
    try {
      const logPath = path.join(process.cwd(), 'backend_debug.log');
      const logData = `${new Date().toISOString()} - Update ID: ${id}, Status: ${studentData.accountStatus} (Type: ${typeof studentData.accountStatus})\n`;
      fs.appendFileSync(logPath, logData);
    } catch (e) {
      console.error("Logging failed", e);
    }

    const payload: any = {
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      email: studentData.email,
      date_of_birth: studentData.dateOfBirth,
      country_code: studentData.countryCode,
      phone_number: studentData.phoneNumber,
      nationality: studentData.nationality,
      current_country: studentData.currentCountry,
      primary_destination: studentData.primaryDestination,
      intended_intake: studentData.intendedIntake,
      current_stage: studentData.currentStage,
      assigned_counselor: studentData.assignedCounselor,
      risk_level: studentData.riskLevel,
      lead_source: studentData.leadSource,
      campaign: studentData.campaign,
      country_preferences: JSON.stringify(studentData.countryPreferences || []),
      notes: studentData.notes,
      account_status: studentData.accountStatus,
      updated_at: DB.fn.now(),
    };

    const updated = await DB('students').where('id', id).update(payload).returning('*');
    return Array.isArray(updated) && updated.length > 0 ? updated[0] : null;
  }

  // DELETE student
  public async delete(id: string | number) {
    const deleted = await DB('students').where('id', id).del().returning('*');
    return Array.isArray(deleted) && deleted.length > 0;
  }

  // DELETE dummy students
  public async deleteDummy() {
    const deleted = await DB('students').where('student_id', 'like', 'STU-%').del();
    return deleted;
  }

  // Get profile completion percentage
  public async getProfileCompletion(id: string | number) {
    const student = await DB('students').where('id', id).first();
    if (!student) return null;
    const fields = [
      "first_name",
      "last_name",
      "email",
      "date_of_birth",
      "country_code",
      "phone_number",
      "nationality",
      "current_country",
      "primary_destination",
      "intended_intake",
      "current_stage",
      "assigned_counselor",
    ];

    const completedFields = fields.filter((f) => student[f] && student[f].toString().trim() !== "");
    const percentage = Math.round((completedFields.length / fields.length) * 100);

    return {
      percentage,
      completedFields,
      totalFields: fields.length,
    };
  }
}

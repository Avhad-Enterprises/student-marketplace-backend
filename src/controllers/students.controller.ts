import { Request, Response, NextFunction } from "express";
import { StudentService } from "@/services/students.service";
import { ExportRunner, ExportOptions } from "@/utils/exportRunner";

export class StudentController {
  private studentService = new StudentService();

  // GET /api/students
  public getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, search, status, risk_level, sort = "created_at", order = "desc" } = req.query;
      
      const result = await this.studentService.findAll(
        Number(page),
        Number(limit),
        search as string,
        status as string,
        risk_level as string,
        sort as string,
        order as string
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/students/metrics
  public getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await this.studentService.getMetrics();
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  };

  // GET /api/students/:id
  public getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const student = await this.studentService.findById(req.params.id);
      
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Ownership Validation: Admin bypass OR student_code match (case-insensitive)
      const isOwner = user?.student_code && student.student_id && 
                      user.student_code.toLowerCase() === student.student_id.toLowerCase();
      
      const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to access this student profile" });
      }

      res.json(student);
    } catch (err) {
      next(err);
    }
  };

  // POST /api/students
  public createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.studentService.create(req.body);
      res.status(201).json({
        id: result.id,
        student_id: result.student_id,
        message: "Student created",
      });
    } catch (err) {
      next(err);
    }
  };

  // PUT /api/students/:id
  public updateStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await this.studentService.update(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student updated" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/students/:id
  public deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.studentService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student deleted" });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/students/delete/dummy
  public deleteDummyStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await this.studentService.deleteDummy();
      res.json({ message: `Deleted ${count} dummy students` });
    } catch (err) {
      next(err);
    }
  };

  // GET /api/students/:id/profile-completion
  public getProfileCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const result = await this.studentService.getProfileCompletion(req.params.id);
      
      if (!result) {
        return res.status(404).json({ error: "Student not found" });
      }

      // We need the student record to check the student_id for ownership
      const student = await this.studentService.findById(req.params.id);
      
      // Ownership Validation: Admin bypass OR student_code match (case-insensitive)
      const isOwner = user?.student_code && student?.student_id && 
                      user.student_code.toLowerCase() === student.student_id.toLowerCase();

      const isAdmin = user?.user_type === 'admin' || user?.role === 'admin';

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to access this profile completion status" });
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public importStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (!Array.isArray(data)) {
        res.status(400).json({ message: 'Input data must be an array' });
        return;
      }
      const result = await this.studentService.importStudents(data);
      res.status(200).json({ data: result, message: 'importStudents' });
    } catch (err) {
      next(err);
    }
  };

  public exportStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.studentService.exportStudents(req.query);
      
      const keyMap = {
        'id': 'id',
        'Student ID': 'student_id',
        'First Name': 'first_name',
        'Last Name': 'last_name',
        'Email': 'email',
        'Date of Birth': 'date_of_birth',
        'Country Code': 'country_code',
        'Phone Number': 'phone_number',
        'Nationality': 'nationality',
        'Current Country': 'current_country',
        'Primary Destination': 'primary_destination',
        'Intended Intake': 'intended_intake',
        'Current Stage': 'current_stage',
        'Assigned Counselor': 'assigned_counselor',
        'Risk Level': 'risk_level',
        'Lead Source': 'lead_source',
        'Campaign': 'campaign',
        'Notes': 'notes',
        'Account Status': 'account_status',

        // Education Snapshot
        'Highest Qualification': 'highest_qualification',
        'Field of Study': 'field_of_study',
        'Current Institution': 'current_institution',
        'Graduation Year': 'graduation_year',
        'GPA': 'gpa',

        // Lead & Attribution
        'First Touch Date': 'first_touch_date',
        'Conversion Path': 'conversion_path_summary',

        // Intent & Preferences
        'Preferred Course Level': 'preferred_course_level',
        'Budget Range': 'budget_range',
        'Intake Preference': 'intake_preference',
        'Test Scores': 'test_scores',
        'Student Intent': 'student_intent',
        'Communication Preference': 'communication_preference',
        'Timezone': 'timezone',

        // Planning & Application
        'Planning Countries': 'planning_countries',
        'Planning Intake': 'planning_intake',
        'Planning Course Level': 'planning_course_level',
        'Planning Field of Study': 'planning_field_of_study',
        'Career Goal': 'career_goal',
        'Long Term Plan': 'long_term_plan',
        'Annual Budget': 'annual_budget',
        'Funding Source': 'funding_source',
        'Family Constraints': 'family_constraints',
        'Timeline Urgency': 'timeline_urgency',
        'Consultation Notes': 'consultation_notes',

        // Evaluation
        'Grading System': 'eval_grading_system',
        'Institution Tier': 'eval_institution_tier',
        'Backlogs': 'eval_backlogs',
        'Work Experience': 'eval_work_exp',
        'Field Relevance': 'eval_field_relevance',
        'Internships': 'eval_internships',
        'Research': 'eval_research',
        'Gap Years': 'eval_gap_years',
        'Additional Evaluation Notes': 'eval_additional_notes',

        // Eligibility
        'Prerequisites Met': 'eligibility_prerequisites',
        'Bridge Course Required': 'eligibility_bridge_course',
        'English Test Met': 'eligibility_english_test',
        'Funds Ready': 'eligibility_funds_ready',
        'Sponsor Identified': 'eligibility_sponsor_identified',
        'Loan Required': 'eligibility_loan_required',
        'Gap Explanation': 'eligibility_gap_explanation',
        'Visa Risk': 'visa_risk',
        'Visa Notes': 'visa_notes',

        // Career
        'Intended Job Role': 'intended_job_role',
        'Preferred Industry': 'preferred_industry',
        'Career Country Preference': 'career_country_preference',
        'Job Market Awareness': 'job_market_awareness',
        'Salary Expectations': 'salary_expectations',
        'Stay Back Interest': 'stay_back_interest',
        'Career Discussion Notes': 'career_discussion_notes',

        // Shortlisting & App Strategy
        'Shortlisted Universities': 'shortlisted_universities',
        'Shortlisted Courses': 'shortlisted_course_details',
        'Shortlisted Country': 'shortlisted_country',
        'Shortlisted Priority': 'shortlisted_priority',
        'Shortlisted Intake': 'shortlisted_intake',
        'Budget Fit': 'shortlisted_budget_fit',
        'Eligibility Fit': 'shortlisted_eligibility_fit',
        'Visa Safety': 'shortlisted_visa_safety',
        'Application Order': 'app_strategy_order',
        'Application Type': 'app_strategy_type',
        'Deadline Awareness': 'app_strategy_deadline_awareness',
        'Deadline Risk': 'app_strategy_deadline_risk',
        'SOP Approach': 'app_strategy_sop_approach',
        'Customization Level': 'app_strategy_customization_level',
        'LOR Type': 'app_strategy_lor_type',
        'LOR Count': 'app_strategy_lor_count',
        'Strategy Notes': 'app_strategy_notes',

        // SOP & LOR
        'SOP Version': 'sop_version',
        'SOP Draft Status': 'sop_draft_status',
        'Assigned Editor': 'sop_assigned_editor',
        'SOP Structure Quality': 'sop_structure_quality',
        'SOP Relevance': 'sop_content_relevance',
        'SOP Language Clarity': 'sop_language_clarity',
        'SOP Feedback': 'sop_feedback_notes',
        'SOP Revisions': 'sop_revision_count',
        'LORs Required': 'lor_count_required',
        'Recommender Name': 'lor_recommender_name',
        'Recommender Relation': 'lor_recommender_relation',
        'Recommender Email': 'lor_recommender_email',
        'LOR Status': 'lor_current_status',
        'LOR Coordination Notes': 'lor_coordination_notes',

        // Submission Support
        'SOP Uploaded': 'submission_sop_uploaded',
        'LORs Uploaded': 'submission_lors_uploaded',
        'Transcripts Uploaded': 'submission_transcripts_uploaded',
        'Fee Paid': 'submission_fee_paid',
        'Submission Portal': 'submission_portal',
        'Confirmation Received': 'submission_confirmation_received',
        'Submission Errors': 'submission_errors_faced',
        'Resolution Notes': 'submission_resolution_notes',

        // Offer Review & Decision
        'Offer University': 'offer_university_name',
        'Offer Course': 'offer_course_name',
        'Offer Country': 'offer_country',
        'Offer Intake': 'offer_intake',
        'Offer Type': 'offer_type',
        'Conditions': 'offer_conditions',
        'Offer Deadline': 'offer_deadline',
        'Deposit Required': 'offer_deposit_required',
        'Deposit Amount': 'offer_deposit_amount',
        'Tuition Fee': 'offer_tuition_fee',
        'Living Cost': 'offer_living_cost',
        'Scholarship': 'offer_scholarship',
        'Total Cost': 'offer_total_cost',
        'Course Relevance': 'offer_course_relevance',
        'University Ranking': 'offer_university_ranking',
        'Employability Outlook': 'offer_employability_outlook',
        'Industry Alignment': 'offer_industry_alignment',
        'Visa Probability': 'offer_visa_probability',
        'Country Risks': 'offer_country_risks',
        'Gap Sensitivity': 'offer_gap_sensitivity',
        'Preference Level': 'offer_preference_level',
        'Family Concerns': 'offer_family_concerns',
        'Student Questions': 'offer_student_questions',
        'Discussion Summary': 'offer_discussion_summary',

        // Visa & Compliance
        'Visa Target Country': 'visa_target_country',
        'Visa Type': 'visa_type',
        'Visa Start Date': 'visa_start_date',
        'Visa University': 'visa_university_name',
        'Visa Offer Uploaded': 'visa_offer_uploaded',
        'CAS Status': 'visa_cas_status',
        'Funds Proof Available': 'visa_funds_proof_available',
        'Funds Source': 'visa_funds_source',
        'Loan Status': 'visa_loan_status',
        'Bank Statement Duration': 'visa_bank_statement_duration',
        'Passport Validity': 'visa_passport_validity',
        'Visa Transcripts Uploaded': 'visa_transcripts_uploaded',
        'Language Report Uploaded': 'visa_language_report_uploaded',
        'Medical Uploaded': 'visa_medical_uploaded',
        'Visa Form Filled': 'visa_form_filled',
        'Biometrics Required': 'visa_biometrics_required',
        'Appointment Booked': 'visa_appointment_booked',
        'Appointment Date': 'visa_appointment_date',
        'Interview Required': 'visa_interview_required',
        'Interview Prep Done': 'visa_interview_prep_done',
        'Mock Interview Notes': 'visa_mock_interview_notes',
        'Special Case Notes': 'visa_special_case_notes',
        'Internal Remarks': 'visa_internal_remarks',

        // Compliance
        'Comp Visa Start Date': 'comp_visa_start_date',
        'Comp Visa Expiry Date': 'comp_visa_expiry_date',
        'Multiple Entry': 'comp_multiple_entry',
        'Work Restrictions': 'comp_work_restrictions',
        'Attendance Req': 'comp_attendance_req',
        'Address Reporting': 'comp_address_reporting',
        'Extension Eligible': 'comp_extension_eligible',
        'Extension Type': 'comp_extension_type',
        'Renewal Window': 'comp_renewal_window',
        'Checkins Required': 'comp_checkins_required',
        'Last Review Date': 'comp_last_review_date',
        'Issues Noted': 'comp_issues_noted',
        'PSW Interest': 'comp_psw_interest',
        'Eligibility Awareness': 'comp_eligibility_awareness',
        'Compliance Notes': 'comp_notes',

        // Pre-Departure
        'Travel Date': 'predep_travel_date',
        'Flight Booked': 'predep_flight_booked',
        'Airline Name': 'predep_airline_name',
        'Departure Airport': 'predep_departure_airport',
        'Arrival Airport': 'predep_arrival_airport',
        'Accommodation Type': 'predep_accommodation_type',
        'Accommodation Confirmed': 'predep_accommodation_confirmed',
        'Accommodation Address': 'predep_address',
        'Initial Stay Duration': 'predep_initial_stay_duration',
        'Insurance Arranged': 'predep_insurance_arranged',
        'Forex Ready': 'predep_forex_ready',
        'Docs Collected': 'predep_docs_collected',
        'Emergency Contact': 'predep_emergency_contact',
        'Orientation Attended': 'predep_orientation_attended',
        'Rules Explained': 'predep_rules_explained',
        'Reporting Instructions Shared': 'predep_reporting_instructions_shared',
        'Packing Guidance Shared': 'predep_packing_guidance_shared',
        'Restricted Items Explained': 'predep_restricted_items_explained',
        'Weather Awareness': 'predep_weather_awareness',
        'Pre-Departure Notes': 'predep_notes'
      };

      const result = await ExportRunner.run(data, req.query as unknown as ExportOptions, 'Students', keyMap);
      
      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename=students-export-${Date.now()}.${result.extension}`);
      res.status(200).send(result.data);
    } catch (err) {
      next(err);
    }
  };
}

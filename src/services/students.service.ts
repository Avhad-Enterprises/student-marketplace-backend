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
      
      highest_qualification: studentData.highestQualification,
      field_of_study: studentData.fieldOfStudy,
      current_institution: studentData.currentInstitution,
      graduation_year: studentData.graduationYear,
      gpa: studentData.gpa,
      
      first_touch_date: studentData.firstTouchDate,
      conversion_path_summary: studentData.conversionPathSummary,
      
      preferred_course_level: studentData.preferredCourseLevel,
      budget_range: studentData.budgetRange,
      intake_preference: studentData.intakePreference,
      test_scores: studentData.testScores,
      
      student_intent: studentData.studentIntent,
      interested_services: JSON.stringify(studentData.interestedServices || []),
      communication_preference: studentData.communicationPreference,
      timezone: studentData.timezone,


      // Planning & Application fields
      planning_countries: studentData.planningCountries,
      planning_intake: studentData.planningIntake,
      planning_course_level: studentData.planningCourseLevel,
      planning_field_of_study: studentData.planningFieldOfStudy,
      career_goal: studentData.careerGoal,
      long_term_plan: studentData.longTermPlan,
      annual_budget: studentData.annualBudget,
      funding_source: studentData.fundingSource,
      family_constraints: studentData.familyConstraints,
      timeline_urgency: studentData.timelineUrgency,
      consultation_notes: studentData.consultationNotes,
      
      eval_grading_system: studentData.evalGradingSystem,
      eval_institution_tier: studentData.evalInstitutionTier,
      eval_backlogs: studentData.evalBacklogs,
      eval_work_exp: studentData.evalWorkExp,
      eval_field_relevance: studentData.evalFieldRelevance,
      eval_internships: studentData.evalInternships,
      eval_research: studentData.evalResearch,
      eval_gap_years: studentData.evalGapYears,
      eval_additional_notes: studentData.evalAdditionalNotes,
      
      eligibility_prerequisites: studentData.eligibilityPrerequisites,
      eligibility_bridge_course: studentData.eligibilityBridgeCourse,
      eligibility_english_test: studentData.eligibilityEnglishTest,
      eligibility_funds_ready: studentData.eligibilityFundsReady,
      eligibility_sponsor_identified: studentData.eligibilitySponsorIdentified,
      eligibility_loan_required: studentData.eligibilityLoanRequired,
      eligibility_gap_explanation: studentData.eligibilityGapExplanation,
      visa_risk: studentData.visaRisk,
      visa_notes: studentData.visaNotes,
      
      intended_job_role: studentData.intendedJobRole,
      preferred_industry: studentData.preferredIndustry,
      career_country_preference: studentData.careerCountryPreference,
      job_market_awareness: studentData.jobMarketAwareness,
      salary_expectations: studentData.salaryExpectations,
      stay_back_interest: studentData.stayBackInterest,
      career_discussion_notes: studentData.careerDiscussionNotes,

      shortlisted_universities: studentData.shortlistedUniversities,
      shortlisted_course_details: studentData.shortlistedCourseDetails,
      shortlisted_country: studentData.shortlistedCountry,
      shortlisted_priority: studentData.shortlistedPriority,
      shortlisted_intake: studentData.shortlistedIntake,
      shortlisted_budget_fit: studentData.shortlistedBudgetFit,
      shortlisted_eligibility_fit: studentData.shortlistedEligibilityFit,
      shortlisted_visa_safety: studentData.shortlistedVisaSafety,

      app_strategy_order: studentData.appStrategyOrder,
      app_strategy_type: studentData.appStrategyType,
      app_strategy_deadline_awareness: studentData.appStrategyDeadlineAwareness,
      app_strategy_deadline_risk: studentData.appStrategyDeadlineRisk,
      app_strategy_sop_approach: studentData.appStrategySopApproach,
      app_strategy_customization_level: studentData.appStrategyCustomizationLevel,
      app_strategy_lor_type: studentData.appStrategyLorType,
      app_strategy_lor_count: studentData.appStrategyLorCount,
      app_strategy_notes: studentData.appStrategyNotes,

      sop_version: studentData.sopVersion,
      sop_draft_status: studentData.sopDraftStatus,
      sop_assigned_editor: studentData.sopAssignedEditor,
      sop_structure_quality: studentData.sopStructureQuality,
      sop_content_relevance: studentData.sopContentRelevance,
      sop_language_clarity: studentData.sopLanguageClarity,
      sop_feedback_notes: studentData.sopFeedbackNotes,
      sop_revision_count: studentData.sopRevisionCount,

      lor_count_required: studentData.lorCountRequired,
      lor_recommender_name: studentData.lorRecommenderName,
      lor_recommender_relation: studentData.lorRecommenderRelation,
      lor_recommender_email: studentData.lorRecommenderEmail,
      lor_current_status: studentData.lorCurrentStatus,
      lor_coordination_notes: studentData.lorCoordinationNotes,

      submission_sop_uploaded: studentData.submissionSopUploaded,
      submission_lors_uploaded: studentData.submissionLorsUploaded,
      submission_transcripts_uploaded: studentData.submissionTranscriptsUploaded,
      submission_fee_paid: studentData.submissionFeePaid,
      submission_portal: studentData.submissionPortal,
      submission_confirmation_received: studentData.submissionConfirmationReceived,
      submission_errors_faced: studentData.submissionErrorsFaced,
      submission_resolution_notes: studentData.submissionResolutionNotes,

      // Offer Review & Decision fields
      offer_university_name: studentData.offerUniversityName,
      offer_course_name: studentData.offerCourseName,
      offer_country: studentData.offerCountry,
      offer_intake: studentData.offerIntake,
      offer_type: studentData.offerType,
      offer_conditions: studentData.offerConditions,
      offer_deadline: studentData.offerDeadline || null,
      offer_deposit_required: studentData.offerDepositRequired,
      offer_deposit_amount: studentData.offerDepositAmount,
      offer_tuition_fee: studentData.offerTuitionFee,
      offer_living_cost: studentData.offerLivingCost,
      offer_scholarship: studentData.offerScholarship,
      offer_total_cost: studentData.offerTotalCost,
      offer_course_relevance: studentData.offerCourseRelevance,
      offer_university_ranking: studentData.offerUniversityRanking,
      offer_employability_outlook: studentData.offerEmployabilityOutlook,
      offer_industry_alignment: studentData.offerIndustryAlignment,
      offer_visa_probability: studentData.offerVisaProbability,
      offer_country_risks: studentData.offerCountryRisks,
      offer_gap_sensitivity: studentData.offerGapSensitivity,
      offer_preference_level: studentData.offerPreferenceLevel,
      offer_family_concerns: studentData.offerFamilyConcerns,
      offer_student_questions: studentData.offerStudentQuestions,
      offer_discussion_summary: studentData.offerDiscussionSummary,

      // Visa & Compliance fields
      visa_target_country: studentData.visaTargetCountry,
      visa_type: studentData.visaType,
      visa_start_date: studentData.visaStartDate || null,
      visa_university_name: studentData.visaUniversityName,
      visa_offer_uploaded: studentData.visaOfferUploaded,
      visa_cas_status: studentData.visaCasStatus,
      visa_funds_proof_available: studentData.visaFundsProofAvailable,
      visa_funds_source: studentData.visaFundsSource,
      visa_loan_status: studentData.visaLoanStatus,
      visa_bank_statement_duration: studentData.visaBankStatementDuration,
      visa_passport_validity: studentData.visaPassportValidity || null,
      visa_transcripts_uploaded: studentData.visaTranscriptsUploaded,
      visa_language_report_uploaded: studentData.visaLanguageReportUploaded,
      visa_medical_uploaded: studentData.visaMedicalUploaded,
      visa_form_filled: studentData.visaFormFilled,
      visa_biometrics_required: studentData.visaBiometricsRequired,
      visa_appointment_booked: studentData.visaAppointmentBooked,
      visa_appointment_date: studentData.visaAppointmentDate || null,
      visa_interview_required: studentData.visaInterviewRequired,
      visa_interview_prep_done: studentData.visaInterviewPrepDone,
      visa_mock_interview_notes: studentData.visaMockInterviewNotes,
      visa_special_case_notes: studentData.visaSpecialCaseNotes,
      visa_internal_remarks: studentData.visaInternalRemarks,

      comp_visa_start_date: studentData.compVisaStartDate || null,
      comp_visa_expiry_date: studentData.compVisaExpiryDate || null,
      comp_multiple_entry: studentData.compMultipleEntry,
      comp_work_restrictions: studentData.compWorkRestrictions,
      comp_attendance_req: studentData.compAttendanceReq,
      comp_address_reporting: studentData.compAddressReporting,
      comp_extension_eligible: studentData.compExtensionEligible,
      comp_extension_type: studentData.compExtensionType,
      comp_renewal_window: studentData.compRenewalWindow,
      comp_checkins_required: studentData.compCheckinsRequired,
      comp_last_review_date: studentData.compLastReviewDate || null,
      comp_issues_noted: studentData.compIssuesNoted,
      comp_psw_interest: studentData.compPswInterest,
      comp_eligibility_awareness: studentData.compEligibilityAwareness,
      comp_notes: studentData.compNotes,

      // Pre-Departure Support fields
      predep_travel_date: studentData.predepTravelDate || null,
      predep_flight_booked: studentData.predepFlightBooked,
      predep_airline_name: studentData.predepAirlineName,
      predep_departure_airport: studentData.predepDepartureAirport,
      predep_arrival_airport: studentData.predepArrivalAirport,
      predep_accommodation_type: studentData.predepAccommodationType,
      predep_accommodation_confirmed: studentData.predepAccommodationConfirmed,
      predep_address: studentData.predepAddress,
      predep_initial_stay_duration: studentData.predepInitialStayDuration,
      predep_insurance_arranged: studentData.predepInsuranceArranged,
      predep_forex_ready: studentData.predepForexReady,
      predep_docs_collected: studentData.predepDocsCollected,
      predep_emergency_contact: studentData.predepEmergencyContact,
      predep_orientation_attended: studentData.predepOrientationAttended,
      predep_rules_explained: studentData.predepRulesExplained,
      predep_reporting_instructions_shared: studentData.predepReportingInstructionsShared,
      predep_packing_guidance_shared: studentData.predepPackingGuidanceShared,
      predep_restricted_items_explained: studentData.predepRestrictedItemsExplained,
      predep_weather_awareness: studentData.predepWeatherAwareness,
      predep_notes: studentData.predepNotes,
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
      
      highest_qualification: studentData.highestQualification,
      field_of_study: studentData.fieldOfStudy,
      current_institution: studentData.currentInstitution,
      graduation_year: studentData.graduationYear,
      gpa: studentData.gpa,
      
      first_touch_date: studentData.firstTouchDate,
      conversion_path_summary: studentData.conversionPathSummary,
      
      preferred_course_level: studentData.preferredCourseLevel,
      budget_range: studentData.budgetRange,
      intake_preference: studentData.intakePreference,
      test_scores: studentData.testScores,
      
      student_intent: studentData.studentIntent,
      interested_services: JSON.stringify(studentData.interestedServices || []),
      communication_preference: studentData.communicationPreference,
      timezone: studentData.timezone,


      // Planning & Application fields
      planning_countries: studentData.planningCountries,
      planning_intake: studentData.planningIntake,
      planning_course_level: studentData.planningCourseLevel,
      planning_field_of_study: studentData.planningFieldOfStudy,
      career_goal: studentData.careerGoal,
      long_term_plan: studentData.longTermPlan,
      annual_budget: studentData.annualBudget,
      funding_source: studentData.fundingSource,
      family_constraints: studentData.familyConstraints,
      timeline_urgency: studentData.timelineUrgency,
      consultation_notes: studentData.consultationNotes,
      
      eval_grading_system: studentData.evalGradingSystem,
      eval_institution_tier: studentData.evalInstitutionTier,
      eval_backlogs: studentData.evalBacklogs,
      eval_work_exp: studentData.evalWorkExp,
      eval_field_relevance: studentData.evalFieldRelevance,
      eval_internships: studentData.evalInternships,
      eval_research: studentData.evalResearch,
      eval_gap_years: studentData.evalGapYears,
      eval_additional_notes: studentData.evalAdditionalNotes,
      
      eligibility_prerequisites: studentData.eligibilityPrerequisites,
      eligibility_bridge_course: studentData.eligibilityBridgeCourse,
      eligibility_english_test: studentData.eligibilityEnglishTest,
      eligibility_funds_ready: studentData.eligibilityFundsReady,
      eligibility_sponsor_identified: studentData.eligibilitySponsorIdentified,
      eligibility_loan_required: studentData.eligibilityLoanRequired,
      eligibility_gap_explanation: studentData.eligibilityGapExplanation,
      visa_risk: studentData.visaRisk,
      visa_notes: studentData.visaNotes,
      
      intended_job_role: studentData.intendedJobRole,
      preferred_industry: studentData.preferredIndustry,
      career_country_preference: studentData.careerCountryPreference,
      job_market_awareness: studentData.jobMarketAwareness,
      salary_expectations: studentData.salaryExpectations,
      stay_back_interest: studentData.stayBackInterest,
      career_discussion_notes: studentData.careerDiscussionNotes,

      shortlisted_universities: studentData.shortlistedUniversities,
      shortlisted_course_details: studentData.shortlistedCourseDetails,
      shortlisted_country: studentData.shortlistedCountry,
      shortlisted_priority: studentData.shortlistedPriority,
      shortlisted_intake: studentData.shortlistedIntake,
      shortlisted_budget_fit: studentData.shortlistedBudgetFit,
      shortlisted_eligibility_fit: studentData.shortlistedEligibilityFit,
      shortlisted_visa_safety: studentData.shortlistedVisaSafety,

      app_strategy_order: studentData.appStrategyOrder,
      app_strategy_type: studentData.appStrategyType,
      app_strategy_deadline_awareness: studentData.appStrategyDeadlineAwareness,
      app_strategy_deadline_risk: studentData.appStrategyDeadlineRisk,
      app_strategy_sop_approach: studentData.appStrategySopApproach,
      app_strategy_customization_level: studentData.appStrategyCustomizationLevel,
      app_strategy_lor_type: studentData.appStrategyLorType,
      app_strategy_lor_count: studentData.appStrategyLorCount,
      app_strategy_notes: studentData.appStrategyNotes,

      sop_version: studentData.sopVersion,
      sop_draft_status: studentData.sopDraftStatus,
      sop_assigned_editor: studentData.sopAssignedEditor,
      sop_structure_quality: studentData.sopStructureQuality,
      sop_content_relevance: studentData.sopContentRelevance,
      sop_language_clarity: studentData.sopLanguageClarity,
      sop_feedback_notes: studentData.sopFeedbackNotes,
      sop_revision_count: studentData.sopRevisionCount,

      lor_count_required: studentData.lorCountRequired,
      lor_recommender_name: studentData.lorRecommenderName,
      lor_recommender_relation: studentData.lorRecommenderRelation,
      lor_recommender_email: studentData.lorRecommenderEmail,
      lor_current_status: studentData.lorCurrentStatus,
      lor_coordination_notes: studentData.lorCoordinationNotes,

      submission_sop_uploaded: studentData.submissionSopUploaded,
      submission_lors_uploaded: studentData.submissionLorsUploaded,
      submission_transcripts_uploaded: studentData.submissionTranscriptsUploaded,
      submission_fee_paid: studentData.submissionFeePaid,
      submission_portal: studentData.submissionPortal,
      submission_confirmation_received: studentData.submissionConfirmationReceived,
      submission_errors_faced: studentData.submissionErrorsFaced,
      submission_resolution_notes: studentData.submissionResolutionNotes,

      // Offer Review & Decision fields
      offer_university_name: studentData.offerUniversityName,
      offer_course_name: studentData.offerCourseName,
      offer_country: studentData.offerCountry,
      offer_intake: studentData.offerIntake,
      offer_type: studentData.offerType,
      offer_conditions: studentData.offerConditions,
      offer_deadline: studentData.offerDeadline,
      offer_deposit_required: studentData.offerDepositRequired,
      offer_deposit_amount: studentData.offerDepositAmount,
      offer_tuition_fee: studentData.offerTuitionFee,
      offer_living_cost: studentData.offerLivingCost,
      offer_scholarship: studentData.offerScholarship,
      offer_total_cost: studentData.offerTotalCost,
      offer_course_relevance: studentData.offerCourseRelevance,
      offer_university_ranking: studentData.offerUniversityRanking,
      offer_employability_outlook: studentData.offerEmployabilityOutlook,
      offer_industry_alignment: studentData.offerIndustryAlignment,
      offer_visa_probability: studentData.offerVisaProbability,
      offer_country_risks: studentData.offerCountryRisks,
      offer_gap_sensitivity: studentData.offerGapSensitivity,
      offer_preference_level: studentData.offerPreferenceLevel,
      offer_family_concerns: studentData.offerFamilyConcerns,
      offer_student_questions: studentData.offerStudentQuestions,
      offer_discussion_summary: studentData.offerDiscussionSummary,

      // Visa & Compliance fields
      visa_target_country: studentData.visaTargetCountry,
      visa_type: studentData.visaType,
      visa_start_date: studentData.visaStartDate,
      visa_university_name: studentData.visaUniversityName,
      visa_offer_uploaded: studentData.visaOfferUploaded,
      visa_cas_status: studentData.visaCasStatus,
      visa_funds_proof_available: studentData.visaFundsProofAvailable,
      visa_funds_source: studentData.visaFundsSource,
      visa_loan_status: studentData.visaLoanStatus,
      visa_bank_statement_duration: studentData.visaBankStatementDuration,
      visa_passport_validity: studentData.visaPassportValidity,
      visa_transcripts_uploaded: studentData.visaTranscriptsUploaded,
      visa_language_report_uploaded: studentData.visaLanguageReportUploaded,
      visa_medical_uploaded: studentData.visaMedicalUploaded,
      visa_form_filled: studentData.visaFormFilled,
      visa_biometrics_required: studentData.visaBiometricsRequired,
      visa_appointment_booked: studentData.visaAppointmentBooked,
      visa_appointment_date: studentData.visaAppointmentDate,
      visa_interview_required: studentData.visaInterviewRequired,
      visa_interview_prep_done: studentData.visaInterviewPrepDone,
      visa_mock_interview_notes: studentData.visaMockInterviewNotes,
      visa_special_case_notes: studentData.visaSpecialCaseNotes,
      visa_internal_remarks: studentData.visaInternalRemarks,

      comp_visa_start_date: studentData.compVisaStartDate,
      comp_visa_expiry_date: studentData.compVisaExpiryDate,
      comp_multiple_entry: studentData.compMultipleEntry,
      comp_work_restrictions: studentData.compWorkRestrictions,
      comp_attendance_req: studentData.compAttendanceReq,
      comp_address_reporting: studentData.compAddressReporting,
      comp_extension_eligible: studentData.compExtensionEligible,
      comp_extension_type: studentData.compExtensionType,
      comp_renewal_window: studentData.compRenewalWindow,
      comp_checkins_required: studentData.compCheckinsRequired,
      comp_last_review_date: studentData.compLastReviewDate,
      comp_issues_noted: studentData.compIssuesNoted,
      comp_psw_interest: studentData.compPswInterest,
      comp_eligibility_awareness: studentData.compEligibilityAwareness,
      comp_notes: studentData.compNotes,

      // Pre-Departure Support fields
      predep_travel_date: studentData.predepTravelDate,
      predep_flight_booked: studentData.predepFlightBooked,
      predep_airline_name: studentData.predepAirlineName,
      predep_departure_airport: studentData.predepDepartureAirport,
      predep_arrival_airport: studentData.predepArrivalAirport,
      predep_accommodation_type: studentData.predepAccommodationType,
      predep_accommodation_confirmed: studentData.predepAccommodationConfirmed,
      predep_address: studentData.predepAddress,
      predep_initial_stay_duration: studentData.predepInitialStayDuration,
      predep_insurance_arranged: studentData.predepInsuranceArranged,
      predep_forex_ready: studentData.predepForexReady,
      predep_docs_collected: studentData.predepDocsCollected,
      predep_emergency_contact: studentData.predepEmergencyContact,
      predep_orientation_attended: studentData.predepOrientationAttended,
      predep_rules_explained: studentData.predepRulesExplained,
      predep_reporting_instructions_shared: studentData.predepReportingInstructionsShared,
      predep_packing_guidance_shared: studentData.predepPackingGuidanceShared,
      predep_restricted_items_explained: studentData.predepRestrictedItemsExplained,
      predep_weather_awareness: studentData.predepWeatherAwareness,
      predep_notes: studentData.predepNotes,

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

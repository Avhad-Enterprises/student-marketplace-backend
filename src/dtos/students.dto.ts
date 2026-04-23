import { IsEmail, IsString, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    public firstName!: string;

    @IsString()
    public lastName!: string;

    @IsEmail()
    public email!: string;

    @IsString()
    @IsOptional()
    public dateOfBirth?: string;

    @IsString()
    public countryCode!: string;

    @IsString()
    public phoneNumber!: string;

    @IsString()
    public nationality!: string;

    @IsString()
    public currentCountry!: string;

    @IsString()
    public primaryDestination!: string;

    @IsString()
    public intendedIntake!: string;

    @IsString()
    public currentStage!: string;

    @IsString()
    @IsOptional()
    public assignedCounselor?: string;

    @IsString()
    @IsOptional()
    public riskLevel?: string;

    @IsString()
    @IsOptional()
    public leadSource?: string;

    @IsString()
    @IsOptional()
    public campaign?: string;

    @IsArray()
    @IsOptional()
    public countryPreferences?: string[];

    @IsString()
    @IsOptional()
    public notes?: string;

    @IsBoolean()
    @IsOptional()
    public accountStatus?: boolean;

    // Education Snapshot
    @IsString() public highestQualification!: string;
    @IsString() public fieldOfStudy!: string;
    @IsString() public currentInstitution!: string;
    @IsString() public graduationYear!: string;
    @IsString() public gpa!: string;

    // Lead & Attribution
    @IsString() @IsOptional() public firstTouchDate?: string;
    @IsString() @IsOptional() public conversionPathSummary?: string;

    // Intent & Preferences
    @IsString() @IsOptional() public preferredCourseLevel?: string;
    @IsString() @IsOptional() public budgetRange?: string;
    @IsString() @IsOptional() public intakePreference?: string;
    @IsString() @IsOptional() public testScores?: string;
    @IsString() @IsOptional() public studentIntent?: string;
    @IsOptional() public interestedServices?: any;
    @IsString() @IsOptional() public communicationPreference?: string;
    @IsString() @IsOptional() public timezone?: string;

    // Planning & Application
    @IsString() @IsOptional() public planningCountries?: string;
    @IsString() @IsOptional() public planningIntake?: string;
    @IsString() @IsOptional() public planningCourseLevel?: string;
    @IsString() @IsOptional() public planningFieldOfStudy?: string;
    @IsString() @IsOptional() public careerGoal?: string;
    @IsString() @IsOptional() public longTermPlan?: string;
    @IsString() @IsOptional() public annualBudget?: string;
    @IsString() @IsOptional() public fundingSource?: string;
    @IsString() @IsOptional() public familyConstraints?: string;
    @IsString() @IsOptional() public timelineUrgency?: string;
    @IsString() @IsOptional() public consultationNotes?: string;

    // Evaluation
    @IsString() @IsOptional() public evalGradingSystem?: string;
    @IsString() @IsOptional() public evalInstitutionTier?: string;
    @IsString() @IsOptional() public evalBacklogs?: string;
    @IsString() @IsOptional() public evalWorkExp?: string;
    @IsString() @IsOptional() public evalFieldRelevance?: string;
    @IsString() @IsOptional() public evalInternships?: string;
    @IsString() @IsOptional() public evalResearch?: string;
    @IsString() @IsOptional() public evalGapYears?: string;
    @IsString() @IsOptional() public evalAdditionalNotes?: string;

    // Eligibility
    @IsOptional() public eligibilityPrerequisites?: any;
    @IsOptional() public eligibilityBridgeCourse?: any;
    @IsOptional() public eligibilityEnglishTest?: any;
    @IsOptional() public eligibilityFundsReady?: any;
    @IsOptional() public eligibilitySponsorIdentified?: any;
    @IsOptional() public eligibilityLoanRequired?: any;
    @IsOptional() public eligibilityGapExplanation?: any;
    @IsString() @IsOptional() public visaRisk?: string;
    @IsString() @IsOptional() public visaNotes?: string;

    // Career
    @IsString() @IsOptional() public intendedJobRole?: string;
    @IsString() @IsOptional() public preferredIndustry?: string;
    @IsString() @IsOptional() public careerCountryPreference?: string;
    @IsString() @IsOptional() public jobMarketAwareness?: string;
    @IsString() @IsOptional() public salaryExpectations?: string;
    @IsOptional() public stayBackInterest?: any;
    @IsString() @IsOptional() public careerDiscussionNotes?: string;

    // Shortlisting
    @IsString() @IsOptional() public shortlistedUniversities?: string;
    @IsString() @IsOptional() public shortlistedCourseDetails?: string;
    @IsString() @IsOptional() public shortlistedCountry?: string;
    @IsString() @IsOptional() public shortlistedPriority?: string;
    @IsString() @IsOptional() public shortlistedIntake?: string;
    @IsString() @IsOptional() public shortlistedBudgetFit?: string;
    @IsString() @IsOptional() public shortlistedEligibilityFit?: string;
    @IsString() @IsOptional() public shortlistedVisaSafety?: string;

    // App Strategy
    @IsString() @IsOptional() public appStrategyOrder?: string;
    @IsString() @IsOptional() public appStrategyType?: string;
    @IsString() @IsOptional() public appStrategyDeadlineAwareness?: string;
    @IsString() @IsOptional() public appStrategyDeadlineRisk?: string;
    @IsString() @IsOptional() public appStrategySopApproach?: string;
    @IsString() @IsOptional() public appStrategyCustomizationLevel?: string;
    @IsString() @IsOptional() public appStrategyLorType?: string;
    @IsString() @IsOptional() public appStrategyLorCount?: string;
    @IsString() @IsOptional() public appStrategyNotes?: string;

    // SOP
    @IsString() @IsOptional() public sopVersion?: string;
    @IsString() @IsOptional() public sopDraftStatus?: string;
    @IsString() @IsOptional() public sopAssignedEditor?: string;
    @IsString() @IsOptional() public sopStructureQuality?: string;
    @IsString() @IsOptional() public sopContentRelevance?: string;
    @IsString() @IsOptional() public sopLanguageClarity?: string;
    @IsString() @IsOptional() public sopFeedbackNotes?: string;
    @IsString() @IsOptional() public sopRevisionCount?: string;

    // LOR
    @IsString() @IsOptional() public lorCountRequired?: string;
    @IsString() @IsOptional() public lorRecommenderName?: string;
    @IsString() @IsOptional() public lorRecommenderRelation?: string;
    @IsString() @IsOptional() public lorRecommenderEmail?: string;
    @IsString() @IsOptional() public lorCurrentStatus?: string;
    @IsString() @IsOptional() public lorCoordinationNotes?: string;

    // Submission
    @IsOptional() public submissionSopUploaded?: any;
    @IsOptional() public submissionLorsUploaded?: any;
    @IsOptional() public submissionTranscriptsUploaded?: any;
    @IsOptional() public submissionFeePaid?: any;
    @IsString() @IsOptional() public submissionPortal?: string;
    @IsOptional() public submissionConfirmationReceived?: any;
    @IsString() @IsOptional() public submissionErrorsFaced?: string;
    @IsString() @IsOptional() public submissionResolutionNotes?: string;

    // Offer Review
    @IsString() @IsOptional() public offerUniversityName?: string;
    @IsString() @IsOptional() public offerCourseName?: string;
    @IsString() @IsOptional() public offerCountry?: string;
    @IsString() @IsOptional() public offerIntake?: string;
    @IsString() @IsOptional() public offerType?: string;
    @IsString() @IsOptional() public offerConditions?: string;
    @IsString() @IsOptional() public offerDeadline?: string;
    @IsOptional() public offerDepositRequired?: any;
    @IsString() @IsOptional() public offerDepositAmount?: string;
    @IsString() @IsOptional() public offerTuitionFee?: string;
    @IsString() @IsOptional() public offerLivingCost?: string;
    @IsString() @IsOptional() public offerScholarship?: string;
    @IsString() @IsOptional() public offerTotalCost?: string;
    @IsString() @IsOptional() public offerCourseRelevance?: string;
    @IsString() @IsOptional() public offerUniversityRanking?: string;
    @IsString() @IsOptional() public offerEmployabilityOutlook?: string;
    @IsString() @IsOptional() public offerIndustryAlignment?: string;
    @IsString() @IsOptional() public offerVisaProbability?: string;
    @IsString() @IsOptional() public offerCountryRisks?: string;
    @IsString() @IsOptional() public offerGapSensitivity?: string;
    @IsString() @IsOptional() public offerPreferenceLevel?: string;
    @IsString() @IsOptional() public offerFamilyConcerns?: string;
    @IsString() @IsOptional() public offerStudentQuestions?: string;
    @IsString() @IsOptional() public offerDiscussionSummary?: string;

    // Visa & Compliance
    @IsString() @IsOptional() public visaTargetCountry?: string;
    @IsString() @IsOptional() public visaType?: string;
    @IsString() @IsOptional() public visaStartDate?: string;
    @IsString() @IsOptional() public visaUniversityName?: string;
    @IsOptional() public visaOfferUploaded?: any;
    @IsString() @IsOptional() public visaCasStatus?: string;
    @IsOptional() public visaFundsProofAvailable?: any;
    @IsString() @IsOptional() public visaFundsSource?: string;
    @IsString() @IsOptional() public visaLoanStatus?: string;
    @IsString() @IsOptional() public visaBankStatementDuration?: string;
    @IsString() @IsOptional() public visaPassportValidity?: string;
    @IsOptional() public visaTranscriptsUploaded?: any;
    @IsOptional() public visaLanguageReportUploaded?: any;
    @IsOptional() public visaMedicalUploaded?: any;
    @IsOptional() public visaFormFilled?: any;
    @IsOptional() public visaBiometricsRequired?: any;
    @IsOptional() public visaAppointmentBooked?: any;
    @IsString() @IsOptional() public visaAppointmentDate?: string;
    @IsOptional() public visaInterviewRequired?: any;
    @IsOptional() public visaInterviewPrepDone?: any;
    @IsString() @IsOptional() public visaMockInterviewNotes?: string;
    @IsString() @IsOptional() public visaSpecialCaseNotes?: string;
    @IsString() @IsOptional() public visaInternalRemarks?: string;

    // Compliance
    @IsString() @IsOptional() public compVisaStartDate?: string;
    @IsString() @IsOptional() public compVisaExpiryDate?: string;
    @IsOptional() public compMultipleEntry?: any;
    @IsString() @IsOptional() public compWorkRestrictions?: string;
    @IsString() @IsOptional() public compAttendanceReq?: string;
    @IsOptional() public compAddressReporting?: any;
    @IsOptional() public compExtensionEligible?: any;
    @IsString() @IsOptional() public compExtensionType?: string;
    @IsString() @IsOptional() public compRenewalWindow?: string;
    @IsOptional() public compCheckinsRequired?: any;
    @IsString() @IsOptional() public compLastReviewDate?: string;
    @IsString() @IsOptional() public compIssuesNoted?: string;
    @IsOptional() public compPswInterest?: any;
    @IsOptional() public compEligibilityAwareness?: any;
    @IsString() @IsOptional() public compNotes?: string;

    // Pre-Departure
    @IsString() @IsOptional() public predepTravelDate?: string;
    @IsOptional() public predepFlightBooked?: any;
    @IsString() @IsOptional() public predepAirlineName?: string;
    @IsString() @IsOptional() public predepDepartureAirport?: string;
    @IsString() @IsOptional() public predepArrivalAirport?: string;
    @IsString() @IsOptional() public predepAccommodationType?: string;
    @IsOptional() public predepAccommodationConfirmed?: any;
    @IsString() @IsOptional() public predepAddress?: string;
    @IsString() @IsOptional() public predepInitialStayDuration?: string;
    @IsOptional() public predepInsuranceArranged?: any;
    @IsOptional() public predepForexReady?: any;
    @IsOptional() public predepDocsCollected?: any;
    @IsString() @IsOptional() public predepEmergencyContact?: string;
    @IsOptional() public predepOrientationAttended?: any;
    @IsOptional() public predepRulesExplained?: any;
    @IsOptional() public predepReportingInstructionsShared?: any;
    @IsOptional() public predepPackingGuidanceShared?: any;
    @IsOptional() public predepRestrictedItemsExplained?: any;
    @IsOptional() public predepWeatherAwareness?: any;
    @IsString() @IsOptional() public predepNotes?: string;
}

export class UpdateStudentDto {
    // Basic Info
    @IsString() @IsOptional() public firstName?: string;
    @IsEmail() @IsOptional() public email?: string;
    @IsString() @IsOptional() public lastName?: string;
    @IsString() @IsOptional() public dateOfBirth?: string;
    @IsString() @IsOptional() public countryCode?: string;
    @IsString() @IsOptional() public phoneNumber?: string;
    @IsString() @IsOptional() public nationality?: string;
    @IsString() @IsOptional() public currentCountry?: string;
    @IsString() @IsOptional() public primaryDestination?: string;
    @IsString() @IsOptional() public intendedIntake?: string;
    @IsString() @IsOptional() public currentStage?: string;
    @IsString() @IsOptional() public assignedCounselor?: string;
    @IsString() @IsOptional() public riskLevel?: string;
    @IsString() @IsOptional() public leadSource?: string;
    @IsString() @IsOptional() public campaign?: string;
    @IsArray() @IsOptional() public countryPreferences?: string[];
    @IsString() @IsOptional() public notes?: string;
    @IsBoolean() @IsOptional() public accountStatus?: boolean;

    // Education Snapshot
    @IsString() @IsOptional() public highestQualification?: string;
    @IsString() @IsOptional() public fieldOfStudy?: string;
    @IsString() @IsOptional() public currentInstitution?: string;
    @IsString() @IsOptional() public graduationYear?: string;
    @IsString() @IsOptional() public gpa?: string;

    // Lead & Attribution
    @IsString() @IsOptional() public firstTouchDate?: string;
    @IsString() @IsOptional() public conversionPathSummary?: string;

    // Intent & Preferences
    @IsString() @IsOptional() public preferredCourseLevel?: string;
    @IsString() @IsOptional() public budgetRange?: string;
    @IsString() @IsOptional() public intakePreference?: string;
    @IsString() @IsOptional() public testScores?: string;
    @IsString() @IsOptional() public studentIntent?: string;
    @IsOptional() public interestedServices?: any;
    @IsString() @IsOptional() public communicationPreference?: string;
    @IsString() @IsOptional() public timezone?: string;

    // Planning & Application
    @IsString() @IsOptional() public planningCountries?: string;
    @IsString() @IsOptional() public planningIntake?: string;
    @IsString() @IsOptional() public planningCourseLevel?: string;
    @IsString() @IsOptional() public planningFieldOfStudy?: string;
    @IsString() @IsOptional() public careerGoal?: string;
    @IsString() @IsOptional() public longTermPlan?: string;
    @IsString() @IsOptional() public annualBudget?: string;
    @IsString() @IsOptional() public fundingSource?: string;
    @IsString() @IsOptional() public familyConstraints?: string;
    @IsString() @IsOptional() public timelineUrgency?: string;
    @IsString() @IsOptional() public consultationNotes?: string;

    // Evaluation
    @IsString() @IsOptional() public evalGradingSystem?: string;
    @IsString() @IsOptional() public evalInstitutionTier?: string;
    @IsString() @IsOptional() public evalBacklogs?: string;
    @IsString() @IsOptional() public evalWorkExp?: string;
    @IsString() @IsOptional() public evalFieldRelevance?: string;
    @IsString() @IsOptional() public evalInternships?: string;
    @IsString() @IsOptional() public evalResearch?: string;
    @IsString() @IsOptional() public evalGapYears?: string;
    @IsString() @IsOptional() public evalAdditionalNotes?: string;

    // Eligibility
    @IsOptional() public eligibilityPrerequisites?: any;
    @IsOptional() public eligibilityBridgeCourse?: any;
    @IsOptional() public eligibilityEnglishTest?: any;
    @IsOptional() public eligibilityFundsReady?: any;
    @IsOptional() public eligibilitySponsorIdentified?: any;
    @IsOptional() public eligibilityLoanRequired?: any;
    @IsOptional() public eligibilityGapExplanation?: any;
    @IsString() @IsOptional() public visaRisk?: string;
    @IsString() @IsOptional() public visaNotes?: string;

    // Career
    @IsString() @IsOptional() public intendedJobRole?: string;
    @IsString() @IsOptional() public preferredIndustry?: string;
    @IsString() @IsOptional() public careerCountryPreference?: string;
    @IsString() @IsOptional() public jobMarketAwareness?: string;
    @IsString() @IsOptional() public salaryExpectations?: string;
    @IsOptional() public stayBackInterest?: any;
    @IsString() @IsOptional() public careerDiscussionNotes?: string;

    // Shortlisting
    @IsString() @IsOptional() public shortlistedUniversities?: string;
    @IsString() @IsOptional() public shortlistedCourseDetails?: string;
    @IsString() @IsOptional() public shortlistedCountry?: string;
    @IsString() @IsOptional() public shortlistedPriority?: string;
    @IsString() @IsOptional() public shortlistedIntake?: string;
    @IsString() @IsOptional() public shortlistedBudgetFit?: string;
    @IsString() @IsOptional() public shortlistedEligibilityFit?: string;
    @IsString() @IsOptional() public shortlistedVisaSafety?: string;

    // App Strategy
    @IsString() @IsOptional() public appStrategyOrder?: string;
    @IsString() @IsOptional() public appStrategyType?: string;
    @IsString() @IsOptional() public appStrategyDeadlineAwareness?: string;
    @IsString() @IsOptional() public appStrategyDeadlineRisk?: string;
    @IsString() @IsOptional() public appStrategySopApproach?: string;
    @IsString() @IsOptional() public appStrategyCustomizationLevel?: string;
    @IsString() @IsOptional() public appStrategyLorType?: string;
    @IsString() @IsOptional() public appStrategyLorCount?: string;
    @IsString() @IsOptional() public appStrategyNotes?: string;

    // SOP
    @IsString() @IsOptional() public sopVersion?: string;
    @IsString() @IsOptional() public sopDraftStatus?: string;
    @IsString() @IsOptional() public sopAssignedEditor?: string;
    @IsString() @IsOptional() public sopStructureQuality?: string;
    @IsString() @IsOptional() public sopContentRelevance?: string;
    @IsString() @IsOptional() public sopLanguageClarity?: string;
    @IsString() @IsOptional() public sopFeedbackNotes?: string;
    @IsString() @IsOptional() public sopRevisionCount?: string;

    // LOR
    @IsString() @IsOptional() public lorCountRequired?: string;
    @IsString() @IsOptional() public lorRecommenderName?: string;
    @IsString() @IsOptional() public lorRecommenderRelation?: string;
    @IsString() @IsOptional() public lorRecommenderEmail?: string;
    @IsString() @IsOptional() public lorCurrentStatus?: string;
    @IsString() @IsOptional() public lorCoordinationNotes?: string;

    // Submission
    @IsOptional() public submissionSopUploaded?: any;
    @IsOptional() public submissionLorsUploaded?: any;
    @IsOptional() public submissionTranscriptsUploaded?: any;
    @IsOptional() public submissionFeePaid?: any;
    @IsString() @IsOptional() public submissionPortal?: string;
    @IsOptional() public submissionConfirmationReceived?: any;
    @IsString() @IsOptional() public submissionErrorsFaced?: string;
    @IsString() @IsOptional() public submissionResolutionNotes?: string;

    // Offer Review
    @IsString() @IsOptional() public offerUniversityName?: string;
    @IsString() @IsOptional() public offerCourseName?: string;
    @IsString() @IsOptional() public offerCountry?: string;
    @IsString() @IsOptional() public offerIntake?: string;
    @IsString() @IsOptional() public offerType?: string;
    @IsString() @IsOptional() public offerConditions?: string;
    @IsString() @IsOptional() public offerDeadline?: string;
    @IsOptional() public offerDepositRequired?: any;
    @IsString() @IsOptional() public offerDepositAmount?: string;
    @IsString() @IsOptional() public offerTuitionFee?: string;
    @IsString() @IsOptional() public offerLivingCost?: string;
    @IsString() @IsOptional() public offerScholarship?: string;
    @IsString() @IsOptional() public offerTotalCost?: string;
    @IsString() @IsOptional() public offerCourseRelevance?: string;
    @IsString() @IsOptional() public offerUniversityRanking?: string;
    @IsString() @IsOptional() public offerEmployabilityOutlook?: string;
    @IsString() @IsOptional() public offerIndustryAlignment?: string;
    @IsString() @IsOptional() public offerVisaProbability?: string;
    @IsString() @IsOptional() public offerCountryRisks?: string;
    @IsString() @IsOptional() public offerGapSensitivity?: string;
    @IsString() @IsOptional() public offerPreferenceLevel?: string;
    @IsString() @IsOptional() public offerFamilyConcerns?: string;
    @IsString() @IsOptional() public offerStudentQuestions?: string;
    @IsString() @IsOptional() public offerDiscussionSummary?: string;

    // Visa & Compliance
    @IsString() @IsOptional() public visaTargetCountry?: string;
    @IsString() @IsOptional() public visaType?: string;
    @IsString() @IsOptional() public visaStartDate?: string;
    @IsString() @IsOptional() public visaUniversityName?: string;
    @IsOptional() public visaOfferUploaded?: any;
    @IsString() @IsOptional() public visaCasStatus?: string;
    @IsOptional() public visaFundsProofAvailable?: any;
    @IsString() @IsOptional() public visaFundsSource?: string;
    @IsString() @IsOptional() public visaLoanStatus?: string;
    @IsString() @IsOptional() public visaBankStatementDuration?: string;
    @IsString() @IsOptional() public visaPassportValidity?: string;
    @IsOptional() public visaTranscriptsUploaded?: any;
    @IsOptional() public visaLanguageReportUploaded?: any;
    @IsOptional() public visaMedicalUploaded?: any;
    @IsOptional() public visaFormFilled?: any;
    @IsOptional() public visaBiometricsRequired?: any;
    @IsOptional() public visaAppointmentBooked?: any;
    @IsString() @IsOptional() public visaAppointmentDate?: string;
    @IsOptional() public visaInterviewRequired?: any;
    @IsOptional() public visaInterviewPrepDone?: any;
    @IsString() @IsOptional() public visaMockInterviewNotes?: string;
    @IsString() @IsOptional() public visaSpecialCaseNotes?: string;
    @IsString() @IsOptional() public visaInternalRemarks?: string;

    // Compliance
    @IsString() @IsOptional() public compVisaStartDate?: string;
    @IsString() @IsOptional() public compVisaExpiryDate?: string;
    @IsOptional() public compMultipleEntry?: any;
    @IsString() @IsOptional() public compWorkRestrictions?: string;
    @IsString() @IsOptional() public compAttendanceReq?: string;
    @IsOptional() public compAddressReporting?: any;
    @IsOptional() public compExtensionEligible?: any;
    @IsString() @IsOptional() public compExtensionType?: string;
    @IsString() @IsOptional() public compRenewalWindow?: string;
    @IsOptional() public compCheckinsRequired?: any;
    @IsString() @IsOptional() public compLastReviewDate?: string;
    @IsString() @IsOptional() public compIssuesNoted?: string;
    @IsOptional() public compPswInterest?: any;
    @IsOptional() public compEligibilityAwareness?: any;
    @IsString() @IsOptional() public compNotes?: string;

    // Pre-Departure
    @IsString() @IsOptional() public predepTravelDate?: string;
    @IsOptional() public predepFlightBooked?: any;
    @IsString() @IsOptional() public predepAirlineName?: string;
    @IsString() @IsOptional() public predepDepartureAirport?: string;
    @IsString() @IsOptional() public predepArrivalAirport?: string;
    @IsString() @IsOptional() public predepAccommodationType?: string;
    @IsOptional() public predepAccommodationConfirmed?: any;
    @IsString() @IsOptional() public predepAddress?: string;
    @IsString() @IsOptional() public predepInitialStayDuration?: string;
    @IsOptional() public predepInsuranceArranged?: any;
    @IsOptional() public predepForexReady?: any;
    @IsOptional() public predepDocsCollected?: any;
    @IsString() @IsOptional() public predepEmergencyContact?: string;
    @IsOptional() public predepOrientationAttended?: any;
    @IsOptional() public predepRulesExplained?: any;
    @IsOptional() public predepReportingInstructionsShared?: any;
    @IsOptional() public predepPackingGuidanceShared?: any;
    @IsOptional() public predepRestrictedItemsExplained?: any;
    @IsOptional() public predepWeatherAwareness?: any;
    @IsString() @IsOptional() public predepNotes?: string;
}

export class BulkUpdateStudentDto {
    @IsArray()
    @IsNumber({}, { each: true })
    public ids!: number[];

    @IsBoolean()
    @IsOptional()
    public accountStatus?: boolean;

    @IsString()
    @IsOptional()
    public currentStage?: string;

    @IsString()
    @IsOptional()
    public assignedCounselor?: string;

    @IsString()
    @IsOptional()
    public riskLevel?: string;
}

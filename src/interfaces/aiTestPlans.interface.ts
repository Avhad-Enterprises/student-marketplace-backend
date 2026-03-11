export interface AITestPlansSettings {
    id?: number;
    weak_skill_boost: number;
    ensure_min_skills: boolean;
    prevent_overload: boolean;
    intensity_mode: 'light' | 'normal' | 'intense';
    custom_intensity: any; // Store as JSON
    mock_frequency: 'conservative' | 'balanced' | 'aggressive';
    exam_countdown_boost: boolean;
    boost_days_before: number;
    auto_exam_ready: boolean;
    ready_band_threshold: number;
    ready_consistency: number;
    readiness_weights: any; // Store as JSON
    enable_streak: boolean;
    min_daily_activity: number;
    grace_days: number;
    streak_milestone: number;
    show_nudges: boolean;
    created_at?: Date;
    updated_at?: Date;
}

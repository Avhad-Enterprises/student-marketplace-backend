import DB from '@/database';
import { ComparisonRules } from '@/interfaces/comparisonRules.interface';

class ComparisonRulesService {
    public async getRules(): Promise<ComparisonRules> {
        const rules: any = await DB('comparison_rules').first() || {};
        
        // Handle initial seed/defaults
        if (Object.keys(rules).length === 0) {
            return {
                enable_country_scoring: true,
                country_scoring_parameters: ['Tuition Cost', 'Visa Success Rate', 'PR Probability', 'Living Cost', 'Employment Opportunity', 'Risk Index'],
                country_weight_distribution: {
                    'Tuition Cost': 15,
                    'Visa Success Rate': 25,
                    'PR Probability': 20,
                    'Living Cost': 15,
                    'Employment Opportunity': 15,
                    'Risk Index': 10
                },
                allow_manual_score_override: true,
                enable_university_ranking_engine: true,
                university_weight_configuration: {
                    'QS Rank': 30,
                    'Acceptance Rate': 20,
                    'Placement %': 25,
                    'Tuition': 15,
                    'Location': 10
                },
                min_eligibility_threshold_required: true,
                enable_smart_matching: true,
                auto_suggest_top_5_countries: true,
                auto_suggest_top_10_universities: true,
                exclude_high_risk_options: true,
                allow_counselor_override_matching: true
            };
        }

        // Parse JSON fields
        if (typeof rules.country_scoring_parameters === 'string') {
            try { rules.country_scoring_parameters = JSON.parse(rules.country_scoring_parameters); } catch (e) { rules.country_scoring_parameters = []; }
        }
        if (typeof rules.country_weight_distribution === 'string') {
            try { rules.country_weight_distribution = JSON.parse(rules.country_weight_distribution); } catch (e) { rules.country_weight_distribution = {}; }
        }
        if (typeof rules.university_weight_configuration === 'string') {
            try { rules.university_weight_configuration = JSON.parse(rules.university_weight_configuration); } catch (e) { rules.university_weight_configuration = {}; }
        }

        return rules;
    }

    public async updateRules(rulesData: Partial<ComparisonRules>): Promise<ComparisonRules> {
        const { id, created_at, updated_at, ...cleanData } = rulesData as any;

        // Serialization
        if (cleanData.country_scoring_parameters && Array.isArray(cleanData.country_scoring_parameters)) {
            cleanData.country_scoring_parameters = JSON.stringify(cleanData.country_scoring_parameters);
        }
        if (cleanData.country_weight_distribution && typeof cleanData.country_weight_distribution === 'object') {
            cleanData.country_weight_distribution = JSON.stringify(cleanData.country_weight_distribution);
        }
        if (cleanData.university_weight_configuration && typeof cleanData.university_weight_configuration === 'object') {
            cleanData.university_weight_configuration = JSON.stringify(cleanData.university_weight_configuration);
        }

        const existing = await DB('comparison_rules').first();
        const dataToSave = {
            ...cleanData,
            updated_at: new Date()
        };

        if (existing) {
            await DB('comparison_rules').where({ id: existing.id }).update(dataToSave);
        } else {
            await DB('comparison_rules').insert(dataToSave);
        }

        return this.getRules();
    }
}

export default ComparisonRulesService;

import DB from "@/database";
import { AiFeature } from "@/interfaces/aiFeature.interface";

export class AiFeatureService {
    public async getAllFeatures(): Promise<AiFeature[]> {
        const features: AiFeature[] = await DB('ai_features').select('*').orderBy('order', 'asc');
        return features;
    }

    public async getFeatureById(featureId: string): Promise<AiFeature> {
        console.log(`[AiFeatureService] Fetching feature by ID: ${featureId}`);
        const feature: AiFeature = await DB('ai_features').where({ feature_id: featureId }).first();
        if (!feature) {
            console.warn(`[AiFeatureService] No feature found for ID: ${featureId}`);
        } else {
            console.log(`[AiFeatureService] Successfully retrieved feature: ${feature.name}`);
        }
        return feature;
    }

    public async updateFeature(featureId: string, featureData: Partial<AiFeature>): Promise<AiFeature> {
        // Remove restricted keys that shouldn't be updated via this method
        const { id, feature_id, created_at, updated_at, ...updateData } = featureData as any;

        await DB('ai_features').where({ feature_id: featureId }).update({
            ...updateData,
            updated_at: new Date()
        });
        return this.getFeatureById(featureId);
    }

    public async createFeature(featureData: AiFeature): Promise<AiFeature> {
        const [id] = await DB('ai_features').insert(featureData).returning('id');
        return this.getFeatureById(featureData.feature_id);
    }

    public async deleteFeature(featureId: string): Promise<void> {
        await DB('ai_features').where({ feature_id: featureId }).delete();
    }
}

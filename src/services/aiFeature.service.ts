import DB from "@/database";
import { AiFeature } from "@/interfaces/aiFeature.interface";

export class AiFeatureService {
    public async getAllFeatures(): Promise<AiFeature[]> {
        const features: AiFeature[] = await DB('ai_features').select('*').orderBy('order', 'asc');
        return features;
    }

    public async getFeatureById(featureId: string): Promise<AiFeature> {
        const feature: AiFeature = await DB('ai_features').where({ feature_id: featureId }).first();
        return feature;
    }

    public async updateFeature(featureId: string, featureData: Partial<AiFeature>): Promise<AiFeature> {
        await DB('ai_features').where({ feature_id: featureId }).update({
            ...featureData,
            updated_at: new Date()
        });
        return this.getFeatureById(featureId);
    }

    public async createFeature(featureData: AiFeature): Promise<AiFeature> {
        const [id] = await DB('ai_features').insert(featureData).returning('id');
        return this.getFeatureById(featureData.feature_id);
    }
}

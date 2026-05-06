export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: any;
    security_rules?: any;
    created_at?: Date;
    updated_at?: Date;
}

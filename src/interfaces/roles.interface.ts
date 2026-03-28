export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: any;
    created_at?: Date;
    updated_at?: Date;
}

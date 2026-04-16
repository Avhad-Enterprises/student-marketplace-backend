export interface User {
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    role_id?: number | string;
    user_type: string;
    account_status: string;
    email_verified: boolean;
    phone_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

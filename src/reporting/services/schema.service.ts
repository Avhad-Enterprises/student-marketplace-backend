import { Knex } from "knex";

export class SchemaService {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    async getTables() {
        try {
            const result = await this.db.raw(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE'
            `);

            const tables = result.rows.map((row: any) => row.table_name);

            return {
                success: true,
                data: tables,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getFields(table: string) {
        try {
            const result = await this.db.raw(
                `
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = ?
            `,
                [table]
            );

            const fields = result.rows.map((row: any) => ({
                name: row.column_name,
                type: row.data_type,
            }));

            return {
                success: true,
                data: fields,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
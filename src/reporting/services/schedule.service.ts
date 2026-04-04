import { Knex } from "knex";

interface CreateScheduleInput {
    report_id: number;
    cron_expression: string;
    label?: string;
}

export class ScheduleService {
    constructor(private db: Knex) { }

    async create(input: CreateScheduleInput) {
        try {
            const [schedule] = await this.db("report_schedules")
                .insert({
                    report_id: input.report_id,
                    cron_expression: input.cron_expression,
                    label: input.label || null,
                    active: true,
                })
                .returning("*");

            return { success: true, data: schedule };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async getAll() {
        try {
            const schedules = await this.db("report_schedules")
                .join("reports", "report_schedules.report_id", "reports.id")
                .select(
                    "report_schedules.*",
                    "reports.name as report_name"
                );

            return { success: true, data: schedules };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async getActive() {
        try {
            const schedules = await this.db("report_schedules")
                .where({ active: true });

            return { success: true, data: schedules };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async toggleActive(id: number, active: boolean) {
        try {
            const [schedule] = await this.db("report_schedules")
                .where({ id })
                .update({ active })
                .returning("*");

            if (!schedule) {
                return { success: false, message: "Schedule not found" };
            }

            return { success: true, data: schedule };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async delete(id: number) {
        try {
            await this.db("report_schedules").where({ id }).delete();
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async updateLastRun(id: number) {
        try {
            await this.db("report_schedules")
                .where({ id })
                .update({ last_run_at: new Date() });
        } catch (error: any) {
            console.error(`Failed to update last_run_at for schedule ${id}:`, error.message);
        }
    }
}
import * as cron from "node-cron";
import { Knex } from "knex";
import { ScheduleService } from "./schedule.service";
import { ReportService } from "./report.service";

export class SchedulerService {
    private scheduleService: ScheduleService;
    private reportService: ReportService;
    private jobs: Map<number, cron.ScheduledTask> = new Map();

    constructor(private db: Knex) {
        this.scheduleService = new ScheduleService(db);
        this.reportService = new ReportService(db);
    }

    async start() {
        const result = await this.scheduleService.getActive();
        if (!result.success || !result.data) return;

        result.data.forEach((schedule: any) => {
            this.register(schedule);
        });

        console.log(`Scheduler started — ${result.data.length} job(s) registered.`);
    }

    register(schedule: { id: number; report_id: number; cron_expression: string }) {
        if (!cron.validate(schedule.cron_expression)) {
            console.warn(`Invalid cron expression for schedule ${schedule.id}: "${schedule.cron_expression}"`);
            return;
        }

        const task = cron.schedule(schedule.cron_expression, async () => {
            console.log(`Running scheduled report — schedule_id: ${schedule.id}, report_id: ${schedule.report_id}`);

            try {
                await this.reportService.getReportById(schedule.report_id);
                await this.scheduleService.updateLastRun(schedule.id);
            } catch (error: any) {
                console.error(`Scheduled report failed — schedule_id: ${schedule.id}:`, error.message);
            }
        });

        this.jobs.set(schedule.id, task);
    }

    unregister(scheduleId: number) {
        const task = this.jobs.get(scheduleId);
        if (task) {
            task.stop();
            this.jobs.delete(scheduleId);
        }
    }

    stop() {
        this.jobs.forEach((task) => task.stop());
        this.jobs.clear();
        console.log("Scheduler stopped.");
    }
}
import { Request, Response } from "express";
import { ReportService } from "../services/report.service";
import db from "@/database";

const reportService = new ReportService(db);

export const runReport = async (req: Request, res: Response) => {
    try {
        const eventId = req.query.eventId ? Number(req.query.eventId) : (req.body.eventId ? Number(req.body.eventId) : undefined);
        const result = await reportService.runReport(req.body, eventId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const saveReport = async (req: Request, res: Response) => {
    try {
        const eventId = req.query.eventId ? Number(req.query.eventId) : (req.body.eventId ? Number(req.body.eventId) : undefined);
        const result = await reportService.saveReport({ ...req.body, event_id: eventId });

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getReports = async (req: Request, res: Response) => {
    try {
        const eventId = req.query.eventId ? Number(req.query.eventId) : undefined;
        const result = await reportService.getReports(eventId);

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const exportReport = async (req: Request, res: Response) => {
    try {
        const { format, ...config } = req.body;
        const eventId = req.query.eventId ? Number(req.query.eventId) : (req.body.eventId ? Number(req.body.eventId) : undefined);
        const result = await reportService.exportReport(config, format, eventId);

        res.setHeader('Content-Type', result.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

        result.stream.pipe(res);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const eventId = req.query.eventId ? Number(req.query.eventId) : (req.body.eventId ? Number(req.body.eventId) : undefined);

        const result = await reportService.getReportById(id, eventId);

        if (!result.success) {
            if (result.message === "Report not found") {
                return res.status(404).json(result);
            }
            return res.status(500).json(result);
        }

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateReport = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const eventId = req.query.eventId ? Number(req.query.eventId) : (req.body.eventId ? Number(req.body.eventId) : undefined);
        const result = await reportService.updateReport(id, { ...req.body, event_id: eventId });

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const exportReportById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const format = (req.query.format as string) || 'xlsx';
        const result: any = await reportService.exportReportById(id, format);

        if (result.success === false) {
            return res.status(result.message === "Report not found" ? 404 : 500).json(result);
        }

        res.setHeader('Content-Type', result.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

        result.stream.pipe(res);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
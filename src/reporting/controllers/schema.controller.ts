import { Request, Response } from "express";
import { SchemaService } from "../services/schema.service";
import db from "../../../database/db";

const schemaService = new SchemaService(db);

export const getTables = async (_req: Request, res: Response) => {
    try {
        const result = await schemaService.getTables();
        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFields = async (req: Request, res: Response) => {
    try {
        const { table } = req.query;

        if (!table) {
            return res.status(400).json({
                success: false,
                message: "Table name is required",
            });
        }

        const result = await schemaService.getFields(table as string);

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
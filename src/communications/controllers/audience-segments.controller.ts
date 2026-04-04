import { Request, Response } from 'express';
import { AudienceSegmentsService, CreateSegmentInput, UpdateSegmentInput, SegmentRule } from '../services/audience-segments.service';

const segmentsService = new AudienceSegmentsService();

export class AudienceSegmentsController {
  // Helper to extract eventId from params or query
  private getEventId(req: Request): number | null {
    const eventIdParam = req.params.eventId || req.query.eventId;
    if (!eventIdParam) return null;
    const eventId = parseInt(eventIdParam as string, 10);
    return isNaN(eventId) ? null : eventId;
  }

  // Get all segments for an event
  async getSegments(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);
      const { search, page, limit } = req.query;

      const result = await segmentsService.getSegmentsByEventId(eventId, {
        search: search as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching segments:', error);
      return res.status(500).json({ message: 'Failed to fetch segments' });
    }
  }

  // Get segment by ID
  async getSegmentById(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);
      const segmentId = parseInt(req.params.segmentId, 10);

      if (isNaN(segmentId)) {
        return res.status(400).json({ message: "Valid Segment ID is required" });
      }

      const segment = await segmentsService.getSegmentById(eventId, segmentId);
      if (!segment) {
        return res.status(404).json({ message: 'Segment not found' });
      }

      return res.status(200).json(segment);
    } catch (error: any) {
      console.error('Error fetching segment:', error);
      return res.status(500).json({ message: 'Failed to fetch segment' });
    }
  }

  // Create segment
  async createSegment(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);

      const { name, description, match_type, rules_json, is_active } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Segment name is required' });
      }

      if (!match_type || !['ALL', 'ANY'].includes(match_type)) {
        return res.status(400).json({ message: 'Match type must be "ALL" or "ANY"' });
      }

      if (!rules_json || !Array.isArray(rules_json)) {
        return res.status(400).json({ message: 'Rules must be an array' });
      }

      const input: CreateSegmentInput = {
        name: name.trim(),
        description: description?.trim(),
        match_type,
        rules_json,
        is_active,
      };

      const segment = await segmentsService.createSegment(eventId, input);
      return res.status(201).json(segment);
    } catch (error: any) {
      console.error('Error creating segment:', error);
      return res.status(500).json({ message: 'Failed to create segment' });
    }
  }

  // Update segment
  async updateSegment(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);
      const segmentId = parseInt(req.params.segmentId, 10);

      if (isNaN(segmentId)) {
        return res.status(400).json({ message: "Valid Segment ID is required" });
      }

      const { name, description, match_type, rules_json, is_active } = req.body;

      const input: UpdateSegmentInput = {};
      if (name !== undefined) input.name = name.trim();
      if (description !== undefined) input.description = description?.trim();
      if (match_type !== undefined) {
        if (!['ALL', 'ANY'].includes(match_type)) {
          return res.status(400).json({ message: 'Match type must be "ALL" or "ANY"' });
        }
        input.match_type = match_type;
      }
      if (rules_json !== undefined) {
        if (!Array.isArray(rules_json)) {
          return res.status(400).json({ message: 'Rules must be an array' });
        }
        input.rules_json = rules_json;
      }
      if (is_active !== undefined) input.is_active = is_active;

      const segment = await segmentsService.updateSegment(eventId, segmentId, input);
      if (!segment) {
        return res.status(404).json({ message: 'Segment not found' });
      }

      return res.status(200).json(segment);
    } catch (error: any) {
      console.error('Error updating segment:', error);
      return res.status(500).json({ message: 'Failed to update segment' });
    }
  }

  // Delete segment
  async deleteSegment(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);
      const segmentId = parseInt(req.params.segmentId, 10);

      if (isNaN(segmentId)) {
        return res.status(400).json({ message: "Valid Segment ID is required" });
      }

      const deleted = await segmentsService.deleteSegment(eventId, segmentId);
      if (!deleted) {
        return res.status(404).json({ message: 'Segment not found' });
      }

      return res.status(200).json({ message: 'Segment deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting segment:', error);
      return res.status(500).json({ message: 'Failed to delete segment' });
    }
  }

  // Preview segment members
  async previewSegment(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);

      const { rules_json, match_type, limit } = req.body;

      if (!match_type || !['ALL', 'ANY'].includes(match_type)) {
        return res.status(400).json({ message: 'Match type must be "ALL" or "ANY"' });
      }

      if (!rules_json || !Array.isArray(rules_json)) {
        return res.status(400).json({ message: 'Rules must be an array' });
      }

      const result = await segmentsService.previewSegmentMembers(
        eventId, 
        rules_json as SegmentRule[], 
        match_type, 
        limit || 10
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error previewing segment:', error);
      return res.status(500).json({ message: 'Failed to preview segment' });
    }
  }

  // Get segment members
  async getSegmentMembers(req: Request, res: Response) {
    try {
      const segmentId = parseInt(req.params.segmentId, 10);

      if (isNaN(segmentId)) {
        return res.status(400).json({ message: 'Valid Segment ID is required' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await segmentsService.getSegmentMembers(segmentId, page, limit);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching segment members:', error);
      return res.status(500).json({ message: 'Failed to fetch segment members' });
    }
  }

  // Refresh segment (recalculate count)
  async refreshSegment(req: Request, res: Response) {
    try {
      const eventId = this.getEventId(req);
      const segmentId = parseInt(req.params.segmentId, 10);

      if (isNaN(segmentId)) {
        return res.status(400).json({ message: 'Valid Segment ID is required' });
      }

      const segment = await segmentsService.refreshSegment(eventId, segmentId);
      if (!segment) {
        return res.status(404).json({ message: 'Segment not found' });
      }

      return res.status(200).json(segment);
    } catch (error: any) {
      console.error('Error refreshing segment:', error);
      return res.status(500).json({ message: 'Failed to refresh segment' });
    }
  }

  // Get available filter fields
  async getFilterFields(req: Request, res: Response) {
    try {
      const fields = segmentsService.getAvailableFilterFields();
      return res.status(200).json(fields);
    } catch (error: any) {
      console.error('Error fetching filter fields:', error);
      return res.status(500).json({ message: 'Failed to fetch filter fields' });
    }
  }
}

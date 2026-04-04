import { Request, Response } from 'express';
import { SenderIdentitiesService } from '../services/sender-identities.service';

const senderService = new SenderIdentitiesService();

export class SenderIdentitiesController {
  async getAll(req: Request, res: Response) {
    try {
      const senders = await senderService.getAll();
      return res.status(200).json({ senders });
    } catch (error: any) {
      console.error('Error fetching sender identities:', error);
      return res.status(500).json({ message: 'Failed to fetch sender identities' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid sender identity ID' });
      }

      const sender = await senderService.getById(id);
      if (!sender) {
        return res.status(404).json({ message: 'Sender identity not found' });
      }

      return res.status(200).json({ sender });
    } catch (error: any) {
      console.error('Error fetching sender identity:', error);
      return res.status(500).json({ message: 'Failed to fetch sender identity' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const senderData = req.body;
      const sender = await senderService.create(senderData);
      return res.status(201).json({
        message: 'Sender identity created successfully',
        sender
      });
    } catch (error: any) {
      console.error('Error creating sender identity:', error);
      return res.status(500).json({ message: 'Failed to create sender identity' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid sender identity ID' });
      }

      const senderData = req.body;
      const sender = await senderService.update(id, senderData);

      if (!sender) {
        return res.status(404).json({ message: 'Sender identity not found' });
      }

      return res.status(200).json({
        message: 'Sender identity updated successfully',
        sender
      });
    } catch (error: any) {
      console.error('Error updating sender identity:', error);
      return res.status(500).json({ message: 'Failed to update sender identity' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid sender identity ID' });
      }

      await senderService.delete(id);

      return res.status(200).json({
        message: 'Sender identity deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting sender identity:', error);
      return res.status(500).json({ message: 'Failed to delete sender identity' });
    }
  }
}

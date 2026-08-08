import { Request, Response } from 'express';
import { prisma } from '../config';

export class ContactController {
  // Public endpoint: Submit Contact Form
  createMessage = async (req: Request, res: Response) => {
    try {
      const { name, email, topic, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required fields.' });
      }

      const newMsg = await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          topic: topic ? topic.trim() : 'General Inquiry',
          message: message.trim(),
          status: 'UNREAD',
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been stored successfully. Our support team will review and contact you shortly.',
        data: newMsg,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to submit message.' });
    }
  };

  // Admin or Vendor: Fetch submitted messages
  getMessages = async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      let whereClause = {};
      if (email && typeof email === 'string') {
        whereClause = { email: email.trim().toLowerCase() };
      }
      const messages = await prisma.contactMessage.findMany({
        where: whereClause,
        orderBy: { created_at: 'desc' },
      });

      return res.status(200).json({ success: true, data: messages });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  };

  // Admin endpoint: Update message status (UNREAD / READ / REPLIED)
  updateMessageStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await prisma.contactMessage.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  };
}

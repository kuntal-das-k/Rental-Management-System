import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async signupCustomer(req: Request, res: Response) {
    try {
      const result = await authService.signupCustomer(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async signupVendor(req: Request, res: Response) {
    try {
      const result = await authService.signupVendor(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.resetPassword(email);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await authService.getAllUsers();
      return res.status(200).json({ success: true, data: users });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async toggleUserActive(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updated = await authService.toggleUserActive(id, isActive);
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

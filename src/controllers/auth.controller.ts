import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export const registerController = async (req: Request, res: Response) => {
  try {
    // Validasi basic input
    const { nama, email, password, kontak } = req.body;
    if (!nama || !email || !password || !kontak) {
       return res.status(400).json({ status: false, message: 'Semua field wajib diisi' });
    }

    const result = await authService.register(req.body);
    return res.status(201).json({
      status: true,
      message: 'Registrasi user berhasil',
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
       return res.status(400).json({ status: false, message: 'Email dan password wajib diisi' });
    }

    const result = await authService.login(req.body);
    return res.status(200).json({
      status: true,
      message: 'Login berhasil',
      data: result
    });
  } catch (error: any) {
    return res.status(401).json({ status: false, message: error.message });
  }
};
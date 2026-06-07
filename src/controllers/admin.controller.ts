import { Request, Response } from 'express';
import * as adminService from '../services/admin.service.js';

export const getDashboardStatsController = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getAdminDashboardStats();
    return res.status(200).json({ status: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getPendingVerificationsController = async (req: Request, res: Response) => {
  try {
    const list = await adminService.getPendingVerifications();
    return res.status(200).json({ status: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const verifyMatchController = async (req: Request, res: Response) => {
  try {
    const id_admin = req.user!.id_user; // Diambil langsung dari token login admin yang sah
    const { id_pencocokan, status_verifikasi, catatan } = req.body;

    if (id_pencocokan === undefined || status_verifikasi === undefined || !catatan) {
      return res.status(400).json({ status: false, message: 'ID Pencocokan, Status Verifikasi, dan Catatan wajib diisi' });
    }

    const result = await adminService.processVerification(
      id_admin,
      parseInt(id_pencocokan),
      Boolean(status_verifikasi),
      catatan
    );

    return res.status(201).json({
      status: true,
      message: status_verifikasi 
        ? 'Verifikasi berhasil: Status barang dinyatakan COCOK secara fisik' 
        : 'Verifikasi berhasil: Barang dinyatakan TIDAK COCOK',
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
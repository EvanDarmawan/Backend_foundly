import { Request, Response } from 'express';
import * as claimService from '../services/claim.service.js';

export const createClaimController = async (req: Request, res: Response) => {
  try {
    // Validasi apakah ada file bukti klaim yang diunggah
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'Bukti klaim fisik (Foto serah terima/KTM) wajib diunggah' });
    }

    const id_user_pelapor = req.user!.id_user; // Diambil aman dari token login pelapor
    const { id_temuan } = req.body;

    if (!id_temuan) {
      return res.status(400).json({ status: false, message: 'ID Barang temuan yang ingin diklaim wajib diisi' });
    }

    const result = await claimService.createClaimTicket(
      id_user_pelapor,
      parseInt(id_temuan),
      req.file.filename
    );

    return res.status(201).json({
      status: true,
      message: 'Transaksi klaim berhasil! Barang telah sukses diserahterimakan',
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getClaimHistoryController = async (req: Request, res: Response) => {
  try {
    const data = await claimService.getAllClaimHistory();
    return res.status(200).json({ status: true, data });
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
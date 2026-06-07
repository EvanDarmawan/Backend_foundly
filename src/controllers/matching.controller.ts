import { Request, Response } from 'express';
import * as matchingService from '../services/matching.service.js';

export const getMatchResultsController = async (req: Request, res: Response) => {
  try {
    const id_barang_hilang = parseInt(req.params.id_barang_hilangn as string);
    const data = await matchingService.getMatchResultsForLostItem(id_barang_hilang);
    
    return res.status(200).json({
      status: true,
      message: 'Berhasil memuat rekomendasi barang temuan yang mirip berbasis AI',
      data
    });
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
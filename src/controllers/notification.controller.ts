import { Request, Response } from 'express';
import * as notifService from '../services/notification.service.js';

export const getMyNotificationsController = async (req: Request, res: Response) => {
  try {
    const id_user = req.user!.id_user; // Diambil aman dari token JWT login user
    const data = await notifService.getUserNotifications(id_user);
    return res.status(200).json({ status: true, data });
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const readNotificationController = async (req: Request, res: Response) => {
  try {
    const id_user = req.user!.id_user;
    const id_notifikasi = parseInt(req.params.id as string);

    const result = await notifService.markAsRead(id_notifikasi, id_user);
    return res.status(200).json({ status: true, message: 'Notifikasi ditandai telah dibaca', data: result });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
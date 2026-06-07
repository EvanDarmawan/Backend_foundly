import { Request, Response } from 'express';
import * as userService from '../services/user.service.js';

// Get Profil Sendiri (Berdasarkan Token)
export const getMyProfileController = async (req: Request, res: Response) => {
  try {
    const id_user = req.user!.id_user; // Didapat dari middleware authenticateJWT
    const profile = await userService.getUserProfile(id_user);
    
    return res.status(200).json({ status: true, data: profile });
  } catch (error: any) {
    return res.status(404).json({ status: false, message: error.message });
  }
};

// Update Profil Sendiri
export const updateMyProfileController = async (req: Request, res: Response) => {
  try {
    const id_user = req.user!.id_user;
    const result = await userService.updateProfile(id_user, req.body);
    
    return res.status(200).json({
      status: true,
      message: 'Profil berhasil diperbarui',
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

// [ADMIN ONLY] Get All Users
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ status: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// [ADMIN ONLY] Change User Role
export const changeRoleController = async (req: Request, res: Response) => {
  try {
    const targetUserId = parseInt(req.params.id as string);
    const { role } = req.body;

    if (!role || !['PELAPOR', 'PENEMU', 'ADMIN'].includes(role)) {
      return res.status(400).json({ status: false, message: 'Role tidak valid' });
    }

    const result = await userService.updateUserRole(targetUserId, role);
    return res.status(200).json({
      status: true,
      message: `Role berhasil diubah menjadi ${role}`,
      data: result
    });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

// [ADMIN ONLY] Delete User
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const targetUserId = parseInt(req.params.id as string);
    const result = await userService.deleteUserByAdmin(targetUserId);
    
    return res.status(200).json({ status: true, message: result.message });
  } catch (error: any) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
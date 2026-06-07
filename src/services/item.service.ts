import prisma from '../config/database.js';
import { triggerMatchingForLostItem } from './matching.service.js'; // <--- Import fungsi trigger baru

export const createLostReport = async (id_user: number, data: any, filename: string) => {
  const newReport = await prisma.barangHilang.create({
    data: {
      id_user: id_user,
      nama_barang: data.nama_barang,
      kategori: data.kategori,
      deskripsi: data.deskripsi,
      lokasi_hilang: data.lokasi_hilang,
      waktu_hilang: new Date(data.waktu_hilang),
      tgl_hilang: new Date(data.tgl_hilang),
      foto_barang: `/uploads/${filename}`,
      status: 'PROSES'
    }
  });

  // BEST PRACTICE: Jalankan proses pencocokan AI di latar belakang (Asynchronous Background Job)
  // Tidak menggunakan 'await' di sini sengaja dilakukan agar HTTP Response ke user tidak tertunda lama oleh kalkulasi AI
  triggerMatchingForLostItem(newReport.id_barang_hilang);

  return newReport;
};

// 2. Mengambil semua daftar barang hilang (Untuk konsumsi dashboard utama/public)
export const getAllLostReports = async () => {
  return await prisma.barangHilang.findMany({
    include: {
      user: {
        select: {
          nama: true,
          kontak: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// 3. Mengambil detail barang hilang berdasarkan ID tertentu
export const getLostReportById = async (id_barang_hilang: number) => {
  const report = await prisma.barangHilang.findUnique({
    where: { id_barang_hilang },
    include: {
      user: {
        select: { nama: true, kontak: true, email: true }
      }
    }
  });
  
  if (!report) throw new Error('Laporan barang hilang tidak ditemukan');
  return report;
};

// 4. Menghapus laporan (Hanya pemilik laporan atau Admin yang boleh menghapus)
export const deleteLostReport = async (id_barang_hilang: number, id_user: number, role: string) => {
  const report = await prisma.barangHilang.findUnique({ where: { id_barang_hilang } });
  
  if (!report) throw new Error('Laporan tidak ditemukan');
  
  // Proteksi Keamanan: Jika bukan pemilik asli DAN bukan admin, tolak akses!
  if (report.id_user !== id_user && role !== 'ADMIN') {
    throw new Error('Anda tidak memiliki otoritas untuk menghapus laporan ini');
  }

  await prisma.barangHilang.delete({ where: { id_barang_hilang } });
  return { message: 'Laporan barang hilang berhasil dihapus' };
};
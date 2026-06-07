import prisma from '../config/database.js';
import { createNotification } from './notification.service.js'; // <--- INI PERUBAHANNYA: Mengambil fungsi pembuat notifikasi

// 1. Mengambil data statistik ringkas untuk Dashboard Utama Admin
export const getAdminDashboardStats = async () => {
  const totalUser = await prisma.user.count();
  const totalBarangHilang = await prisma.barangHilang.count({ where: { status: 'PROSES' } });
  const totalBarangTemuan = await prisma.barangTemuan.count({ where: { status: 'DISIMPAN' } });
  const totalKlaimSelesai = await prisma.klaimBarang.count({ where: { status: 'DI_AMBIL' } });

  return {
    total_user: totalUser,
    aktif_laporan_hilang: totalBarangHilang,
    aktif_barang_disimpan: totalBarangTemuan,
    total_klaim_sukses: totalKlaimSelesai
  };
};

// 2. Mendapatkan daftar pencocokan AI yang menunggu verifikasi fisik petugas
export const getPendingVerifications = async () => {
  return await prisma.pencocokan.findMany({
    where: {
      status: false
    },
    include: {
      barang_hilang: {
        include: { user: { select: { nama: true, kontak: true } } }
      },
      barang_temuan: {
        include: { user: { select: { nama: true } } }
      }
    },
    orderBy: { tingkat_kemiripan: 'desc' }
  });
};

// 3. Eksekusi Verifikasi Fisik (Double Verification Approval/Rejection)
export const processVerification = async (id_admin: number, id_pencocokan: number, status_verifikasi: boolean, catatan: string) => {
  // A. Cek apakah data pencocokan tersebut eksis, sekaligus ambil data barang_hilang di dalamnya
  const matchData = await prisma.pencocokan.findUnique({
    where: { id_pencocokan },
    include: {
      barang_hilang: true, // <--- INI PERUBAHANNYA: Sekarang kita sertakan relasi barang_hilang agar tahu siapa pemiliknya
      barang_temuan: true
    }
  });

  if (!matchData) throw new Error('Data pencocokan barang tidak ditemukan');

  // B. Jalankan Database Transaction
  return await prisma.$transaction(async (tx) => {
    
    // 1. Buat log data verifikasi admin
    const newVerification = await tx.verifikasi.create({
      data: {
        id_pencocokan,
        id_admin,
        status_verifikasi,
        catatan,
        waktu_verifikasi: new Date(),
        tgl_verfikasi: new Date(),
      }
    });

    // 2. Perbarui status di tabel jembatan pencocokan
    await tx.pencocokan.update({
      where: { id_pencocokan },
      data: { status: status_verifikasi }
    });

    // 3. Jika Admin menyatakan FISIKNYA COCOK, ubah status operasional kedua barang
    if (status_verifikasi === true) {
      // Ubah status barang hilang menjadi DITEMUKAN
      await tx.barangHilang.update({
        where: { id_barang_hilang: matchData.id_barang_hilang },
        data: { status: 'DITEMUKAN' }
      });

      // Ubah status barang temuan menjadi MENUNGGU
      await tx.barangTemuan.update({
        where: { id_temuan: matchData.id_temuan },
        data: { status: 'MENUNGGU' }
      });

      // 4. INI PERUBAHAN UTAMANYA: Memicu notifikasi masuk ke akun si pelapor barang hilang
      await createNotification(
        matchData.barang_hilang.id_user, // ID user pelapor yang kehilangan barang
        `Kabar baik! Laporan barang hilang Anda (${matchData.barang_hilang.nama_barang}) telah diverifikasi COCOK secara fisik oleh Admin dengan barang temuan ID #${matchData.id_temuan}. Silakan lakukan klaim di pos logistik.`
      );
    }

    return newVerification;
  });
};
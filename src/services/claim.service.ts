import prisma from '../config/database.js';

// 1. Eksekusi Klaim / Serah Terima Barang (Final Transaction)
export const createClaimTicket = async (id_user_pelapor: number, id_temuan: number, filename: string) => {
  // A. Pastikan barang temuan tersebut ada dan statusnya memang 'MENUNGGU' (Sudah diverifikasi admin)
  const foundItem = await prisma.barangTemuan.findUnique({
    where: { id_temuan }
  });

  if (!foundItem) throw new Error('Data barang temuan tidak ditemukan');
  if (foundItem.status !== 'MENUNGGU') {
    throw new Error('Barang belum divalidasi oleh admin atau sudah diklaim oleh orang lain');
  }

  // B. Cari data pencocokan yang valid untuk mendapatkan ID barang hilang milik si pelapor
  const matchingData = await prisma.pencocokan.findFirst({
    where: {
      id_temuan: id_temuan,
      status: true // Yang sudah diverifikasi cocok oleh admin
    },
    include: {
      barang_hilang: true
    }
  });

  if (!matchingData || matchingData.barang_hilang.id_user !== id_user_pelapor) {
    throw new Error('Anda tidak memiliki hak untuk mengklaim barang ini (ID User tidak cocok dengan pelapor asli)');
  }

  // C. Eksekusi Database Transaction untuk menjaga konsistensi status data
  return await prisma.$transaction(async (tx) => {
    // 1. Buat struk/dokumen klaim barang baru
    const claim = await tx.klaimBarang.create({
      data: {
        id_temuan: id_temuan,
        id_user: id_user_pelapor,
        bukti_klaim: `/uploads/${filename}`, // Menyimpan foto serah terima/KTM
        status: 'DI_AMBIL',
        waktu_pengambilan: new Date()
      }
    });

    // 2. Update status barang temuan menjadi DIAMBIL / SELESAI
    await tx.barangTemuan.update({
      where: { id_temuan },
      data: { status: 'DIAMBIL' }
    });

    // 3. Update status laporan barang hilang menjadi SELESAI
    await tx.barangHilang.update({
      where: { id_barang_hilang: matchingData.id_barang_hilang },
      data: { status: 'SELESAI' }
    });

    return claim;
  });
};

// 2. [KHUSUS ADMIN]: Melihat histori seluruh klaim barang yang sudah selesai di kampus
export const getAllClaimHistory = async () => {
  return await prisma.klaimBarang.findMany({
    include: {
      user: {
        select: { nama: true, email: true, kontak: true }
      },
      barang_temuan: true
    },
    orderBy: { waktu_pengambilan: 'desc' }
  });
};
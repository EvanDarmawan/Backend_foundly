-- CreateTable
CREATE TABLE `tb_user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('PELAPOR', 'PENEMU', 'ADMIN') NOT NULL DEFAULT 'PELAPOR',
    `kontak` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tb_user_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_barang_hilang` (
    `id_barang_hilang` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama_barang` VARCHAR(100) NOT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `lokasi_hilang` VARCHAR(100) NOT NULL,
    `waktu_hilang` DATETIME(3) NOT NULL,
    `tgl_hilang` DATETIME(3) NOT NULL,
    `foto_barang` TEXT NOT NULL,
    `status` ENUM('PROSES', 'DITEMUKAN', 'TIDAK_DITEMUKAN', 'SELESAI') NOT NULL DEFAULT 'PROSES',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_barang_hilang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_barang_temuan` (
    `id_temuan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nama_barang` VARCHAR(100) NOT NULL,
    `kategori` VARCHAR(50) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `lokasi_temuan` VARCHAR(100) NOT NULL,
    `waktu_temuan` DATETIME(3) NOT NULL,
    `tgl_temuan` DATETIME(3) NOT NULL,
    `foto_barang` TEXT NOT NULL,
    `status` ENUM('DISIMPAN', 'MENUNGGU', 'DIAMBIL', 'SELESAI') NOT NULL DEFAULT 'DISIMPAN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_temuan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_pencocokan` (
    `id_pencocokan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_barang_hilang` INTEGER NOT NULL,
    `id_temuan` INTEGER NOT NULL,
    `tingkat_kemiripan` DOUBLE NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_pencocokan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_verifikasi` (
    `id_verifikasi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pencocokan` INTEGER NOT NULL,
    `id_admin` INTEGER NOT NULL,
    `status_verifikasi` BOOLEAN NOT NULL DEFAULT false,
    `catatan` TEXT NOT NULL,
    `tgl_verfikasi` DATETIME(3) NOT NULL,
    `waktu_verifikasi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tb_verifikasi_id_pencocokan_key`(`id_pencocokan`),
    PRIMARY KEY (`id_verifikasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_notifikasi` (
    `id_notifikasi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `pesan` TEXT NOT NULL,
    `waktu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('DIBACA', 'BELUM') NOT NULL DEFAULT 'BELUM',

    PRIMARY KEY (`id_notifikasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `klaim_barang` (
    `id_klaim` INTEGER NOT NULL AUTO_INCREMENT,
    `id_temuan` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `waktu_pengambilan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bukti_klaim` TEXT NOT NULL,
    `status` ENUM('DI_AMBIL', 'BELUM_DI_AMBIL') NOT NULL DEFAULT 'BELUM_DI_AMBIL',

    UNIQUE INDEX `klaim_barang_id_temuan_key`(`id_temuan`),
    PRIMARY KEY (`id_klaim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_barang_hilang` ADD CONSTRAINT `tb_barang_hilang_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tb_user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_barang_temuan` ADD CONSTRAINT `tb_barang_temuan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tb_user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_pencocokan` ADD CONSTRAINT `tb_pencocokan_id_barang_hilang_fkey` FOREIGN KEY (`id_barang_hilang`) REFERENCES `tb_barang_hilang`(`id_barang_hilang`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_pencocokan` ADD CONSTRAINT `tb_pencocokan_id_temuan_fkey` FOREIGN KEY (`id_temuan`) REFERENCES `tb_barang_temuan`(`id_temuan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_verifikasi` ADD CONSTRAINT `tb_verifikasi_id_pencocokan_fkey` FOREIGN KEY (`id_pencocokan`) REFERENCES `tb_pencocokan`(`id_pencocokan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_verifikasi` ADD CONSTRAINT `tb_verifikasi_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `tb_user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_notifikasi` ADD CONSTRAINT `tb_notifikasi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tb_user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `klaim_barang` ADD CONSTRAINT `klaim_barang_id_temuan_fkey` FOREIGN KEY (`id_temuan`) REFERENCES `tb_barang_temuan`(`id_temuan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `klaim_barang` ADD CONSTRAINT `klaim_barang_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tb_user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

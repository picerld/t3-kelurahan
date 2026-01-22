-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU', 'KEPERCAYAAN', 'LAINNYA');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI');

-- CreateEnum
CREATE TYPE "FamilyRole" AS ENUM ('KEPALA_KELUARGA', 'SUAMI', 'ISTRI', 'ANAK', 'MENANTU', 'CUCU', 'ORANG_TUA', 'MERTUA', 'FAMILI_LAIN', 'PEMBANTU', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('TIDAK_SEKOLAH', 'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('BELUM_TIDAK_BEKERJA', 'PELAJAR_MAHASISWA', 'IRT', 'PNS', 'TNI', 'POLRI', 'KARYAWAN_SWASTA', 'WIRASWASTA', 'PETANI', 'NELAYAN', 'BURUH', 'PENSIUNAN', 'LAINNYA');

-- CreateTable
CREATE TABLE "penduduk" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "Gender" NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "agama" "Religion",
    "pendidikan" "Education",
    "pekerjaan" "Occupation",
    "statusPerkawinan" "MaritalStatus",
    "kewarganegaraan" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "alamatId" TEXT,
    "keluargaId" TEXT,
    "statusDalamKeluarga" "FamilyRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penduduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keluarga" (
    "id" TEXT NOT NULL,
    "noKK" TEXT NOT NULL,
    "kepalaNIK" TEXT,
    "namaKepala" TEXT,
    "alamatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alamat" (
    "id" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT,
    "rw" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupaten" TEXT,
    "provinsi" TEXT,
    "kodePos" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alamat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "penduduk_nik_key" ON "penduduk"("nik");

-- CreateIndex
CREATE INDEX "penduduk_keluargaId_idx" ON "penduduk"("keluargaId");

-- CreateIndex
CREATE INDEX "penduduk_alamatId_idx" ON "penduduk"("alamatId");

-- CreateIndex
CREATE UNIQUE INDEX "keluarga_noKK_key" ON "keluarga"("noKK");

-- CreateIndex
CREATE INDEX "keluarga_alamatId_idx" ON "keluarga"("alamatId");

-- CreateIndex
CREATE INDEX "alamat_kelurahan_kecamatan_idx" ON "alamat"("kelurahan", "kecamatan");

-- AddForeignKey
ALTER TABLE "penduduk" ADD CONSTRAINT "penduduk_alamatId_fkey" FOREIGN KEY ("alamatId") REFERENCES "alamat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penduduk" ADD CONSTRAINT "penduduk_keluargaId_fkey" FOREIGN KEY ("keluargaId") REFERENCES "keluarga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keluarga" ADD CONSTRAINT "keluarga_alamatId_fkey" FOREIGN KEY ("alamatId") REFERENCES "alamat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

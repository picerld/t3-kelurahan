export type Citizen = {
    id: string;
    nik: string;
    nama: string;
    email: string;
    jenisKelamin: string;
    kewarganegaraan: string;
    agama: string,
    pekerjaan: string,
    pendidikan: string,
    statusPerkawinan: string,
    noHp: string;
    statusDalamKeluarga: string;
    tanggalLahir: Date;
    tempatLahir?: string;
    keluargaId?: string;
    alamatId?: string;

    createdAt: Date;
}
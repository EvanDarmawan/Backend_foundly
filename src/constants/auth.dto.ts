export interface RegisterDTO {
  nama: string;
  email: string;
  password: string;
  kontak: string;
  role?: 'PELAPOR' | 'PENEMU';
}

export interface LoginDTO {
  email: string;
  password: string;
}
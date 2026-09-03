# LMS Qur'an Hadis MA Al-Huda V2.2

Login siswa menggunakan NIS + PIN. Website membentuk email internal Supabase dari NIS, sehingga siswa tidak perlu mengetahui email tersebut.

Alfira:
- NIS: 12345
- Email internal: 12345@student.alhuda.local
- PIN: gunakan password yang dibuat di Authentication.

Setup:
1. Pastikan akun Alfira sudah ada di Authentication.
2. Pastikan profil Alfira sudah ada di tabel profiles.
3. Buka js/config.js.
4. Project URL sudah terisi.
5. Isi SUPABASE_ANON_KEY dengan Publishable/Anon Key dari Supabase > Project Settings > API.
6. Jangan gunakan service_role key.
7. Upload folder ke Netlify.

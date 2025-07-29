Berikut adalah `README.md` **lengkap dan disesuaikan** berdasarkan script `package.json` milikmu, termasuk setup `pnpm`, `drizzle-kit`, dan perintah untuk linting, formatting, dan build:

---

````markdown
# 🚀 Backend Project Setup with Drizzle ORM + pnpm + TypeScript

Panduan ini menjelaskan langkah-langkah lengkap untuk menjalankan proyek backend menggunakan **TypeScript**, **Drizzle ORM**, **PostgreSQL**, dan **pnpm**.

---

## ✅ Prasyarat

Sebelum memulai, pastikan kamu sudah menginstal:

- **Node.js** (disarankan versi terbaru)
- **PostgreSQL** (aktif dan dapat diakses)
- **pnpm** (pasang via `npm install -g pnpm`)

---

## 📦 1. Install Dependency

```bash
pnpm install
```
````

---

## 🗃️ 2. Setup Database

Buat database PostgreSQL baru, misalnya `mydb`:

```sql
CREATE DATABASE mydb;
```

Lalu buat file `.env` di root proyek:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

Ganti `username`, `password`, dan `mydb` sesuai dengan database lokalmu.

---

## ⚙️ 3. Konfigurasi Drizzle ORM

Pastikan kamu punya file `drizzle.config.ts` seperti berikut:

```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Contoh schema di `src/db/schema.ts`:

```ts
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: text('email').notNull(),
});
```

---

## 🛠️ 4. Generate & Migrate Database

### Generate migration dari schema:

```bash
pnpm db:generate
```

### Push/migrate ke database:

```bash
pnpm db:migrate
```

### (Opsional) Studio visualisasi schema:

```bash
pnpm db:studio
```

---

## 🧪 5. Menjalankan Server

### Mode development:

```bash
pnpm dev
```

> Akan menjalankan `src/index.ts` dengan `nodemon` di port 8080.

### Mode production (setelah build):

```bash
pnpm build
pnpm start
```

---

## 🧹 6. Tools & Maintenance

### Cek & perbaiki lint:

```bash
pnpm lint       # cek
pnpm lint:fix   # otomatis perbaiki
```

### Format dengan Prettier:

```bash
pnpm format        # auto format
pnpm format:check  # hanya cek, tanpa ubah file
```

### Type-check tanpa compile:

```bash
pnpm type-check
```

---

## 📁 Struktur Folder

```
project/
├── src/
│   ├── index.ts
│   └── db/
│       └── schema.ts
├── drizzle/
│   └── migrations/
├── .env
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── ...
```

---

## 🔒 Git Hook Support (Husky)

Jika menggunakan Husky, jalankan ini untuk setup hook:

```bash
pnpm prepare
```

---

## 🧪 Testing (Placeholder)

```bash
pnpm test
```

> Saat ini belum ada testing, perlu ditambahkan nanti.

---

## 📌 Catatan

- Pastikan koneksi database aktif saat menjalankan migrasi.
- Gunakan `.env` untuk menyimpan variabel sensitif dan jangan commit ke git.

---

## 🪪 Lisensi

Proyek ini menggunakan lisensi MIT.

```

---

Silakan modifikasi sesuai struktur proyekmu jika berbeda. Kalau kamu butuh contoh folder `src` atau contoh endpoint `Express`, tinggal bilang saja!
```

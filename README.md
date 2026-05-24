
# 🚀 KTV / – Next.js 14 Fullstack Project

Dự án web fullstack xây dựng hệ thống đặt phòng (KTV booking system) sử dụng **Next.js 14 App Router** cùng hệ sinh thái hiện đại như Auth, Database, UI và Cloud Storage.

---

## 🧰 Tech Stack

* ⚡ **Next.js 14 (App Router)**
* 🔐 **Kinde Authentication** (Google, Facebook, Passwordless)
* 💿 **Supabase Database + Storage**
* 🧠 **Prisma ORM**
* 🎨 **Tailwind CSS + Shadcn/UI**
* 📅 React Date Range (Calendar booking)
* 📍 Leaflet Map (location system)
* 🚀 Deploy Vercel

---

## ✨ Features

### 🔐 Authentication System

* Login / Register không mật khẩu
* OAuth Google / Facebook
* Role-based access (Admin / Manager / Customer)

### 🏠 Room Management

* Create / edit / delete rooms
* Room types (VIP / Luxury / Standard)
* Hourly pricing system
* Image gallery per room

### 📅 Booking System

* Booking theo giờ
* Tính tiền tự động
* Check trạng thái phòng (Available / Using / Cleaning)
* Lịch đặt phòng trực quan

### 🍔 Service System (Food & Drinks)

* Add dịch vụ đồ ăn / đồ uống
* Gắn service vào booking
* Tính tổng tiền booking + service

### 📊 Dashboard

* Admin dashboard
* Manager tools
* User management

### ⚡ UI/UX

* Multi-step form tạo phòng
* Filter search rooms
* Responsive UI
* Loading states + streaming

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

---

### 2. Setup environment variables

Tạo file `.env`:

```env
DATABASE_URL=your_postgres_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
KINDE_CLIENT_ID=your_kinde_id
KINDE_CLIENT_SECRET=your_kinde_secret
KINDE_ISSUER_URL=your_kinde_url
```

---

### 3. Prisma setup

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

---

### 4. Run project

```bash
npm run dev
```

Mở:

```
http://localhost:3000
```

---

## 📁 Project Structure

```
app/
  ├── (routes)
  ├── components
  ├── lib
  ├── actions
  ├── api
prisma/
  ├── schema.prisma
  ├── seed.ts
```

---

## 🚀 Deploy

Deploy dễ nhất bằng **Vercel**:

* Connect GitHub repo
* Add environment variables
* Deploy

---

## 📚 Useful Links

* Next.js → [https://nextjs.org](https://nextjs.org)
* Kinde Auth → [https://kinde.com](https://kinde.com)
* Supabase → [https://supabase.com](https://supabase.com)
* Prisma → [https://prisma.io](https://prisma.io)
* Tailwind → [https://tailwindcss.com](https://tailwindcss.com)
* Shadcn UI → [https://ui.shadcn.com](https://ui.shadcn.com)

---

## 💡 Notes

Dự án này có thể mở rộng thành:

* 🏨 KTV booking system
* 🍽️ Restaurant + karaoke ecosystem
* 🚕 Service booking platform
* 💳 Payment system (Stripe / VNPay)

---



# Swag Night Runner

มินิเกมเด็ก Swag วิ่งเก็บเหรียญ หลบตำรวจ ฉากเมืองกลางคืน  
รองรับมือถือ + หน้า Landing + ชื่อผู้เล่น + Leaderboard ในเครื่อง

## เล่นบนเครื่องตัวเอง

```bash
npm install
npm run dev
```

แล้วเปิดลิงก์ที่ Terminal แสดง เช่น `http://localhost:5173`

## Deploy ขึ้น Vercel เพื่อเอาลิงก์ให้คนเล่น

### วิธีง่ายสุด
1. แตกไฟล์ ZIP นี้
2. อัปโหลดโฟลเดอร์ `swag-night-runner` เข้า GitHub
3. เข้า Vercel
4. Add New Project
5. เลือก repo นี้
6. กด Deploy

หลัง deploy จะได้ลิงก์ประมาณ:

```text
https://swag-night-runner.vercel.app
```

## Deploy ด้วย Terminal

```bash
npm install
npm run build
npm i -g vercel
vercel
```

ตอบตามขั้นตอน แล้ว Vercel จะให้ลิงก์ public

## QR Code

หลังจากได้ลิงก์จริงแล้ว ให้นำลิงก์ไปสร้าง QR ได้ที่:
- https://www.qr-code-generator.com/
- https://www.canva.com/qr-code-generator/

หรือใช้คำสั่ง:

```bash
npm i -g qrcode
qrcode "https://YOUR-LINK.vercel.app" -o swag-runner-qr.png
```

## หมายเหตุเรื่อง Leaderboard

Leaderboard ตอนนี้เก็บใน `localStorage` ของเครื่องผู้เล่น  
ถ้าต้องการ Leaderboard รวมออนไลน์ของทุกคน ต้องต่อ Firebase หรือ Supabase เพิ่ม

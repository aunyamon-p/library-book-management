# Library Management System API

REST API สำหรับระบบจัดการห้องสมุด รองรับการเชื่อมต่อกับ SQL Server Database

## 🔧 การติดตั้งและการใช้งาน

### 1. ตั้งค่า Environment Variables

เพิ่ม environment variables ใน Supabase Edge Functions:

```
DB_USERNAME=libraryAdmin
DB_PASSWORD=BookManage1234
DB_HOST=localhost
DB_PORT=1433
DB_NAME=library_book
```

### 2. เชื่อมต่อกับ SQL Server

แก้ไขฟังก์ชัน `executeQuery` ในไฟล์ `index.ts` เพื่อเชื่อมต่อกับ SQL Server ของคุณ:

```typescript
async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  try {
    // Import mssql package
    const sql = await import('npm:mssql@11.0.1');
    
    // Create connection pool
    const pool = await sql.connect(dbConfig);
    
    // Create request
    const request = pool.request();
    
    // Add parameters
    params.forEach((param, index) => {
      request.input(`p${index + 1}`, param);
    });
    
    // Execute query
    const result = await request.query(query);
    
    return result.recordset || [];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
```

## 📋 API Endpoints

### Categories (หมวดหมู่หนังสือ)

- **GET** `/library-api/categories` - ดึงข้อมูลหมวดหมู่ทั้งหมด
- **GET** `/library-api/categories/:id` - ดึงข้อมูลหมวดหมู่ตาม ID
- **POST** `/library-api/categories` - สร้างหมวดหมู่ใหม่
  ```json
  {
    "category_name": "Science Fiction"
  }
  ```
- **PUT** `/library-api/categories/:id` - อัพเดทหมวดหมู่
- **DELETE** `/library-api/categories/:id` - ลบหมวดหมู่

### Books (หนังสือ)

- **GET** `/library-api/books` - ดึงข้อมูลหนังสือทั้งหมด
- **GET** `/library-api/books/:id` - ดึงข้อมูลหนังสือตาม ID
- **POST** `/library-api/books` - เพิ่มหนังสือใหม่
  ```json
  {
    "isbn": "9780001",
    "book_name": "Database System Concepts",
    "author": "Abraham Silberschatz",
    "publisher": "Wiley",
    "publish_year": 2020,
    "shelf": "A1",
    "amount": 5,
    "status": "available",
    "category_id": 1
  }
  ```
- **PUT** `/library-api/books/:id` - อัพเดทข้อมูลหนังสือ
- **DELETE** `/library-api/books/:id` - ลบหนังสือ

**Status Values:**
- `available` - หนังสือพร้อมให้ยืม
- `borrowed` - หนังสือถูกยืมอยู่
- `lost` - หนังสือสูญหาย

### Members (สมาชิก)

- **GET** `/library-api/members` - ดึงข้อมูลสมาชิกทั้งหมด
- **GET** `/library-api/members/:id` - ดึงข้อมูลสมาชิกตาม ID
- **POST** `/library-api/members` - เพิ่มสมาชิกใหม่
  ```json
  {
    "name": "Somchai Arun",
    "first_name": "Somchai",
    "last_name": "Arun",
    "email": "somchai@example.com",
    "phone": "0811111111",
    "borrowlimit": 5,
    "date_registered": "2025-01-01",
    "status": "active"
  }
  ```
- **PUT** `/library-api/members/:id` - อัพเดทข้อมูลสมาชิก
- **DELETE** `/library-api/members/:id` - ลบสมาชิก

**Status Values:**
- `active` - สมาชิกใช้งานได้
- `inactive` - สมาชิกถูกระงับ

### Admins (ผู้ดูแลระบบ)

- **GET** `/library-api/admins` - ดึงข้อมูล admin ทั้งหมด
- **GET** `/library-api/admins/:id` - ดึงข้อมูล admin ตาม ID
- **POST** `/library-api/admins` - เพิ่ม admin ใหม่
  ```json
  {
    "username": "admin01",
    "password": "1234",
    "first_name": "Krit",
    "last_name": "Sang",
    "name": "Krit Sang"
  }
  ```
- **PUT** `/library-api/admins/:id` - อัพเดทข้อมูล admin
- **DELETE** `/library-api/admins/:id` - ลบ admin

### Borrow Records (บันทึกการยืม)

- **GET** `/library-api/borrow-records` - ดึงข้อมูลบันทึกการยืมทั้งหมด
- **GET** `/library-api/borrow-records/:id` - ดึงข้อมูลบันทึกการยืมตาม ID
- **POST** `/library-api/borrow-records` - สร้างบันทึกการยืมใหม่
  ```json
  {
    "user_id": 1,
    "borrow_date": "2025-01-10",
    "amount": 2,
    "recorded_by": 1
  }
  ```
- **PUT** `/library-api/borrow-records/:id` - อัพเดทบันทึกการยืม
- **DELETE** `/library-api/borrow-records/:id` - ลบบันทึกการยืม

### Detail Borrows (รายละเอียดการยืม)

- **GET** `/library-api/detail-borrows` - ดึงข้อมูลรายละเอียดการยืมทั้งหมด
- **GET** `/library-api/detail-borrows/:id` - ดึงข้อมูลรายละเอียดการยืมตาม ID
- **POST** `/library-api/detail-borrows` - เพิ่มรายละเอียดการยืม
  ```json
  {
    "borrow_id": 1,
    "book_id": 1,
    "due_date": "2025-01-17",
    "renew_count": 0,
    "status": "borrowed"
  }
  ```
- **PUT** `/library-api/detail-borrows/:id` - อัพเดทรายละเอียดการยืม
- **DELETE** `/library-api/detail-borrows/:id` - ลบรายละเอียดการยืม

**Status Values:**
- `borrowed` - หนังสือกำลังถูกยืม
- `returned` - หนังสือคืนแล้ว

### Returns (บันทึกการคืน)

- **GET** `/library-api/returns` - ดึงข้อมูลบันทึกการคืนทั้งหมด
- **GET** `/library-api/returns/:id` - ดึงข้อมูลบันทึกการคืนตาม ID
- **POST** `/library-api/returns` - สร้างบันทึกการคืนใหม่
  ```json
  {
    "return_date": "2025-01-20",
    "totalfine": 20.00,
    "processed_by": 1
  }
  ```
- **PUT** `/library-api/returns/:id` - อัพเดทบันทึกการคืน
- **DELETE** `/library-api/returns/:id` - ลบบันทึกการคืน

### Detail Returns (รายละเอียดการคืน)

- **GET** `/library-api/detail-returns` - ดึงข้อมูลรายละเอียดการคืนทั้งหมด
- **GET** `/library-api/detail-returns/:id` - ดึงข้อมูลรายละเอียดการคืนตาม ID
- **POST** `/library-api/detail-returns` - เพิ่มรายละเอียดการคืน
  ```json
  {
    "return_id": 1,
    "book_id": 1,
    "fine": 20.00,
    "status": "Overdue"
  }
  ```
- **PUT** `/library-api/detail-returns/:id` - อัพเดทรายละเอียดการคืน
- **DELETE** `/library-api/detail-returns/:id` - ลบรายละเอียดการคืน

**Status Values:**
- `Overdue` - คืนช้า
- `Fine` - มีค่าปรับ
- `OK` - คืนตรงเวลา

## 🔐 Authentication

API นี้รองรับ CORS และสามารถเรียกใช้งานได้จาก frontend application โดยตรง

## 📝 Response Format

### Success Response
```json
{
  "id": 1,
  "field1": "value1",
  "field2": "value2"
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

## 🚀 การ Deploy

Edge Function จะถูก deploy อัตโนมัติเมื่อมีการเปลี่ยนแปลงโค้ด

## ⚠️ สิ่งที่ต้องทำเพิ่มเติม

1. ✅ แก้ไขฟังก์ชัน `executeQuery` เพื่อเชื่อมต่อกับ SQL Server จริง
2. ⚠️ เพิ่ม Error Handling ที่ละเอียดขึ้น
3. ⚠️ เพิ่ม Validation สำหรับ Input Data
4. ⚠️ เพิ่ม Authentication/Authorization หากจำเป็น
5. ⚠️ เพิ่ม Rate Limiting
6. ⚠️ เพิ่ม Logging และ Monitoring
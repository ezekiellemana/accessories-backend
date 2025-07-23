
# 🧢 Accessories Ordering System – Backend API

This is a backend-only REST API for an Accessories Ordering System, built using **Node.js**, **Express**, and **MongoDB**. It supports full user authentication, product management, and order handling for both **customers** and **admins**.

---

## 🚀 Features

### 👥 Authentication & Roles
- Register/Login with JWT
- User roles: `customer` and `admin`

### 🛒 Customer Features
- Browse all accessories
- Place orders with delivery info & payment method
- View own order history

### 🛠️ Admin Features
- Add/Edit/Delete accessories
- View all customer orders
- Update order status (`Pending → Approved → Shipped → Delivered`)

---

## 📦 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for env configs
- **CORS** enabled

---

## 📁 Folder Structure

```
accessories-backend/
├── config/             # MongoDB connection
├── controllers/        # Route logic (auth, products, orders)
├── middleware/         # Auth & role check
├── models/             # Mongoose schemas (User, Product, Order)
├── routes/             # API route handlers
├── .env                # Environment variables
├── .gitignore
├── server.js           # Main server file
└── README.md
```

---

## 🔑 API Endpoints

### Auth Routes
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login & get token  |

### Product Routes
| Method | Endpoint             | Description           | Role     |
|--------|----------------------|------------------------|----------|
| GET    | `/api/products`       | Get all products       | Public   |
| POST   | `/api/products`       | Add new product        | Admin    |
| PUT    | `/api/products/:id`   | Update product         | Admin    |
| DELETE | `/api/products/:id`   | Delete product         | Admin    |

### Order Routes
| Method | Endpoint                  | Description            | Role     |
|--------|---------------------------|-------------------------|----------|
| POST   | `/api/orders`             | Place order            | Customer |
| GET    | `/api/orders/my-orders`   | Get my orders          | Customer |
| GET    | `/api/orders`             | Get all orders         | Admin    |
| PUT    | `/api/orders/:id/status`  | Update order status    | Admin    |

> 🔐 Protected routes require `Authorization: Bearer <token>`

---

## 🧪 How to Run Locally

1. Clone this repo:
   ```bash
   git clone https://github.com/ezekiellemana/accessories-backend.git
   cd accessories-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/accessoriesDB
   JWT_SECRET=supersecret123
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Test using Postman or Thunder Client.

---

## 💡 Future Upgrades (Optional)

- Add image upload with Cloudinary
- Integrate WhatsApp for order confirmation
- Build frontend using React
- Deploy with Render or Railway

---

## ✨ Author

Made with ❤️ by [@ezekiellemana](https://github.com/ezekiellemana)  
Built for learning, growth, and flex 😎

# 📸 InstaClone — A Fullstack Social Media App

InstaClone is a fullstack web application inspired by Instagram, allowing users to register, log in, create and share posts (images/videos), like content, and manage their profile and media files.

## 🚀 Features

- ✅ User registration and login with JWT authentication
- ✅ Secure password hashing with Bcrypt
- ✅ Profile page with user information
- ✅ Post creation (text, image, and video support)
- ✅ Like and share functionality
- ✅ Edit and delete your own posts
- ✅ Responsive modern UI with Tailwind CSS
- ✅ MongoDB for data persistence

---

## 🧱 Tech Stack

| Tech       | Usage                      |
|------------|----------------------------|
| **Node.js** & **Express** | Backend server & routing |
| **MongoDB** & **Mongoose** | Database & schema modeling |
| **EJS**     | Templating engine for rendering views |
| **Tailwind CSS** | Responsive and modern UI |
| **JWT (jsonwebtoken)** | Secure user authentication |
| **Bcrypt**  | Password hashing |
| **Multer** (optional) | File uploads (image/video support) |

---

---

## 🔐 User Auth Flow

1. **Register** `/register`
2. **Login** `/login`
3. JWT token is stored in cookies
4. Middleware (`isLoggedIn`) protects private routes like `/profile` and `/create`

---




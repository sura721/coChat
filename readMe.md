 
# 💬 Real-Time Chat App

A fully functional, real-time chat application built with the **MERN Stack (MongoDB, Express, React, Node.js)** and **Socket.IO** for instant messaging. Includes **secure email OTP & OAuth login**, **image sharing**, and a clean, responsive UI styled with **TailwindCSS**.

---

## 🌟 Features

- 🔐 **Advanced Authentication**
  - Signup with email & password
  - Email **OTP verification**
  - OAuth login (e.g., Google)
  - Session-based login with `/auth/me` check
- 👥 **Private Chat**
  - One-on-one messaging
  - Real-time updates with Socket.IO
 
- 🖼️ **Image Support**
  - Send and receive images
  - Uploaded in real-time with previews
- ✨ **User Experience**
  - Resend OTP functionality
  - Toast notifications
  - Responsive & mobile-friendly UI
- 🔧 **Robust Backend**
  - RESTful API using Express
  - MongoDB for storage
  - Nodemailer for OTP delivery

---



## 🚀 Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- React Router DOM
- Lucide Icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- Nodemailer
- OAuth (e.g., Google Sign-In)

---

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/'Sura&21'/chat-app.git
cd chat-app

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd server
npm install



#CREATE .env FILE WITH THE FOLLOWING DATA in the client folder


PORT=5001
NODE_ENV=development

# MongoDB
MONGO_URL=your_mongo_db_url

# JWT or Access Token
ACCESS_TOKEN=your_access_token_here

# Cloudinary (for image upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (for OTP email sending)
GOOGLE_USER_EMAIL=your_gmail_address
GOOGLE_USER_PASS=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

#folder structure
chat-app/
├── client/         # React frontend
├── server/         # Node.js backend







📌 Upcoming Features
     -> Drag & drop image uploads
     -> Group chat (planned)

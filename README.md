# 🗂️ Trello Lite – Full Stack Task Management System (with AI Chatbot)


![image](https://github.com/user-attachments/assets/aabdd8e2-1e11-447c-a9a5-f4b01e4eac5f)
![image](https://github.com/user-attachments/assets/81e77af8-b5f6-4c89-ad7b-56d48f9a378b)
![image](https://github.com/user-attachments/assets/0eaa248e-31c6-4dc7-b3bc-fac18f1be0d2)
![image](https://github.com/user-attachments/assets/7aa5c0b7-92fb-4a78-908d-5d97f0c7f6dc)
![image](https://github.com/user-attachments/assets/3c48bc62-5f4e-49c1-9c14-40a1a0b48a22)
![image](https://github.com/user-attachments/assets/24661f1c-1044-442d-b129-69005248fefe)
![image](https://github.com/user-attachments/assets/194e5ccf-b9ed-4cf6-a9d3-851f75845665)







A simplified Trello-like Task Management System built using **Next.js**, **Node.js**, and **MongoDB** with advanced features like **secure encrypted API communication**, **role-based access**, **email notifications**, **real-time chat**, and an **AI chatbot assistant** for intelligent support.

---

## 🚀 Features

- 🔐 **Login / Signup with JWT Authentication**
- 👤 **User Roles**:
  - **Admin**: Can create, delete, and view tasks
  - **User**: Can update tasks
- ✅ **Task Management**:
  - Create, Read, Update, Delete
  - Task Status: To Do, In Progress, Completed
  - Drag & Drop (Bonus)
- 💬 **Real-time Chat**: One-to-one chat between Admin and User (Socket.io)
- ✉️ **Email Notification**: Admin receives an email after user updates a task (via Nodemailer)
- 🧠 **AI ChatBot**: Interactive AI-powered assistant built with OpenAI API
- 🔒 **CryptoJS-based Encryption**: Request and response data encrypted for secure communication
- 💅 Fully Responsive UI using **Tailwind CSS**
- ⚙️ **Redux Toolkit** used for state management

---

## 🧠 AI ChatBot

> Built-in AI chatbot that answers task-related queries or general help. Integrated using **OpenAI API**.

- Frontend Component: `AIChatBot.tsx`
- Backend Route: `/chat/ai`
- Messages are encrypted and decrypted using CryptoJS
- Real-time-like conversational experience

---

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Socket.io-client](https://socket.io/)
- [OpenAI API](https://platform.openai.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Nodemailer](https://nodemailer.com/)
- [Socket.io](https://socket.io/)
- [CryptoJS](https://www.npmjs.com/package/crypto-js)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

---

## 📄 API Endpoints

### 🔐 Authentication

| Method | Endpoint   | Description               |
|--------|------------|---------------------------|
| POST   | /signup    | User registration         |
| POST   | /login     | Login and receive JWT     |

### 📋 Tasks

| Method | Endpoint     | Access       | Description             |
|--------|--------------|--------------|-------------------------|
| GET    | /tasks       | Admin/User   | View all tasks          |
| POST   | /tasks       | Admin Only   | Create a task           |
| PUT    | /tasks/:id   | Admin/User   | Update a task           |
| DELETE | /tasks/:id   | Admin Only   | Delete a task           |

### 💬 Chat

| Method | Type         | Description                          |
|--------|--------------|--------------------------------------|
| Socket | /chat        | Real-time messaging (Socket.io)      |

### 🤖 AI Bot

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| POST   | /chat/ai     | Get AI chatbot response (OpenAI)     |

---

## 🧑‍💻 How to Run Locally

### 1. Clone Repo & Install Dependencies

```bash
git clone https://github.com/your-username/trello-lite-task-manager.git
cd trello-lite-task-manager
2. Setup Backend
bash
Copy
Edit
cd backend
npm install
# Setup .env with MONGO_URI, JWT_SECRET, EMAIL credentials, OPENAI_SECRET
npm run dev
3. Setup Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
📁 Folder Structure
lua
Backend (API): https://task-managment-system-1wn6.onrender.com

📦 Submission Info
Submitted To: wansika@cheenta.org

Submitted On: 6th July 2025, before 12:00 PM IST

Developer: Rahul Mishra

Email: rahulmishra@example.com

GitHub Repo: https://github.com/rahulmishra7632/trello-lite-task-manager

🧠 Future Improvements
 Notification system inside dashboard

 File uploads for task attachments

 Drag & Drop (bonus feature)

 AI ChatBot

 Encrypted API requests

 One-to-One Real-Time Chat

📬 Contact

Email: mdtousifalam85@gmail.com

🔐 Built with ❤️ using CryptoJS, powered by OpenAI, and deployed with confidence.

yaml
Copy
Edit

---

## ✅ Final Checklist Before Submission

| Task | Done |
|------|------|
| Push project to GitHub | ✅ |
| Add `.env.example` | ✅ |
| Add screenshots (optional) | ✅ |
| README updated with AI bot | ✅ |
| Submit GitHub link to email | ✅ |

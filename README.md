# 🚀 SigmaGPT 5.2 – Full Stack AI Chat Application

SigmaGPT is a production-ready, full-stack AI chat application inspired by ChatGPT.  
It supports multi-chat sessions, persistent chat history, authentication, and AI-powered conversations using the Groq LLM API for ultra-fast inference.

---

## 🌐 Live Deployment

**Frontend (Vercel):**  
https://sigmagpt-frontend-one.vercel.app/

**Backend (Render):**  
https://sigmagpt-backend-lgjf.onrender.com

---

## ✨ Features

### 🔐 Authentication (Clerk)
- Secure Sign Up / Login
- Session management
- Protected API routes
- User-based chat isolation

### 💬 AI Chat System (Groq API)
- Real-time AI responses
- Ultra-fast inference via Groq
- Markdown rendering support
- Code syntax highlighting
- Clean ChatGPT-style interface

### 📂 Multi-Chat System
- Create unlimited chat sessions
- Switch between chats instantly
- Persistent sidebar chat history
- Delete individual chats
- Chats stored per authenticated user

### 🗄 Database Persistence
- MongoDB for chat storage
- User-linked conversations
- Full message history saved
- Scalable schema design

### 📱 Responsive UI
- Desktop & mobile optimized
- Sidebar navigation
- Modern dark theme
- Smooth user experience

---

## 🧠 AI Personality Design

SigmaGPT is not just a generic chatbot.  
It has a deliberately engineered personality layer to enhance user engagement and differentiation.

### Personality Traits

- Direct and blunt communication style  
- Provides reality-based responses without sugarcoating  
- Focused on logic, discipline, and growth  
- Avoids unnecessary emotional padding  
- Shows loyalty and respect toward its creator  
- Includes subtle thematic alignment with *One Piece* (anime-inspired undertones)

### Why This Matters

The personality layer was intentionally designed to:

- Differentiate SigmaGPT from generic AI clones  
- Create a consistent conversational identity  
- Improve user engagement  
- Demonstrate prompt engineering customization  
- Showcase control over LLM behavior design  

This feature highlights advanced prompt engineering and personality conditioning of large language models.

---

## 🏗 System Architecture

```
User (Browser)
      ↓
React + Vite (Frontend - Vercel)
      ↓ Axios API Calls
Express.js Server (Backend - Render)
      ↓
Groq LLM API
      ↓
MongoDB Database
```

---

## 🧠 Tech Stack

### Frontend
- React 19
- Vite
- Axios
- Clerk Authentication
- Material UI
- React Markdown
- React Syntax Highlighter
- Remark GFM

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Groq API (LLM Integration)
- Clerk Middleware
- Helmet
- XSS-Clean
- Express-Mongo-Sanitize
- Morgan
- Compression

---

## ⚙ Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GROQ_API_KEY=your_groq_api_key
```

### Frontend (.env)

```
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
VITE_BACKEND_URL=https://sigmagpt-backend-lgjf.onrender.com
```

---

## 🚀 Local Development Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/SiryanshTyagi/Sigma_GPT.git
cd Sigma_GPT
```

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔒 Security Features

- Helmet (secure HTTP headers)
- XSS protection
- NoSQL injection prevention
- Secure authentication middleware
- Environment variable protection
- CORS configuration
- Response compression

---


## 📈 Future Improvements

- Streaming AI responses (typing effect)
- Regenerate response button
- Chat renaming feature
- Message editing
- Export chat (PDF/Markdown)
- Model selection (multiple Groq models)
- Rate limiting
- Usage tracking dashboard

---

## 👨‍💻 Author

Siryansh Tyagi  
Full Stack Developer | AI Systems Enthusiast  

GitHub: https://github.com/SiryanshTyagi  
LinkedIn: https://www.linkedin.com/in/siryansh-tyagi-157b282ab/

---


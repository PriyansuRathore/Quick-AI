# 🚀 QuickAI - AI-Powered SaaS Platform

A comprehensive AI-powered SaaS application that provides multiple AI tools for content creation, image processing, and document analysis.

## ✨ Features

### 🎯 **AI Content Creation**
- **Article Generator** - Create high-quality articles with AI
- **Blog Title Generator** - Generate catchy blog titles
- **Resume Review** - AI-powered resume analysis and feedback

### 🎨 **AI Image Tools**
- **Image Generator** - Create stunning images from text prompts
- **Background Remover** - Remove backgrounds from images instantly
- **Object Remover** - Remove unwanted objects from photos

### 👥 **Community Features**
- **Public Gallery** - Share your AI creations
- **Like System** - Engage with community content
- **User Dashboard** - Track your creations and usage

### 🔐 **Authentication & Plans**
- **Clerk Authentication** - Secure user management
- **Free & Premium Tiers** - Usage-based pricing
- **Usage Tracking** - Monitor API consumption

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Clerk** - Authentication
- **Axios** - HTTP client

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database (Neon)
- **Clerk** - Authentication middleware
- **Multer** - File upload handling

### **AI Services**
- **Google Gemini** - Text generation
- **ClipDrop API** - Image generation
- **Cloudinary** - Image processing & storage

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- PostgreSQL database
- API keys for Gemini, ClipDrop, Cloudinary, Clerk

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/PriyansuRathore/Quick-AI.git
cd Quick-AI
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**

**Server (.env)**
```env
DATABASE_URL=your_postgresql_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Client (.env)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
```

4. **Database Setup**
```bash
cd server
node create-table.js
```

5. **Run the application**
```bash
# Start server (Terminal 1)
cd server
npm run server

# Start client (Terminal 2)
cd client
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
QuickAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Static assets
│   │   └── App.jsx         # Main app component
│   ├── public/             # Public assets
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── configs/            # Configuration files
│   ├── middlewares/        # Custom middlewares
│   └── server.js           # Main server file
└── README.md
```

## 🔧 API Endpoints

### **AI Routes**
- `POST /api/ai/generate-article` - Generate articles
- `POST /api/ai/generate-blog-title` - Generate blog titles
- `POST /api/ai/generate-image` - Generate images
- `POST /api/ai/remove-image-background` - Remove backgrounds
- `POST /api/ai/remove-image-object` - Remove objects
- `POST /api/ai/resume-review` - Review resumes

### **User Routes**
- `GET /api/user/get-user-creations` - Get user's creations
- `GET /api/user/get-published-creations` - Get public creations
- `POST /api/user/toggle-like-creation` - Like/unlike creations

## 🚀 Deployment

### **Frontend (Vercel)**
1. Push code to GitHub
2. Connect Vercel to your repository
3. Set root directory to `client`
4. Add environment variables
5. Deploy

### **Backend (Vercel/Railway)**
1. Create separate deployment for server
2. Set root directory to `server`
3. Add all environment variables
4. Deploy

## 🔑 Environment Variables

### **Required API Keys**
- **Clerk** - Authentication ([clerk.com](https://clerk.com))
- **Google Gemini** - Text AI ([ai.google.dev](https://ai.google.dev))
- **ClipDrop** - Image AI ([clipdrop.co](https://clipdrop.co))
- **Cloudinary** - Image storage ([cloudinary.com](https://cloudinary.com))
- **Neon** - PostgreSQL database ([neon.tech](https://neon.tech))

## 📝 Usage

1. **Sign up/Login** using Clerk authentication
2. **Choose a tool** from the sidebar
3. **Generate content** using AI
4. **Share publicly** to community (optional)
5. **Track usage** in dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Priyansu Rathore**
- GitHub: [@PriyansuRathore](https://github.com/PriyansuRathore)

## 🙏 Acknowledgments

- Google Gemini for AI text generation
- ClipDrop for AI image generation
- Cloudinary for image processing
- Clerk for authentication
- Neon for database hosting

---

⭐ **Star this repository if you found it helpful!**
# 🚀 Smart Helpdesk - AI-Powered IT Ticketing System

> **A visually stunning, full-stack MERN application with premium UI/UX, smooth animations, and intelligent NLP-based ticket routing.**

![Tech Stack](https://img.shields.io/badge/Stack-MERN-success)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![UI](https://img.shields.io/badge/UI-Premium%20SaaS-blue)

---

## ✨ **Project Highlights**

### 🎨 **UI-FIRST Design Philosophy**
- **Premium SaaS aesthetics** inspired by Linear, Notion, and Intercom
- **Dark-first UI** with glassmorphism effects
- **Smooth micro-interactions** on every element
- **Framer Motion animations** throughout the entire application
- **Zero static screens** - everything moves and responds

### 🧠 **AI-Powered Intelligence**
- **Natural Language Processing** for automatic ticket classification
- **Real-time category prediction** while users type
- **Smart knowledge base search** with instant solutions
- **Intelligent ticket routing** to appropriate teams
- **Automated priority assignment** based on urgency keywords

### 🎯 **Core WOW Factor**
The **full-screen chatbot experience** that:
- Engages users with typewriter effects
- Shows live NLP classification predictions
- Suggests instant solutions from knowledge base
- Seamlessly creates tickets if issues persist
- Provides animated feedback at every step

---

## 📦 **Tech Stack**

### **Frontend**
- ⚛️ React 18 (with Vite)
- 🎨 Tailwind CSS (custom design tokens)
- 🎬 Framer Motion (animations)
- 🎭 Lucide React (icons)
- 📊 Recharts (analytics charts)
- 🔄 React Router v6
- 📡 Axios

### **Backend**
- 🟢 Node.js + Express.js
- 🗄️ MongoDB + Mongoose
- 🔐 JWT Authentication
- 🧠 Natural NLP Library
- 📧 NodeMailer (email alerts)
- 🛡️ bcryptjs (password hashing)

---

## 🎭 **User Roles & Features**

### 👤 **Employee**
- ✅ AI chatbot for ticket creation
- ✅ Live NLP feedback while typing
- ✅ Instant knowledge base suggestions
- ✅ Track all personal tickets
- ✅ Animated ticket status timeline
- ✅ Comment on tickets

### 🛠️ **IT Agent**
- ✅ Drag-and-drop Kanban board
- ✅ Assign tickets to agents
- ✅ Update ticket status with animations
- ✅ View detailed ticket drawer
- ✅ Add resolution notes
- ✅ Respond to comments

### 👨‍💼 **Admin**
- ✅ Comprehensive analytics dashboard
- ✅ Animated charts (Pie, Bar, Line)
- ✅ Ticket distribution by category/priority
- ✅ Average resolution time metrics
- ✅ Team workload visualization
- ✅ User management (coming soon)

---

## 🎨 **Design System**

### **Color Palette**
```js
Background:
- Primary: #0B0F1A (deep navy)
- Secondary: #111827 (slate)

Surfaces:
- Cards: #1F2933 (elevated surfaces)

Accents:
- Primary: #6366F1 (indigo)
- Secondary: #22D3EE (cyan)
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444

Text:
- Primary: #F9FAFB
- Secondary: #9CA3AF
- Muted: #6B7280
```

### **Typography**
- **Font**: Inter (headings & body)
- **Monospace**: JetBrains Mono (code/tags)

### **Animations**
- Page transitions: fade + slide
- Cards: float on hover, animate on mount
- Buttons: glow effect + press feedback
- Chatbot: typewriter + bubble animations
- Status changes: color morphing
- Skeleton loaders for all loading states

---

## 📂 **Project Structure**

```
CAPSTONE_8th_SEM/
├── server/                      # Backend
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── knowledgeController.js
│   │   └── userController.js
│   ├── models/                 # Database schemas
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── KnowledgeBase.js
│   ├── routes/                 # API endpoints
│   │   ├── auth.js
│   │   ├── tickets.js
│   │   ├── knowledge.js
│   │   └── users.js
│   ├── middleware/             # Auth & error handling
│   │   ├── auth.js
│   │   └── error.js
│   ├── services/              # Business logic
│   │   ├── nlpService.js      # NLP classification
│   │   └── emailService.js    # Email notifications
│   ├── utils/
│   │   └── seed.js            # Sample data
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── client/                     # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/            # Reusable components
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Drawer.jsx
    │   │   │   └── Skeleton.jsx
    │   │   ├── layout/
    │   │   │   └── DashboardLayout.jsx
    │   │   ├── chatbot/
    │   │   │   └── Chatbot.jsx
    │   │   ├── tickets/
    │   │   │   └── TicketDetail.jsx
    │   │   ├── agent/
    │   │   │   └── AgentKanban.jsx
    │   │   └── admin/
    │   │       └── AdminAnalytics.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MyTickets.jsx
    │   │   ├── AgentTickets.jsx
    │   │   └── Analytics.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### **Installation**

#### 1️⃣ **Clone the repository**
```bash
cd CAPSTONE_8th_SEM
```

#### 2️⃣ **Setup Backend**
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and email credentials
# MONGODB_URI=mongodb://localhost:27017/smart-helpdesk
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password

# Seed the database
npm run seed

# Start server
npm run dev
```

Server will run on **http://localhost:5000**

#### 3️⃣ **Setup Frontend**
```bash
cd ../client
npm install

# Start frontend
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## 👥 **Demo Credentials**

### Employee Account
```
Email: employee@test.com
Password: password123
```

### IT Agent Account
```
Email: agent@test.com
Password: password123
```

### Admin Account
```
Email: admin@test.com
Password: password123
```

---

## 📸 **Feature Showcase**

### 🎯 **1. Premium Login Page**
- Animated gradient background blobs
- Glass card design
- Smooth transitions
- Inline validation
- Demo credentials displayed

### 🤖 **2. AI Chatbot (CORE WOW)**
- Full-screen modal with blur backdrop
- Real-time NLP classification badge
- Animated message bubbles
- Typewriter effect for bot responses
- Knowledge base article cards with steps
- Smooth action button transitions

### 📊 **3. Employee Dashboard**
- Animated stat cards with counting effect
- Floating CTA card with pulse glow
- Recent tickets grid
- Quick access to chatbot

### 🎫 **4. My Tickets Page**
- Search & filter with smooth transitions
- Animated ticket cards on grid
- Hover lift effect
- Click opens slide-in drawer
- Real-time status badges

### 🗂️ **5. Agent Kanban Board**
- Three-column drag-and-drop board
- Smooth drag animations
- Drop zone highlights
- Assign tickets with dropdown
- Instant status updates

### 📈 **6. Admin Analytics**
- Animated KPI cards
- Pie chart for categories
- Bar chart for priorities
- Progress bars with animation
- Average resolution time

### 🎨 **7. Consistent Animations**
- Page enter/exit transitions
- Button hover glow effects
- Card float on hover
- Skeleton loaders everywhere
- Drawer slide from right
- Modal scale + fade

---

## 🧠 **NLP Classification**

The system uses the `natural` library to:

1. **Tokenize** user input
2. **Match keywords** against predefined categories
3. **Calculate confidence scores**
4. **Auto-assign priority** based on urgency keywords
5. **Route to appropriate team**

**Categories:**
- Password Reset
- VPN Issue
- Software Access
- Hardware Issue
- Network Issue
- Email Issue

**Priority Detection:**
- Urgent: "urgent", "critical", "emergency", "asap"
- High: "important", "soon", "blocking"
- Medium: "need", "help", "issue"
- Low: "question", "how to"

---

## 📧 **Email Notifications**

Automated emails sent for:
- ✅ Ticket creation (to employee)
- ✅ Ticket assignment (to agent)
- ✅ Ticket resolution (to employee)

---

## 🎬 **Animation Details**

### Page Transitions
```js
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4 }
```

### Hover Effects
```js
whileHover: { scale: 1.03, boxShadow: '...' }
```

### Button Press
```js
whileTap: { scale: 0.97 }
```

### Stagger Children
```js
staggerChildren: 0.1
```

---

## 🔒 **Security Features**

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ Input validation
- ✅ XSS protection
- ✅ CORS enabled

---

## 🎯 **API Endpoints**

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
PUT    /api/auth/updatedetails - Update profile
PUT    /api/auth/updatepassword - Change password
```

### Tickets
```
POST   /api/tickets            - Create ticket
GET    /api/tickets/my         - Get my tickets
GET    /api/tickets            - Get all tickets (agent/admin)
GET    /api/tickets/:id        - Get ticket details
PUT    /api/tickets/:id/status - Update status
PUT    /api/tickets/:id/assign - Assign ticket
POST   /api/tickets/:id/comments - Add comment
GET    /api/tickets/stats      - Get statistics
```

### Knowledge Base
```
GET    /api/knowledge/search   - Search articles
GET    /api/knowledge          - Get all articles
GET    /api/knowledge/:id      - Get article
POST   /api/knowledge/:id/feedback - Mark helpful
```

### Users
```
GET    /api/users              - Get all users (admin)
GET    /api/users/agents       - Get agents (agent/admin)
```

---

## 🚀 **Deployment**

### Backend (Heroku/Railway)
```bash
# Set environment variables
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>
CLIENT_URL=<frontend-url>
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

---

## 🎨 **UI Highlights**

### ✅ Glassmorphism
```css
backdrop-blur-xl
bg-surface/80
border border-gray-700/50
```

### ✅ Neon Glows
```css
box-shadow: 0 0 20px rgba(99, 102, 241, 0.3)
```

### ✅ Custom Scrollbars
```css
::-webkit-scrollbar {
  width: 8px;
}
```

### ✅ Gradient Text
```css
.text-gradient {
  background: linear-gradient(to right, #6366F1, #22D3EE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 📝 **Known Limitations**

- File attachments not implemented (can be added)
- Dark mode only (light mode toggle can be added)
- Email configuration requires Gmail app password
- Real-time notifications via WebSocket not implemented (polling used)

---

## 🔮 **Future Enhancements**

- [ ] Real-time updates with Socket.io
- [ ] File upload for ticket attachments
- [ ] Live chat between agent and employee
- [ ] SLA (Service Level Agreement) tracking
- [ ] Custom ticket forms per category
- [ ] Email reply parsing
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Integration with Slack/Teams
- [ ] Multi-language support

---

## 🤝 **Contributing**

This is a capstone project. For educational purposes, feel free to fork and modify.

---

## 📄 **License**

MIT License - free to use for educational purposes.

---

## 👨‍💻 **Author**

Built with 💙 as a capstone project demonstrating:
- Modern React patterns
- Advanced animations
- NLP integration
- Clean architecture
- Premium UI/UX design

---

## 🎉 **Acknowledgments**

- Inspired by Linear, Notion, and Intercom
- Icons by Lucide
- Charts by Recharts
- Animations by Framer Motion

---

## 📞 **Support**

For any questions or issues:
1. Check the console logs
2. Verify MongoDB connection
3. Ensure all npm packages are installed
4. Check environment variables

---

**⭐ Star this repository if you found it helpful!**

**🎓 Perfect for:**
- Capstone projects
- Portfolio showcase
- Learning MERN stack
- Understanding NLP integration
- Mastering Framer Motion

---

**🚀 Happy Coding!**

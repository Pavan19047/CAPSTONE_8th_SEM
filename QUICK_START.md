# 🚀 Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB installed and running (or MongoDB Atlas URI)
- A Gmail account for email notifications (optional)

---

## ⚡ Automatic Setup (Recommended)

### For Windows (PowerShell):
```powershell
.\setup.ps1
```

This script will:
- ✅ Check Node.js installation
- ✅ Check MongoDB status
- ✅ Install all dependencies (server + client)
- ✅ Create .env file
- ✅ Seed database with sample data

---

## 🔧 Manual Setup

### Step 1: Install Server Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env with your settings:
# - MONGODB_URI (if using Atlas)
# - EMAIL_USER and EMAIL_PASS (for notifications)
```

### Step 3: Seed Database
```bash
npm run seed
```

Expected output:
```
✅ MongoDB connected
🗑️  Cleared existing data
👥 Created users
📚 Created knowledge base articles
🎫 Created sample tickets

✨ Seed data created successfully!

📧 Login credentials:
Employee: employee@test.com / password123
Agent: agent@test.com / password123
Admin: admin@test.com / password123
```

### Step 4: Install Client Dependencies
```bash
cd ../client
npm install
```

---

## 🎯 Running the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

Server starts at: **http://localhost:5000**

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 http://localhost:5000
```

### Terminal 2 - Frontend App
```bash
cd client
npm run dev
```

Frontend starts at: **http://localhost:5173**

Expected output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🔐 Login Credentials

### Employee (Standard User)
```
Email: employee@test.com
Password: password123
```
**Can:** Create tickets, view own tickets, use chatbot

### IT Agent
```
Email: agent@test.com
Password: password123
```
**Can:** View all tickets, assign tickets, update status, use Kanban board

### Admin
```
Email: admin@test.com
Password: password123
```
**Can:** Everything + Analytics dashboard, user management

---

## 🎨 First Experience

1. **Login** with employee@test.com
2. **See animated dashboard** with stats cards
3. **Click "Launch AI Assistant"** (glowing button)
4. **Type an IT issue** like "I forgot my password"
5. **Watch NLP classify it** in real-time
6. **See knowledge base suggestions** appear
7. **Create a ticket** if not solved

---

## 📧 Email Setup (Optional)

To enable email notifications:

1. **Use Gmail** (easiest option)
2. **Enable 2-Factor Authentication** on your Google account
3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Copy the 16-character password
4. **Update .env:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-password
   ```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

Or use **MongoDB Atlas** (cloud):
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI in .env

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in server/.env
```
PORT=5001
```

### Frontend Can't Connect to Backend
**Solution:** Check proxy in client/vite.config.js:
```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

---

## 📱 Application Flow

### Employee Journey
```
Login → Dashboard → Click "Launch AI Assistant" 
→ Type issue → See suggestions → Create ticket 
→ Track in "My Tickets" → Get email updates
```

### Agent Journey
```
Login → Dashboard → Go to "All Tickets" 
→ See Kanban board → Drag tickets → Assign to self 
→ Add comments → Update status → Mark resolved
```

### Admin Journey
```
Login → Dashboard → Go to "Analytics" 
→ View charts → See metrics → Track performance
```

---

## 🎯 Key Features to Test

### 1. Chatbot Intelligence
- Type: "VPN not connecting" → Watch it classify as "VPN Issue"
- Type: "Forgot password" → See instant solutions
- Type: "Laptop broken" → Auto-detects as hardware issue

### 2. Animations
- Hover over any card → Float effect
- Click buttons → Press feedback
- Open ticket drawer → Slide animation
- Switch pages → Fade transition

### 3. Kanban Board (Agent)
- Drag ticket from "Open" to "In Progress"
- Watch smooth animation
- Drop highlights column
- Status updates instantly

### 4. Analytics (Admin)
- See animated stat counters
- Watch charts render with transitions
- Progress bars fill smoothly

---

## 📊 Sample Data Included

After seeding, you'll have:
- ✅ 4 users (employee, 2 agents, admin)
- ✅ 5 sample tickets (various statuses)
- ✅ 5 knowledge base articles
- ✅ Pre-configured categories and priorities

---

## 🎨 UI Highlights to Notice

1. **Glassmorphism** - Cards with blur effect
2. **Neon Glows** - Button hover effects
3. **Smooth Transitions** - Every state change
4. **Skeleton Loaders** - While content loads
5. **Typewriter Effect** - Chatbot responses
6. **Animated Badges** - Status & priority
7. **Float on Hover** - All cards
8. **Gradient Text** - Headers
9. **Custom Scrollbar** - Themed scrolling
10. **Pulse Animation** - Important CTAs

---

## 🔥 Pro Tips

1. **Use Employee account** to experience the chatbot first
2. **Switch to Agent account** to see Kanban board
3. **Try Admin account** for analytics dashboard
4. **Create multiple tickets** to see board population
5. **Assign tickets** to see agent notifications
6. **Add comments** to test real-time updates

---

## 📚 Additional Resources

- **MongoDB Setup:** https://docs.mongodb.com/manual/installation/
- **Node.js Download:** https://nodejs.org/
- **Gmail App Password:** https://support.google.com/accounts/answer/185833
- **Vite Docs:** https://vitejs.dev/
- **Framer Motion:** https://www.framer.com/motion/

---

## ✅ Checklist Before Running

- [ ] Node.js installed (v18+)
- [ ] MongoDB running
- [ ] Server dependencies installed
- [ ] Client dependencies installed
- [ ] Database seeded
- [ ] .env file configured
- [ ] Both servers running
- [ ] Browser open at localhost:5173

---

## 🎉 Success!

If everything is working, you should see:
- ✅ Premium dark UI with animations
- ✅ Login page with gradient blobs
- ✅ Dashboard with stat cards
- ✅ Glowing "Launch AI Assistant" button
- ✅ Smooth page transitions

**Congratulations! You're ready to explore the Smart Helpdesk!** 🚀

---

**Need Help?**
- Check console logs in browser (F12)
- Check terminal output for errors
- Verify MongoDB is connected
- Ensure ports 5000 and 5173 are free

**Star the repo ⭐ if you found this helpful!**

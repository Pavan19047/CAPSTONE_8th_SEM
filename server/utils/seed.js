import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import KnowledgeBase from '../models/KnowledgeBase.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany();
    await Ticket.deleteMany();
    await KnowledgeBase.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'employee@test.com',
        password: 'password123',
        role: 'employee',
        department: 'Engineering'
      },
      {
        name: 'Jane Smith',
        email: 'agent@test.com',
        password: 'password123',
        role: 'agent',
        department: 'IT Support'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        department: 'IT'
      },
      {
        name: 'Sarah Johnson',
        email: 'agent2@test.com',
        password: 'password123',
        role: 'agent',
        department: 'Network Team'
      }
    ]);

    console.log('👥 Created users');

    // Create knowledge base articles
    const articles = await KnowledgeBase.create([
      {
        title: 'How to Reset Your Password',
        category: 'Password Reset',
        keywords: ['password', 'reset', 'forgot', 'login'],
        problem: 'I forgot my password and cannot log in',
        solution: 'You can reset your password through the self-service portal',
        steps: [
          'Go to the login page',
          'Click on "Forgot Password"',
          'Enter your email address',
          'Check your email for reset link',
          'Click the link and create a new password'
        ],
        views: 245,
        helpful: 189,
        notHelpful: 12
      },
      {
        title: 'VPN Connection Issues',
        category: 'VPN Issue',
        keywords: ['vpn', 'connection', 'remote', 'access'],
        problem: 'Cannot connect to VPN from home',
        solution: 'Try these troubleshooting steps to resolve VPN connection issues',
        steps: [
          'Verify your internet connection is stable',
          'Restart the VPN client application',
          'Check if your VPN credentials are correct',
          'Try connecting to a different VPN server',
          'If issue persists, contact IT support'
        ],
        views: 178,
        helpful: 142,
        notHelpful: 8
      },
      {
        title: 'Request Software Installation',
        category: 'Software Access',
        keywords: ['software', 'install', 'application', 'access'],
        problem: 'Need to install new software for work',
        solution: 'Submit a software installation request through the portal',
        steps: [
          'Create a ticket specifying the software name',
          'Provide business justification',
          'Manager approval may be required',
          'IT will install the software remotely',
          'You will receive confirmation once complete'
        ],
        views: 134,
        helpful: 98,
        notHelpful: 5
      },
      {
        title: 'Printer Not Working',
        category: 'Hardware Issue',
        keywords: ['printer', 'print', 'hardware', 'not working', 'printing'],
        problem: 'Printer is not responding or printing',
        solution: 'Follow these steps to troubleshoot printer issues',
        steps: [
          'Check if printer is powered on',
          'Verify printer is connected to network',
          'Check for paper jams',
          'Restart the printer',
          'Remove and re-add printer in Windows settings'
        ],
        views: 89,
        helpful: 67,
        notHelpful: 4
      },
      {
        title: 'Laptop Not Starting or Booting',
        category: 'Hardware Issue',
        keywords: ['laptop', 'not starting', 'wont start', 'boot', 'power', 'startup', 'not booting', 'wont boot'],
        problem: 'Laptop will not power on or start up properly',
        solution: 'Follow these troubleshooting steps to diagnose and fix laptop startup issues',
        steps: [
          'Check if the power adapter is properly connected',
          'Try a different power outlet',
          'Remove the battery and hold power button for 30 seconds, then reconnect',
          'Check for any indicator lights on the laptop',
          'Try connecting to an external monitor to rule out display issues',
          'If still not working, contact hardware support for repair'
        ],
        views: 156,
        helpful: 124,
        notHelpful: 8
      },
      {
        title: 'Slow Network Connection',
        category: 'Network Issue',
        keywords: ['network', 'slow', 'internet', 'connection'],
        problem: 'Internet is very slow or keeps disconnecting',
        solution: 'Try these steps to improve network performance',
        steps: [
          'Run a speed test to measure connection',
          'Restart your router/modem',
          'Connect via ethernet cable if possible',
          'Close bandwidth-heavy applications',
          'Contact network team if issue persists'
        ],
        views: 156,
        helpful: 112,
        notHelpful: 7
      }
    ]);

    console.log('📚 Created knowledge base articles');

    // Create sample tickets
    const tickets = await Ticket.create([
      {
        title: 'Cannot access VPN',
        description: 'I am trying to connect to VPN from home but getting connection timeout error. Need urgent help as I have a meeting in 30 minutes.',
        category: 'VPN Issue',
        priority: 'urgent',
        status: 'open',
        createdBy: users[0]._id,
        assignedTeam: 'Network Team'
      },
      {
        title: 'Password reset request',
        description: 'Forgot my password, please reset it',
        category: 'Password Reset',
        priority: 'high',
        status: 'in-progress',
        createdBy: users[0]._id,
        assignedTo: users[1]._id,
        assignedTeam: 'IT Support'
      },
      {
        title: 'Need Adobe Photoshop license',
        description: 'I need Adobe Photoshop installed for design work. Manager has approved.',
        category: 'Software Access',
        priority: 'medium',
        status: 'open',
        createdBy: users[0]._id,
        assignedTeam: 'IT Support'
      },
      {
        title: 'Laptop screen flickering',
        description: 'My laptop screen started flickering this morning. It is getting worse.',
        category: 'Hardware Issue',
        priority: 'high',
        status: 'in-progress',
        createdBy: users[0]._id,
        assignedTo: users[3]._id,
        assignedTeam: 'Hardware Team'
      },
      {
        title: 'Email not syncing on phone',
        description: 'My work email is not syncing on my mobile device. Last sync was 2 days ago.',
        category: 'Email Issue',
        priority: 'medium',
        status: 'resolved',
        createdBy: users[0]._id,
        assignedTo: users[1]._id,
        resolvedAt: new Date(),
        resolutionNotes: 'Reconfigured email account on mobile device. Issue resolved.',
        assignedTeam: 'IT Support'
      }
    ]);

    console.log('🎫 Created sample tickets');

    console.log('\n✨ Seed data created successfully!\n');
    console.log('📧 Login credentials:');
    console.log('Employee: employee@test.com / password123');
    console.log('Agent: agent@test.com / password123');
    console.log('Admin: admin@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

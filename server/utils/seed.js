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
        category: 'VPN Issues',
        keywords: ['vpn', 'connection', 'remote', 'access', 'timeout', 'tunnel'],
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
        category: 'Software Installation',
        keywords: ['software', 'install', 'application', 'access', 'license', 'adobe', 'microsoft'],
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
        category: 'Hardware Issues',
        keywords: ['printer', 'print', 'hardware', 'not working', 'printing', 'paper jam'],
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
        category: 'Hardware Issues',
        keywords: ['laptop', 'not starting', 'wont start', 'boot', 'power', 'startup', 'not booting', 'wont boot', 'screen', 'display'],
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
        category: 'Network Issues',
        keywords: ['network', 'slow', 'internet', 'connection', 'wifi', 'ethernet', 'speed'],
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
      },
      {
        title: 'Email Not Syncing on Mobile Device',
        category: 'Email Issues',
        keywords: ['email', 'sync', 'syncing', 'mobile', 'phone', 'outlook', 'mail'],
        problem: 'Work email is not syncing on mobile device or phone',
        solution: 'Follow these steps to fix email sync issues on your mobile device',
        steps: [
          'Check your internet connection on the device',
          'Open the Mail app settings and verify account configuration',
          'Remove the email account and re-add it',
          'Ensure background app refresh is enabled for Mail',
          'Check if your IT department has blocked mobile access'
        ],
        views: 198,
        helpful: 167,
        notHelpful: 11
      },
      {
        title: 'WiFi Connection Dropping Frequently',
        category: 'Network Issues',
        keywords: ['wifi', 'disconnecting', 'dropping', 'wireless', 'connection', 'unstable'],
        problem: 'WiFi keeps disconnecting or dropping connection frequently',
        solution: 'Follow these troubleshooting steps to fix WiFi connectivity issues',
        steps: [
          'Forget the WiFi network and reconnect',
          'Move closer to the WiFi access point',
          'Check if other devices are experiencing the same issue',
          'Restart your computer and router',
          'Update your network adapter drivers'
        ],
        views: 134,
        helpful: 98,
        notHelpful: 6
      },
      {
        title: 'Computer Making Strange Noises',
        category: 'Hardware Issues',
        keywords: ['noise', 'sound', 'buzzing', 'fan', 'loud', 'computer', 'laptop', 'strange'],
        problem: 'Computer or laptop making strange buzzing or loud noises',
        solution: 'Diagnose and address unusual computer noises',
        steps: [
          'Identify where the noise is coming from (fan, hard drive, speakers)',
          'Clean dust from fans and vents using compressed air',
          'Check if the noise occurs during heavy usage only',
          'Ensure the laptop is on a hard flat surface for proper ventilation',
          'If noise persists, contact hardware support for inspection'
        ],
        views: 87,
        helpful: 72,
        notHelpful: 5
      },
      {
        title: 'Forgot Password - Account Recovery',
        category: 'Password Reset',
        keywords: ['forgot', 'password', 'reset', 'account', 'recovery', 'locked', 'login'],
        problem: 'I forgot my password and cannot access my account',
        solution: 'Recover your account using the self-service password reset',
        steps: [
          'Go to the password reset portal',
          'Enter your username or email address',
          'Answer security questions or use backup email',
          'Create a new strong password',
          'Login with your new password'
        ],
        views: 312,
        helpful: 289,
        notHelpful: 8
      }
    ]);

    console.log('📚 Created knowledge base articles');

    // Create sample tickets sequentially to avoid race on ticket number generation
    const ticketData = [
      {
        title: 'Cannot access VPN',
        description: 'I am trying to connect to VPN from home but getting connection timeout error. Need urgent help as I have a meeting in 30 minutes.',
        category: 'VPN Issues',
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
        category: 'Software Installation',
        priority: 'medium',
        status: 'open',
        createdBy: users[0]._id,
        assignedTeam: 'IT Support'
      },
      {
        title: 'Laptop screen flickering',
        description: 'My laptop screen started flickering this morning. It is getting worse.',
        category: 'Hardware Issues',
        priority: 'high',
        status: 'in-progress',
        createdBy: users[0]._id,
        assignedTo: users[3]._id,
        assignedTeam: 'Hardware Team'
      },
      {
        title: 'Email not syncing on phone',
        description: 'My work email is not syncing on my mobile device. Last sync was 2 days ago.',
        category: 'Email Issues',
        priority: 'medium',
        status: 'resolved',
        createdBy: users[0]._id,
        assignedTo: users[1]._id,
        resolvedAt: new Date(),
        resolutionNotes: 'Reconfigured email account on mobile device. Issue resolved.',
        assignedTeam: 'IT Support'
      }
    ];

    for (const t of ticketData) {
      await Ticket.create(t);
    }

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

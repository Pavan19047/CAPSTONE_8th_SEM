import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import Chatbot from '../components/chatbot/Chatbot';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user.role === 'employee') {
        const ticketsResponse = await ticketService.getMyTickets();
        setRecentTickets(ticketsResponse.data.slice(0, 5));
        
        const openCount = ticketsResponse.data.filter(t => t.status === 'open').length;
        const inProgressCount = ticketsResponse.data.filter(t => t.status === 'in-progress').length;
        const resolvedCount = ticketsResponse.data.filter(t => t.status === 'resolved').length;
        
        setStats({
          totalTickets: ticketsResponse.data.length,
          openTickets: openCount,
          inProgressTickets: inProgressCount,
          resolvedTickets: resolvedCount
        });
      } else {
        const statsResponse = await ticketService.getStats();
        const ticketsResponse = await ticketService.getAllTickets();
        setStats(statsResponse.data);
        setRecentTickets(ticketsResponse.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats?.totalTickets || 0,
      icon: Ticket,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/20'
    },
    {
      title: 'Open',
      value: stats?.openTickets || 0,
      icon: AlertCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressTickets || 0,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Resolved',
      value: stats?.resolvedTickets || 0,
      icon: CheckCircle2,
      color: 'text-accent-success',
      bgColor: 'bg-accent-success/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="text-gradient">{user?.name}</span>
        </h1>
        <p className="text-text-secondary text-lg">
          {user?.role === 'employee' 
            ? "Let's get your IT issues resolved quickly"
            : "Here's your ticket overview"}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-muted text-sm mb-1">{stat.title}</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + 0.1 * index, type: 'spring' }}
                      className="text-4xl font-bold text-text-primary"
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* CTA for employees */}
      {user?.role === 'employee' && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border-accent-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Need Help? Start Here
                </h3>
                <p className="text-text-secondary mb-4">
                  Our AI assistant will help you solve issues instantly or create a ticket
                </p>
                <Button
                  size="lg"
                  icon={Sparkles}
                  onClick={() => setShowChatbot(true)}
                  className="animate-pulse-glow"
                >
                  Launch AI Assistant
                </Button>
              </div>
              <div className="hidden lg:block">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageSquare className="w-32 h-32 text-accent-primary/30" />
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Tickets */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary">Recent Tickets</h2>
          {user?.role === 'employee' && (
            <Button variant="ghost" size="sm">View All</Button>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : recentTickets.length > 0 ? (
            recentTickets.map((ticket, index) => (
              <motion.div
                key={ticket._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card hover>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="primary" size="sm">
                          {ticket.ticketNumber}
                        </Badge>
                        <Badge variant={ticket.status} size="sm">
                          {ticket.status}
                        </Badge>
                        <Badge variant={ticket.priority} size="sm">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {ticket.title}
                      </h3>
                      <p className="text-text-muted text-sm line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted text-lg">No tickets yet</p>
                {user?.role === 'employee' && (
                  <Button
                    className="mt-4"
                    onClick={() => setShowChatbot(true)}
                  >
                    Create Your First Ticket
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <Chatbot
          onClose={() => setShowChatbot(false)}
          onTicketCreated={() => {
            setShowChatbot(false);
            loadDashboardData();
          }}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;

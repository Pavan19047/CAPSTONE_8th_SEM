import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2,
  Activity
} from 'lucide-react';
import { ticketService } from '../../services/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { SkeletonCard } from '../ui/Skeleton';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Total Tickets',
      value: stats?.totalTickets || 0,
      icon: Activity,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/20'
    },
    {
      title: 'Open Tickets',
      value: stats?.openTickets || 0,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Resolved',
      value: stats?.resolvedTickets || 0,
      icon: CheckCircle2,
      color: 'text-accent-success',
      bgColor: 'bg-accent-success/20'
    },
    {
      title: 'Avg Resolution Time',
      value: `${stats?.avgResolutionTime || 0}h`,
      icon: Clock,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/20'
    }
  ];

  // Prepare chart data
  const categoryData = stats?.ticketsByCategory?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const priorityData = stats?.ticketsByPriority?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const COLORS = ['#6366F1', '#22D3EE', '#22C55E', '#F59E0B', '#EF4444'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">Analytics Dashboard</h1>
        <p className="text-text-secondary">Comprehensive ticket metrics and insights</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">{card.title}</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    className="text-3xl font-bold text-text-primary"
                  >
                    {card.value}
                  </motion.p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-xl font-bold text-text-primary mb-6">Tickets by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2933',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-xl font-bold text-text-primary mb-6">Tickets by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2933',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Status Overview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <h3 className="text-xl font-bold text-text-primary mb-6">Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">Open</span>
                <Badge variant="open">{stats?.openTickets || 0}</Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((stats?.openTickets || 0) / (stats?.totalTickets || 1)) * 100}%`
                  }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="bg-blue-500 h-2 rounded-full"
                />
              </div>
            </div>

            <div className="p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">In Progress</span>
                <Badge variant="in-progress">{stats?.inProgressTickets || 0}</Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((stats?.inProgressTickets || 0) / (stats?.totalTickets || 1)) * 100}%`
                  }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="bg-yellow-500 h-2 rounded-full"
                />
              </div>
            </div>

            <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">Resolved</span>
                <Badge variant="resolved">{stats?.resolvedTickets || 0}</Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((stats?.resolvedTickets || 0) / (stats?.totalTickets || 1)) * 100}%`
                  }}
                  transition={{ duration: 1, delay: 1 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminAnalytics;

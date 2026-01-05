import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { ticketService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonTicket } from '../components/ui/Skeleton';
import Drawer from '../components/ui/Drawer';
import TicketDetail from '../components/tickets/TicketDetail';
import Chatbot from '../components/chatbot/Chatbot';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getMyTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">My Tickets</h1>
          <p className="text-text-secondary">Track and manage your support requests</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => setShowChatbot(true)}
          className="animate-pulse-glow"
        >
          Create Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'in-progress', 'resolved'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SkeletonTicket />
            <SkeletonTicket />
            <SkeletonTicket />
            <SkeletonTicket />
          </>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTicket(ticket)}
            >
              <Card hover className="cursor-pointer">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Badge variant="primary" size="sm">
                        {ticket.ticketNumber}
                      </Badge>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {ticket.title}
                      </h3>
                    </div>
                    <Badge variant={ticket.status}>
                      {ticket.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-text-muted text-sm line-clamp-2">
                    {ticket.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={ticket.priority} size="sm">
                      {ticket.priority}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {ticket.category}
                    </Badge>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-sm text-text-muted">
                      Created {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.assignedTo && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center">
                          <span className="text-xs text-accent-primary">
                            {ticket.assignedTo.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-text-muted">
                          {ticket.assignedTo.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2">
            <Card>
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted text-lg">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No tickets match your filters'
                    : 'No tickets yet'}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setShowChatbot(true)}
                >
                  Create Your First Ticket
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Ticket Detail Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title="Ticket Details"
          width="700px"
        >
          <TicketDetail
            ticketId={selectedTicket._id}
            onUpdate={loadTickets}
          />
        </Drawer>
      )}

      {/* Chatbot */}
      {showChatbot && (
        <Chatbot
          onClose={() => setShowChatbot(false)}
          onTicketCreated={() => {
            setShowChatbot(false);
            loadTickets();
          }}
        />
      )}
    </motion.div>
  );
};

export default MyTickets;

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { ticketService, userService } from '../../services/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import TicketDetail from '../tickets/TicketDetail';
import { SkeletonTicket } from '../ui/Skeleton';

const AgentKanban = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [draggedTicket, setDraggedTicket] = useState(null);

  const columns = [
    { id: 'open', title: 'Open', color: 'border-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'border-yellow-500' },
    { id: 'resolved', title: 'Resolved', color: 'border-green-500' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, agentsResponse] = await Promise.all([
        ticketService.getAllTickets(),
        userService.getAgents()
      ]);
      setTickets(ticketsResponse.data);
      setAgents(agentsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTicket || draggedTicket.status === newStatus) {
      setDraggedTicket(null);
      return;
    }

    try {
      await ticketService.updateStatus(draggedTicket._id, { status: newStatus });
      await loadData();
    } catch (error) {
      console.error('Error updating ticket:', error);
    } finally {
      setDraggedTicket(null);
    }
  };

  const handleAssign = async (ticketId, agentId) => {
    try {
      await ticketService.assignTicket(ticketId, agentId);
      await loadData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const filteredTickets = searchTerm
    ? tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tickets;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Ticket Board</h1>
        <p className="text-text-secondary">Manage and track all support tickets</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 w-full"
          />
        </div>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTickets = filteredTickets.filter(t => t.status === column.id);
          
          return (
            <div key={column.id}>
              {/* Column Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 glass-card border-l-4 ${column.color}`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text-primary">{column.title}</h2>
                  <Badge variant={column.id}>{columnTickets.length}</Badge>
                </div>
              </motion.div>

              {/* Column Content */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="space-y-4 min-h-[500px] p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: draggedTicket?.status !== column.id ? 'transparent' : 'rgba(99, 102, 241, 0.05)'
                }}
              >
                {loading ? (
                  <>
                    <SkeletonTicket />
                    <SkeletonTicket />
                  </>
                ) : columnTickets.length > 0 ? (
                  columnTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket)}
                      className="cursor-move"
                    >
                      <Card
                        hover
                        className="cursor-pointer"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="primary" size="sm">
                              {ticket.ticketNumber}
                            </Badge>
                            <Badge variant={ticket.priority} size="sm">
                              {ticket.priority}
                            </Badge>
                          </div>

                          <h3 className="text-base font-semibold text-text-primary line-clamp-2">
                            {ticket.title}
                          </h3>

                          <p className="text-sm text-text-muted line-clamp-2">
                            {ticket.description}
                          </p>

                          <Badge variant="default" size="sm">
                            {ticket.category}
                          </Badge>

                          {/* Assigned Agent */}
                          {ticket.assignedTo ? (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                              <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center">
                                <span className="text-xs text-accent-primary">
                                  {ticket.assignedTo.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm text-text-muted">
                                {ticket.assignedTo.name}
                              </span>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-gray-700">
                              <select
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleAssign(ticket._id, e.target.value)}
                                className="input-field text-sm py-1"
                                defaultValue=""
                              >
                                <option value="" disabled>Assign to...</option>
                                {agents.map((agent) => (
                                  <option key={agent._id} value={agent._id}>
                                    {agent.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="text-xs text-text-muted">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Filter className="w-12 h-12 text-text-muted mx-auto mb-2" />
                    <p className="text-text-muted">No tickets</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
            onUpdate={() => {
              loadData();
              setSelectedTicket(null);
            }}
          />
        </Drawer>
      )}
    </motion.div>
  );
};

export default AgentKanban;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, XCircle, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { knowledgeService, ticketService } from '../../services/api';

const Chatbot = ({ onClose, onTicketCreated }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your AI helpdesk assistant. Describe your IT issue and I'll help you solve it or create a ticket.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [knowledgeResults, setKnowledgeResults] = useState([]);
  const [showResolution, setShowResolution] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, { ...message, id: Date.now(), timestamp: new Date() }]);
  };

  const handleSearch = async (query) => {
    if (query.length > 10) {
      try {
        const response = await knowledgeService.searchKnowledge(query);
        // Handle different response structures
        const data = response?.data?.data || response?.data || {};
        setClassification({
          category: data.suggestedCategory || 'Other',
          confidence: data.confidence || 0
        });
        const results = data.results || [];
        setKnowledgeResults(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.length > 10) {
        handleSearch(input);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ type: 'user', text: userMessage });
    setLoading(true);

    try {
      // Search knowledge base
      const response = await knowledgeService.searchKnowledge(userMessage);
      
      // Extract results - handle different response structures
      const results = response?.data?.data?.results || response?.data?.results || [];
      const category = response?.data?.data?.suggestedCategory || response?.data?.suggestedCategory;
      const confidence = response?.data?.data?.confidence || response?.data?.confidence;

      console.log('Full response:', response); // Debug
      console.log('Search results:', results); // Debug
      console.log('First article:', results[0]); // Debug
      
      if (results.length > 0) {
        // Show knowledge base articles
        setShowResolution(true);
        addMessage({
          type: 'bot',
          text: `I found ${results.length} article(s) that might help. Take a look:`,
          articles: results
        });

        setTimeout(() => {
          addMessage({
            type: 'bot',
            text: "Did any of these articles solve your issue?",
            showActions: true
          });
        }, 1000);
      } else {
        // No solutions found, create ticket
        addMessage({
          type: 'bot',
          text: "I couldn't find a solution in our knowledge base. Let me create a ticket for you."
        });

        setTimeout(() => {
          handleCreateTicket(userMessage);
        }, 1000);
      }
    } catch (error) {
      addMessage({
        type: 'bot',
        text: "Sorry, I encountered an error. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (description) => {
    setLoading(true);
    try {
      const response = await ticketService.createTicket({
        title: description.substring(0, 100),
        description: description
      });

      addMessage({
        type: 'bot',
        text: `Great! I've created ticket #${response.data.ticketNumber} for you. Our team will review it shortly.`,
        ticket: response.data
      });

      if (onTicketCreated) {
        onTicketCreated(response.data);
      }
    } catch (error) {
      addMessage({
        type: 'bot',
        text: "Sorry, I couldn't create the ticket. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolved = () => {
    addMessage({
      type: 'bot',
      text: "Awesome! I'm glad I could help. Feel free to ask if you need anything else!"
    });
    setShowResolution(false);
  };

  const handleNotResolved = () => {
    const lastUserMessage = messages.filter(m => m.type === 'user').slice(-1)[0];
    addMessage({
      type: 'bot',
      text: "No problem, let me create a ticket for you."
    });
    setTimeout(() => {
      handleCreateTicket(lastUserMessage.text);
    }, 1000);
    setShowResolution(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-4xl h-[80vh] glass-card flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">AI Support Assistant</h2>
              <p className="text-text-muted text-sm">Powered by NLP Classification</p>
            </div>
          </div>
          {classification && classification.confidence > 30 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-text-muted text-sm">Detected:</span>
              <Badge variant="primary">{classification.category}</Badge>
              <span className="text-text-muted text-sm">{classification.confidence}%</span>
            </motion.div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-accent-primary text-white'
                      : 'bg-primary-card text-text-primary'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>

                  {/* Knowledge base articles */}
                  {message.articles && message.articles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {message.articles.slice(0, 3).map((article, articleIdx) => (
                        <motion.div
                          key={article._id || `article-${articleIdx}`}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-primary-surface rounded-lg border border-gray-700 cursor-pointer"
                        >
                          <h4 className="font-semibold text-accent-secondary mb-1">
                            {article.title || 'Untitled Article'}
                          </h4>
                          <p className="text-sm text-text-muted line-clamp-2">
                            {article.problem || article.solution || 'No description available'}
                          </p>
                          {article.steps && article.steps.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {article.steps.slice(0, 3).map((step, idx) => (
                                <div key={`step-${articleIdx}-${idx}`} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-accent-success mt-0.5 flex-shrink-0" />
                                  <span className="text-text-secondary">{step}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  {message.showActions && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="success"
                        icon={ThumbsUp}
                        onClick={handleResolved}
                      >
                        Yes, solved!
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={ThumbsDown}
                        onClick={handleNotResolved}
                      >
                        No, create ticket
                      </Button>
                    </div>
                  )}

                  {/* Ticket created */}
                  {message.ticket && (
                    <div className="mt-4 p-3 bg-accent-success/10 border border-accent-success/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-accent-success" />
                        <span className="font-semibold text-accent-success">Ticket Created</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><strong>Ticket #:</strong> {message.ticket.ticketNumber}</p>
                        <p><strong>Category:</strong> {message.ticket.category}</p>
                        <p><strong>Priority:</strong> {message.ticket.priority}</p>
                        <p><strong>Status:</strong> {message.ticket.status}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-primary-card p-4 rounded-2xl">
                <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your IT issue in detail..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              icon={Send}
            >
              Send
            </Button>
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;

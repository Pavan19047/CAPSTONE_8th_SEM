import natural from 'natural';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// Keywords for each category
const categoryKeywords = {
  'Password Reset': [
    'password', 'reset', 'forgot', 'change password', 'login', 'cant login',
    'locked out', 'account locked', 'credentials', 'authentication'
  ],
  'VPN Issue': [
    'vpn', 'virtual private network', 'remote access', 'connection failed',
    'cant connect', 'vpn error', 'network access', 'remote', 'tunnel'
  ],
  'Software Access': [
    'software', 'application', 'access', 'license', 'install', 'permission',
    'app not working', 'cant open', 'need access', 'tool access'
  ],
  'Hardware Issue': [
    'hardware', 'laptop', 'computer', 'mouse', 'keyboard', 'monitor',
    'printer', 'broken', 'not working', 'device', 'equipment', 'screen',
    'not starting', 'wont start', 'wont boot', 'boot', 'power', 'startup',
    'screen flickering', 'display', 'charging', 'battery', 'overheating'
  ],
  'Network Issue': [
    'network', 'internet', 'wifi', 'connection', 'slow', 'connectivity',
    'ethernet', 'network down', 'no internet', 'cant connect'
  ],
  'Email Issue': [
    'email', 'outlook', 'mail', 'inbox', 'cant send', 'cant receive',
    'email error', 'mailbox', 'smtp', 'spam'
  ]
};

// Priority keywords
const priorityKeywords = {
  urgent: ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'down', 'cant work'],
  high: ['important', 'soon', 'blocking', 'cant access', 'broken'],
  medium: ['need', 'help', 'issue', 'problem'],
  low: ['question', 'how to', 'request', 'information']
};

export const classifyTicket = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      category: 'Other',
      priority: 'medium',
      confidence: 0,
      assignedTeam: 'Support'
    };
  }

  const normalizedText = text.toLowerCase();
  const tokens = tokenizer.tokenize(normalizedText);

  // Calculate category scores
  const categoryScores = {};
  let maxScore = 0;
  let predictedCategory = 'Other';

  Object.keys(categoryKeywords).forEach(category => {
    let score = 0;
    categoryKeywords[category].forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score += keyword.split(' ').length; // Multi-word keywords get higher weight
      }
    });
    
    categoryScores[category] = score;
    if (score > maxScore) {
      maxScore = score;
      predictedCategory = category;
    }
  });

  // Calculate priority
  let predictedPriority = 'medium';
  let highestPriorityScore = 0;

  Object.keys(priorityKeywords).forEach(priority => {
    let score = 0;
    priorityKeywords[priority].forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score++;
      }
    });
    
    if (score > highestPriorityScore) {
      highestPriorityScore = score;
      predictedPriority = priority;
    }
  });

  // Determine assigned team based on category
  const teamMapping = {
    'Password Reset': 'IT Support',
    'VPN Issue': 'Network Team',
    'Software Access': 'IT Support',
    'Hardware Issue': 'Hardware Team',
    'Network Issue': 'Network Team',
    'Email Issue': 'IT Support',
    'Other': 'Support'
  };

  const confidence = maxScore > 0 ? Math.min((maxScore / 3) * 100, 95) : 0;

  return {
    category: predictedCategory,
    priority: predictedPriority,
    confidence: Math.round(confidence),
    assignedTeam: teamMapping[predictedCategory] || 'Support',
    categoryScores
  };
};

export const searchKnowledgeBase = (query, articles) => {
  if (!query || !articles || articles.length === 0) {
    return [];
  }

  // First, classify the query to understand the category
  const classification = classifyTicket(query);
  const detectedCategory = classification.category;

  // Filter articles by detected category first (if confidence is high enough)
  let relevantArticles = articles;
  if (classification.confidence > 30 && detectedCategory !== 'Other') {
    relevantArticles = articles.filter(article => 
      article.category === detectedCategory
    );
  }

  // If no articles in that category, fall back to all articles
  if (relevantArticles.length === 0) {
    relevantArticles = articles;
  }

  const tfidf = new TfIdf();
  
  // Add relevant articles to TF-IDF
  relevantArticles.forEach(article => {
    const content = `${article.title} ${article.problem} ${article.solution} ${article.keywords.join(' ')}`;
    tfidf.addDocument(content.toLowerCase());
  });

  // Score the query against all documents
  const scores = [];
  const normalizedQuery = query.toLowerCase();
  
  relevantArticles.forEach((article, index) => {
    let score = 0;
    
    tfidf.tfidfs(normalizedQuery, (i, measure) => {
      if (i === index) {
        score = measure;
      }
    });

    // Boost score for exact keyword matches in title
    if (article.title.toLowerCase().includes(normalizedQuery)) {
      score += 5;
    }

    // Boost score for keyword matches
    article.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score += 3;
      }
    });

    // Boost score for matches in problem description
    const problemWords = tokenizer.tokenize(normalizedQuery);
    problemWords.forEach(word => {
      if (word.length > 3 && article.problem.toLowerCase().includes(word)) {
        score += 1;
      }
    });

    if (score > 0) {
      scores.push({
        article: {
          ...article,
          relevance: Math.min(score / 10, 1) // Normalize relevance score
        },
        score
      });
    }
  });

  // Sort by score and return top results
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.article);
};

export const extractKeywords = (text) => {
  if (!text) return [];
  
  const normalizedText = text.toLowerCase();
  const tokens = tokenizer.tokenize(normalizedText);
  
  // Remove common stop words
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'my', 'i', 'me'];
  const keywords = tokens.filter(token => 
    !stopWords.includes(token) && token.length > 2
  );
  
  return [...new Set(keywords)].slice(0, 10);
};

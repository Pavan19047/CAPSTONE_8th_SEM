import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const BayesClassifier = natural.BayesClassifier;
const JaroWinklerDistance = natural.JaroWinklerDistance;
const DiceCoefficient = natural.DiceCoefficient;

// ============================================
// MACHINE LEARNING CONFIGURATION
// ============================================

// Path to save/load classifier
const CLASSIFIER_PATH = path.join(__dirname, '../data/classifier.json');

// Minimum confidence threshold
const CONFIDENCE_THRESHOLD = 0.6;

// Training dataset for Bayes Classifier
const trainingData = [
  // Password Reset examples
  { text: 'I forgot my password and cannot login', category: 'Password Reset' },
  { text: 'Need to reset my password urgently', category: 'Password Reset' },
  { text: 'My account is locked out need password reset', category: 'Password Reset' },
  { text: 'Cannot remember my password help', category: 'Password Reset' },
  { text: 'Password expired need to change it', category: 'Password Reset' },
  { text: 'Locked out of my account after failed login attempts', category: 'Password Reset' },
  { text: 'Need password recovery for my account', category: 'Password Reset' },
  { text: 'Reset my credentials please', category: 'Password Reset' },
  { text: 'Account login issues after password change', category: 'Password Reset' },
  { text: 'Cannot authenticate need password help', category: 'Password Reset' },
  
  // VPN Issues examples
  { text: 'VPN connection keeps dropping', category: 'VPN Issues' },
  { text: 'Cannot connect to VPN from home', category: 'VPN Issues' },
  { text: 'VPN timeout error when connecting', category: 'VPN Issues' },
  { text: 'Remote access not working VPN issue', category: 'VPN Issues' },
  { text: 'VPN client shows connection failed', category: 'VPN Issues' },
  { text: 'Cannot access company network through VPN', category: 'VPN Issues' },
  { text: 'VPN tunnel not establishing', category: 'VPN Issues' },
  { text: 'VPN disconnects frequently', category: 'VPN Issues' },
  
  // Software Installation examples
  { text: 'Need access to Adobe Creative Suite', category: 'Software Installation' },
  { text: 'Cannot install required software', category: 'Software Installation' },
  { text: 'Software license expired need renewal', category: 'Software Installation' },
  { text: 'Need permission to use application', category: 'Software Installation' },
  { text: 'Request for Microsoft Office installation', category: 'Software Installation' },
  { text: 'Application not opening access denied', category: 'Software Installation' },
  { text: 'Need license key for software', category: 'Software Installation' },
  { text: 'Cannot install Adobe Acrobat', category: 'Software Installation' },
  { text: 'Need Microsoft Teams installed', category: 'Software Installation' },
  { text: 'Software update failed', category: 'Software Installation' },
  { text: 'Need access to install applications', category: 'Software Installation' },
  { text: 'Application installation error', category: 'Software Installation' },
  
  // Hardware Issues examples
  { text: 'My laptop screen is flickering', category: 'Hardware Issues' },
  { text: 'Computer not starting up', category: 'Hardware Issues' },
  { text: 'Laptop not booting black screen', category: 'Hardware Issues' },
  { text: 'Keyboard keys not working properly', category: 'Hardware Issues' },
  { text: 'Mouse is not responding', category: 'Hardware Issues' },
  { text: 'Monitor display is blank', category: 'Hardware Issues' },
  { text: 'Printer paper jam issue', category: 'Hardware Issues' },
  { text: 'Laptop battery not charging', category: 'Hardware Issues' },
  { text: 'Computer making loud noise overheating', category: 'Hardware Issues' },
  { text: 'Laptop wont start or boot', category: 'Hardware Issues' },
  
  // Network Issues examples
  { text: 'Internet connection very slow', category: 'Network Issues' },
  { text: 'WiFi keeps disconnecting', category: 'Network Issues' },
  { text: 'Cannot connect to office network', category: 'Network Issues' },
  { text: 'No internet access on my computer', category: 'Network Issues' },
  { text: 'Ethernet cable not working', category: 'Network Issues' },
  { text: 'Network drive not accessible', category: 'Network Issues' },
  { text: 'Slow file transfer speeds on network', category: 'Network Issues' },
  { text: 'Cannot connect to office wifi', category: 'Network Issues' },
  { text: 'Internet is very slow', category: 'Network Issues' },
  { text: 'Network connection problems', category: 'Network Issues' },
  
  // Email Issues examples
  { text: 'Cannot send emails from Outlook', category: 'Email Issues' },
  { text: 'Email not syncing on phone', category: 'Email Issues' },
  { text: 'Inbox not receiving new messages', category: 'Email Issues' },
  { text: 'Outlook keeps crashing when opening', category: 'Email Issues' },
  { text: 'Cannot access my mailbox', category: 'Email Issues' },
  { text: 'Emails going to spam folder', category: 'Email Issues' },
  { text: 'Email attachment too large error', category: 'Email Issues' },
  { text: 'Emails not syncing with phone', category: 'Email Issues' },
  { text: 'Cannot receive emails in Outlook', category: 'Email Issues' },
  { text: 'Email sync issues', category: 'Email Issues' }
];

// Initialize classifier (will be loaded or trained)
let categoryClassifier = null;

// Keywords for each category (fallback for keyword boosting)
const categoryKeywords = {
  'Password Reset': [
    'password', 'reset', 'forgot', 'change password', 'login', 'cant login',
    'locked out', 'account locked', 'credentials', 'authentication'
  ],
  'VPN Issues': [
    'vpn', 'virtual private network', 'remote access', 'connection failed',
    'cant connect', 'vpn error', 'network access', 'remote', 'tunnel'
  ],
  'Software Installation': [
    'software', 'application', 'access', 'license', 'install', 'permission',
    'app not working', 'cant open', 'need access', 'tool access', 'adobe',
    'microsoft', 'teams', 'office'
  ],
  'Hardware Issues': [
    'hardware', 'laptop', 'computer', 'mouse', 'keyboard', 'monitor',
    'printer', 'broken', 'not working', 'device', 'equipment', 'screen',
    'not starting', 'wont start', 'wont boot', 'boot', 'power', 'startup',
    'screen flickering', 'display', 'charging', 'battery', 'overheating',
    'noise', 'paper jam'
  ],
  'Network Issues': [
    'network', 'internet', 'wifi', 'connection', 'slow', 'connectivity',
    'ethernet', 'network down', 'no internet', 'cant connect', 'office wifi'
  ],
  'Email Issues': [
    'email', 'outlook', 'mail', 'inbox', 'cant send', 'cant receive',
    'email error', 'mailbox', 'smtp', 'spam', 'syncing', 'sync'
  ]
};

// Priority keywords
const priorityKeywords = {
  urgent: ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'down', 'cant work'],
  high: ['important', 'soon', 'blocking', 'cant access', 'broken'],
  medium: ['need', 'help', 'issue', 'problem'],
  low: ['question', 'how to', 'request', 'information']
};

// ============================================
// CLASSIFIER TRAINING & PERSISTENCE
// ============================================

/**
 * Train the Bayes classifier with sample data
 */
const trainClassifier = () => {
  console.log('🤖 Training Bayes Classifier...');
  
  const classifier = new BayesClassifier();
  
  // Count samples per category
  const categoryCounts = {};
  trainingData.forEach(data => {
    classifier.addDocument(data.text.toLowerCase(), data.category);
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  });
  
  // Display category breakdown
  Object.keys(categoryCounts).forEach(category => {
    console.log(`   Added ${categoryCounts[category]} samples for: ${category}`);
  });
  
  classifier.train();
  console.log(`✅ Classifier trained with ${trainingData.length} samples\n`);
  
  return classifier;
};

/**
 * Save classifier to disk
 */
const saveClassifier = (classifier) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save synchronously
    const classifierData = JSON.stringify(classifier);
    fs.writeFileSync(CLASSIFIER_PATH, classifierData, 'utf8');
    console.log('💾 Classifier saved to:', CLASSIFIER_PATH);
    console.log('');
  } catch (error) {
    console.error('❌ Error in saveClassifier:', error);
  }
};

/**
 * Load classifier from disk or train new one
 */
const loadOrTrainClassifier = () => {
  try {
    if (fs.existsSync(CLASSIFIER_PATH)) {
      console.log('📂 Loading existing classifier...');
      const classifier = BayesClassifier.restore(JSON.parse(fs.readFileSync(CLASSIFIER_PATH, 'utf8')));
      console.log(`✅ Classifier loaded successfully (${trainingData.length} samples)\n`);
      return classifier;
    } else {
      console.log('🆕 No saved classifier found. Training new classifier...\n');
      const classifier = trainClassifier();
      saveClassifier(classifier);
      return classifier;
    }
  } catch (error) {
    console.error('❌ Error in loadOrTrainClassifier:', error);
    console.log('🔄 Falling back to training new classifier...\n');
    return trainClassifier();
  }
};

/**
 * Initialize classifier on module load
 */
const initializeClassifier = () => {
  if (!categoryClassifier) {
    categoryClassifier = loadOrTrainClassifier();
  }
  return categoryClassifier;
};

/**
 * Retrain classifier with new data (optional API endpoint)
 */
export const retrainClassifier = (newTrainingData = null) => {
  console.log('🔄 Retraining classifier...');
  
  if (newTrainingData && Array.isArray(newTrainingData)) {
    trainingData.push(...newTrainingData);
  }
  
  categoryClassifier = trainClassifier();
  saveClassifier(categoryClassifier);
  return { success: true, samplesCount: trainingData.length };
};

// ============================================
// CLASSIFICATION FUNCTIONS
// ============================================

/**
 * Classify ticket using Bayes Classifier + keyword boosting
 */
export const classifyTicket = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      category: 'Other',
      priority: 'medium',
      confidence: 0,
      assignedTeam: 'Support',
      method: 'fallback',
      mlConfidence: 0,
      keywordScore: 0,
      allClassifications: []
    };
  }

  // Ensure classifier is initialized
  const classifier = initializeClassifier();
  
  const normalizedText = text.toLowerCase();
  
  // ========================================
  // 1. MACHINE LEARNING CLASSIFICATION
  // ========================================
  
  // Get ML prediction with probabilities
  const classifications = classifier.getClassifications(normalizedText);
  const topClassification = classifications[0];
  
  let predictedCategory = topClassification.label;
  let mlConfidence = topClassification.value;
  
  // ========================================
  // 2. KEYWORD BOOSTING (Hybrid Approach)
  // ========================================
  
  // Calculate keyword match scores for each category
  const keywordScores = {};
  Object.keys(categoryKeywords).forEach(category => {
    let score = 0;
    categoryKeywords[category].forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score += keyword.split(' ').length; // Multi-word = higher weight
      }
    });
    keywordScores[category] = score;
  });
  
  // Find best keyword match
  const bestKeywordCategory = Object.keys(keywordScores).reduce((a, b) => 
    keywordScores[a] > keywordScores[b] ? a : b
  );
  const bestKeywordScore = keywordScores[bestKeywordCategory];
  
  // ========================================
  // 3. HYBRID DECISION (ML + Keywords)
  // ========================================
  
  let finalCategory = predictedCategory;
  let finalConfidence = mlConfidence;
  let method = 'ml';
  
  // If keyword match is strong and ML confidence is low, use keyword result
  if (bestKeywordScore >= 3 && mlConfidence < 0.7) {
    finalCategory = bestKeywordCategory;
    finalConfidence = Math.min((bestKeywordScore / 5) * 0.9, 0.95);
    method = 'hybrid-keyword';
  }
  // If ML confidence is too low, fallback to "Other"
  else if (mlConfidence < CONFIDENCE_THRESHOLD) {
    finalCategory = 'Other';
    finalConfidence = CONFIDENCE_THRESHOLD * 0.8; // Lower confidence for fallback
    method = 'fallback';
  }
  // Boost confidence if keyword matches support ML prediction
  else if (bestKeywordCategory === predictedCategory && bestKeywordScore >= 2) {
    finalConfidence = Math.min(mlConfidence + (bestKeywordScore * 0.05), 0.98);
    method = 'hybrid-boosted';
  }

  // ========================================
  // 4. PRIORITY DETECTION
  // ========================================
  
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

  // ========================================
  // 5. TEAM ASSIGNMENT
  // ========================================
  
  const teamMapping = {
    'Password Reset': 'IT Support',
    'VPN Issues': 'Network Team',
    'Software Installation': 'Software Team',
    'Hardware Issues': 'Hardware Team',
    'Network Issues': 'Network Team',
    'Email Issues': 'IT Support',
    'Other': 'Support'
  };

  const confidence = Math.round(finalConfidence * 100);
  
  // ========================================
  // 6. RETURN CLASSIFICATION RESULT
  // ========================================
  
  return {
    category: finalCategory,
    priority: predictedPriority,
    confidence: confidence,
    assignedTeam: teamMapping[finalCategory] || 'Support',
    method: method,
    mlConfidence: Math.round(mlConfidence * 100),
    keywordScore: bestKeywordScore,
    allClassifications: classifications.slice(0, 3).map(c => ({
      label: c.label,
      confidence: Math.round(c.value * 100)
    }))
  };
};

// ============================================
// SIMILARITY CALCULATION HELPERS
// ============================================

/**
 * Calculate fuzzy string similarity using Jaro-Winkler
 */
const calculateJaroWinklerSimilarity = (str1, str2) => {
  return JaroWinklerDistance(str1.toLowerCase(), str2.toLowerCase());
};

/**
 * Calculate Dice Coefficient similarity
 */
const calculateDiceSimilarity = (str1, str2) => {
  return DiceCoefficient(str1.toLowerCase(), str2.toLowerCase());
};

// ============================================
// ADVANCED SEMANTIC SEARCH
// ============================================

/**
 * Advanced semantic search with multiple similarity measures
 */
export const searchKnowledgeBase = (query, articles) => {
  if (!query || !articles || articles.length === 0) {
    return [];
  }

  // ========================================
  // 1. CATEGORY-BASED FILTERING
  // ========================================
  
  // Classify query to detect category
  const classification = classifyTicket(query);
  const detectedCategory = classification.category;

  // Filter articles by detected category (if confidence is high)
  let relevantArticles = articles;
  if (classification.confidence > 30 && detectedCategory !== 'Other') {
    relevantArticles = articles.filter(article => 
      article.category === detectedCategory
    );
  }

  // Fallback to all articles if no matches
  if (relevantArticles.length === 0) {
    relevantArticles = articles;
  }

  // ========================================
  // 2. MULTI-METRIC SCORING
  // ========================================
  
  const tfidf = new TfIdf();
  const normalizedQuery = query.toLowerCase();
  const queryTokens = tokenizer.tokenize(normalizedQuery);
  
  // Build TF-IDF index
  relevantArticles.forEach(article => {
    const content = `${article.title} ${article.problem} ${article.solution} ${article.keywords.join(' ')}`;
    tfidf.addDocument(content.toLowerCase());
  });

  const scoredArticles = [];
  
  relevantArticles.forEach((article, index) => {
    let totalScore = 0;
    
    // ----------------------------------------
    // A. TF-IDF Score (Base semantic similarity)
    // ----------------------------------------
    let tfidfScore = 0;
    tfidf.tfidfs(normalizedQuery, (i, measure) => {
      if (i === index) {
        tfidfScore = measure * 10; // Scale up
      }
    });
    totalScore += tfidfScore;
    
    // ----------------------------------------
    // B. Jaro-Winkler Distance (Title similarity)
    // ----------------------------------------
    const titleSimilarity = calculateJaroWinklerSimilarity(normalizedQuery, article.title);
    totalScore += titleSimilarity * 15; // Strong weight for title match
    
    // ----------------------------------------
    // C. Dice Coefficient (Problem similarity)
    // ----------------------------------------
    const problemSimilarity = calculateDiceSimilarity(normalizedQuery, article.problem);
    totalScore += problemSimilarity * 12;
    
    // ----------------------------------------
    // D. Exact Keyword Matching
    // ----------------------------------------
    let keywordMatches = 0;
    article.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        keywordMatches++;
        totalScore += 8;
      }
      
      // Fuzzy keyword match using Dice
      const keywordSimilarity = calculateDiceSimilarity(normalizedQuery, keyword);
      if (keywordSimilarity > 0.7) {
        totalScore += keywordSimilarity * 5;
      }
    });
    
    // ----------------------------------------
    // E. Token Overlap (Query words in article)
    // ----------------------------------------
    const articleText = `${article.title} ${article.problem}`.toLowerCase();
    queryTokens.forEach(token => {
      if (token.length > 3 && articleText.includes(token)) {
        totalScore += 2;
      }
    });
    
    // ----------------------------------------
    // F. Popularity Boost (views, helpful count)
    // ----------------------------------------
    const popularityScore = Math.log10(article.views + 1) * 0.5;
    const helpfulRatio = article.helpful / (article.helpful + article.notHelpful + 1);
    totalScore += popularityScore + (helpfulRatio * 3);
    
    // Only include articles with meaningful scores
    if (totalScore > 0.5) {
      scoredArticles.push({
        article: {
          ...article,
          relevance: Math.min(totalScore / 50, 1), // Normalize to 0-1
          matchDetails: {
            tfidf: tfidfScore.toFixed(2),
            titleSimilarity: (titleSimilarity * 100).toFixed(0) + '%',
            problemSimilarity: (problemSimilarity * 100).toFixed(0) + '%',
            keywordMatches: keywordMatches
          }
        },
        score: totalScore
      });
    }
  });

  // ========================================
  // 3. RANKING & RETURN
  // ========================================
  
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.article);
  };
  
  /**
   * Simple keyword-based search (fallback method)
   */
  export const simpleSearch = (query, articles) => {
    if (!query || !articles) return [];
  
    const normalizedQuery = query.toLowerCase();
    const scores = [];
  
    articles.forEach(article => {
      let score = 0;
  
      // Score for title match
      if (article.title.toLowerCase().includes(normalizedQuery)) {
        score += 5;
      }
  
      // Score for keyword matches
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

// ============================================
// AUTO-INITIALIZE CLASSIFIER ON MODULE LOAD
// ============================================

console.log('🔧 Initializing NLP Service...\n');
initializeClassifier();
console.log('🚀 NLP Service ready!\n');

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
const NGrams = natural.NGrams;
const PorterStemmer = natural.PorterStemmer;

// ============================================
// MACHINE LEARNING CONFIGURATION
// ============================================

// Path to save/load classifier
const CLASSIFIER_PATH = path.join(__dirname, '../data/classifier.json');

// Lower threshold for better ML utilization with small training sets
const CONFIDENCE_THRESHOLD = 0.35;

// Minimum keyword score to override ML
const KEYWORD_OVERRIDE_THRESHOLD = 2;

// Training dataset for Bayes Classifier - EXPANDED with more diverse examples
const trainingData = [
  // Password Reset examples (20 samples)
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
  { text: 'I forgot my login credentials', category: 'Password Reset' },
  { text: 'How do I change my password', category: 'Password Reset' },
  { text: 'My password is not working anymore', category: 'Password Reset' },
  { text: 'Account says invalid password', category: 'Password Reset' },
  { text: 'Need new password for my account', category: 'Password Reset' },
  { text: 'Unable to sign in wrong password', category: 'Password Reset' },
  { text: 'Password reset link not working', category: 'Password Reset' },
  { text: 'I keep getting password incorrect error', category: 'Password Reset' },
  { text: 'Forgot password and locked out of system', category: 'Password Reset' },
  { text: 'Authentication failed need to reset', category: 'Password Reset' },

  // VPN Issues examples (18 samples)
  { text: 'VPN connection keeps dropping', category: 'VPN Issues' },
  { text: 'Cannot connect to VPN from home', category: 'VPN Issues' },
  { text: 'VPN timeout error when connecting', category: 'VPN Issues' },
  { text: 'Remote access not working VPN issue', category: 'VPN Issues' },
  { text: 'VPN client shows connection failed', category: 'VPN Issues' },
  { text: 'Cannot access company network through VPN', category: 'VPN Issues' },
  { text: 'VPN tunnel not establishing', category: 'VPN Issues' },
  { text: 'VPN disconnects frequently', category: 'VPN Issues' },
  { text: 'VPN connection timeout error', category: 'VPN Issues' },
  { text: 'Cannot work from home VPN broken', category: 'VPN Issues' },
  { text: 'VPN says authentication error', category: 'VPN Issues' },
  { text: 'Remote desktop through VPN not working', category: 'VPN Issues' },
  { text: 'VPN client crashes when connecting', category: 'VPN Issues' },
  { text: 'Work from home VPN problem', category: 'VPN Issues' },
  { text: 'VPN keeps asking for credentials', category: 'VPN Issues' },
  { text: 'Cannot establish VPN connection to office', category: 'VPN Issues' },
  { text: 'VPN network unreachable error', category: 'VPN Issues' },
  { text: 'Remote connection failing through VPN', category: 'VPN Issues' },

  // Software Installation examples (20 samples)
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
  { text: 'Request to install new software on my computer', category: 'Software Installation' },
  { text: 'Need admin rights to install program', category: 'Software Installation' },
  { text: 'Software not opening permission denied', category: 'Software Installation' },
  { text: 'Install zoom application on laptop', category: 'Software Installation' },
  { text: 'Need Slack installed for team communication', category: 'Software Installation' },
  { text: 'Application needs update but cannot install', category: 'Software Installation' },
  { text: 'Software license has expired please renew', category: 'Software Installation' },
  { text: 'Cannot download software from website', category: 'Software Installation' },

  // Hardware Issues examples (22 samples)
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
  { text: 'My laptop wont start up', category: 'Hardware Issues' },
  { text: 'Computer screen is broken', category: 'Hardware Issues' },
  { text: 'Laptop making strange noise', category: 'Hardware Issues' },
  { text: 'Computer making buzzing sound', category: 'Hardware Issues' },
  { text: 'Monitor flickering and blinking', category: 'Hardware Issues' },
  { text: 'Keyboard stopped working completely', category: 'Hardware Issues' },
  { text: 'Touchpad not responding on laptop', category: 'Hardware Issues' },
  { text: 'USB ports not recognizing devices', category: 'Hardware Issues' },
  { text: 'Computer fan running very loud', category: 'Hardware Issues' },
  { text: 'Laptop overheating and shutting down', category: 'Hardware Issues' },
  { text: 'Screen display showing weird colors', category: 'Hardware Issues' },
  { text: 'Computer freezes and crashes', category: 'Hardware Issues' },

  // Network Issues examples (20 samples)
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
  { text: 'Wifi signal is weak in my office', category: 'Network Issues' },
  { text: 'Cannot access shared folders on network', category: 'Network Issues' },
  { text: 'Internet keeps dropping every few minutes', category: 'Network Issues' },
  { text: 'Network printer not reachable', category: 'Network Issues' },
  { text: 'Wifi password not working', category: 'Network Issues' },
  { text: 'Cannot connect to wireless network', category: 'Network Issues' },
  { text: 'Slow download and upload speeds', category: 'Network Issues' },
  { text: 'Network cable disconnected error', category: 'Network Issues' },
  { text: 'Internet connectivity issues on laptop', category: 'Network Issues' },
  { text: 'Office wifi not showing in available networks', category: 'Network Issues' },

  // Email Issues examples (18 samples)
  { text: 'Cannot send emails from Outlook', category: 'Email Issues' },
  { text: 'Email not syncing on phone', category: 'Email Issues' },
  { text: 'Inbox not receiving new messages', category: 'Email Issues' },
  { text: 'Outlook keeps crashing when opening', category: 'Email Issues' },
  { text: 'Cannot access my mailbox', category: 'Email Issues' },
  { text: 'Emails going to spam folder', category: 'Email Issues' },
  { text: 'Email attachment too large error', category: 'Email Issues' },
  { text: 'Emails not syncing with phone', category: 'Email Issues' },
  { text: 'Cannot receive emails in Outlook', category: 'Email Issues' },
  { text: 'Email sync issues', category: 'Email Issues' },
  { text: 'Outlook showing disconnected from server', category: 'Email Issues' },
  { text: 'Email calendar not syncing', category: 'Email Issues' },
  { text: 'Cannot open email attachments', category: 'Email Issues' },
  { text: 'Email signature not showing correctly', category: 'Email Issues' },
  { text: 'Outlook keeps asking for password', category: 'Email Issues' },
  { text: 'Emails stuck in outbox not sending', category: 'Email Issues' },
  { text: 'Mail app not loading messages', category: 'Email Issues' },
  { text: 'Cannot add new email account to Outlook', category: 'Email Issues' }
];

// Initialize classifier (will be loaded or trained)
let categoryClassifier = null;

// Enhanced keywords with weighted scoring
const categoryKeywords = {
  'Password Reset': {
    exact: ['password reset', 'forgot password', 'reset password', 'change password', 'locked out', 'account locked'],
    strong: ['password', 'credentials', 'login', 'signin', 'sign in', 'authentication', 'authenticate'],
    weak: ['forgot', 'reset', 'locked', 'access', 'account']
  },
  'VPN Issues': {
    exact: ['vpn connection', 'vpn error', 'vpn issue', 'remote access', 'work from home'],
    strong: ['vpn', 'tunnel', 'remote', 'connection failed'],
    weak: ['connection', 'timeout', 'disconnect', 'home']
  },
  'Software Installation': {
    exact: ['install software', 'software installation', 'need access', 'license expired', 'admin rights'],
    strong: ['software', 'install', 'application', 'license', 'adobe', 'microsoft', 'teams', 'office', 'zoom', 'slack'],
    weak: ['access', 'permission', 'download', 'update', 'program']
  },
  'Hardware Issues': {
    exact: ['laptop screen', 'computer not starting', 'not booting', 'paper jam', 'making noise', 'wont start'],
    strong: ['laptop', 'computer', 'screen', 'keyboard', 'mouse', 'monitor', 'printer', 'hardware', 'display', 'battery'],
    weak: ['broken', 'not working', 'flickering', 'noise', 'charging', 'overheating', 'startup', 'boot', 'power']
  },
  'Network Issues': {
    exact: ['internet slow', 'wifi disconnecting', 'network connection', 'no internet', 'office wifi'],
    strong: ['network', 'internet', 'wifi', 'ethernet', 'wireless', 'connectivity'],
    weak: ['slow', 'speed', 'disconnecting', 'connection', 'signal']
  },
  'Email Issues': {
    exact: ['email not syncing', 'outlook crashing', 'cannot send email', 'email sync', 'mailbox full'],
    strong: ['email', 'outlook', 'mailbox', 'inbox', 'smtp', 'mail'],
    weak: ['sync', 'syncing', 'sending', 'receiving', 'attachment', 'spam']
  }
};

// Priority keywords with weights
const priorityKeywords = {
  urgent: {
    strong: ['urgent', 'critical', 'emergency', 'asap', 'immediately', 'down', 'outage', 'cant work', 'blocked'],
    normal: ['important', 'priority']
  },
  high: {
    strong: ['important', 'soon', 'blocking', 'broken', 'failing'],
    normal: ['need', 'deadline']
  },
  medium: {
    strong: ['issue', 'problem', 'help'],
    normal: ['need', 'request']
  },
  low: {
    strong: ['question', 'how to', 'information', 'when available'],
    normal: ['wondering', 'curious']
  }
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
    // Add original text
    classifier.addDocument(data.text.toLowerCase(), data.category);

    // Add stemmed version for better generalization
    const stemmed = PorterStemmer.tokenizeAndStem(data.text.toLowerCase()).join(' ');
    if (stemmed.length > 0) {
      classifier.addDocument(stemmed, data.category);
    }

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
 * Save classifier to disk (async but non-blocking)
 */
const saveClassifier = (classifier) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save asynchronously (non-blocking)
    classifier.save(CLASSIFIER_PATH, (err) => {
      if (err) {
        console.error('❌ Error saving classifier:', err);
      } else {
        console.log('💾 Classifier saved to:', CLASSIFIER_PATH);
        console.log('');
      }
    });
  } catch (error) {
    console.error('❌ Error in saveClassifier:', error);
  }
};

/**
 * Load classifier from disk or train new one (synchronous)
 */
const loadOrTrainClassifier = () => {
  console.log('🔧 Initializing classifier...\n');

  // Always train fresh for now (fast with samples)
  // This ensures the classifier is always properly initialized
  const classifier = trainClassifier();
  saveClassifier(classifier); // Save async

  return classifier;
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
// ENHANCED KEYWORD SCORING
// ============================================

/**
 * Calculate weighted keyword score for a category
 */
const calculateKeywordScore = (text, category) => {
  const normalizedText = text.toLowerCase();
  const keywords = categoryKeywords[category];
  if (!keywords) return { score: 0, matches: [] };

  let score = 0;
  const matches = [];

  // Check exact phrase matches (highest weight)
  keywords.exact?.forEach(phrase => {
    if (normalizedText.includes(phrase)) {
      score += 5;
      matches.push({ phrase, weight: 5 });
    }
  });

  // Check strong keyword matches
  keywords.strong?.forEach(keyword => {
    if (normalizedText.includes(keyword)) {
      score += 3;
      matches.push({ keyword, weight: 3 });
    }
  });

  // Check weak keyword matches
  keywords.weak?.forEach(keyword => {
    if (normalizedText.includes(keyword)) {
      score += 1;
      matches.push({ keyword, weight: 1 });
    }
  });

  // N-gram matching for better phrase detection
  const bigrams = NGrams.bigrams(normalizedText).map(bg => bg.join(' '));
  const trigrams = NGrams.trigrams(normalizedText).map(tg => tg.join(' '));

  [...bigrams, ...trigrams].forEach(ngram => {
    keywords.exact?.forEach(phrase => {
      const similarity = DiceCoefficient(ngram, phrase);
      if (similarity > 0.7) {
        score += similarity * 3;
      }
    });
  });

  return { score, matches };
};

/**
 * Get all keyword scores for each category
 */
const getAllKeywordScores = (text) => {
  const scores = {};
  Object.keys(categoryKeywords).forEach(category => {
    scores[category] = calculateKeywordScore(text, category);
  });
  return scores;
};

// ============================================
// CLASSIFICATION FUNCTIONS
// ============================================

/**
 * Classify ticket using Bayes Classifier + enhanced keyword boosting
 */
export const classifyTicket = (text) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
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

  const normalizedText = text.toLowerCase().trim();

  // ========================================
  // 1. MACHINE LEARNING CLASSIFICATION
  // ========================================

  // Get ML prediction with probabilities
  const classifications = classifier.getClassifications(normalizedText);
  const topClassification = classifications[0] || { label: 'Other', value: 0 };
  const secondClassification = classifications[1] || { label: 'Other', value: 0 };

  let predictedCategory = topClassification.label;
  let mlConfidence = topClassification.value;

  // Calculate confidence gap between top 2 predictions
  const confidenceGap = mlConfidence - secondClassification.value;

  // ========================================
  // 2. ENHANCED KEYWORD SCORING
  // ========================================

  const keywordScores = getAllKeywordScores(normalizedText);

  // Find best keyword match
  let bestKeywordCategory = 'Other';
  let bestKeywordScore = 0;
  let bestKeywordMatches = [];

  Object.keys(keywordScores).forEach(category => {
    if (keywordScores[category].score > bestKeywordScore) {
      bestKeywordScore = keywordScores[category].score;
      bestKeywordCategory = category;
      bestKeywordMatches = keywordScores[category].matches;
    }
  });

  // ========================================
  // 3. SMART HYBRID DECISION
  // ========================================

  let finalCategory = predictedCategory;
  let finalConfidence = mlConfidence;
  let method = 'ml';

  // Decision logic based on multiple factors
  const mlKeywordScore = keywordScores[predictedCategory]?.score || 0;

  // Case 1: Strong keyword match (score >= 5) - trust keywords
  if (bestKeywordScore >= 5) {
    finalCategory = bestKeywordCategory;
    finalConfidence = Math.min(0.75 + (bestKeywordScore * 0.02), 0.95);
    method = 'keyword-strong';
  }
  // Case 2: ML has low confidence but keywords match ML category
  else if (mlConfidence < CONFIDENCE_THRESHOLD && mlKeywordScore >= KEYWORD_OVERRIDE_THRESHOLD) {
    finalCategory = predictedCategory;
    finalConfidence = Math.min(0.55 + (mlKeywordScore * 0.05), 0.85);
    method = 'hybrid-boosted';
  }
  // Case 3: ML has low confidence and keywords suggest different category
  else if (mlConfidence < CONFIDENCE_THRESHOLD && bestKeywordScore >= KEYWORD_OVERRIDE_THRESHOLD) {
    finalCategory = bestKeywordCategory;
    finalConfidence = Math.min(0.50 + (bestKeywordScore * 0.05), 0.80);
    method = 'hybrid-keyword';
  }
  // Case 4: ML has decent confidence and keywords support it
  else if (mlConfidence >= CONFIDENCE_THRESHOLD && mlKeywordScore >= 1) {
    finalConfidence = Math.min(mlConfidence + (mlKeywordScore * 0.03), 0.98);
    method = 'ml-boosted';
  }
  // Case 5: ML has good confidence and good gap from second choice
  else if (mlConfidence >= CONFIDENCE_THRESHOLD && confidenceGap > 0.1) {
    finalConfidence = mlConfidence;
    method = 'ml';
  }
  // Case 6: Very low ML confidence and no keyword support - fallback
  else if (mlConfidence < 0.25 && bestKeywordScore < KEYWORD_OVERRIDE_THRESHOLD) {
    finalCategory = 'Other';
    finalConfidence = 0.48;
    method = 'fallback';
  }
  // Case 7: Default - use ML with slight boost if any keywords match
  else {
    finalConfidence = Math.min(mlConfidence + (bestKeywordScore * 0.02), 0.90);
    method = bestKeywordScore > 0 ? 'ml-supported' : 'ml';
  }

  // ========================================
  // 4. PRIORITY DETECTION
  // ========================================

  let predictedPriority = 'medium';
  let highestPriorityScore = 0;

  Object.keys(priorityKeywords).forEach(priority => {
    let score = 0;
    const keywords = priorityKeywords[priority];

    keywords.strong?.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score += 2;
      }
    });

    keywords.normal?.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score += 1;
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
    keywordMatches: bestKeywordMatches.slice(0, 5),
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
  if (!str1 || !str2) return 0;
  return JaroWinklerDistance(str1.toLowerCase(), str2.toLowerCase());
};

/**
 * Calculate Dice Coefficient similarity
 */
const calculateDiceSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
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

  // Convert Mongoose documents to plain objects if needed
  const plainArticles = articles.map(article => {
    if (article.toObject) {
      return article.toObject();
    }
    return { ...article };
  });

  // ========================================
  // 1. CATEGORY-BASED FILTERING
  // ========================================

  // Classify query to detect category
  const classification = classifyTicket(query);
  const detectedCategory = classification.category;

  // Filter articles by detected category (if confidence is high enough)
  let relevantArticles = plainArticles;
  if (classification.confidence > 40 && detectedCategory !== 'Other') {
    const categoryFiltered = plainArticles.filter(article =>
      article.category === detectedCategory
    );
    // Only use filtered if we have results
    if (categoryFiltered.length > 0) {
      relevantArticles = categoryFiltered;
    }
  }

  // ========================================
  // 2. MULTI-METRIC SCORING
  // ========================================

  const tfidf = new TfIdf();
  const normalizedQuery = query.toLowerCase();
  const queryTokens = tokenizer.tokenize(normalizedQuery) || [];
  const queryStemmed = PorterStemmer.tokenizeAndStem(normalizedQuery);

  // Build TF-IDF index
  relevantArticles.forEach(article => {
    const content = `${article.title || ''} ${article.problem || ''} ${article.solution || ''} ${(article.keywords || []).join(' ')}`;
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
    const titleSimilarity = calculateJaroWinklerSimilarity(normalizedQuery, article.title || '');
    totalScore += titleSimilarity * 20; // Strong weight for title match

    // ----------------------------------------
    // C. Dice Coefficient (Problem similarity)
    // ----------------------------------------
    const problemSimilarity = calculateDiceSimilarity(normalizedQuery, article.problem || '');
    totalScore += problemSimilarity * 15;

    // ----------------------------------------
    // D. Exact Keyword Matching with fuzzy fallback
    // ----------------------------------------
    let keywordMatches = 0;
    const articleKeywords = article.keywords || [];

    articleKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();

      // Exact match
      if (normalizedQuery.includes(keywordLower)) {
        keywordMatches++;
        totalScore += 10;
      } else {
        // Fuzzy keyword match using Dice
        const keywordSimilarity = calculateDiceSimilarity(normalizedQuery, keyword);
        if (keywordSimilarity > 0.6) {
          keywordMatches += keywordSimilarity;
          totalScore += keywordSimilarity * 6;
        }
      }
    });

    // ----------------------------------------
    // E. Token Overlap (Query words in article)
    // ----------------------------------------
    const articleText = `${article.title || ''} ${article.problem || ''} ${article.solution || ''}`.toLowerCase();
    const articleStemmed = PorterStemmer.tokenizeAndStem(articleText);

    // Regular token overlap
    queryTokens.forEach(token => {
      if (token.length > 3 && articleText.includes(token)) {
        totalScore += 3;
      }
    });

    // Stemmed token overlap (more flexible matching)
    queryStemmed.forEach(stem => {
      if (articleStemmed.includes(stem)) {
        totalScore += 2;
      }
    });

    // ----------------------------------------
    // F. N-gram matching
    // ----------------------------------------
    const queryBigrams = NGrams.bigrams(normalizedQuery).map(bg => bg.join(' '));
    const articleBigrams = NGrams.bigrams(articleText).map(bg => bg.join(' '));

    queryBigrams.forEach(qbg => {
      articleBigrams.forEach(abg => {
        if (qbg === abg) {
          totalScore += 4;
        }
      });
    });

    // ----------------------------------------
    // G. Popularity Boost (views, helpful count)
    // ----------------------------------------
    const views = article.views || 0;
    const helpful = article.helpful || 0;
    const notHelpful = article.notHelpful || 0;

    const popularityScore = Math.log10(views + 1) * 0.5;
    const helpfulRatio = helpful / (helpful + notHelpful + 1);
    totalScore += popularityScore + (helpfulRatio * 3);

    // Only include articles with meaningful scores
    if (totalScore > 0.5) {
      scoredArticles.push({
        article: {
          _id: article._id,
          title: article.title,
          category: article.category,
          keywords: article.keywords,
          problem: article.problem,
          solution: article.solution,
          steps: article.steps,
          views: article.views,
          helpful: article.helpful,
          notHelpful: article.notHelpful,
          relevance: Math.min(totalScore / 60, 1), // Normalize to 0-1
          matchDetails: {
            tfidf: tfidfScore.toFixed(2),
            titleSimilarity: (titleSimilarity * 100).toFixed(0) + '%',
            problemSimilarity: (problemSimilarity * 100).toFixed(0) + '%',
            keywordMatches: Math.round(keywordMatches)
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
    const plainArticle = article.toObject ? article.toObject() : { ...article };

    // Score for title match
    if ((plainArticle.title || '').toLowerCase().includes(normalizedQuery)) {
      score += 5;
    }

    // Score for keyword matches
    (plainArticle.keywords || []).forEach(keyword => {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score += 3;
      }
    });

    // Boost score for matches in problem description
    const problemWords = tokenizer.tokenize(normalizedQuery) || [];
    problemWords.forEach(word => {
      if (word.length > 3 && (plainArticle.problem || '').toLowerCase().includes(word)) {
        score += 1;
      }
    });

    if (score > 0) {
      scores.push({
        article: {
          ...plainArticle,
          relevance: Math.min(score / 10, 1)
        },
        score
      });
    }
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.article);
};

export const extractKeywords = (text) => {
  if (!text) return [];

  const normalizedText = text.toLowerCase();
  const tokens = tokenizer.tokenize(normalizedText) || [];

  // Remove common stop words
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'my', 'i', 'me', 'it', 'this', 'that', 'be', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can'];
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
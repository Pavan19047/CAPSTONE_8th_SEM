/**
 * HUGGING FACE INTEGRATION (BONUS)
 * 
 * This service provides high-accuracy zero-shot classification using
 * Hugging Face's Inference API with distilbert-base-uncased-mnli model.
 * 
 * Benefits:
 * - Higher accuracy than Bayes for complex queries
 * - No training data required (zero-shot)
 * - Understands semantic meaning better
 * 
 * Trade-offs:
 * - Requires API calls (slight latency)
 * - Needs HF_API_KEY environment variable
 * - Cost per request (free tier available)
 */

import axios from 'axios';

// Configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const HF_API_KEY = process.env.HF_API_KEY; // Add to .env file

// Category labels for zero-shot classification
const CANDIDATE_LABELS = [
  'Password Reset',
  'VPN Issue',
  'Software Access',
  'Hardware Issue',
  'Network Issue',
  'Email Issue',
  'Other'
];

/**
 * Classify text using Hugging Face zero-shot classification
 * 
 * @param {string} text - Text to classify
 * @returns {Promise<Object>} Classification result
 */
export const classifyWithHuggingFace = async (text) => {
  if (!HF_API_KEY) {
    throw new Error('HF_API_KEY not configured in environment variables');
  }

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: text,
        parameters: {
          candidate_labels: CANDIDATE_LABELS,
          multi_label: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout for real-time performance
      }
    );

    const { labels, scores } = response.data;
    
    return {
      category: labels[0],
      confidence: Math.round(scores[0] * 100),
      allPredictions: labels.map((label, idx) => ({
        category: label,
        confidence: Math.round(scores[idx] * 100)
      })),
      method: 'huggingface-zero-shot'
    };
  } catch (error) {
    if (error.response?.status === 503) {
      // Model is loading, retry after delay
      throw new Error('HuggingFace model is loading. Please try again in 20 seconds.');
    }
    throw new Error(`HuggingFace API error: ${error.message}`);
  }
};

/**
 * Hybrid classification: Try HuggingFace first, fallback to Bayes
 * 
 * @param {string} text - Text to classify
 * @param {Function} fallbackClassifier - Bayes classifier function
 * @returns {Promise<Object>} Classification result
 */
export const classifyWithFallback = async (text, fallbackClassifier) => {
  try {
    // Try HuggingFace first (higher accuracy)
    const hfResult = await classifyWithHuggingFace(text);
    return hfResult;
  } catch (error) {
    console.warn('HuggingFace failed, using Bayes fallback:', error.message);
    // Fallback to local Bayes classifier
    return fallbackClassifier(text);
  }
};

/**
 * Batch classification for multiple texts (more efficient)
 * 
 * @param {string[]} texts - Array of texts to classify
 * @returns {Promise<Object[]>} Array of classification results
 */
export const batchClassify = async (texts) => {
  if (!HF_API_KEY) {
    throw new Error('HF_API_KEY not configured');
  }

  try {
    const promises = texts.map(text => classifyWithHuggingFace(text));
    return await Promise.all(promises);
  } catch (error) {
    throw new Error(`Batch classification failed: ${error.message}`);
  }
};

/**
 * Check if HuggingFace API is available and configured
 * 
 * @returns {boolean} True if API is ready
 */
export const isHuggingFaceAvailable = () => {
  return Boolean(HF_API_KEY);
};

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Sign up for free Hugging Face account: https://huggingface.co/join
 * 
 * 2. Get API token: https://huggingface.co/settings/tokens
 * 
 * 3. Add to server/.env:
 *    HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
 * 
 * 4. Update nlpService.js to use hybrid approach:
 * 
 *    import { classifyWithFallback } from './huggingFaceService.js';
 *    
 *    export const classifyTicket = async (text) => {
 *      return await classifyWithFallback(text, localBayesClassifier);
 *    };
 * 
 * 5. Free tier limits:
 *    - 30,000 API calls/month
 *    - Rate limit: 1,000 requests/day
 *    - Perfect for chatbot type-ahead (cache results)
 * 
 * OPTIMIZATION TIPS:
 * 
 * - Cache common queries in Redis/memory
 * - Use HF only for confidence < 0.8 in Bayes
 * - Implement request queuing for rate limits
 * - Consider self-hosting the model for unlimited requests
 */

export default {
  classifyWithHuggingFace,
  classifyWithFallback,
  batchClassify,
  isHuggingFaceAvailable
};

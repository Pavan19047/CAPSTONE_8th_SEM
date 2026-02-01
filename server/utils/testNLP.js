/**
 * Test script for the Machine Learning NLP Service
 * Run: node utils/testNLP.js
 */

import { classifyTicket, searchKnowledgeBase } from '../services/nlpService.js';
import KnowledgeBase from '../models/KnowledgeBase.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Test queries
const testQueries = [
  'My laptop wont start up',
  'VPN connection timeout error',
  'I forgot my password',
  'Cannot install Adobe software',
  'Internet is very slow',
  'Emails not syncing',
  'Printer paper jam',
  'Need access to Microsoft Teams',
  'Computer making strange noise',
  'Cannot connect to office wifi'
];

const runTests = async () => {
  console.log('🧪 Starting NLP Service Tests\n');
  console.log('=' .repeat(80));
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');
    
    // ========================================
    // TEST 1: Classification Accuracy
    // ========================================
    console.log('📊 TEST 1: Classification Accuracy');
    console.log('-'.repeat(80));
    
    const results = testQueries.map(query => {
      const result = classifyTicket(query);
      return {
        query,
        category: result.category,
        confidence: result.confidence,
        method: result.method,
        team: result.assignedTeam
      };
    });
    
    // Display results in table format
    console.table(results);
    
    // Calculate average confidence
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    console.log(`\n📈 Average Confidence: ${avgConfidence.toFixed(1)}%`);

    // Count classification methods
    const methodCounts = results.reduce((acc, r) => {
      acc[r.method] = (acc[r.method] || 0) + 1;
      return acc;
    }, {});

    console.log(`\n🤖 Classification Methods:`);
    Object.entries(methodCounts).forEach(([method, count]) => {
      console.log(`   ${method}: ${count}/${results.length}`);
    });

    // Count correct classifications (non-Other)
    const correctClassified = results.filter(r => r.category !== 'Other').length;
    console.log(`\n✅ Correctly Classified: ${correctClassified}/${results.length}`);
    
    // ========================================
    // TEST 2: Detailed Classification Breakdown
    // ========================================
    console.log('\n' + '='.repeat(80));
    console.log('🔍 TEST 2: Detailed Classification Example');
    console.log('-'.repeat(80));
    
    const detailedQuery = 'My laptop screen is flickering and making buzzing sound';
    const detailed = classifyTicket(detailedQuery);
    
    console.log(`\nQuery: "${detailedQuery}"\n`);
    console.log(`Category: ${detailed.category}`);
    console.log(`Confidence: ${detailed.confidence}%`);
    console.log(`Priority: ${detailed.priority}`);
    console.log(`Team: ${detailed.assignedTeam}`);
    console.log(`Method: ${detailed.method}`);
    console.log(`ML Confidence: ${detailed.mlConfidence}%`);
    console.log(`Keyword Score: ${detailed.keywordScore}`);
    if (detailed.keywordMatches && detailed.keywordMatches.length > 0) {
      console.log(`Keyword Matches: ${detailed.keywordMatches.map(m => m.keyword || m.phrase).join(', ')}`);
    }
    console.log('\nTop 3 Predictions:');
    detailed.allClassifications.forEach((pred, idx) => {
      console.log(`  ${idx + 1}. ${pred.label}: ${pred.confidence}%`);
    });
    
    // ========================================
    // TEST 3: Semantic Search
    // ========================================
    console.log('\n' + '='.repeat(80));
    console.log('🔎 TEST 3: Advanced Semantic Search');
    console.log('-'.repeat(80));
    
    const articles = await KnowledgeBase.find({ isPublished: true });
    console.log(`\nTotal KB Articles: ${articles.length}`);
    
    const searchQuery = 'laptop not booting';
    console.log(`\nSearch Query: "${searchQuery}"\n`);
    
    const searchResults = searchKnowledgeBase(searchQuery, articles);
    
    if (searchResults.length > 0) {
      console.log(`Found ${searchResults.length} relevant articles:\n`);
      searchResults.forEach((article, idx) => {
        console.log(`${idx + 1}. ${article.title}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Relevance: ${(article.relevance * 100).toFixed(1)}%`);
        if (article.matchDetails) {
          console.log(`   Match Details:`, article.matchDetails);
        }
        console.log();
      });
    } else {
      console.log('❌ No relevant articles found');
    }
    
    // ========================================
    // TEST 4: Edge Cases
    // ========================================
    console.log('='.repeat(80));
    console.log('⚠️  TEST 4: Edge Cases & Fallbacks');
    console.log('-'.repeat(80));
    
    const edgeCases = [
      { text: '', expected: 'Should fallback to Other' },
      { text: 'help', expected: 'Short query - low confidence' },
      { text: 'My computer is acting weird', expected: 'Vague query' },
      { text: 'urgent vpn issue critical', expected: 'Priority detection' }
    ];
    
    edgeCases.forEach(testCase => {
      const result = classifyTicket(testCase.text);
      console.log(`\nQuery: "${testCase.text}"`);
      console.log(`Expected: ${testCase.expected}`);
      console.log(`Result: ${result.category} (${result.confidence}%, Priority: ${result.priority})`);
      console.log(`Method: ${result.method}`);
    });
    
    // ========================================
    // TEST 5: Performance Benchmark
    // ========================================
    console.log('\n' + '='.repeat(80));
    console.log('⚡ TEST 5: Performance Benchmark');
    console.log('-'.repeat(80));
    
    const iterations = 100;
    
    // Classification speed
    const classifyStart = Date.now();
    for (let i = 0; i < iterations; i++) {
      classifyTicket('VPN connection issue need help urgently');
    }
    const classifyTime = Date.now() - classifyStart;
    const classifyAvg = classifyTime / iterations;
    
    console.log(`\n🤖 Classification Performance:`);
    console.log(`   Total: ${classifyTime}ms for ${iterations} iterations`);
    console.log(`   Average: ${classifyAvg.toFixed(2)}ms per classification`);
    console.log(`   Throughput: ${Math.round(1000 / classifyAvg)} classifications/sec`);
    
    // Search speed
    const searchStart = Date.now();
    for (let i = 0; i < 10; i++) {
      searchKnowledgeBase('laptop problem', articles);
    }
    const searchTime = Date.now() - searchStart;
    const searchAvg = searchTime / 10;
    
    console.log(`\n🔎 Search Performance:`);
    console.log(`   Total: ${searchTime}ms for 10 iterations`);
    console.log(`   Average: ${searchAvg.toFixed(2)}ms per search`);
    console.log(`   Throughput: ${Math.round(1000 / searchAvg)} searches/sec`);
    
    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(80));
    console.log('✅ TEST SUMMARY');
    console.log('='.repeat(80));
    
    const highConfidence = results.filter(r => r.confidence >= 70).length;
    const mediumConfidence = results.filter(r => r.confidence >= 50 && r.confidence < 70).length;
    const lowConfidence = results.filter(r => r.confidence < 50).length;
    
    console.log(`\n📊 Classification Distribution:`);
    console.log(`   High Confidence (≥70%): ${highConfidence}/${results.length}`);
    console.log(`   Medium Confidence (50-69%): ${mediumConfidence}/${results.length}`);
    console.log(`   Low Confidence (<50%): ${lowConfidence}/${results.length}`);
    
    console.log(`\n⚡ Performance:`);
    console.log(`   Classification: ${classifyAvg < 20 ? '✅' : '⚠️'} ${classifyAvg.toFixed(2)}ms (target: <20ms)`);
    console.log(`   Search: ${searchAvg < 100 ? '✅' : '⚠️'} ${searchAvg.toFixed(2)}ms (target: <100ms)`);
    
    const otherCount = results.filter(r => r.category === 'Other').length;
    const status = avgConfidence >= 70 && otherCount <= 2 ? '✅ EXCELLENT' :
                   avgConfidence >= 60 && otherCount <= 4 ? '✅ GOOD' :
                   avgConfidence >= 50 ? '⚠️ ACCEPTABLE' : '❌ NEEDS IMPROVEMENT';
    console.log(`\n🎯 Overall Status: ${status}`);
    console.log(`   Avg Confidence: ${avgConfidence.toFixed(1)}% | Fallback to Other: ${otherCount}/${results.length}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('🎉 All tests completed!\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

runTests();

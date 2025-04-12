const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Script to explore the Boston Ballet website structure
 */
const exploreBostonWebsite = async () => {
  console.log('Exploring Boston Ballet website...');
  
  try {
    // Fetch the performances page
    const response = await axios.get('https://www.bostonballet.org/home/tickets-performances/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Save the HTML to a file for inspection
    const outputPath = path.join(__dirname, 'boston-website-full.html');
    fs.writeFileSync(outputPath, response.data);
    console.log(`Saved full HTML to ${outputPath}`);
    
    // Extract and log all div classes to help identify performance containers
    const classRegex = /class="([^"]+)"/g;
    const classes = new Set();
    let match;
    
    while ((match = classRegex.exec(response.data)) !== null) {
      match[1].split(' ').forEach(cls => {
        if (cls.includes('performance') || cls.includes('event') || cls.includes('production') || cls.includes('show') || cls.includes('card')) {
          classes.add(cls);
        }
      });
    }
    
    console.log('Potential performance-related classes:');
    console.log(Array.from(classes).sort().join('\n'));
    
    // Look for specific performance-related sections
    const performanceRegex = /<div[^>]*class="[^"]*(?:performance|event|production|show|card)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    const performanceSections = [];
    let sectionMatch;
    
    while ((sectionMatch = performanceRegex.exec(response.data)) !== null) {
      if (sectionMatch[0].length < 5000) { // Avoid huge sections
        performanceSections.push(sectionMatch[0]);
      }
    }
    
    console.log(`\nFound ${performanceSections.length} potential performance sections`);
    
    // Save a sample of performance sections to a file
    const sampleSections = performanceSections.slice(0, 3).join('\n\n' + '-'.repeat(80) + '\n\n');
    const samplePath = path.join(__dirname, 'boston-performance-samples.html');
    fs.writeFileSync(samplePath, sampleSections);
    console.log(`Saved sample performance sections to ${samplePath}`);
    
    // Check for alternative performance pages
    const seasonRegex = /href="([^"]*(?:season|performances|events|shows)[^"]*)"/gi;
    const seasonLinks = new Set();
    let linkMatch;
    
    while ((linkMatch = seasonRegex.exec(response.data)) !== null) {
      seasonLinks.add(linkMatch[1]);
    }
    
    console.log('\nPotential alternative performance pages:');
    console.log(Array.from(seasonLinks).join('\n'));
    
    console.log('\nExploration completed');
  } catch (error) {
    console.error('Exploration failed:', error);
  }
};

// Run the exploration
exploreBostonWebsite();

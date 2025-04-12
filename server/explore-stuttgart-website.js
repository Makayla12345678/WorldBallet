/**
 * Script to explore the Stuttgart Ballet website structure
 * This will help identify the correct CSS selectors for scraping
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// URL to explore
const url = 'https://www.stuttgart-ballet.de/schedule/season-2024-25/';

// Main function to explore the website
const exploreWebsite = async () => {
  try {
    console.log(`Exploring Stuttgart Ballet website: ${url}`);
    
    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Page fetched successfully');
    
    // Load the HTML into cheerio
    const $ = cheerio.load(response.data);
    
    // Save the full HTML for reference
    fs.writeFileSync(
      path.join(__dirname, 'stuttgart-website-full.html'),
      response.data
    );
    console.log('Full HTML saved to stuttgart-website-full.html');
    
    // Extract and log the page structure
    console.log('\n=== PAGE STRUCTURE ===\n');
    
    // Look for potential performance containers
    console.log('\n=== POTENTIAL PERFORMANCE CONTAINERS ===\n');
    
    // Try various selectors that might contain performances
    const selectors = [
      '.event-item',
      '.performance-item',
      '.production-item',
      '.schedule-item',
      'article',
      '.event',
      '.performance',
      '.production',
      '.schedule-entry',
      '.content-item',
      '.item',
      '.event-list-item',
      '.event-list > *',
      '.performance-list > *',
      '.schedule-list > *',
      '.content-list > *',
      '.list > *',
      '.events > *',
      '.performances > *',
      '.schedule > *',
      '.content > *'
    ];
    
    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`\nSelector "${selector}": ${elements.length} elements found`);
      
      if (elements.length > 0) {
        console.log(`First element HTML structure:`);
        console.log(elements.first().html()?.substring(0, 500) + '...');
        
        // Try to extract title
        const titleSelectors = ['.title', 'h1', 'h2', 'h3', 'h4', '.event-title', '.performance-title'];
        for (const titleSelector of titleSelectors) {
          const title = elements.first().find(titleSelector).first().text().trim();
          if (title) {
            console.log(`Title found with selector "${titleSelector}": "${title}"`);
          }
        }
        
        // Try to extract date
        const dateSelectors = ['.date', '.event-date', '.performance-date', 'time', '.datetime', '.when'];
        for (const dateSelector of dateSelectors) {
          const date = elements.first().find(dateSelector).first().text().trim();
          if (date) {
            console.log(`Date found with selector "${dateSelector}": "${date}"`);
          }
        }
      }
    }
    
    // Look for the main content area
    console.log('\n=== MAIN CONTENT AREA ===\n');
    const mainContentSelectors = [
      'main',
      '#main',
      '.main',
      '.main-content',
      '.content',
      '#content',
      '.page-content',
      '#page-content'
    ];
    
    for (const selector of mainContentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        console.log(`Main content found with selector "${selector}"`);
        
        // Look for child elements that might be performance items
        const children = element.children();
        console.log(`Main content has ${children.length} direct children`);
        
        // Log the classes of the first few children
        for (let i = 0; i < Math.min(5, children.length); i++) {
          const child = children.eq(i);
          console.log(`Child ${i+1} tag: ${child.prop('tagName')}, class: ${child.attr('class')}`);
        }
      }
    }
    
    // Look for lists that might contain performances
    console.log('\n=== POTENTIAL PERFORMANCE LISTS ===\n');
    const listSelectors = ['ul', 'ol', '.list', '.grid', '.items', '.events', '.performances'];
    
    for (const selector of listSelectors) {
      const lists = $(selector);
      console.log(`Selector "${selector}": ${lists.length} elements found`);
      
      if (lists.length > 0) {
        // Check the first list
        const firstList = lists.first();
        const items = firstList.children();
        console.log(`First ${selector} has ${items.length} children`);
        
        if (items.length > 0) {
          console.log(`First child class: ${items.first().attr('class')}`);
          console.log(`First child tag: ${items.first().prop('tagName')}`);
        }
      }
    }
    
    // Extract all unique class names from the page
    console.log('\n=== ALL UNIQUE CLASS NAMES ===\n');
    const classes = new Set();
    $('[class]').each((i, el) => {
      const classNames = $(el).attr('class').split(/\s+/);
      classNames.forEach(className => classes.add(className));
    });
    
    console.log(`Found ${classes.size} unique class names`);
    console.log(Array.from(classes).sort().join('\n'));
    
    console.log('\nExploration completed successfully');
  } catch (error) {
    console.error('Error exploring website:', error);
  }
};

// Run the exploration
exploreWebsite();

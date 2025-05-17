const axios = require('axios');
const fs = require('fs').promises;

const url = 'https://www.roh.org.uk/tickets-and-events?event-type=ballet-and-dance&venue=main-stage';

async function checkWebsite() {
  try {
    console.log(`Attempting to fetch: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('Request successful. Status:', response.status);
    console.log('Content Type:', response.headers['content-type']);

    // Save the HTML content to a file
    await fs.writeFile('rb-website-content.html', response.data);
    console.log('HTML content saved to rb-website-content.html');

    // Log the first 500 characters of the response
    console.log('First 500 characters of the response:');
    console.log(response.data.substring(0, 500));

  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

checkWebsite();

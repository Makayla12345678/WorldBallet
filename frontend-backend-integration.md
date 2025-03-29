# Frontend-Backend Integration Guide for World Ballets

This guide will walk you through integrating the World Ballets frontend with the backend API. This involves replacing the current client-side scraping approach with API calls to the backend server.

## Prerequisites

Before starting, ensure you have:
- Completed the MongoDB Atlas setup (see mongodb-atlas-setup.md)
- Deployed the backend server (see backend-deployment.md)
- Verified that the server is running and API endpoints are working

## Step 1: Replace the Data Service

The key change is to replace the current `data-service.js` file (which uses client-side scraping) with the `frontend-integration.js` version (which uses the backend API).

1. Make a backup of the current data-service.js file (optional):

```bash
cp js/data-service.js js/data-service.js.backup
```

2. Copy the content from server/frontend-integration.js to js/data-service.js:

```bash
cp server/frontend-integration.js js/data-service.js
```

3. Verify that the API_BASE_URL in the new data-service.js file is correct:
   - It should be set to `http://localhost:5000/api` for local development
   - Update this URL if your server is running on a different host or port

## Step 2: Add Error Handling with Mock Data Fallback (Optional)

For better reliability, you might want to add fallback to mock data when the API is unavailable. This step is optional but recommended for development and testing.

1. Create a mock-data.js file in the js directory:

```bash
touch js/mock-data.js
```

2. Extract the mock data from the original data-service.js.backup file and place it in mock-data.js:

```javascript
// js/mock-data.js
const MockData = (() => {
    const data = {
        companies: {
            // Copy company data from original data-service.js
        },
        performances: {
            // Copy performance data from original data-service.js
        }
    };
    
    return {
        getCompanyInfo: (companyId) => data.companies[companyId] || null,
        getCompanyPerformances: (companyId) => data.performances[companyId] || [],
        getAllCompanies: () => Object.values(data.companies),
        getAllPerformances: () => {
            const allPerformances = [];
            Object.keys(data.performances).forEach(companyId => {
                data.performances[companyId].forEach(performance => {
                    allPerformances.push({
                        ...performance,
                        companyName: data.companies[companyId].name,
                        companyShortName: data.companies[companyId].shortName
                    });
                });
            });
            return allPerformances;
        }
    };
})();
```

3. Update data-service.js to use the mock data as fallback:

```javascript
// In data-service.js, modify the catch blocks to use MockData
const getCompanyInfo = async (companyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch company info: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching company ${companyId}:`, error);
        console.warn('Falling back to mock data');
        return MockData.getCompanyInfo(companyId);
    }
};

// Similarly update other methods
```

4. Add a script tag for mock-data.js in index.html and company pages:

```html
<script src="js/mock-data.js"></script>
```

## Step 3: Test the Integration

1. Ensure the backend server is running:

```bash
cd server
npm run dev
```

2. Open the World Ballets website in a browser:
   - If using a local file, simply open index.html in your browser
   - If using a local server, navigate to the appropriate URL

3. Test the following functionality:
   - Homepage loads with featured performances
   - Company pages display correct information
   - Performance listings appear correctly
   - Timeline shows upcoming performances

4. Check the browser console for any errors or warnings

## Step 4: Verify API Usage

To confirm that the frontend is using the API instead of client-side scraping:

1. Open your browser's developer tools (F12 or right-click > Inspect)
2. Go to the Network tab
3. Reload the page
4. Look for requests to the API endpoints:
   - `/api/companies`
   - `/api/performances/current`
   - etc.

These requests should return JSON data from your backend server.

## Troubleshooting

### CORS Issues

If you see CORS errors in the console:

1. Verify that the backend server has CORS enabled (it should by default)
2. Check that the API_BASE_URL in data-service.js matches your server's address exactly

### API Endpoint Errors

If API requests are failing:

1. Check that the server is running
2. Verify the API endpoints directly in your browser or with curl:
   ```bash
   curl http://localhost:5000/api/companies
   ```
3. Check the server console for any error messages

### Mock Data Fallback Not Working

If the fallback to mock data isn't working:

1. Ensure mock-data.js is properly included in your HTML files
2. Check that the mock data object structure matches what the application expects
3. Verify that the error handling in data-service.js correctly calls the MockData methods

## Next Steps

After successfully integrating the frontend with the backend:

1. Add support for more ballet companies by implementing additional scrapers on the backend
2. Enhance the frontend with loading states and better error handling
3. Consider adding caching to improve performance

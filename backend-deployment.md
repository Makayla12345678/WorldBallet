# Backend Server Deployment Guide for World Ballets

This guide will walk you through deploying the World Ballets backend server for development purposes.

## Prerequisites

Before starting, ensure you have:
- Node.js installed (v14 or higher)
- npm installed (v6 or higher)
- MongoDB Atlas account set up (see mongodb-atlas-setup.md)
- Updated the MongoDB connection string in server/.env

## Step 1: Install Dependencies

1. Open a terminal and navigate to the server directory:

```bash
cd server
```

2. Install all required dependencies:

```bash
npm install
```

This will install all the dependencies listed in package.json:
- express: Web server framework
- mongoose: MongoDB object modeling tool
- cheerio: HTML parsing library for web scraping
- axios: HTTP client for making requests
- node-cron: Task scheduler for automated scraping
- dotenv: Environment variable management
- cors: Cross-Origin Resource Sharing middleware
- nodemon (dev dependency): Utility for auto-restarting the server during development

## Step 2: Start the Server in Development Mode

1. After installing dependencies, start the server in development mode:

```bash
npm run dev
```

This will start the server using nodemon, which automatically restarts the server when you make changes to the code.

2. You should see output similar to:

```
> world-ballets-server@1.0.0 dev
> nodemon server.js

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server running on port 5000
Connected to MongoDB
```

## Step 3: Verify API Endpoints

Once the server is running, you can verify that the API endpoints are working correctly:

1. Open a web browser and navigate to:
   - http://localhost:5000/api/companies (should return a list of companies)
   - http://localhost:5000/api/performances/current (should return current performances)

2. Alternatively, you can use tools like curl or Postman to test the endpoints:

```bash
curl http://localhost:5000/api/companies
```

## Step 4: Run a Manual Scrape (Optional)

If you want to manually trigger the scraping process to populate your database:

1. Open a new terminal window (keep the server running in the first terminal)
2. Navigate to the server directory:

```bash
cd server
```

3. Run the scrape script:

```bash
npm run scrape
```

This will execute the scraping process for all configured ballet companies and store the data in your MongoDB database.

## Troubleshooting

### Connection Issues

If the server fails to connect to MongoDB:
1. Check that your MongoDB Atlas cluster is running
2. Verify the connection string in server/.env is correct
3. Ensure your IP address is whitelisted in MongoDB Atlas Network Access

### Scraping Issues

If the scrapers fail to retrieve data:
1. Check the console for specific error messages
2. Verify that the ballet company websites are accessible
3. The scrapers may need updates if the ballet company websites have changed their structure

### Port Conflicts

If port 5000 is already in use:
1. You can change the port in server/.env
2. Restart the server after changing the port

## Next Steps

After successfully deploying the backend server, you can:
1. Integrate the frontend with the backend API
2. Add support for more ballet companies
3. Enhance the API with additional endpoints as needed

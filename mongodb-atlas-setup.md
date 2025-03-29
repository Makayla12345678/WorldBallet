# MongoDB Atlas Setup Guide for World Ballets

This guide will walk you through setting up a MongoDB Atlas account, creating a cluster, and configuring it for use with the World Ballets project.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas registration page](https://www.mongodb.com/cloud/atlas/register)
2. You can sign up with Google or fill out the registration form with:
   - First Name
   - Last Name
   - Email Address
   - Password
3. Accept the terms of service and privacy policy
4. Click "Create your Atlas account"
5. Complete the "Tell us a few things about yourself" form:
   - Select your role (e.g., "Developer")
   - Select your project goals (e.g., "Learning MongoDB")
   - Select your preferred programming language (JavaScript/Node.js)
6. Click "Finish"

## Step 2: Create a New Project

1. After registration, you'll be prompted to name your organization and project
2. For Organization Name, enter "World Ballets Organization"
3. For Project Name, enter "World Ballets"
4. Click "Create"

## Step 3: Create a Free Tier Cluster

1. On the "Deploy a cloud database" page, select "FREE" under the Shared option
2. Choose a cloud provider (AWS, Google Cloud, or Azure) - any will work for our purposes
3. Select a region closest to you for better performance
4. Leave the default cluster tier (M0 Sandbox)
5. Name your cluster "WorldBallet"
6. Click "Create Cluster"

## Step 4: Create a Database User

1. While your cluster is being created, click on "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" for Authentication Method
4. Enter a username (e.g., "world-ballets-admin")
5. Either:
   - Enter a secure password, or
   - Click "Autogenerate Secure Password" and save the generated password
6. Under "Database User Privileges", select "Atlas admin"
7. Click "Add User"

## Step 5: Configure Network Access

1. Click on "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development purposes, you can click "Allow Access from Anywhere" (not recommended for production)
   - Alternatively, add your specific IP address
4. Click "Confirm"

## Step 6: Get Your Connection String

1. Return to the "Database Deployments" page by clicking "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Ensure "Node.js" is selected as the driver and the latest version is selected
5. Copy the connection string provided
6. Replace `<password>` with your database user's password
7. Replace `<dbname>` with "world-ballets"

Your connection string should look something like:
```
mongodb+srv://Makayla12345678:yourpassword@worldballet.momckzt.mongodb.net/world-ballets?retryWrites=true&w=majority
```

## Step 7: Update Your .env File

1. Open the `server/.env` file in your World Ballets project
2. Replace the placeholder MongoDB URI with your actual connection string:

```
MONGODB_URI=mongodb+srv://Makayla12345678:yourpassword@worldballet.momckzt.mongodb.net/world-ballets?retryWrites=true&w=majority
```

3. Save the file

## Step 8: Test the Connection

After updating your .env file, you can test the connection by running the server:

```bash
cd server
npm install
npm run dev
```

If everything is set up correctly, your server should connect to MongoDB Atlas without errors.

## Troubleshooting

- If you see connection errors, double-check your connection string and ensure you've replaced `<password>` with your actual password
- Verify that your IP address has been added to the Network Access list
- Ensure your database user has the correct permissions
- Check that your cluster has finished deploying (it may take a few minutes)

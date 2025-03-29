# Testing MongoDB Connection

I've created a script to test your MongoDB connection, but it appears that Node.js and npm are not installed on your system. Here's how to test the connection:

## Prerequisites

1. **Install Node.js and npm**
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation with:
     ```bash
     node -v
     npm -v
     ```

## Testing the Connection

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Update the .env file with your password**
   - Open `server/.env`
   - Replace `<db_password>` with your actual password: `Kittycatlove3838@`

3. **Run the test script**
   ```bash
   cd server
   node test-db-connection.js
   ```

4. **Check the output**
   - If successful, you'll see: "✅ Successfully connected to MongoDB!"
   - If there's an error, the error message will be displayed

## What the Test Script Does

The test script (`server/test-db-connection.js`) performs the following:

1. Connects to your MongoDB Atlas cluster using the connection string in the .env file
2. Lists all collections in the database (if any)
3. Closes the connection

## Security Note

After testing, you may want to revert the .env file to use the placeholder instead of your actual password:

```
MONGODB_URI=mongodb+srv://Makayla12345678:<db_password>@worldballet.momckzt.mongodb.net/world-ballets?retryWrites=true&w=majority
```

## Next Steps After Successful Connection

Once you've confirmed the connection works:

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Begin frontend-backend integration**
   - Update data-service.js to use the API
   - Test the integration between frontend and backend

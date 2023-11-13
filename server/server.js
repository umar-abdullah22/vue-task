import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import shiftsRoutes from './routes/shiftsRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/api/shifts', shiftsRoutes);

app.use(errorHandler);

const port = 3000;

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

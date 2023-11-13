const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const shiftsRoutes = require('./routes/shiftsRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/api/shifts', shiftsRoutes);

app.use(errorHandler);
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

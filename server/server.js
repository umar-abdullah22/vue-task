const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Load data from data.json
const loadData = () => {
  try {
    //async would come handy in prodution and real world here sync would be better
    const data = fs.readFileSync('./data/data.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

//Api to get data
app.get('/api/data', (req, res) => {
  try {
    const data = loadData();
    res.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ message: 'Error loading data' });
  }
});

// API to update data
app.post('/api/update-status', (req, res) => {
  try {
    const { ids, status } = req.body;
    const data = loadData();

    // Update status of shifts with matching IDs
    data.forEach((shift) => {
      if (ids.includes(shift.id)) {
        shift.status = status;
      }
    });
    const groupedShifts = data.reduce((acc, shift) => {
      const shiftDate = new Date(shift.startedAt);
      const monthYearKey = `${shiftDate.toLocaleString('default', {
        month: 'long',
      })} ${shiftDate.getFullYear()}`;

      if (!acc[monthYearKey]) {
        acc[monthYearKey] = [];
      }

      acc[monthYearKey].push(shift);
      return acc;
    }, {});
    res.json({
      message: 'Status updated successfully',
      updatedShiftData: groupedShifts,
    });
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ message: 'Error updating data' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

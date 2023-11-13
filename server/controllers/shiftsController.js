const data = require('../data/shifts.json');
const shiftsService = require('../services/shiftsService');

for (let i = 0; i < data.length; i++) {
  data[i].id = i + 1;
}
// Get all shifts
exports.getAllShifts = (req, res, next) => {
  try {
    return res.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    next(error);
  }
};

// Update shift status
exports.updateShiftStatus = (req, res, next) => {
  try {
    const { ids, status } = req.body;
    const updatedShifts = shiftsService.updateShiftStatus(data, ids, status);
    return res.json({
      message: 'Status updated successfully',
      updatedShiftData: updatedShifts,
    });
  } catch (error) {
    console.error('Error updating data:', error);
    next(error);
  }
};

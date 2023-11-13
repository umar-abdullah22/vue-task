import data from '../data/shifts.json' with {type:'json'};
import shiftsService from '../services/shiftsService.js';

// transform shifts
(() => {
  for (let i = 0; i < data.length; i++) {
    data[i].id = i + 1;
  }
})();

// Get all shifts
const getAllShifts = (req, res, next) => {
  try {
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

// Update shift status
const updateShiftStatus = (req, res, next) => {
  try {
    const { ids, status } = req.body;
    shiftsService.updateShiftStatus(data, ids, status);

    return res.json({ message: 'Status updated successfully' });
  } catch (error) {
    next(error);
  }
};

export { getAllShifts, updateShiftStatus };

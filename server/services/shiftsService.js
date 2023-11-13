// Update shift status
exports.updateShiftStatus = (data, ids, status) => {
  data.forEach((shift) => {
    if (ids.includes(shift.id)) {
      shift.status = status;
    }
  });
  return data;
};

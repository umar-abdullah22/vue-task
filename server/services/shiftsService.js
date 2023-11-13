// Update shift status
const updateShiftStatus = (shifts, ids, status) => {
  shifts.forEach((shift) => {
    if (ids.includes(shift.id)) {
      shift.status = status;
    }
  });

  return shifts;
};

export default { updateShiftStatus };

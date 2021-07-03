function formatDate(startDateInput, endDateInput) {
  // Check dates
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  today = new Date(`${yyyy}-${mm}-${dd}`);
  return [startDate, endDate, today];
}

module.exports = {
  formatDate,
};

/**
 * Checks if a restaurant is currently closed based on its status and opening/closing times.
 * @param {Object} restaurant - The restaurant object from the backend.
 * @returns {boolean} - True if the restaurant is closed, false otherwise.
 */
export const checkIsClosed = (restaurant) => {
  if (!restaurant) return true;
  
  // 1. Check operational status
  if (restaurant.status !== 'OPEN') return true;
  
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[now.getDay()];

  // 2. Check day-specific schedule if available
  if (restaurant.schedule && typeof restaurant.schedule === 'object') {
    const todaySchedule = restaurant.schedule[todayName];
    if (todaySchedule) {
      if (todaySchedule.closed) return true;
      if (todaySchedule.open && todaySchedule.close) {
        return isTimeClosed(todaySchedule.open, todaySchedule.close);
      }
    }
  }

  // 3. Fallback to global opening/closing times
  if (!restaurant.openingTime || !restaurant.closingTime) return false;
  return isTimeClosed(restaurant.openingTime, restaurant.closingTime);
};

/**
 * Helper to check if current time is outside the open-close range.
 */
const isTimeClosed = (openTime, closeTime) => {
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    
    const cleaned = timeStr.trim().toLowerCase();
    const isPM = cleaned.includes('pm');
    const isAM = cleaned.includes('am');
    
    const timeOnly = cleaned.replace(/[ap]m/g, '').trim();
    let [hours, minutes] = timeOnly.split(':');
    
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10) || 0;
    
    if (isNaN(hours)) return null;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  
  const openMins = parseTime(openTime);
  const closeMins = parseTime(closeTime);

  if (openMins === null || closeMins === null) return false;

  if (openMins <= closeMins) {
    return currentMins < openMins || currentMins > closeMins;
  } else {
    return currentMins > closeMins && currentMins < openMins;
  }
};

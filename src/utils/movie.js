export const convertToHourFormat = (timeInMinutes) => {
  if (timeInMinutes < 60) {
    return `${timeInMinutes}m`;
  }

  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes - (hours * 60);

  return `${hours}h ${minutes}m`;
};

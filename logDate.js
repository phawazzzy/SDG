const days = 'days';
const weeks = 'weeks';
const months = 'months';

const getLogDate = () => {
  const date = new Date();
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
};

module.exports = getLogDate
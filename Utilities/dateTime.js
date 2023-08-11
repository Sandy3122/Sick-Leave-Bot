//date and Time Function
function getCurrentDateTime() {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const formattedDate = `${date}-${month}-${year}`;
    return {
      date: formattedDate,
      time: hours
    };
  }
  
  module.exports = {
    getCurrentDateTime: getCurrentDateTime
  };
  
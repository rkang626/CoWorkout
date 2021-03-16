const extractTimeString = function(timestamp) {
  // expected timestamp format '2021-03-16T07:29:39.503Z'
  // output: 07:29
  const timeString = timestamp.toString();
  return timeString.substring(11,16);
};

const extractDayOfWeek = function(timestamp) {
  // expected timestamp format '2021-03-16T07:29:39.503Z'
  // output: 'WED'
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // check to see if timestamp is a string or a datetime object\
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return daysOfWeek[newDateObj.getDay()];
}

const changeToUserTZ = function(timestamp, userTZ) {
  // changeToUserTZ('2021-03-16T07:29:39.503Z', 'Asia/Singapore')
  // output: 2021-03-16, 12:29:39 a.m

  // check to see if timestamp is a string or a datetime object
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return newDateObj.toLocaleString({ timeZone: userTZ});
  // return newDateObj.toLocaleString('en-US', { timeZone: userTZ}); // can specify output format
};

// const replaceEmptySessions = function(allAppointments, bookedAppointments) {
//   for (const appointment in all)
// };

const generateTimeString = function(hour, minute) {
  // takes in ints and returns a time string in the "01:45" format
  let hourString = hour.toString();
  let minuteString = minute.toString();
  if (hourString.length !== 2) {
    hourString = "0" + hourString;
  }
  if (minuteString.length !== 2) {
    minuteString = "0" + minuteString;
  }
  return hourString + ':' + minuteString;
}

const getWeekDates = function(userTZ) {
  /*
    JS Date.getDay()
    MON: 0
    TUE: 1
    WED: 2
    THU: 3
    FRI: 4
    SAT: 5
    SUN: 6
  */

  const today = new Date();
  let daysFromMon = today.getDay();
  let daysFromSun = 6 - today.getDay();

  let daysBeforeToday = [];
  let daysAfterToday = [];

  // get dates before today up till monday
  while (daysFromMon > 0) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() - daysFromMon);
    daysBeforeToday.push(newDate);
    daysFromMon --;
  }

  // get dates after today up till sunday
  for (let dayAfter = 1; dayAfter <= daysFromSun; dayAfter++) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() + dayAfter);
    console.log('new date:', newDate);
    daysAfterToday.push(newDate);
  }

  // console.log([...daysBeforeToday, today, ...daysAfterToday]);
  return [...daysBeforeToday, today, ...daysAfterToday]
  
}();

const autoGenerateEmptyAppointments = function() {
  let emptyAppointments = {};
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  for (const day of weekDays) {
    emptyAppointments[day] = {};
    let hour = 0;
    let minute = 0;
    
    while (hour < 24) {
      let timeString = generateTimeString(hour, minute);
      emptyAppointments[day][timeString] = { 'status': 'empty' };
      minute += 15;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    };
  }
  return emptyAppointments;
}

const allAppointments = autoGenerateEmptyAppointments();

module.exports = {
  allAppointments,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ
}
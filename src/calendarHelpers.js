const formatTimeStamp = function(timestamp) {
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return newDateObj;
};

const extractDayOfWeek = function(timestamp) {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const targetDay = formatTimeStamp(timestamp);
  return daysOfWeek[targetDay.getDay()];
};

const changeToUserTZ = function(timestamp, userTZ) {
  // changeToUserTZ('2021-03-16T07:29:39.503Z', 'Asia/Singapore')
  const targetDatetime = formatTimeStamp(timestamp);
  const timeString = targetDatetime.toLocaleString('en-US',{ timeZone: userTZ}).toString();
  return new Date(timeString);
};

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
};

const extractTimeString = function(timestamp) {
  const targetTime = formatTimeStamp(timestamp);
  return generateTimeString(targetTime.getHours(), targetTime.getMinutes());
};

const getWeekDates = function(targetDate = new Date()) {
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

  const today = formatTimeStamp(targetDate);
  let daysFromMon = today.getDay();
  let daysFromSun = 6 - today.getDay();
  let daysBeforeToday = [];
  let daysAfterToday = [];

  // get dates before today up till monday
  while (daysFromMon > 0) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() - daysFromMon);
    daysBeforeToday.push(newDate.getDate());
    daysFromMon --;
  }

  // get dates after today up till sunday
  for (let dayAfter = 1; dayAfter <= daysFromSun; dayAfter++) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() + dayAfter);
    daysAfterToday.push(newDate.getDate());
  }

  return [...daysBeforeToday, today.getDate(), ...daysAfterToday]
};

const autoGenerateEmptyAppointments = function() {
  let emptyAppointments = {};
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  for (const day of weekDays) {
    emptyAppointments[day] = {};
    let hour = 0;
    let minute = 0;
    
    while (hour < 24) {
      let timeString = generateTimeString(hour, minute);
      emptyAppointments[day][timeString] = { 'state': 'empty' };
      minute += 15;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    };
  }
  return emptyAppointments;
};

const rebuildAppointmentObjs = function(emptyAppointments, allAppointments, userTZ) {
  // deep copy emptyAppointments
  let reconstructedAppointments = {...emptyAppointments};
  for (const appointment of allAppointments) {
    const startTimeUserTZ = changeToUserTZ(appointment.start_time, userTZ);
    const dayOfWeek = extractDayOfWeek(startTimeUserTZ);
    const startTimeString = extractTimeString(startTimeUserTZ);
    reconstructedAppointments[dayOfWeek][startTimeString] = {
        'id': null,
        'owner_name': null,
        'owner_pic': null,
        'day': dayOfWeek,
        'startTime': startTimeUserTZ,
        'activityType': null
    };
  }
  console.log(reconstructedAppointments);
  return reconstructedAppointments;
}


// replace with static var after finalizing formats
const allSlots = autoGenerateEmptyAppointments();

// // examples
// let today = new Date();
// console.log(extractDayOfWeek(today.toString()));
// console.log(extractTimeString("2021-03-29T01:07:04.353Z"));
// console.log(changeToUserTZ(today.toString(), 'Asia/Singapore'));
// console.log(getWeekDates("2021-03-29T19:07:04.353Z"));

const fakeSessions = [
  {
    id: 1,
    owner_name: 'Chuck Norris',
    owner_pic: 'avatar',
    start_time: '2021-03-15T01:00:00Z',
    activity_type: 'napping'
  },
  {
    id: 2,
    owner_name: 'Rick Astley',
    owner_pic: 'avatar',
    start_time: '2021-03-15T01:30:00Z',
    activity_type: 'napping'
  },
  {
    id: 3,
    owner_name: 'Bustin Jieber',
    owner_pic: 'avatar',
    start_time: '2021-03-15T02:00:00Z',
    activity_type: 'napping'
  },
];

rebuildAppointmentObjs(allSlots, fakeSessions, 'Asia/Singapore');


module.exports = {
  allSlots,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ,
  getWeekDates
}

/* example allSlots
const allSlots = {
  MON: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  TUE: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': {
      id: null,
      owner_name: null,
      owner_pic: null,
      day: 'TUE',
      startTime: 2021-03-15T16:00:00.000Z,
      activityType: null
    },
    '09:15': { state: 'empty' },
    '09:30': {
      id: null,
      owner_name: null,
      owner_pic: null,
      day: 'TUE',
      startTime: 2021-03-15T16:30:00.000Z,
      activityType: null
    },
    '09:45': { state: 'empty' },
    '10:00': {
      id: null,
      owner_name: null,
      owner_pic: null,
      day: 'TUE',
      startTime: 2021-03-15T17:00:00.000Z,
      activityType: null
    },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  WED: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  THU: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  FRI: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  SAT: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  SUN: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  }
}
*/
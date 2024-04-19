import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

const formatMap = {
  lessThanWeek: 'dddd, hh:mma',
  today: '[Today,] LT',
  greaterThanWeek: 'MMMM DD, hh:mma'
}

export const relativeDate = (date) => {
    const now = dayjs.extend(localizedFormat)();
    const diffInDays = now.diff(date, 'day');
    const diffInMinute = now.diff(date, 'minute');    

    let format = formatMap.greaterThanWeek;
    if (diffInMinute < 60) {
      format = `[${diffInMinute} min. ago]`;
    } else if (diffInDays === 0) {      
      format = formatMap.today;
    } else if (diffInDays < 7) {
      format = formatMap.lessThanWeek;
    } else {
      format = formatMap.greaterThanWeek;
    }
    return dayjs(date).format(format);
  };

export const convoDate = (date) => {
    const now = dayjs.extend(localizedFormat)();
    const diffInDays = now.diff(date, 'day');

    if (diffInDays === 0) {
      // Date is from today, display time only
      return dayjs(date).format('LT');
    } else if (diffInDays < 7) {
      // Date is from the past 7 days, display day of the week and time
      return  dayjs(date).format('ddd MMMM DD, hh:mma');
    } else {
      // Date is more than 7 days ago, display full date and time
      return  dayjs(date).format('MMMM DD, hh:mma');
    }
};
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
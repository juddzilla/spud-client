import moment from 'moment';

export const relativeDate = (date) => {
    const now = moment();
    const diffInDays = now.diff(date, 'days');

    if (diffInDays === 0) {
      // Date is from today, display time only
      return moment(date).format('[Today,] LT');
    } else if (diffInDays < 7) {
      // Date is from the past 7 days, display day of the week and time
      return  moment(date).format('dddd, hh:mma');
    } else {
      // Date is more than 7 days ago, display full date and time
      return  moment(date).format('MMMM DD, hh:mma');
    }
  };
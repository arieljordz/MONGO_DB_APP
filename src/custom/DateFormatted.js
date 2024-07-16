import React from 'react';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const DateFormatted = ({ dateString }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const utcDate = new Date(dateString);
    const zonedDate = toZonedTime(utcDate, 'UTC');
    return formatInTimeZone(zonedDate, 'UTC', 'MM-dd-yyyy');
  };

  return (
    <span>
      {formatDate(dateString)}
    </span>
  );
};

export default DateFormatted;

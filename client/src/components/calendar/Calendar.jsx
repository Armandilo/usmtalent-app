import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import Badge from '@mui/material/Badge';
import newRequest from '../../utils/newRequest';
import { useParams } from 'react-router-dom';
import './Calendar.css'

const Calendar = ({onDateSelect}) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchDatesBooked = async () => {
    setIsLoading(true);
    try {
      const res = await newRequest.get(`/users/${id}`);
      const formattedDates = res.data.datesBooked.map((date) => dayjs(date).format('YYYY-MM-DD'));
      setHighlightedDays(formattedDates);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatesBooked();
  }, [id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date); // Pass the selected date to the parent component
  };

  const initialValue = dayjs();

  function ServerDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const isSelected = !outsideCurrentMonth && highlightedDays.indexOf(day.format('YYYY-MM-DD')) >= 0;

    
    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '❌' : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }

  const handleMonthChange = (date) => {
    setIsLoading(true);
    setHighlightedDays([]);
    fetchDatesBooked(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        value={selectedDate}
        onChange={handleDateChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
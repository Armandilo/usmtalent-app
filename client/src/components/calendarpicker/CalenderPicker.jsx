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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment';
const CalenderPicker = ({onDateSelect}) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);



  const fetchDatesBooked = async () => {
    setIsLoading(true);
    try {

      // Fetch the skill document using the skillId
      const skillRes = await newRequest.get(`/skills/single/${id}`);
      const userId = skillRes.data.userId;      
      const res = await newRequest.get(`/users/${userId}`);
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
    const formattedDay = day.format('YYYY-MM-DD');
    const isSelected = !outsideCurrentMonth && highlightedDays.includes(formattedDay);

    
    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '❌' : undefined}
      >
        <PickersDay {...other} day={day} />
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

    <DemoContainer components={['DatePicker', 'DatePicker']}>
      <DatePicker
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        value={selectedDate}
        onChange={handleDateChange}
        renderLoading={() => <DayCalendarSkeleton />}
        shouldDisableDate={(date) => {
            // Convert the date to 'YYYY-MM-DD' format
            const formattedDate = date.format('YYYY-MM-DD');
            // Check if the date is in highlightedDays
            return highlightedDays.includes(formattedDate);
          }}
          renderDay={(day, _value, DayComponentProps) => (
            <ServerDay {...DayComponentProps} day={day} />
        )}
      />
      </DemoContainer>


    </LocalizationProvider>
  );
};

export default CalenderPicker;
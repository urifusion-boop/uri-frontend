import { Box, MenuItem, Select, Typography, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import { isPast } from 'date-fns';
import moment from 'moment';
import { useState } from 'react';
import { Calendar, Event, SlotInfo, ToolbarProps, View, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const localizer = momentLocalizer(moment);

interface MyCalendarProps {
  events?: Event[];
  onSelectSlot?: (slotInfo: SlotInfo) => void;
  onSelectEvent?: (event: Event) => void;
}

const MyCalendar = ({ events, onSelectSlot, onSelectEvent }: MyCalendarProps) => {
  const today = new Date();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      sx={{
        overflow: 'auto',
      }}
    >
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: isMobile ? 800 : 'calc(100vh - 190px)',
          maxHeight: 1500,
          minWidth: 800,
          minHeight: 800,
        }}
        components={{
          toolbar: CustomToolbar,
        }}
        min={today}
        dayPropGetter={(date) => ({
          className: isPast(date) ? 'past-date' : '',
        })}
        onSelectSlot={onSelectSlot}
        onSelectEvent={(events) => {
          onSelectEvent && onSelectEvent(events);
        }}
      />
    </Box>
  );
};

export default MyCalendar;

const CustomToolbar = ({ onNavigate, label, onView }: ToolbarProps) => {
  const [currentView, setCurrentView] = useState<View>('month');
  const [postType] = useState('all-post');

  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToToday = () => {
    onNavigate('TODAY');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    onView(view);
  };

  return (
    <div style={{ display: 'flex', paddingInline: 4, paddingBottom: 12 }}>
      <div className="flex-1 flex items-center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mr: 2,
          }}
        >
          <div onClick={goToBack} style={{ marginRight: 6, cursor: 'pointer' }}>
            <IoChevronBack />
          </div>
          <div style={{ cursor: 'pointer' }} onClick={goToNext}>
            <IoChevronForward />
          </div>
          <Typography fontWeight={550}> {label}</Typography>
        </Box>
        <Button onClick={goToToday} className="border ml-4">
          Today
        </Button>
        <Select size="small" value={currentView} onChange={(e) => handleViewChange(e.target.value as View)} sx={{ minWidth: 100, marginLeft: 2 }}>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
        </Select>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <Select size="small" value={postType} sx={{ minWidth: 100, marginLeft: 2, border: 0 }}>
            <MenuItem value="all-post">All Post</MenuItem>
            <MenuItem value="monthly-post">Monthly Post</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

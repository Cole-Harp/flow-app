import React, { useState } from "react";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enGB from "date-fns/locale/id";

const locales = {
  id: enGB
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "My event",
      allDay: false,
      start: new Date("2021-02-21T14:08:22.000000Z"),
      end: new Date(2021, 2, 28)
    }
  ]);

  const handleAddEvent = () => {
    const newEvent = {
      id: 2,
      title: "New Event",
      allDay: false,
      start: new Date(),
      end: new Date()
    };

    setEvents([...events, newEvent]);
  };

  return (
    <div className="App">
      <h1>Welcome to React Big Calendar Example</h1>
      <button onClick={handleAddEvent}>Add Event</button>
      <Calendar
        localizer={localizer}
        events={events}
        style={{ height: 500 }}
      />
    </div>
  );
};

export default MyCalendar;
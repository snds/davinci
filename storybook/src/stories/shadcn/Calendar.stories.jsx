import React, { useState } from 'react';
import { Calendar } from '@davinci/ui/components/ui/calendar';

export default {
  title: 'Components/Calendar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export const Default = {
  render: () => {
    const [date, setDate] = useState(new Date());

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <p className="text-sm text-muted-foreground">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

export const RangeSelection = {
  render: () => {
    const [range, setRange] = useState({ from: undefined, to: undefined });

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          className="rounded-md border"
          numberOfMonths={2}
        />
        <p className="text-sm text-muted-foreground">
          {range?.from
            ? range.to
              ? `${range.from.toLocaleDateString()} — ${range.to.toLocaleDateString()}`
              : `From: ${range.from.toLocaleDateString()}`
            : 'Pick a date range'}
        </p>
      </div>
    );
  },
};

export const Multiple = {
  render: () => {
    const [dates, setDates] = useState([]);

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
        />
        <p className="text-sm text-muted-foreground">
          {dates.length > 0
            ? `${dates.length} date(s) selected`
            : 'Click dates to select multiple'}
        </p>
      </div>
    );
  },
};

export const Disabled = {
  render: () => {
    const [date, setDate] = useState(undefined);
    const today = new Date();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(day) => day < today}
        className="rounded-md border"
        initialFocus
      />
    );
  },
};

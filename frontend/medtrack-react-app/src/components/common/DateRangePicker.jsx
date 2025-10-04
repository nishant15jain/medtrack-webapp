import { useState } from 'react';
import './DateRangePicker.css';

const DateRangePicker = ({ onApply, onClear }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="date-range-picker">
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="startDate" className="date-label">From:</label>
          <input
            type="date"
            id="startDate"
            className="date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="endDate" className="date-label">To:</label>
          <input
            type="date"
            id="endDate"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </div>
      </div>
      <div className="date-actions">
        <button
          type="button"
          className="btn-date-apply"
          onClick={handleApply}
          disabled={!startDate || !endDate}
        >
          Apply
        </button>
        {(startDate || endDate) && (
          <button
            type="button"
            className="btn-date-clear"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;


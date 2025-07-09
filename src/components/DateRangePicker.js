import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateRangePicker({ fromDate, toDate, setFromDate, setToDate }) {
    return (
        <div className="row g-2 align-items-end mb-4">
            <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold">From:</label>
                <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    className="form-control w-100"
                    dateFormat="dd-MM-yyyy"
                    maxDate={toDate || new Date()}
                    placeholderText="Select start date"
                />
            </div>

            <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold">To:</label>
                <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    className="form-control w-100"
                    dateFormat="dd-MM-yyyy"
                    minDate={fromDate}
                    maxDate={new Date()}
                    placeholderText="Select end date"
                />
            </div>
        </div>
    );
}

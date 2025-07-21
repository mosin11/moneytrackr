import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateRangePicker({ fromDate, toDate, setFromDate, setToDate, onSearch, onClear }) {

   
    return (
        <div className="card p-3 shadow-sm mb-4 bg-light rounded">
            <div className="row g-2 align-items-end mb-4">
                <div className="col-12 col-sm-3">
                    <label className="form-label fw-semibold">From:</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        maxDate={toDate || new Date()}
                        placeholderText="Select start date"
                    />
                </div>

                <div className="col-12 col-sm-3">
                    <label className="form-label fw-semibold">To:</label>
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        minDate={fromDate}
                        maxDate={new Date()}
                        placeholderText="Select end date"
                    />
                </div>

                <div className="col-6 col-sm-3 d-flex gap-2">
                    <button
                        className="btn btn-primary w-100"
                        onClick={onSearch}
                        disabled={!fromDate || !toDate}
                    >
                        Search
                    </button>
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={onClear}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

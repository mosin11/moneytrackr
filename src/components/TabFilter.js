// components/TabFilter.js
import React from 'react';

export default function TabFilter({ activeTab, setActiveTab, darkMode }) {
    return (
        <div
            className={`btn-group w-100 mb-3 ${darkMode ? 'bg-dark' : 'bg-light'}`}
            role="group"
        >
            {['Daily', 'Weekly', 'Monthly', 'LastMonth', 'All'].map((label) => (
                <button
                    key={label}
                    className={`btn ${activeTab === label
                        ? 'btn-primary text-white'
                        : darkMode
                            ? 'btn-outline-primary text-white border-secondary'
                            : 'btn-outline-secondary text-dark'
                        }`}
                    onClick={() => setActiveTab(label)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

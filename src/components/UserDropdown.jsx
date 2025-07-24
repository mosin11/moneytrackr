import React, { useState, useRef, useEffect } from "react";

const UserDropdown = ({ userName, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-sm ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
      >
        👤 {userName}
      </button>

      {isOpen && (
        <ul
          className={`dropdown-menu show mt-2 shadow ${darkMode ? "bg-dark text-light" : "bg-white"}`}
          style={{ right: 0, left: "auto", position: "absolute" }}
        >
          <li className="dropdown-item-text px-3 py-2">
            Signed in as <strong>{userName}</strong>
          </li>
          <li>
            <hr className="dropdown-divider my-1" />
          </li>
          <li>
            <button
              className="dropdown-item text-danger px-3 py-2 w-100 text-start"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;

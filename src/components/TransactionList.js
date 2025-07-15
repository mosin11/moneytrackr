import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

function TransactionList({ transactions, darkMode, onEdit, onDelete }) {
  const handleEditClick = (txn) => onEdit(txn);
  const handleDeleteClick = (txn) => onDelete(txn.id);

  const baseStyle = {
    fontSize: "0.95rem",
    wordBreak: "break-word",
    minWidth: "100%",
    color: darkMode ? "#ffffff" : "#000000",
    backgroundColor: darkMode ? "#1f1f1f" : "#ffffff",
    borderColor: darkMode ? "#444" : "#dee2e6"
  };

  const theadStyle = {
    backgroundColor: darkMode ? "#2d2d2d" : "rgb(57 206 236)",
    color: darkMode ? "#ffffff" : "#000000",
    borderColor: darkMode ? "#555" : "#ced4da"
  };

  const tbodyStyle = {
    backgroundColor: darkMode ? "#1f1f1f" : "#ffffff",
    color: darkMode ? "#e0e0e0" : "#000000",
    borderColor: darkMode ? "#444" : "#dee2e6"
  };

  return (
    <div
      className="card shadow-sm p-3 mb-4"
      style={{
        minHeight: "200px",
        background: darkMode
          ? "linear-gradient(90deg, #1c1c1c, #2d2d2d)"
          : "linear-gradient(90deg, #f0f8ff, #e0eafc)",
        color: darkMode ? "#ffffff" : "#000000",
        borderRadius: "12px",
        border: "none"
      }}
    >
      {transactions.length === 0 ? (
        <p className={`text-center my-4 ${darkMode ? "text-light" : "text-muted"}`}>
          No transactions yet.
        </p>
      ) : (
        <div className="table-responsive">
          <table
            className="table text-center table-bordered table-sm align-middle mb-0"
            style={baseStyle}
          >
            <thead>
              <tr>
                <th style={{ ...theadStyle, width: "60px" }}>S. No.</th>
                <th style={theadStyle}>Date</th>
                <th style={theadStyle}>Description</th>
                <th style={theadStyle}>Type</th>
                <th style={theadStyle}>Amount</th>
                <th style={{ ...theadStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn.id}>
                  <td style={tbodyStyle}>{index + 1}</td>
                  <td style={tbodyStyle}>{txn.date}</td>
                  <td style={tbodyStyle}>{txn.desc || txn.description}</td>
                  <td
                    style={{
                      ...tbodyStyle,
                      color: ["cash_in", "in"].includes(txn.type)
                        ? "lightgreen"
                        : "tomato"
                    }}
                  >
                    {["cash_in", "in"].includes(txn.type) ? "Cash In" : "Cash Out"}
                  </td>
                  <td style={tbodyStyle}>₹{txn.amount}</td>
                  <td style={tbodyStyle}>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditClick(txn)}
                        title="Edit"
                      >
                        <FaRegEdit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(txn)}
                        title="Delete"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionList;

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

  const formatType = (type) =>
    ["cash_in", "in"].includes(type) ? "Cash In" : "Cash Out";

  return (
    <div
      className="card shadow-sm px-2 py-3 mb-3 mb-md-4"
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
        <>
          {/* Desktop Table */}
          <div className="table-responsive d-none d-md-block">
            <table
              className="table text-center table-bordered table-sm align-middle mb-0"
              style={{ ...baseStyle }}
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
                      {formatType(txn.type)}
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

          {/* Mobile Card View */}
          <div className="d-md-none" 
           style={{
    background: darkMode
      ? "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)" // dark full background
      : "linear-gradient(to bottom, #fbfdfdff, #e2d1c3)",          // light full background
    borderRadius: "12px"
  }}
          >
            {transactions.map((txn, index) => (
              <div
                key={txn.id}
                className={`card mb-3 shadow-sm ${darkMode ? "bg-dark text-light" : "text-dark"}`}
                style={{

                  background: darkMode
                    ? "linear-gradient(135deg, #2c3e50, #4ca1af)" // dark gradient
                    : "linear-gradient(135deg, #fdfcfb, #e2d1c3)", // light gradient
                  border: `1px solid ${darkMode ? "#444" : "#cfd9df"}`,
                  borderRadius: "12px"
                }}
              >
                <div className="card-body p-3">
                  {/* Header: Type + Amount */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className={`badge ${["cash_in", "in"].includes(txn.type) ? "bg-success" : "bg-danger"} text-white px-2 py-1`}
                    >
                      🔁 {["cash_in", "in"].includes(txn.type) ? "Cash In" : "Cash Out"}
                    </span>
                    <h6 className="mb-0 fw-bold">₹{txn.amount}</h6>
                  </div>

                  {/* Description */}
                  <div className="mb-1">
                    <span className="me-2">📝</span>
                    {txn.desc || txn.description}
                  </div>

                  {/* Date */}
                  <div className="text-muted small mb-3">
                    <span className="me-2">🕒</span>
                    {txn.date}
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(txn)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(txn.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>


            ))}
          </div>











        </>
      )}
    </div>
  );
}

export default TransactionList;

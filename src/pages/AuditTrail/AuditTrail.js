import { useEffect, useState } from "react";
import axios from "axios";
import "./AuditTrail.css";

function AuditTrail() {
  const [auditData, setAuditData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  // Store cursors so Previous can work
  const [cursorHistory, setCursorHistory] = useState([]);

  const LIMIT = 20;

  const fetchAuditTrail = async (cursor = null) => {
    try {
      setLoading(true);
      setError("");

      let url = `${process.env.REACT_APP_URL}/api/audit-trail?limit=${LIMIT}`;

      if (cursor) {
        url += `&createdAt=${encodeURIComponent(
          cursor.createdAt
        )}&id=${encodeURIComponent(cursor.id)}`;
      }

      const response = await axios.get(url, {
        withCredentials: true,
      });

      setAuditData(response.data.data);

      setHasNext(response.data.pagination.hasNext);

      setNextCursor(response.data.pagination.nextCursor);
    } catch (error) {
      console.error("Audit Trail Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load audit trail"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditTrail();
  }, []);

  const handleNext = () => {
    if (!nextCursor) return;

    // Save current cursor before moving forward
    setCursorHistory((previous) => [
      ...previous,
      nextCursor,
    ]);

    fetchAuditTrail(nextCursor);
  };

  const handlePrevious = () => {
    if (cursorHistory.length === 0) return;

    const history = [...cursorHistory];

    // Remove the cursor used for the current page
    history.pop();

    setCursorHistory(history);

    // If history is empty, go back to first page
    if (history.length === 0) {
      fetchAuditTrail();
      return;
    }

    // Otherwise use the previous cursor
    const previousCursor =
      history[history.length - 1];

    fetchAuditTrail(previousCursor);
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "-";

    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(
      2,
      "0"
    );
    const year = value.getFullYear();

    let hours = value.getHours();

    const minutes = String(value.getMinutes()).padStart(
      2,
      "0"
    );

    const seconds = String(value.getSeconds()).padStart(
      2,
      "0"
    );

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${String(hours).padStart(
      2,
      "0"
    )}:${minutes}:${seconds} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="audit-loading">
        Loading Audit Trail...
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-error">
        {error}
      </div>
    );
  }

  return (
    <div className="audit-container">

      <h2>Audit Trail</h2>

      {auditData.length === 0 ? (
        <p className="audit-empty">
          No audit records found.
        </p>
      ) : (
        <>
          <div className="audit-table-container">

            <table className="audit-table">

              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>IP Address</th>
                </tr>
              </thead>

              <tbody>
                {auditData.map((audit) => (
                  <tr key={audit._id}>

                    <td>
                      {formatDateTime(
                        audit.createdAt
                      )}
                    </td>

                    <td>
                      {audit.userName}
                    </td>

                    <td>
                      {audit.userEmail}
                    </td>

                    <td>
                      {audit.action}
                    </td>

                    <td>
                      {audit.module}
                    </td>

                    <td>
                      {audit.ipAddress || "-"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          <div className="audit-pagination">

            <button
              type="button"
              onClick={handlePrevious}
              disabled={cursorHistory.length === 0}
            >
              ← Previous
            </button>

            <span>
              Showing {auditData.length} records
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={!hasNext}
            >
              Next →
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default AuditTrail;
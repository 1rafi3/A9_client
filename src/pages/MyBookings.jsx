import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import SafeImage from "../components/SafeImage";
import { getImageSrc } from "../lib/get-image-src";
import toast from "react-hot-toast";
import { Calendar, Clock, Trash2, ShieldX } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        const res = await fetch("/api/bookings/my-bookings", {
          credentials: "include",
        });

        if (res.ok && !ignore) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCancel = async (bookingId) => {
    if (confirmCancelId !== bookingId) {
      // First click: prompt confirmation
      setConfirmCancelId(bookingId);
      // Auto reset after 3 seconds
      setTimeout(() => {
        setConfirmCancelId((prev) => (prev === bookingId ? null : prev));
      }, 3000);
      return;
    }

    // Second click: proceed with cancellation
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking cancelled successfully!");
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setConfirmCancelId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bookings-page section">
      <div className="container">
        <h2 className="section-title">My Bookings</h2>
        <p className="section-subtitle">
          Manage and review your booked courts, turfs, and tracks.
        </p>

        {bookings.length === 0 ? (
          <div className="empty-state" style={{ background: "var(--surface)", padding: "60px", borderRadius: "var(--radius-lg)" }}>
            <Calendar size={48} style={{ color: "var(--primary)", marginBottom: "16px" }} />
            <h3>You don't have any bookings yet.</h3>
            <p style={{ marginTop: "8px", marginBottom: "24px" }}>Start exploring premium facilities and book your slots today!</p>
            <Link to="/facilities" className="btn btn-primary">
              Browse Facilities
            </Link>
          </div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Duration / Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="booking-facility-cell">
                        <SafeImage
                          src={getImageSrc(booking.facility)}
                          alt={booking.facility?.name}
                          className="booking-facility-img"
                        />
                        <div>
                          <p className="booking-facility-name">{booking.facility?.name || "Deleted Facility"}</p>
                          <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                            {booking.facility?.facility_type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} className="detail-icon" />
                        <span>{booking.booking_date}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={14} className="detail-icon" />
                        <span>{booking.time_slot}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: "600" }}>${booking.total_price}</p>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {booking.hours} {booking.hours === 1 ? "hour" : "hours"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`booking-status-badge ${booking.status}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className={`btn ${confirmCancelId === booking._id ? "btn-danger" : "btn-secondary"}`}
                        style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                      >
                        {confirmCancelId === booking._id ? (
                          <>
                            <ShieldX size={14} />
                            <span>Are you sure?</span>
                          </>
                        ) : (
                          <>
                            <Trash2 size={14} />
                            <span>Cancel</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

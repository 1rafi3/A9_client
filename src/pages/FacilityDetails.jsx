import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import SafeImage from "../components/SafeImage";
import { getImageSrc } from "../lib/get-image-src";
import toast from "react-hot-toast";
import { Calendar as CalendarIcon, Clock, MapPin, Users, DollarSign, Activity } from "lucide-react";

export default function FacilityDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [hours, setHours] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        const res = await fetch(`/api/facilities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFacility(data);
        } else {
          toast.error("Facility not found");
          navigate("/facilities");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Failed to load facility details");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [id, navigate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to book this facility");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a booking date");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          facility_id: id,
          booking_date: bookingDate,
          time_slot: selectedSlot,
          hours: hours,
          status: "pending"
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Facility booked successfully!");
        navigate("/my-bookings");
      } else {
        toast.error(data.message || "Failed to make a booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!facility) return null;

  const totalPrice = facility.price_per_hour * hours;

  // Get tomorrow's date for date picker minimum limit
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="facility-details-page section">
      <div className="container">
        <div className="details-layout">
          {/* Details Column */}
          <div className="details-info-col">
            <SafeImage
              src={getImageSrc(facility)}
              alt={facility.name}
              className="facility-hero-img"
            />
            
            <div className="facility-meta">
              <h1 className="facility-title">{facility.name}</h1>
              <span className="card-badge" style={{ position: "static", display: "inline-flex", width: "fit-content" }}>
                <Activity size={14} style={{ marginRight: "6px" }} />
                {facility.facility_type}
              </span>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-item-label">Location</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <MapPin size={18} className="detail-icon" />
                  <span className="info-item-value">{facility.location}</span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-item-label">Price / Hour</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <DollarSign size={18} className="detail-icon" />
                  <span className="info-item-value">${facility.price_per_hour}</span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-item-label">Max Capacity</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <Users size={18} className="detail-icon" />
                  <span className="info-item-value">{facility.capacity} Players</span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-item-label">Booking Count</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <Clock size={18} className="detail-icon" />
                  <span className="info-item-value">{facility.booking_count || 0} times booked</span>
                </div>
              </div>
            </div>

            <div className="slots-container">
              <h3>Available Time Slots</h3>
              <div className="slots-grid">
                {facility.available_slots.map((slot) => (
                  <span key={slot} className="slot-pill">
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div className="description-box">
              <h3>About this facility</h3>
              <p>{facility.description}</p>
            </div>
          </div>

          {/* Booking Widget Column */}
          <div className="details-booking-col">
            <div className="booking-card">
              <h3>Reserve Your Slot</h3>
              <form onSubmit={handleBookingSubmit} className="booking-form">
                
                {/* Date Picker */}
                <div className="booking-form-group">
                  <label htmlFor="bookingDate" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CalendarIcon size={16} />
                    <span>Booking Date</span>
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    className="form-input-control"
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                {/* Time Slot Picker */}
                <div className="booking-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={16} />
                    <span>Select Time Slot</span>
                  </label>
                  <div className="slot-selection-grid">
                    {facility.available_slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`slot-option-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hours Picker */}
                <div className="booking-form-group">
                  <label htmlFor="hours">Booking Duration (Hours)</label>
                  <select
                    id="hours"
                    className="select-control"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((h) => (
                      <option key={h} value={h}>
                        {h} {h === 1 ? "Hour" : "Hours"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Breakdown */}
                <div className="price-summary">
                  <div className="price-row">
                    <span>Hourly Rate</span>
                    <span>${facility.price_per_hour}</span>
                  </div>
                  <div className="price-row">
                    <span>Duration</span>
                    <span>{hours} hrs</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Cost</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary booking-submit-btn"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Reserving..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

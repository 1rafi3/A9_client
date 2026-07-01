import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import SafeImage from "../components/SafeImage";
import { getImageSrc } from "../lib/get-image-src";
import toast from "react-hot-toast";
import { Edit3, Trash2, ShieldX, MapPin, DollarSign, Activity } from "lucide-react";

const STANDARD_SLOTS = [
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00"
];

const SPORT_TYPES = [
  "Football Turf",
  "Badminton Court",
  "Swimming Lane",
  "Tennis Court",
  "Basketball Court"
];

export default function ManageMyFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  // Editing state
  const [editingFacility, setEditingFacility] = useState(null);
  const [name, setName] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [description, setDescription] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadFacilities = async () => {
      try {
        const res = await fetch("/api/facilities/my-facilities", {
          credentials: "include",
        });

        if (res.ok && !ignore) {
          const data = await res.json();
          setFacilities(data);
        }
      } catch (error) {
        console.error("Error fetching my facilities:", error);
        toast.error("Failed to load facilities");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadFacilities();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (facilityId) => {
    if (confirmDeleteId !== facilityId) {
      setConfirmDeleteId(facilityId);
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === facilityId ? null : prev));
      }, 3000);
      return;
    }

    try {
      const res = await fetch(`/api/facilities/${facilityId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Facility deleted successfully!");
        setFacilities((prev) => prev.filter((f) => f._id !== facilityId));
      } else {
        toast.error(data.message || "Failed to delete facility");
      }
    } catch (error) {
      console.error("Delete facility error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const startEdit = (facility) => {
    setEditingFacility(facility);
    setName(facility.name);
    setFacilityType(facility.facility_type);
    setImageUrl(facility.image_url);
    setLocation(facility.location);
    setPricePerHour(facility.price_per_hour);
    setCapacity(facility.capacity);
    setSelectedSlots(facility.available_slots);
    setDescription(facility.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (selectedSlots.length === 0) {
      toast.error("Please select at least one available time slot");
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`/api/facilities/${editingFacility._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          facility_type: facilityType,
          image_url: imageUrl,
          location,
          price_per_hour: parseFloat(pricePerHour),
          capacity: parseInt(capacity),
          available_slots: selectedSlots,
          description
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Facility updated successfully!");
        setEditingFacility(null);
        // Refresh local list
        setFacilities((prev) =>
          prev.map((f) =>
            f._id === editingFacility._id
              ? {
                  ...f,
                  name,
                  facility_type: facilityType,
                  image_url: imageUrl,
                  location,
                  price_per_hour: parseFloat(pricePerHour),
                  capacity: parseInt(capacity),
                  available_slots: selectedSlots,
                  description
                }
              : f
          )
        );
      } else {
        toast.error(data.message || "Failed to update facility");
      }
    } catch (error) {
      console.error("Update facility error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="manage-facilities-page section">
      <div className="container">
        {editingFacility ? (
          // Editing Form UI
          <div className="form-card large" style={{ margin: "0 auto" }}>
            <div className="form-header">
              <h2>Edit Facility: {editingFacility.name}</h2>
              <p>Modify the details, price, or availability slots of your facility.</p>
            </div>

            <form onSubmit={handleUpdate} className="custom-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Facility Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-input-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="facilityType">Facility Type</label>
                  <select
                    id="facilityType"
                    className="select-control"
                    style={{ padding: "12px 16px" }}
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                  >
                    {SPORT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    className="form-input-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location Address</label>
                  <input
                    type="text"
                    id="location"
                    className="form-input-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pricePerHour">Price Per Hour ($)</label>
                  <input
                    type="number"
                    id="pricePerHour"
                    className="form-input-control"
                    min="1"
                    step="0.01"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacity">Capacity (Max Players)</label>
                  <input
                    type="number"
                    id="capacity"
                    className="form-input-control"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="form-group">
                <label>Available Time Slots</label>
                <div className="type-filters" style={{ marginTop: "8px" }}>
                  {STANDARD_SLOTS.map((slot) => {
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotToggle(slot)}
                        className={`filter-checkbox-label ${isSelected ? "selected" : ""}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Detailed Description</label>
                <textarea
                  id="description"
                  className="form-input-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={updating}
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFacility(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Facility List UI
          <>
            <h2 className="section-title">Manage My Facilities</h2>
            <p className="section-subtitle">
              Update details or remove sports arenas that you own.
            </p>

            {facilities.length === 0 ? (
              <div className="empty-state" style={{ background: "var(--surface)", padding: "60px", borderRadius: "var(--radius-lg)" }}>
                <h3>You haven't listed any facilities yet.</h3>
                <p style={{ marginTop: "8px", marginBottom: "24px" }}>Start listing your venues to receive player bookings!</p>
                <button onClick={() => navigate("/add-facility")} className="btn btn-primary">
                  List Your Facility
                </button>
              </div>
            ) : (
              <div className="grid-6">
                {facilities.map((facility) => (
                  <div key={facility._id} className="facility-card">
                    <div className="card-image-wrapper">
                      <SafeImage
                        src={getImageSrc(facility)}
                        alt={facility.name}
                        className="card-image"
                      />
                      <span className="card-badge">
                        <Activity size={12} style={{ marginRight: "4px", display: "inline-block", verticalAlign: "middle" }} />
                        {facility.facility_type}
                      </span>
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">{facility.name}</h3>

                      <div className="card-details">
                        <div className="card-detail-item">
                          <MapPin size={16} className="detail-icon" />
                          <span className="detail-text">{facility.location}</span>
                        </div>
                        <div className="card-detail-item price-item">
                          <DollarSign size={16} className="detail-icon" />
                          <span className="detail-text">
                            <strong className="price-number">{facility.price_per_hour}</strong> / hour
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                        <button
                          onClick={() => startEdit(facility)}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(facility._id)}
                          className={`btn ${confirmDeleteId === facility._id ? "btn-danger" : "btn-secondary"}`}
                          style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                        >
                          {confirmDeleteId === facility._id ? (
                            <>
                              <ShieldX size={14} />
                              <span>Confirm</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

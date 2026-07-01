import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

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

export default function AddFacility() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [facilityType, setFacilityType] = useState(SPORT_TYPES[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSlots.length === 0) {
      toast.error("Please select at least one available time slot");
      return;
    }

    try {
      setSubmitting(true);
      let finalImageUrl = imageUrl;

      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
        if (!imgbbKey) {
          toast.error("ImgBB API key is missing. Please add VITE_IMGBB_API_KEY to your .env file.");
          setSubmitting(false);
          setUploadingImage(false);
          return;
        }

        try {
          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: "POST",
            body: formData,
          });
          const imgbbData = await imgbbRes.json();
          
          if (imgbbData.success) {
            finalImageUrl = imgbbData.data.url;
          } else {
            toast.error("Failed to upload image to ImgBB");
            setSubmitting(false);
            setUploadingImage(false);
            return;
          }
        } catch (uploadErr) {
          console.error("ImgBB upload error:", uploadErr);
          toast.error("An error occurred during image upload");
          setSubmitting(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const res = await fetch("/api/facilities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          facility_type: facilityType,
          image_url: finalImageUrl,
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
        toast.success("Facility added successfully!");
        navigate("/facilities");
      } else {
        toast.error(data.message || "Failed to add facility");
      }
    } catch (error) {
      console.error("Add facility error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-facility-page container">
      <div className="form-card large">
        <div className="form-header">
          <PlusCircle size={40} style={{ color: "var(--primary)", marginBottom: "12px" }} />
          <h2>Add New Facility</h2>
          <p>Register your court, turf, or lane on SportNest to start receiving bookings.</p>
        </div>

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Facility Name</label>
              <input
                type="text"
                id="name"
                className="form-input-control"
                placeholder="e.g. Stamford Bridge Turf"
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
              <label htmlFor="imageFile">Facility Image</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                className="form-input-control"
                style={{ padding: "9px" }}
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Select an image to automatically upload to ImgBB.
              </span>
              <div style={{ margin: "8px 0", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>OR PURL</div>
              <input
                type="url"
                id="imageUrl"
                className="form-input-control"
                placeholder="Or paste an image URL directly here..."
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
                placeholder="e.g. London, UK"
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
                placeholder="e.g. 50"
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
                placeholder="e.g. 14"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Available Slots Checkboxes */}
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
              placeholder="Describe the turf condition, amenities, rules, or gear availability..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Owner Email (Auto-filled)</label>
              <input
                type="text"
                className="form-input-control"
                value={user?.email || ""}
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            </div>
          </div>

            <button
            type="submit"
            className="btn btn-primary form-submit-btn"
            disabled={submitting || uploadingImage}
          >
            {uploadingImage ? "Uploading Image..." : submitting ? "Adding Facility..." : "Add Facility"}
          </button>
        </form>
      </div>
    </div>
  );
}

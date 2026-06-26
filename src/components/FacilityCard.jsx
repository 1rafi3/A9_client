import { Link, useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Activity } from "lucide-react";
import SafeImage from "./SafeImage";
import { getImageSrc } from "../lib/get-image-src";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";

export default function FacilityCard({ facility }) {
  const { _id, name, facility_type, location, price_per_hour, image_url } = facility;
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/facility/${_id}`);
    }
  };

  return (
    <motion.div
      className="facility-card"
      whileHover={{ y: -6, scale: 1.015, boxShadow: "var(--shadow-lg)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="card-image-wrapper">
        <SafeImage
          src={getImageSrc(facility)}
          alt={name}
          className="card-image"
        />
        <span className="card-badge">
          <Activity size={12} style={{ marginRight: "4px", display: "inline-block", verticalAlign: "middle" }} />
          {facility_type}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        
        <div className="card-details">
          <div className="card-detail-item">
            <MapPin size={16} className="detail-icon" />
            <span className="detail-text">{location}</span>
          </div>
          
          <div className="card-detail-item price-item">
            <DollarSign size={16} className="detail-icon" />
            <span className="detail-text">
              <strong className="price-number">{price_per_hour}</strong> / hour
            </span>
          </div>
        </div>

        <button onClick={handleBookNow} className="btn btn-primary card-btn" style={{ width: "100%" }}>
          Book Now
        </button>
      </div>
    </motion.div>
  );
}

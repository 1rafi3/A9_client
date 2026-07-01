import { useEffect, useState } from "react";
import FacilityCard from "../components/FacilityCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search, SlidersHorizontal } from "lucide-react";

const SPORT_TYPES = [
  "Football Turf",
  "Badminton Court",
  "Swimming Lane",
  "Tennis Court",
  "Basketball Court"
];

export default function AllFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (selectedTypes.length > 0) queryParams.append("type", selectedTypes.join(","));

        const res = await fetch(`/api/facilities?${queryParams.toString()}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setFacilities(data);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(delayDebounce);
    };
  }, [search, selectedTypes]);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="facilities-page section">
      <div className="container">
        <h2 className="section-title">All Sports Facilities</h2>
        <p className="section-subtitle">
          Discover and book the ultimate sport arenas, pitches, and courts in your area.
        </p>

        {/* Search and Filter Control Bar */}
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by facility name..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <SlidersHorizontal size={16} />
              <span>Filter by Sport Type:</span>
            </div>
            <div className="type-filters">
              {SPORT_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`filter-checkbox-label ${isSelected ? "selected" : ""}`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <LoadingSpinner fullPage={false} />
        ) : facilities.length === 0 ? (
          <div className="empty-state">
            <h3>No facilities match your search criteria.</h3>
            <p style={{ marginTop: "8px" }}>Try adjusting your filters or typing another name.</p>
          </div>
        ) : (
          <div className="grid-6">
            {facilities.map((facility) => (
              <FacilityCard key={facility._id} facility={facility} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

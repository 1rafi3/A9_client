import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacilityCard from "../components/FacilityCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SafeImage from "../components/SafeImage";
import matchdayReel from "../assets/matchday-reel.svg";
import { getActualImageSrc, getVideoSrc } from "../lib/get-image-src";
import { ArrowRight, Calendar, ShieldCheck, PlayCircle } from "lucide-react";

const SPOTLIGHT_NAMES = ["Old Trafford Turf", "Stamford Bridge Arena", "Wembley Training Ground"];

export default function Home() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const spotlightFacilities = (() => {
    const exactMatches = SPOTLIGHT_NAMES
      .map((name) => facilities.find((facility) => facility.name?.toLowerCase() === name.toLowerCase()))
      .filter(Boolean);

    if (exactMatches.length >= 3) {
      return exactMatches.slice(0, 3);
    }

    return facilities.slice(0, 3);
  })();

  const spotlightVideoFacility = spotlightFacilities.find(getVideoSrc);
  const spotlightVideoSrc = spotlightVideoFacility ? getVideoSrc(spotlightVideoFacility) : null;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities");
        if (res.ok) {
          const data = await res.json();
          setFacilities(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero section">
        <div className="container hero-content">
          <div className="hero-badge">
            <span>⚡ Book Your Turf in 60 Seconds</span>
          </div>
          <h1 className="hero-title">Your Ultimate Sports Facility Destination</h1>
          <p className="hero-desc">
            Discover, compare, and reserve top-tier football turfs, tennis courts, swimming lanes, and basketball courts. Experience hassle-free booking and flexible scheduling.
          </p>
          <div className="hero-btns">
            <Link to="/facilities" className="btn btn-primary">
              Explore Facilities <ArrowRight size={18} />
            </Link>
            <a href="#booking-guide" className="btn btn-secondary">
              How It Works
            </a>
          </div>
        </div>
      </header>

      <section className="venue-showcase section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Venue Spotlight</p>
              <h2 className="section-title section-title-left">Three places worth booking</h2>
            </div>
            <p className="section-subtitle section-subtitle-left">
              A visual tour of three showcase venues with a short highlight clip for atmosphere.
            </p>
          </div>

          <div className="venue-showcase-grid" style={{ marginTop: "10px" }}>
            <div className="venue-card-grid">
              {spotlightFacilities.length === 3 ? (
                spotlightFacilities.map((facility) => {
                  const imageSrc = getActualImageSrc(facility);

                  return (
                    <article key={facility._id} className="venue-card">
                      {imageSrc ? (
                        <SafeImage src={imageSrc} alt={facility.name} className="venue-card-image" />
                      ) : (
                        <div className="venue-card-placeholder">
                          <span>{facility.name}</span>
                        </div>
                      )}
                      <div className="venue-card-overlay">
                        <span className="venue-card-tag">{facility.facility_type}</span>
                        <div>
                          <h3>{facility.name}</h3>
                          <p>{facility.location}</p>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="empty-state venue-empty-state">
                  <p>Waiting for the three named venues to come back from the database.</p>
                </div>
              )}
            </div>

            <div className="venue-video-card">
              <div className="venue-video-copy">
                <span className="section-kicker">Video Highlight</span>
                <h3>Match-day atmosphere in motion</h3>
                <p>
                  The clip below will use a backend video URL if your API returns one for a venue; otherwise it falls back to a demo clip.
                </p>
              </div>
              <div className="venue-video-frame">
                <video key="canva-video" className="venue-video" autoPlay loop muted playsInline poster={matchdayReel}>
                  <source src="/Video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="venue-video-badge">
                  <PlayCircle size={18} />
                  <span>Highlight reel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Facilities Section */}
      <section className="featured-section section">
        <div className="container">
          <h2 className="section-title">Featured Facilities</h2>
          <p className="section-subtitle">
            Explore our hand-picked premium facilities highly rated by athletes and sports enthusiasts.
          </p>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : facilities.length === 0 ? (
            <div className="empty-state">
              <p>No facilities available at the moment. Add one to get started!</p>
              <Link to="/add-facility" className="btn btn-primary" style={{ marginTop: "16px" }}>
                Add Facility
              </Link>
            </div>
          ) : (
            <div className="grid-6">
              {facilities.map((facility) => (
                <FacilityCard key={facility._id} facility={facility} />
              ))}
            </div>
          )}

          {facilities.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <Link to="/facilities" className="btn btn-secondary">
                View All Facilities
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Booking Guide Section (Static Section 1) */}
      <section id="booking-guide" className="guide-section section">
        <div className="container">
          <h2 className="section-title">How SportNest Works</h2>
          <p className="section-subtitle">
            Book your favorite court in three simple steps. No phone calls, no delays, pure convenience.
          </p>

          <div className="guide-grid">
            <div className="guide-card">
              <div className="guide-icon-box">
                <ArrowRight size={24} />
              </div>
              <h3 className="guide-title">1. Search Facilities</h3>
              <p className="guide-desc">
                Browse through our wide selection of sports facilities. Filter by sport type, location, and price.
              </p>
            </div>

            <div className="guide-card">
              <div className="guide-icon-box">
                <Calendar size={24} />
              </div>
              <h3 className="guide-title">2. Select Slot & Date</h3>
              <p className="guide-desc">
                Choose your desired date and available time slot. Review the pricing and total hours.
              </p>
            </div>

            <div className="guide-card">
              <div className="guide-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3 className="guide-title">3. Secure Booking</h3>
              <p className="guide-desc">
                Confirm your booking instantly. Your slot is guaranteed, and you can manage or cancel it from your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Static Section 2) */}
      <section className="testimonials-section section">
        <div className="container">
          <h2 className="section-title">What Athletes Say</h2>
          <p className="section-subtitle">
            Hear from our community of players, trainers, and sports facility owners.
          </p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "SportNest has transformed the way my friends and I coordinate our weekly football matches. The live slot booking is incredibly accurate."
              </div>
              <div className="testimonial-author">
                <SafeImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                  alt="Sarah Jenkins"
                  className="author-avatar"
                />
                <div>
                  <h4 className="author-name">Sarah Jenkins</h4>
                  <p className="author-role">Amateur Footballer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                "As a turf owner, listing my venue on SportNest has boosted my bookings by 40%. The admin dashboard lets me easily manage pricing and slots."
              </div>
              <div className="testimonial-author">
                <SafeImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
                  alt="David K."
                  className="author-avatar"
                />
                <div>
                  <h4 className="author-name">David Kovac</h4>
                  <p className="author-role">Facility Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                "Super convenient booking and responsive interface. The cancellation policy is fair, and the glassmorphic dark theme looks absolutely stunning!"
              </div>
              <div className="testimonial-author">
                <SafeImage
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
                  alt="Marcus Vance"
                  className="author-avatar"
                />
                <div>
                  <h4 className="author-name">Marcus Vance</h4>
                  <p className="author-role">Tennis Club Captain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Dumbbell, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Dumbbell className="logo-icon" />
            <span className="logo-text">SportNest</span>
          </Link>
          <p className="footer-desc">
            Discover and book the finest sports facilities in your area. Football turfs, badminton courts, swimming lanes, and more, all at your fingertips.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="social-icon x-logo" aria-label="X (formerly Twitter)">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Youtube">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/facilities">All Facilities</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="footer-contact">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="contact-list">
            <li>
              <MapPin size={18} />
              <span>123 Arena Drive, Sports Hub, SH 90210</span>
            </li>
            <li>
              <Phone size={18} />
              <span>+1 (555) 234-5678</span>
            </li>
            <li>
              <Mail size={18} />
              <span>support@sportnest.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SportNest. All rights reserved. Recruiter-friendly sports portal.</p>
      </div>
    </footer>
  );
}

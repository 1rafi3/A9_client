import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <div className="notfound-page container">
      <div className="notfound-wrapper">
        <Dumbbell className="logo-icon" size={64} style={{ marginBottom: "16px", animation: "spin 6s linear infinite" }} />
        <div className="notfound-icon">404</div>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-text">
          Oops! The court you are trying to reach doesn't exist, has been closed, or moved to another address.
        </p>
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </div>
  );
}

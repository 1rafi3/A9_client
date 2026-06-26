export default function LoadingSpinner({ fullPage = true }) {
  return (
    <div className={`spinner-container ${fullPage ? "full-page" : "inline"}`}>
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p className="spinner-text">Loading SportNest...</p>
      </div>
    </div>
  );
}

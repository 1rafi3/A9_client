import { useState, useEffect } from "react";

export default function SafeImage({ src, alt, className, style, loading = "lazy", ...props }) {
  const [error, setError] = useState(!src);

  useEffect(() => {
    setError(!src);
  }, [src]);

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div 
        className={className} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#1e293b', 
          color: '#94a3b8', 
          textAlign: 'center',
          padding: '12px',
          ...style 
        }}
        {...props}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{alt || "No image available"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
}
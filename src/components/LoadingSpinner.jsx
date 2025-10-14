import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 40, color = '#4a90e2', text = 'Exploring the cosmos...' }) => {
  return (
    <div className="loading-spinner-container">
      <div
        className="loading-spinner"
        style={{
          width: size,
          height: size,
          borderColor: `${color}33`,
          borderTopColor: color,
        }}
      />
      <div className="loading-text">
        {text}
      </div>
    </div>
  );
};

export default LoadingSpinner;
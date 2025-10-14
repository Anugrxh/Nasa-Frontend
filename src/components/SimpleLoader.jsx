const SimpleLoader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'transparent',
    zIndex: 1000,
    pointerEvents: 'none'
  }} />
);

export default SimpleLoader;
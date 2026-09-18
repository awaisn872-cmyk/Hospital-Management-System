export default function Message({ type = "success", children, onClose }) {
  if (!children) return null;
  return (
    <div className={`message ${type}`}>
      <span>{children}</span>
      {onClose && <button onClick={onClose}>×</button>}
    </div>
  );
}
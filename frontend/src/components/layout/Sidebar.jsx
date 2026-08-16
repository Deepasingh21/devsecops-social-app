import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>

      <ul className="space-y-3">
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
        <li><Link to="/people">👥 People</Link></li>
        <li><Link to="/login">🔐 Login</Link></li>
        <li><Link to="/register">📝 Register</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;

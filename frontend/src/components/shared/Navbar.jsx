import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Map, Plus } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.nav}>
      <Link to={user ? "/dashboard" : "/"} className={styles.logo}>
        <Map size={20} />
        <span>Trrip</span>
      </Link>
      {user ? (
        <div className={styles.actions}>
          <Link to="/upload" className={styles.newBtn}>
            <Plus size={16} /> New Trip
          </Link>
          <span className={styles.greeting}>Hi, {user.name.split(" ")[0]}</span>
          <button onClick={handleLogout} className={styles.logout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div className={styles.actions}>
          <Link to="/login" className={styles.loginLink}>Sign in</Link>
          <Link to="/register" className={styles.registerBtn}>Get Started</Link>
        </div>
      )}
    </nav>
  );
}

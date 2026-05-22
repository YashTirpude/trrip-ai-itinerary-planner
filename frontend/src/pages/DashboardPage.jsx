import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/shared/Navbar";
import api from "../api/axios";
import { Plus, MapPin, Calendar, Trash2, Share2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get("/itineraries")
      .then((r) => setItineraries(r.data.itineraries))
      .catch(() => toast.error("Failed to load itineraries"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this itinerary?")) return;
    setDeleting(id);
    try {
      await api.delete(`/itineraries/${id}`);
      setItineraries((prev) => prev.filter((i) => i._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const copyShareLink = (token) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied!"));
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1>My Trips</h1>
            <p>Welcome back, {user.name.split(" ")[0]} 👋</p>
          </div>
          <Link to="/upload" className={styles.newBtn}>
            <Plus size={18} /> New Itinerary
          </Link>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3].map((i) => <div key={i} className={`${styles.card} skeleton`} style={{ height: 180 }} />)}
          </div>
        ) : itineraries.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✈️</div>
            <h2>No trips yet</h2>
            <p>Upload your travel documents and let AI plan your itinerary</p>
            <Link to="/upload" className={styles.newBtn}><Plus size={16} /> Create First Trip</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {itineraries.map((it, i) => (
              <div key={it._id} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={styles.cardTop}>
                  <span className={styles.destination}>
                    <MapPin size={14} /> {it.destination || "Unknown destination"}
                  </span>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => copyShareLink(it.shareToken)}
                      title="Copy share link"
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(it._id)}
                      disabled={deleting === it._id}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className={styles.tripTitle}>{it.title}</h3>

                {it.startDate && it.endDate && (
                  <p className={styles.dates}>
                    <Calendar size={13} />
                    {format(new Date(it.startDate), "MMM d")} — {format(new Date(it.endDate), "MMM d, yyyy")}
                  </p>
                )}

                <div className={styles.dayCount}>
                  {it.days?.length || 0} days planned
                </div>

                <Link to={`/itinerary/${it._id}`} className={styles.viewBtn}>
                  View itinerary <ChevronRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

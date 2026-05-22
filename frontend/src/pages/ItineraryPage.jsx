import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import api from "../api/axios";
import {
  MapPin,
  Calendar,
  Share2,
  Check,
  Clock,
  Plane,
  Hotel,
  Coffee,
  Train,
  Bus,
  Activity,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import styles from "./ItineraryPage.module.css";

const typeIcon = {
  flight: <Plane size={14} />,
  hotel: <Hotel size={14} />,
  meal: <Coffee size={14} />,
  transport: <Train size={14} />,
  bus: <Bus size={14} />,
  activity: <Activity size={14} />,
  other: <Activity size={14} />,
};

const typeColor = {
  flight: "#4a90d9",
  hotel: "#9b59b6",
  meal: "#e67e22",
  transport: "#27ae60",
  bus: "#16a085",
  activity: "var(--amber)",
  other: "var(--muted)",
};

export default function ItineraryPage() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    api
      .get(`/api/itineraries/${id}`)
      .then((r) => setItinerary(r.data.itinerary))
      .catch(() => toast.error("Failed to load itinerary"))
      .finally(() => setLoading(false));
  }, [id]);

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${itinerary.shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Share link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading)
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading itinerary…</p>
        </div>
      </div>
    );

  if (!itinerary)
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.loadingWrap}>
          <p>Itinerary not found.</p>
        </div>
      </div>
    );

  const day = itinerary.days?.[activeDay];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        {/* Back */}
        <Link to="/dashboard" className={styles.back}>
          <ArrowLeft size={16} /> My Trips
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.destination}>
              <MapPin size={15} />
              {itinerary.destination}
            </div>
            <h1>{itinerary.title}</h1>
            {itinerary.startDate && itinerary.endDate && (
              <p className={styles.dates}>
                <Calendar size={14} />
                {format(new Date(itinerary.startDate), "MMM d")} —{" "}
                {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                <span className={styles.badge}>
                  {itinerary.days?.length || 0} days
                </span>
              </p>
            )}
          </div>
          <button
            className={`${styles.shareBtn} ${copied ? styles.copied : ""}`}
            onClick={copyShareLink}
          >
            {copied ? (
              <>
                <Check size={16} /> Copied!
              </>
            ) : (
              <>
                <Share2 size={16} /> Share Trip
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        {itinerary.rawSummary && (
          <div className={styles.summary}>
            {itinerary.rawSummary
              .split("\n")
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p.replace(/^#+\s*/, "")}</p>
              ))}
          </div>
        )}

        {/* Day tabs */}
        {itinerary.days?.length > 0 && (
          <div className={styles.itineraryWrap}>
            <div className={styles.dayTabs}>
              {itinerary.days.map((d, i) => (
                <button
                  key={i}
                  className={`${styles.dayTab} ${activeDay === i ? styles.activeTab : ""}`}
                  onClick={() => setActiveDay(i)}
                >
                  <span className={styles.dayNum}>Day {d.day}</span>
                  {d.date && (
                    <span className={styles.dayDate}>
                      {format(new Date(d.date), "MMM d")}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {day && (
              <div className={styles.dayContent} key={activeDay}>
                <div className={styles.dayHeader}>
                  <h2>{day.title}</h2>
                  {day.date && (
                    <span className={styles.fullDate}>
                      {format(new Date(day.date), "EEEE, MMMM d")}
                    </span>
                  )}
                </div>

                {/* Activities timeline */}
                <div className={styles.timeline}>
                  {day.activities?.map((act, i) => (
                    <div key={i} className={styles.activity}>
                      <div className={styles.actLeft}>
                        <span className={styles.actTime}>
                          {act.time || "—"}
                        </span>
                        <div className={styles.timelineLine} />
                      </div>
                      <div className={styles.actCard}>
                        <div
                          className={styles.actType}
                          style={{
                            color: typeColor[act.type] || typeColor.other,
                          }}
                        >
                          {typeIcon[act.type] || typeIcon.other}
                          <span>{act.type || "activity"}</span>
                        </div>
                        <p className={styles.actDesc}>{act.description}</p>
                        {act.location && (
                          <span className={styles.actLocation}>
                            <MapPin size={12} /> {act.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {day.notes && (
                  <div className={styles.dayNotes}>
                    <span>💡</span>
                    <p>{day.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

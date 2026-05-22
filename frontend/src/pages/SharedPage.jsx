import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import {
  MapPin,
  Calendar,
  Clock,
  Plane,
  Hotel,
  Coffee,
  Train,
  Activity,
  Map,
  Share2,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import styles from "./SharedPage.module.css";

const typeIcon = {
  flight: <Plane size={14} />,
  hotel: <Hotel size={14} />,
  meal: <Coffee size={14} />,
  transport: <Train size={14} />,
  activity: <Activity size={14} />,
  other: <Activity size={14} />,
};
const typeColor = {
  flight: "#4a90d9",
  hotel: "#9b59b6",
  meal: "#e67e22",
  transport: "#27ae60",
  activity: "var(--amber)",
  other: "var(--muted)",
};

export default function SharedPage() {
  const { token } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(`/api/share/${token}`)
      .then((r) => setItinerary(r.data.itinerary))
      .catch(() => setItinerary(null))
      .finally(() => setLoading(false));
  }, [token]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading trip…</p>
        </div>
      </div>
    );

  if (!itinerary)
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>🗺️</div>
          <h1>Trip not found</h1>
          <p>This itinerary may have been made private or doesn't exist.</p>
          <Link to="/" className={styles.homeLink}>
            Go to Trrip
          </Link>
        </div>
      </div>
    );

  const day = itinerary.days?.[activeDay];

  return (
    <div className={styles.page}>
      {/* Banner */}
      <div className={styles.banner}>
        <Link to="/" className={styles.logo}>
          <Map size={18} /> Trrip
        </Link>
        <div className={styles.bannerRight}>
          <span>Shared itinerary</span>
          <button className={styles.copyBtn} onClick={copyLink}>
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Share2 size={14} /> Copy link
              </>
            )}
          </button>
          <Link to="/register" className={styles.signupBtn}>
            Plan your trip →
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
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
            <span className={styles.badge}>{itinerary.days?.length} days</span>
          </p>
        )}
      </div>

      <main className={styles.main}>
        {/* Summary */}
        {itinerary.rawSummary && (
          <div className={styles.summary}>
            {itinerary.rawSummary
              .split("\n")
              .filter(Boolean)
              .slice(0, 3)
              .map((p, i) => (
                <p key={i}>{p.replace(/^#+\s*/, "")}</p>
              ))}
          </div>
        )}

        {/* Day tabs + content */}
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
                    <span>{format(new Date(day.date), "EEEE, MMMM d")}</span>
                  )}
                </div>
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
                          <span>{act.type}</span>
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

        {/* Footer CTA */}
        <div className={styles.cta}>
          <h3>Want to plan your own trip?</h3>
          <p>
            Upload your travel documents and get an AI-powered itinerary in
            seconds.
          </p>
          <Link to="/register" className={styles.ctaBtn}>
            Start with Trrip — it's free
          </Link>
        </div>
      </main>
    </div>
  );
}

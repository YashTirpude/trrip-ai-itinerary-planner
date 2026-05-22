import { Link } from "react-router-dom";
import { Plane, FileText, Sparkles, Globe } from "lucide-react";
import Navbar from "../components/shared/Navbar";
import styles from "./LandingPage.module.css";

const features = [
  { icon: <FileText size={24} />, title: "Upload Any Document", desc: "Flight tickets, hotel bookings, train passes — PDF or image, we handle it all." },
  { icon: <Sparkles size={24} />, title: "AI-Powered Extraction", desc: "Claude AI reads your documents and pulls every relevant detail automatically." },
  { icon: <Plane size={24} />, title: "Smart Itinerary", desc: "Get a beautiful, day-by-day itinerary with local recommendations woven in." },
  { icon: <Globe size={24} />, title: "Share Anywhere", desc: "Share your itinerary with travel companions via a simple link — no login needed." },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroTag}>AI Travel Planner</div>
          <h1 className={styles.heroTitle}>
            Upload your bookings.<br />
            <em>We'll plan the rest.</em>
          </h1>
          <p className={styles.heroSub}>
            Drop in your flight tickets, hotel confirmations, and travel passes — Trrip's AI engine builds a complete, curated itinerary in seconds.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register" className={styles.ctaPrimary}>Start for free</Link>
            <Link to="/login" className={styles.ctaSecondary}>Sign in</Link>
          </div>
        </section>

        {/* Features */}
        <section className={styles.features}>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Band */}
        <section className={styles.ctaBand}>
          <h2>Ready to simplify travel planning?</h2>
          <Link to="/register" className={styles.ctaPrimary}>Create your first itinerary →</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© 2025 Trrip</span>
        <span>Built with ♥ and Claude AI</span>
      </footer>
    </div>
  );
}

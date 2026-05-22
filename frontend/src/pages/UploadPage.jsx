import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/shared/Navbar";
import api from "../api/axios";
import { Upload, X, FileText, Image, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./UploadPage.module.css";

const MAX_FILES = 10;
const ACCEPTED = { "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] };

function FileIcon({ type }) {
  return type === "application/pdf"
    ? <FileText size={20} color="var(--coral)" />
    : <Image size={20} color="var(--sage)" />;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep]     = useState("idle"); // idle | uploading | extracting | generating

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) toast.error("Some files were rejected. Only PDF, JPG, PNG, WEBP allowed (max 20MB).");
    setFiles((prev) => {
      const combined = [...prev, ...accepted].slice(0, MAX_FILES);
      return combined;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: 20 * 1024 * 1024,
    maxFiles: MAX_FILES,
    multiple: true,
  });

  const removeFile = (index) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleGenerate = async () => {
    if (files.length === 0) return toast.error("Please upload at least one document");
    setLoading(true);
    setStep("uploading");

    const formData = new FormData();
    files.forEach((f) => formData.append("documents", f));

    try {
      setTimeout(() => setStep("extracting"), 1500);
      setTimeout(() => setStep("generating"), 5000);

      const { data } = await api.post("/itineraries/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Itinerary generated!");
      navigate(`/itinerary/${data.itinerary._id}`);
    } catch (err) {
      toast.error(err.message || "Generation failed. Please try again.");
      setLoading(false);
      setStep("idle");
    }
  };

  const stepLabel = {
    idle: null,
    uploading: "Uploading your documents...",
    extracting: "Extracting booking details with AI...",
    generating: "Crafting your perfect itinerary...",
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Upload Travel Documents</h1>
          <p>Upload your flight tickets, hotel bookings, train passes — in PDF or image format. Our AI will do the rest.</p>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${isDragActive ? styles.active : ""} ${files.length > 0 ? styles.compact : ""}`}
        >
          <input {...getInputProps()} />
          <Upload size={36} className={styles.uploadIcon} />
          {isDragActive ? (
            <p>Drop your files here...</p>
          ) : (
            <>
              <p className={styles.dropText}>Drag & drop files here</p>
              <p className={styles.dropSub}>or click to browse — PDF, JPG, PNG, WEBP · Max 20MB · Up to {MAX_FILES} files</p>
            </>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((f, i) => (
              <div key={i} className={styles.fileItem}>
                <FileIcon type={f.type} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileSize}>{(f.size / 1024).toFixed(1)} KB</span>
                </div>
                <button className={styles.removeBtn} onClick={() => removeFile(i)}><X size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Generate button */}
        {files.length > 0 && (
          <button
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.loadingState}>
                <span className={styles.spinner} />
                <span>{stepLabel[step]}</span>
              </div>
            ) : (
              <><Sparkles size={18} /> Generate Itinerary</>
            )}
          </button>
        )}

        {/* Tips */}
        <div className={styles.tips}>
          <h3>Tips for best results</h3>
          <ul>
            <li>Upload clear, readable scans or PDFs of your travel documents</li>
            <li>Include flight tickets, hotel confirmations, train/bus passes</li>
            <li>Multiple documents work together — the AI connects them</li>
            <li>AI will fill gaps between bookings with curated recommendations</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./eligibility.module.css";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function CheckEligibility() {
  const [cnic, setCnic] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "eligible" | "ineligible" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 13) value = value.slice(0, 13);
    
    // Format as XXXXX-XXXXXXX-X
    let formatted = value;
    if (value.length > 5 && value.length <= 12) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      formatted = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
    }
    
    setCnic(formatted);
  };

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (cnic.length !== 15) {
      setStatus("error");
      setMessage("Please enter a valid 13-digit CNIC / B-Form Number.");
      return;
    }

    setStatus("loading");
    
    // Simulate API verification
    setTimeout(() => {
      if (cnic.endsWith("000")) {
        setStatus("ineligible");
        setMessage("Sorry, your CNIC record indicates you have previously received an allotment or do not meet current criteria.");
      } else {
        setStatus("eligible");
        setMessage("Congratulations! Your CNIC is eligible to apply for Student Laptop Online.");
      }
    }, 800);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="STUDENT LAPTOP ONLINE"
              width={42}
              height={42}
              style={{ objectFit: "contain" }}
            />
            <span style={{ color: "var(--primary)", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "0.5px" }}>
              STUDENT LAPTOP ONLINE
            </span>
          </Link>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
            Back to Home
          </Link>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className="card" style={{ maxWidth: "600px", margin: "4rem auto", padding: "2.5rem" }}>
          <h1 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
            Check Your Eligibility
          </h1>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Enter your 13-digit CNIC or B-Form number to verify your scheme eligibility in real-time.
          </p>
          
          <form onSubmit={checkEligibility} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label htmlFor="cnic" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#334155" }}>
                CNIC / B-Form Number
              </label>
              <input 
                id="cnic"
                type="text" 
                className="input" 
                placeholder="XXXXX-XXXXXXX-X" 
                value={cnic}
                onChange={handleCnicChange}
                required
                style={{ fontSize: "1.1rem", letterSpacing: "1px" }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === "loading"}
              style={{ width: "100%", padding: "0.85rem", fontSize: "1.05rem", fontWeight: 700 }}
            >
              {status === "loading" ? "Verifying..." : "Check Status"}
            </button>
          </form>

          {status !== "idle" && status !== "loading" && (
            <div className={`${styles.alert} ${status === "eligible" ? styles.success : status === "ineligible" ? styles.danger : styles.warning}`} style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                {status === "eligible" && <CheckCircle2 size={20} />}
                {status === "ineligible" && <XCircle size={20} />}
                {status === "error" && <AlertTriangle size={20} />}
                <strong style={{ fontSize: "1.05rem" }}>
                  {status === "eligible" ? "Eligible for Scheme!" : status === "ineligible" ? "Not Eligible" : "Validation Error"}
                </strong>
              </div>
              <p style={{ margin: 0 }}>{message}</p>
            </div>
          )}

          {status === "eligible" && (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backgroundColor: "#16a34a",
                }}
              >
                Proceed to Apply Online <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./eligibility.module.css";

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
      setMessage("Please enter a valid 13-digit CNIC.");
      return;
    }

    setStatus("loading");
    
    // Simulate API delay
    setTimeout(() => {
      // Mock Logic: Always eligible for prototype unless it ends in 000
      if (cnic.endsWith("000")) {
        setStatus("ineligible");
        setMessage("Sorry, your CNIC is not eligible or you have already received a laptop in a previous scheme.");
      } else {
        setStatus("eligible");
        setMessage("Congratulations! You are eligible for this phase of the Laptop Scheme.");
      }
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container" style={{display: "flex", justifyContent: "space-between"}}>
           <div className={styles.logo}>
             <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
           </div>
           <Link href="/" style={{color: "var(--foreground)", textDecoration: "none", fontWeight: "500"}}>Back to Home</Link>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className="card" style={{maxWidth: "600px", margin: "4rem auto", padding: "2.5rem"}}>
          <h1 style={{textAlign: "center", marginBottom: "0.5rem"}}>Check Your Eligibility</h1>
          <p style={{textAlign: "center", color: "#64748b", marginBottom: "2rem"}}>Enter your CNIC without dashes. The system will automatically format it.</p>
          
          <form onSubmit={checkEligibility} style={{display: "flex", flexDirection: "column", gap: "1.5rem"}}>
            <div>
              <label htmlFor="cnic" style={{display: "block", marginBottom: "0.5rem", fontWeight: "500"}}>CNIC Number</label>
              <input 
                id="cnic"
                type="text" 
                className="input" 
                placeholder="XXXXX-XXXXXXX-X" 
                value={cnic}
                onChange={handleCnicChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === "loading"}
              style={{width: "100%", padding: "0.75rem", fontSize: "1.1rem"}}
            >
              {status === "loading" ? "Verifying..." : "Check Status"}
            </button>
          </form>

          {status !== "idle" && status !== "loading" && (
            <div className={`${styles.alert} ${status === "eligible" ? styles.success : status === "ineligible" ? styles.danger : styles.warning}`}>
              <strong>{status === "eligible" ? "Eligible!" : status === "ineligible" ? "Not Eligible" : "Error"}</strong>
              <p>{message}</p>
            </div>
          )}

          {status === "eligible" && (
            <div style={{marginTop: "2rem", textAlign: "center"}}>
              <Link href="/register" className="btn btn-primary" style={{width: "100%", padding: "1rem", fontSize: "1.2rem", display: "inline-block"}}>
                Apply Now ✨
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


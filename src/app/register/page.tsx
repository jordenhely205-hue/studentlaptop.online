"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cnic: "",
    level: "",
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    password: "",
    boardOrUniversity: "",
    customInstitute: "",
    score: "", // Can be CGPA or Marks/Percentage
    otp: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto format CNIC
    if (name === "cnic") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length > 13) formatted = formatted.slice(0, 13);
      if (formatted.length > 5 && formatted.length <= 12) formatted = `${formatted.slice(0, 5)}-${formatted.slice(5)}`;
      else if (formatted.length > 12) formatted = `${formatted.slice(0, 5)}-${formatted.slice(5, 12)}-${formatted.slice(12)}`;
      setFormData(prev => ({ ...prev, cnic: formatted }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.cnic.length !== 15) {
        alert("Please enter a valid 13-digit CNIC.");
        return;
      }
      if (!formData.level) {
        alert("Please select your academic level (Inter or University).");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    // Mock API call to send OTP
    setTimeout(() => {
      setLoading(false);
      alert("OTP sent to your email/phone! (Since this is a demo, please enter '123456')");
      setStep(3);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock registration submission and challan generation
    setTimeout(() => {
      setLoading(false);
      
      // Save data locally to display in challan
      if (typeof window !== 'undefined') {
        const finalData = { ...formData };
        // If they typed manually, replace the printed name with their custom typed name
        if (formData.boardOrUniversity === "Other" && formData.customInstitute) {
          finalData.boardOrUniversity = formData.customInstitute;
        }
        localStorage.setItem("challanData", JSON.stringify(finalData));
      }
      
      router.push("/challan");
    }, 1500);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container" style={{display: "flex", justifyContent: "space-between"}}>
           <div className={styles.logo}>
             <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
           </div>
           <Link href="/" style={{color: "var(--foreground)", textDecoration: "none", fontWeight: "500"}}>Cancel</Link>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className="card" style={{maxWidth: "700px", margin: "3rem auto", padding: "2.5rem"}}>
          
          <div className={styles.progressContainer}>
            <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ""}`}>1. Category</div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ""}`}>2. Details</div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ""}`}>3. Verification</div>
          </div>

          <h2 style={{marginTop: "2rem", marginBottom: "1.5rem"}}>{
            step === 1 ? "Start Registration" : 
            step === 2 ? "Personal & Academic Info" : 
            "Verify Account"
          }</h2>

          {step === 1 && (
            <form onSubmit={nextStep}>
              <div style={{marginBottom: "1.5rem"}}>
                <label className={styles.label}>CNIC Number</label>
                <input 
                  type="text" name="cnic" className="input" placeholder="XXXXX-XXXXXXX-X"
                  value={formData.cnic} onChange={handleInputChange} required
                />
              </div>
              <div style={{marginBottom: "1.5rem"}}>
                <label className={styles.label}>Academic Level</label>
                <select name="level" className="input" value={formData.level} onChange={handleInputChange} required>
                  <option value="" disabled>Select your category...</option>
                  <option value="Matric">Matric Level (9th, 10th)</option>
                  <option value="Inter">Inter Level (FSc, FA, ICS, etc.)</option>
                  <option value="University">University Level (BS, MS, PhD)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{width: "100%", padding: "0.75rem"}}>Next Step</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem"}}>
                <div>
                  <label className={styles.label}>Full Name (As per CNIC)</label>
                  <input type="text" name="name" className="input" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className={styles.label}>Father's Name</label>
                  <input type="text" name="fatherName" className="input" value={formData.fatherName} onChange={handleInputChange} required />
                </div>

                <div style={{gridColumn: "span 2", marginTop: "1rem", marginBottom: "0.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem"}}>
                  <strong>Academic Requirements ({formData.level})</strong>
                </div>

                {formData.level === "Inter" || formData.level === "Matric" ? (
                  <>
                    <div style={{gridColumn: formData.boardOrUniversity === "Other" ? "span 2" : "auto"}}>
                      <label className={styles.label}>{formData.level === "Matric" ? "Matric Board" : "Intermediate Board"}</label>
                      <select name="boardOrUniversity" className="input" value={formData.boardOrUniversity} onChange={handleInputChange} required>
                        <option value="" disabled>Select Board...</option>
                        <option value="Federal Board">Federal Board (FBISE)</option>
                        <option value="Lahore Board">Lahore Board</option>
                        <option value="Rawalpindi Board">Rawalpindi Board</option>
                        <option value="Karachi Board">Karachi Board</option>
                        <option value="Peshawar Board">Peshawar Board</option>
                        <option value="Other">Other (Type Manually)</option>
                      </select>
                    </div>
                    {formData.boardOrUniversity === "Other" && (
                      <div style={{gridColumn: "span 2"}}>
                        <label className={styles.label}>Type Your Board/School Name</label>
                        <input type="text" name="customInstitute" className="input" placeholder="Enter full name of your board or school" 
                               value={formData.customInstitute || ""} onChange={handleInputChange} required />
                      </div>
                    )}
                    <div style={{gridColumn: formData.boardOrUniversity === "Other" ? "span 2" : "auto"}}>
                      <label className={styles.label}>Marks or Percentage</label>
                      <input type="text" name="score" className="input" placeholder="e.g. 850 or 78%" value={formData.score} onChange={handleInputChange} required />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{gridColumn: formData.boardOrUniversity === "Other" ? "span 2" : "auto"}}>
                      <label className={styles.label}>University Selection</label>
                      <select name="boardOrUniversity" className="input" value={formData.boardOrUniversity} onChange={handleInputChange} required>
                        <option value="" disabled>Select University...</option>
                        <option value="Quaid-i-Azam University">Quaid-i-Azam University, Islamabad</option>
                        <option value="Punjab University">Punjab University, Lahore</option>
                        <option value="NUST">NUST</option>
                        <option value="University of Karachi">University of Karachi</option>
                        <option value="UET Lahore">UET Lahore</option>
                        <option value="Other">Other (Type Manually)</option>
                      </select>
                    </div>
                    {formData.boardOrUniversity === "Other" && (
                      <div style={{gridColumn: "span 2"}}>
                        <label className={styles.label}>Type Your University Name</label>
                        <input type="text" name="customInstitute" className="input" placeholder="Enter full name of your university or college" 
                               value={formData.customInstitute || ""} onChange={handleInputChange} required />
                      </div>
                    )}
                    <div style={{gridColumn: formData.boardOrUniversity === "Other" ? "span 2" : "auto"}}>
                      <label className={styles.label}>Current CGPA</label>
                      <input type="number" step="0.01" max="4.00" name="score" className="input" placeholder="e.g. 3.45" value={formData.score} onChange={handleInputChange} required />
                    </div>
                  </>
                )}

                <div style={{gridColumn: "span 2", marginTop: "1rem", marginBottom: "0.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem"}}>
                  <strong>Contact Information</strong>
                </div>
                <div>
                  <label className={styles.label}>Email Address</label>
                  <input type="email" name="email" className="input" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className={styles.label}>Phone Number</label>
                  <input type="tel" name="phone" className="input" placeholder="03XXXXXXXXX" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div style={{gridColumn: "span 2"}}>
                  <label className={styles.label}>Account Password</label>
                  <input type="password" name="password" className="input" value={formData.password} onChange={handleInputChange} required />
                </div>
              </div>

              <div style={{display: "flex", gap: "1rem"}}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{flex: 1}}>Back</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{flex: 2}}>
                  {loading ? "Sending..." : "Send Verification OTP"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: "1.5rem"}}>
                <p style={{color: "#64748b", marginBottom: "1rem"}}>We have sent a 6-digit OTP to your email: {formData.email}</p>
                <label className={styles.label}>Enter OTP</label>
                <input 
                  type="text" name="otp" className="input" placeholder="123456" maxLength={6}
                  value={formData.otp} onChange={handleInputChange} required style={{letterSpacing: "4px", fontSize: "1.25rem", textAlign: "center"}}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{width: "100%", padding: "0.75rem"}}>
                {loading ? "Verifying..." : "Confirm & Generate Challan"}
              </button>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}


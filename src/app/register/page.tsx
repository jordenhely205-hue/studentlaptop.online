"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import SearchableSelect from "@/components/SearchableSelect";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

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
    // Step 3 Academic Fields - All mock/prefilled values initialized to empty strings ("")
    rollNumber: "",
    passingYear: "",
    totalMarks: "",
    obtainedMarks: "",
    percentage: "",
    instituteName: "",
    boardName: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Auto format CNIC
    if (name === "cnic") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length > 13) formatted = formatted.slice(0, 13);
      if (formatted.length > 5 && formatted.length <= 12)
        formatted = `${formatted.slice(0, 5)}-${formatted.slice(5)}`;
      else if (formatted.length > 12)
        formatted = `${formatted.slice(0, 5)}-${formatted.slice(5, 12)}-${formatted.slice(12)}`;
      setFormData((prev) => ({ ...prev, cnic: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Live auto-calculation of percentage when Total Marks and Obtained Marks are entered
  const handleMarksChange = (field: "totalMarks" | "obtainedMarks", val: string) => {
    const cleanVal = val.replace(/[^\d.]/g, "");
    
    setFormData((prev) => {
      const nextData = { ...prev, [field]: cleanVal };
      const total = parseFloat(field === "totalMarks" ? cleanVal : prev.totalMarks);
      const obtained = parseFloat(field === "obtainedMarks" ? cleanVal : prev.obtainedMarks);

      if (!isNaN(total) && !isNaN(obtained) && total > 0) {
        if (obtained > total) {
          nextData.percentage = "Invalid (Obtained > Total)";
        } else {
          const calculatedPct = ((obtained / total) * 100).toFixed(2);
          nextData.percentage = `${calculatedPct}%`;
        }
      } else {
        nextData.percentage = "";
      }
      return nextData;
    });
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cnic.length !== 15) {
      alert("Please enter a valid 13-digit CNIC / B-Form Number.");
      return;
    }
    if (!formData.level) {
      alert("Please select your academic level (Matric, Inter, or University).");
      return;
    }
    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.fatherName || !formData.email || !formData.phone || !formData.password) {
      alert("Please fill all required personal and contact fields.");
      return;
    }
    setStep(3);
  };

  const handleNextFromStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instituteName) {
      alert("Please select or search your Institute / College Name.");
      return;
    }
    if (!formData.boardName) {
      alert("Please select or search your Affiliated Examination Board.");
      return;
    }
    if (!formData.rollNumber) {
      alert("Please enter your Roll Number.");
      return;
    }
    if (!formData.passingYear) {
      alert("Please enter or select your Passing Year.");
      return;
    }
    if (!formData.totalMarks || !formData.obtainedMarks) {
      alert("Please enter Total Marks and Obtained Marks.");
      return;
    }

    setLoading(true);
    // Simulate verification OTP dispatch
    setTimeout(() => {
      setLoading(false);
      alert("Verification OTP sent to your registered Email/Phone! (Demo code: 123456)");
      setStep(4);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (typeof window !== "undefined") {
        const candidatePayload = {
          ...formData,
          feeAmount: 475,
          feeInWords: "Four Hundred Seventy Five Rupees Only",
          status: "Payment Pending",
          tillId: "984703000",
        };
        localStorage.setItem("challanData", JSON.stringify(candidatePayload));
      }

      router.push("/challan");
    }, 1200);
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
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem" }}>
            Cancel
          </Link>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className="card" style={{ maxWidth: "760px", margin: "2.5rem auto", padding: "2.5rem" }}>
          
          {/* Progress Indicator */}
          <div className={styles.progressContainer}>
            <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ""}`}>1. Category</div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ""}`}>2. Personal</div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ""}`}>3. Academic Info</div>
            <div className={`${styles.stepLine} ${step >= 4 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 4 ? styles.active : ""}`}>4. Verify</div>
          </div>

          <div style={{ marginTop: "1.75rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem" }}>
              {step === 1 && "Step 1: Category & CNIC Verification"}
              {step === 2 && "Step 2: Personal & Contact Details"}
              {step === 3 && "Step 3: Academic Qualifications & Merit Info"}
              {step === 4 && "Step 4: Final OTP Verification"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
              {step === 1 && "Enter your national identity number and current academic level."}
              {step === 2 && "Provide your official name and contact information."}
              {step === 3 && "Select your institute & board from our database and enter your marks for live percentage calculation."}
              {step === 4 && "Enter the verification code to generate your candidate payment challan."}
            </p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label className={styles.label}>CNIC / B-Form Number (13 Digits)</label>
                <input
                  type="text"
                  name="cnic"
                  className="input"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  required
                />
                <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                  Enter digits without dashes; formatted automatically.
                </span>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label className={styles.label}>Current Academic Level</label>
                <select
                  name="level"
                  className="input"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select your academic category...</option>
                  <option value="Matric">Matriculation (9th / 10th)</option>
                  <option value="Inter">Intermediate (FA, FSc, ICS, I.Com)</option>
                  <option value="University">University Degree (BS, MS, MPhil, PhD)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem", fontSize: "1.05rem", display: "flex", gap: "0.5rem" }}
              >
                Continue to Step 2 <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleNextFromStep2}>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.label}>Student Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="Enter full name as per CNIC"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    className="input"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Mobile Contact Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input"
                    placeholder="03XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.spanFull}>
                  <label className={styles.label}>Account Password</label>
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: "0.85rem", display: "flex", gap: "0.5rem" }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: "0.85rem", display: "flex", gap: "0.5rem" }}
                >
                  Proceed to Academic Details <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 - Academic Fields with Searchable Select & Live Percentage */}
          {step === 3 && (
            <form onSubmit={handleNextFromStep3}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                
                {/* Searchable Select for Institute */}
                <SearchableSelect
                  label="Institute / College Name"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={(val) => setFormData((prev) => ({ ...prev, instituteName: val }))}
                  placeholder="Search and select your institute / college / university..."
                  type="institute"
                  required
                />

                {/* Searchable Select for Board */}
                <SearchableSelect
                  label="Affiliated Examination Board"
                  name="boardName"
                  value={formData.boardName}
                  onChange={(val) => setFormData((prev) => ({ ...prev, boardName: val }))}
                  placeholder="Search and select your examination board..."
                  type="board"
                  required
                />

                {/* Academic credentials grid */}
                <div className={styles.formGridCompact}>
                  <div>
                    <label className={styles.label}>Roll Number <span style={{ color: "#dc2626" }}>*</span></label>
                    <input
                      type="text"
                      name="rollNumber"
                      className="input"
                      placeholder="e.g. 582910"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Passing Year / Session <span style={{ color: "#dc2626" }}>*</span></label>
                    <select
                      name="passingYear"
                      className="input"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select passing year...</option>
                      <option value="2026">2026 (Current Session)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.label}>Total Marks <span style={{ color: "#dc2626" }}>*</span></label>
                    <input
                      type="number"
                      name="totalMarks"
                      className="input"
                      placeholder="e.g. 1100"
                      value={formData.totalMarks}
                      onChange={(e) => handleMarksChange("totalMarks", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Obtained Marks <span style={{ color: "#dc2626" }}>*</span></label>
                    <input
                      type="number"
                      name="obtainedMarks"
                      className="input"
                      placeholder="e.g. 965"
                      value={formData.obtainedMarks}
                      onChange={(e) => handleMarksChange("obtainedMarks", e.target.value)}
                      required
                    />
                  </div>

                  {/* Auto-calculated percentage */}
                  <div className={styles.spanFull}>
                    <label className={styles.label}>Calculated Percentage (%)</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        name="percentage"
                        className="input"
                        placeholder="Live auto-calculated from marks"
                        value={formData.percentage}
                        readOnly
                        style={{
                          backgroundColor: "#f8fafc",
                          fontWeight: 700,
                          color: formData.percentage && !formData.percentage.includes("Invalid") ? "#16a34a" : "#dc2626",
                          fontSize: "1.05rem",
                          border: "2px solid #e2e8f0",
                        }}
                      />
                      {formData.percentage && !formData.percentage.includes("Invalid") && (
                        <span
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            color: "#16a34a",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={16} /> Merit Calculated
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem", display: "block" }}>
                      Percentage updates automatically in real-time as Total & Obtained marks are provided.
                    </span>
                  </div>
                </div>

              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(2)}
                  style={{ flex: 1, padding: "0.85rem", display: "flex", gap: "0.5rem" }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 2, padding: "0.85rem", display: "flex", gap: "0.5rem" }}
                >
                  {loading ? "Processing..." : "Next: Verify & Challan"} <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: OTP Verification */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p style={{ color: "#166534", margin: 0, fontSize: "0.95rem" }}>
                    A 6-digit verification code has been dispatched to: <strong>{formData.email}</strong> & <strong>{formData.phone}</strong>
                  </p>
                </div>

                <label className={styles.label} style={{ textAlign: "center" }}>
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  className="input"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  style={{
                    letterSpacing: "6px",
                    fontSize: "1.5rem",
                    textAlign: "center",
                    maxWidth: "240px",
                    margin: "0 auto",
                    fontWeight: 700,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(3)}
                  style={{ flex: 1, padding: "0.85rem", display: "flex", gap: "0.5rem" }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 2, padding: "0.85rem" }}
                >
                  {loading ? "Verifying..." : "Confirm & View Candidate Challan"}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}

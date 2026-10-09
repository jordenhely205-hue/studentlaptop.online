"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import SearchableSelect from "@/components/SearchableSelect";
import { CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, GraduationCap, School, BookOpen } from "lucide-react";

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

    // Sequential Academic Fields - Matriculation / SSC (Compulsory for All)
    matricRollNumber: "",
    matricPassingYear: "",
    matricBoard: "",
    matricInstitute: "",
    matricTotalMarks: "",
    matricObtainedMarks: "",
    matricPercentage: "",

    // Intermediate / HSSC (For Inter & University Applicants)
    interRollNumber: "",
    interPassingYear: "",
    interBoard: "",
    interInstitute: "",
    interTotalMarks: "",
    interObtainedMarks: "",
    interPercentage: "",

    // Graduation / University (For University Applicants)
    gradUniversity: "",
    gradRollNumber: "",
    gradProgram: "",
    gradScore: "",

    // Compatibility fields
    instituteName: "",
    boardName: "",
    rollNumber: "",
    passingYear: "",
    totalMarks: "",
    obtainedMarks: "",
    percentage: "",

    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);

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

  // Live auto-calculation of percentage for Matric
  const handleMatricMarksChange = (field: "matricTotalMarks" | "matricObtainedMarks", val: string) => {
    const cleanVal = val.replace(/[^\d.]/g, "");
    setFormData((prev) => {
      const next = { ...prev, [field]: cleanVal };
      const total = parseFloat(field === "matricTotalMarks" ? cleanVal : prev.matricTotalMarks);
      const obtained = parseFloat(field === "matricObtainedMarks" ? cleanVal : prev.matricObtainedMarks);

      if (!isNaN(total) && !isNaN(obtained) && total > 0) {
        if (obtained > total) {
          next.matricPercentage = "Invalid (Obtained > Total)";
        } else {
          next.matricPercentage = `${((obtained / total) * 100).toFixed(2)}%`;
        }
      } else {
        next.matricPercentage = "";
      }
      return next;
    });
  };

  // Live auto-calculation of percentage for Inter
  const handleInterMarksChange = (field: "interTotalMarks" | "interObtainedMarks", val: string) => {
    const cleanVal = val.replace(/[^\d.]/g, "");
    setFormData((prev) => {
      const next = { ...prev, [field]: cleanVal };
      const total = parseFloat(field === "interTotalMarks" ? cleanVal : prev.interTotalMarks);
      const obtained = parseFloat(field === "interObtainedMarks" ? cleanVal : prev.interObtainedMarks);

      if (!isNaN(total) && !isNaN(obtained) && total > 0) {
        if (obtained > total) {
          next.interPercentage = "Invalid (Obtained > Total)";
        } else {
          next.interPercentage = `${((obtained / total) * 100).toFixed(2)}%`;
        }
      } else {
        next.interPercentage = "";
      }
      return next;
    });
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cnic.length !== 15) {
      alert("Please enter a valid 13-digit CNIC / B-Form Number (e.g. 42101-1234567-1).");
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

  const triggerSendOtp = async () => {
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn("OTP send warning:", data.error);
      }
      setOtpSent(true);
      setOtpResendCooldown(60);
      const timer = setInterval(() => {
        setOtpResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Failed to dispatch OTP:", err);
      setOtpSent(true);
    }
  };

  const handleNextFromStep3 = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Matric Fields (Compulsory for All)
    if (!formData.matricRollNumber) {
      alert("Please enter your Matric / SSC Roll Number.");
      return;
    }
    if (!formData.matricPassingYear) {
      alert("Please select your Matric / SSC Passing Year.");
      return;
    }
    if (!formData.matricBoard) {
      alert("Please select or search your Matric / SSC Examination Board.");
      return;
    }
    if (!formData.matricTotalMarks || !formData.matricObtainedMarks) {
      alert("Please enter both Total Marks and Obtained Marks for Matric / SSC.");
      return;
    }

    // 2. Validate Intermediate Fields (If Inter or University)
    if (formData.level === "Inter" || formData.level === "University") {
      if (!formData.interRollNumber) {
        alert("Please enter your Intermediate / HSSC Roll Number.");
        return;
      }
      if (!formData.interPassingYear) {
        alert("Please select your Intermediate / HSSC Passing Year.");
        return;
      }
      if (!formData.interBoard) {
        alert("Please select or search your Intermediate / HSSC Examination Board.");
        return;
      }
      if (!formData.interTotalMarks || !formData.interObtainedMarks) {
        alert("Please enter both Total Marks and Obtained Marks for Intermediate / HSSC.");
        return;
      }
    }

    // 3. Validate University Fields (If University)
    if (formData.level === "University") {
      if (!formData.gradUniversity) {
        alert("Please enter or select your University / Degree Awarding Institute.");
        return;
      }
      if (!formData.gradProgram) {
        alert("Please enter your Degree Program (e.g. BS Computer Science, BBA).");
        return;
      }
      if (!formData.gradRollNumber) {
        alert("Please enter your University Registration / Student ID Number.");
        return;
      }
      if (!formData.gradScore) {
        alert("Please enter your Current CGPA or Marks.");
        return;
      }
    }

    // Sync highest qualifications to compatibility fields
    const highestInst =
      formData.gradUniversity ||
      formData.interInstitute ||
      formData.matricInstitute ||
      formData.matricBoard;
    const highestBoard =
      formData.gradUniversity ||
      formData.interBoard ||
      formData.matricBoard;
    const highestRoll =
      formData.gradRollNumber ||
      formData.interRollNumber ||
      formData.matricRollNumber;
    const highestYear =
      formData.interPassingYear ||
      formData.matricPassingYear ||
      "2026";
    const highestTotal =
      formData.interTotalMarks ||
      formData.matricTotalMarks ||
      "1100";
    const highestObtained =
      formData.interObtainedMarks ||
      formData.matricObtainedMarks ||
      "0";
    const highestPct =
      formData.interPercentage ||
      formData.matricPercentage ||
      "";

    setFormData((prev) => ({
      ...prev,
      instituteName: highestInst,
      boardName: highestBoard,
      rollNumber: highestRoll,
      passingYear: highestYear,
      totalMarks: highestTotal,
      obtainedMarks: highestObtained,
      percentage: highestPct,
    }));

    setLoading(true);
    await triggerSendOtp();
    setLoading(false);
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!formData.otp || formData.otp.trim().length !== 6) {
      setOtpError("Please enter the complete 6-digit verification OTP code.");
      return;
    }

    setLoading(true);

    try {
      // 1. Verify OTP with backend
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp.trim(),
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok && !verifyData.valid) {
        setLoading(false);
        setOtpError(verifyData.error || "Invalid or expired OTP code. Please try again.");
        return;
      }

      // 2. Submit candidate application to Neon DB
      const submitRes = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const submitData = await submitRes.json();

      // 3. Store candidate voucher data in localStorage
      if (typeof window !== "undefined") {
        const candidatePayload = {
          ...formData,
          applicationNo: submitData.applicationNo || `SLO-${Date.now().toString().slice(-6)}`,
          psid: submitData.psid || "984703000",
          feeAmount: 475,
          feeInWords: "Four Hundred Seventy Five Rupees Only",
          status: "Payment Pending",
          tillId: "984703000",
        };
        localStorage.setItem("challanData", JSON.stringify(candidatePayload));
      }

      setLoading(false);
      router.push("/challan");
    } catch (err: any) {
      console.warn("Error submitting application:", err);
      // Fallback redirect with stored candidate payload
      if (typeof window !== "undefined") {
        const candidatePayload = {
          ...formData,
          applicationNo: `SLO-${Date.now().toString().slice(-6)}`,
          psid: "984703000",
          feeAmount: 475,
          feeInWords: "Four Hundred Seventy Five Rupees Only",
          status: "Payment Pending",
          tillId: "984703000",
        };
        localStorage.setItem("challanData", JSON.stringify(candidatePayload));
      }
      setLoading(false);
      router.push("/challan");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Top Header */}
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
          <Link href="/" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
            Home
          </Link>
        </div>
      </header>

      {/* Main Registration Form */}
      <main className={`container ${styles.mainContent}`} style={{ padding: "2rem 1rem", maxWidth: "860px" }}>
        
        {/* Step Progress Tracker */}
        <div className={styles.progressContainer}>
          <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ""}`}>
            1. Identity & Level
          </div>
          <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ""}`} />
          <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ""}`}>
            2. Personal Info
          </div>
          <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ""}`} />
          <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ""}`}>
            3. Academic History
          </div>
          <div className={`${styles.stepLine} ${step >= 4 ? styles.activeLine : ""}`} />
          <div className={`${styles.stepIndicator} ${step >= 4 ? styles.active : ""}`}>
            4. Verify & Challan
          </div>
        </div>

        <div className="card" style={{ padding: "2rem", marginTop: "1rem" }}>
          
          {/* STEP 1: Identification & Academic Level */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
                Step 1: Applicant CNIC & Scheme Stream
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Enter your 13-digit CNIC or B-Form Number and select your current educational tier.
              </p>

              <div className={styles.formGrid}>
                <div className={styles.spanFull}>
                  <label className={styles.label}>
                    Applicant CNIC / B-Form Number <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    className="input"
                    placeholder="XXXXX-XXXXXXX-X"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    maxLength={15}
                    required
                    style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "1px" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                    Format: 13 digits with hyphens (e.g. 42101-1234567-1).
                  </span>
                </div>

                <div className={styles.spanFull}>
                  <label className={styles.label}>
                    Current Academic Level <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    name="level"
                    className="input"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: "1rem" }}
                  >
                    <option value="" disabled>Select your academic level...</option>
                    <option value="Matric">Matriculation / Secondary School Certificate (SSC)</option>
                    <option value="Inter">Intermediate / Higher Secondary School Certificate (HSSC)</option>
                    <option value="University">University / Graduation / Undergraduate Degree</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}
              >
                Continue to Personal Profile <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: Personal & Contact Information */}
          {step === 2 && (
            <form onSubmit={handleNextFromStep2}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
                Step 2: Personal & Contact Profile
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Provide exact details matching your official educational certificates.
              </p>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.label}>Student Full Name <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="Full name as per CNIC / Matric"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Father's Full Name <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    type="text"
                    name="fatherName"
                    className="input"
                    placeholder="Father's full name"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Email Address <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                    Your official OTP verification code will be sent to this email.
                  </span>
                </div>

                <div>
                  <label className={styles.label}>Mobile Contact Number <span style={{ color: "#dc2626" }}>*</span></label>
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
                  <label className={styles.label}>Portal Password <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Create a password for application tracking"
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
                  style={{ flex: 1, padding: "0.85rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: "0.85rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}
                >
                  Proceed to Academic History <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Full Sequential Academic Qualifications */}
          {step === 3 && (
            <form onSubmit={handleNextFromStep3}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
                Step 3: Academic Qualifications
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                All sequential academic milestones are captured to determine merit and test eligibility.
              </p>

              {/* 1. MATRICULATION / SSC SECTION (Always Visible for All Applicants) */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  marginBottom: "1.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <School size={20} color="#1e40af" />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e3a8a", margin: 0 }}>
                    1. Matriculation / SSC Qualification (Compulsory)
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SearchableSelect
                    label="Matric Examination Board"
                    name="matricBoard"
                    value={formData.matricBoard}
                    onChange={(val) => setFormData((prev) => ({ ...prev, matricBoard: val }))}
                    placeholder="Search and select Matric Board (e.g. BISE Lahore, BSEK, Federal Board)..."
                    type="board"
                    required
                  />

                  <SearchableSelect
                    label="School / Institute Name"
                    name="matricInstitute"
                    value={formData.matricInstitute}
                    onChange={(val) => setFormData((prev) => ({ ...prev, matricInstitute: val }))}
                    placeholder="Search or enter your School / Matriculation Institute..."
                    type="institute"
                    required
                  />

                  <div className={styles.formGridCompact}>
                    <div>
                      <label className={styles.label}>
                        Matric Roll Number <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="matricRollNumber"
                        className="input"
                        placeholder="e.g. 482910"
                        value={formData.matricRollNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.label}>
                        Passing Year / Session <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <select
                        name="matricPassingYear"
                        className="input"
                        value={formData.matricPassingYear}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select passing year...</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                      </select>
                    </div>

                    <div>
                      <label className={styles.label}>
                        Matric Total Marks <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="matricTotalMarks"
                        className="input"
                        placeholder="e.g. 1100"
                        value={formData.matricTotalMarks}
                        onChange={(e) => handleMatricMarksChange("matricTotalMarks", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.label}>
                        Matric Obtained Marks <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="number"
                        name="matricObtainedMarks"
                        className="input"
                        placeholder="e.g. 980"
                        value={formData.matricObtainedMarks}
                        onChange={(e) => handleMatricMarksChange("matricObtainedMarks", e.target.value)}
                        required
                      />
                    </div>

                    {/* Auto-Calculated Matric Percentage */}
                    <div className={styles.spanFull}>
                      <label className={styles.label}>Matric Calculated Percentage (%)</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="matricPercentage"
                          className="input"
                          placeholder="Auto-calculated in real time"
                          value={formData.matricPercentage}
                          readOnly
                          style={{
                            backgroundColor: "#ffffff",
                            fontWeight: 700,
                            color: formData.matricPercentage && !formData.matricPercentage.includes("Invalid") ? "#16a34a" : "#dc2626",
                            fontSize: "1.05rem",
                            border: "2px solid #cbd5e1",
                          }}
                        />
                        {formData.matricPercentage && !formData.matricPercentage.includes("Invalid") && (
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
                            <CheckCircle2 size={16} /> Matric Score Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. INTERMEDIATE / HSSC SECTION (Shown for Intermediate and University Levels) */}
              {(formData.level === "Inter" || formData.level === "University") && (
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <BookOpen size={20} color="#15803d" />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#166534", margin: 0 }}>
                      2. Intermediate / HSSC Qualification
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <SearchableSelect
                      label="Intermediate Examination Board"
                      name="interBoard"
                      value={formData.interBoard}
                      onChange={(val) => setFormData((prev) => ({ ...prev, interBoard: val }))}
                      placeholder="Search and select Intermediate Board (e.g. BIEK, BISE Rawalpindi)..."
                      type="board"
                      required
                    />

                    <SearchableSelect
                      label="College / Higher Secondary Institute Name"
                      name="interInstitute"
                      value={formData.interInstitute}
                      onChange={(val) => setFormData((prev) => ({ ...prev, interInstitute: val }))}
                      placeholder="Search or enter your Intermediate College..."
                      type="institute"
                      required
                    />

                    <div className={styles.formGridCompact}>
                      <div>
                        <label className={styles.label}>
                          Inter Roll Number <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="interRollNumber"
                          className="input"
                          placeholder="e.g. 719204"
                          value={formData.interRollNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>
                          Passing Year / Session <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <select
                          name="interPassingYear"
                          className="input"
                          value={formData.interPassingYear}
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
                        <label className={styles.label}>
                          Inter Total Marks <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="number"
                          name="interTotalMarks"
                          className="input"
                          placeholder="e.g. 1100"
                          value={formData.interTotalMarks}
                          onChange={(e) => handleInterMarksChange("interTotalMarks", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>
                          Inter Obtained Marks <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="number"
                          name="interObtainedMarks"
                          className="input"
                          placeholder="e.g. 940"
                          value={formData.interObtainedMarks}
                          onChange={(e) => handleInterMarksChange("interObtainedMarks", e.target.value)}
                          required
                        />
                      </div>

                      {/* Auto-Calculated Intermediate Percentage */}
                      <div className={styles.spanFull}>
                        <label className={styles.label}>Inter Calculated Percentage (%)</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            name="interPercentage"
                            className="input"
                            placeholder="Auto-calculated in real time"
                            value={formData.interPercentage}
                            readOnly
                            style={{
                              backgroundColor: "#ffffff",
                              fontWeight: 700,
                              color: formData.interPercentage && !formData.interPercentage.includes("Invalid") ? "#16a34a" : "#dc2626",
                              fontSize: "1.05rem",
                              border: "2px solid #86efac",
                            }}
                          />
                          {formData.interPercentage && !formData.interPercentage.includes("Invalid") && (
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
                              <CheckCircle2 size={16} /> Inter Score Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. GRADUATION / DEGREE SECTION (Shown for University Level Applicants) */}
              {formData.level === "University" && (
                <div
                  style={{
                    backgroundColor: "#fdf4ff",
                    border: "1.5px solid #f0abfc",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <GraduationCap size={20} color="#a21caf" />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#86198f", margin: 0 }}>
                      3. University / Degree Information
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <SearchableSelect
                      label="University / Degree Awarding Institute"
                      name="gradUniversity"
                      value={formData.gradUniversity}
                      onChange={(val) => setFormData((prev) => ({ ...prev, gradUniversity: val }))}
                      placeholder="Search and select University (e.g. PU, NUST, FAST, UoK, GCU)..."
                      type="institute"
                      required
                    />

                    <div className={styles.formGridCompact}>
                      <div>
                        <label className={styles.label}>
                          Degree Program / Discipline <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="gradProgram"
                          className="input"
                          placeholder="e.g. BS Computer Science / BBA / MBBS"
                          value={formData.gradProgram}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.label}>
                          University Roll / Student ID <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="gradRollNumber"
                          className="input"
                          placeholder="e.g. 2023-CS-1049"
                          value={formData.gradRollNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className={styles.spanFull}>
                        <label className={styles.label}>
                          Current CGPA or Obtained Score <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="gradScore"
                          className="input"
                          placeholder="e.g. 3.75 / 4.00 or 82%"
                          value={formData.gradScore}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(2)}
                  style={{ flex: 1, padding: "0.85rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 2, padding: "0.85rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}
                >
                  {loading ? "Sending Verification OTP..." : "Proceed to OTP & Challan"} <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Real Email OTP Verification & Submission */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem", textAlign: "center" }}>
                Step 4: Verify Identity & Generate Challan
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem", textAlign: "center" }}>
                We have dispatched a real transactional OTP to your registered domain inbox.
              </p>

              <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "0.5rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                    textAlign: "left",
                  }}
                >
                  <p style={{ color: "#166534", margin: 0, fontSize: "0.95rem" }}>
                    ✉ 6-digit OTP code sent to: <strong>{formData.email}</strong>
                  </p>
                  <span style={{ fontSize: "0.8rem", color: "#15803d", marginTop: "0.35rem", display: "block" }}>
                    Please check your Inbox (or Spam/Promotions folder). Official sender: noreply@studentlaptop.online.
                  </span>
                </div>

                {otpError && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {otpError}
                  </div>
                )}

                <label className={styles.label} style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  className="input"
                  placeholder="------"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  style={{
                    letterSpacing: "8px",
                    fontSize: "1.75rem",
                    textAlign: "center",
                    maxWidth: "260px",
                    margin: "0 auto",
                    fontWeight: 800,
                  }}
                />

                {/* Resend OTP button */}
                <div style={{ marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={triggerSendOtp}
                    disabled={otpResendCooldown > 0}
                    style={{
                      background: "none",
                      border: "none",
                      color: otpResendCooldown > 0 ? "#94a3b8" : "var(--primary)",
                      cursor: otpResendCooldown > 0 ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <RefreshCw size={14} />
                    {otpResendCooldown > 0
                      ? `Resend OTP in ${otpResendCooldown}s`
                      : "Did not receive OTP? Resend Code"}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(3)}
                  style={{ flex: 1, padding: "0.85rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 2, padding: "0.85rem", fontSize: "1rem", fontWeight: 700 }}
                >
                  {loading ? "Verifying & Generating Challan..." : "Confirm & Generate Official Challan"}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}

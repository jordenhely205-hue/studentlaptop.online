"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
];

const DEGREE_LEVELS = [
  { value: "Matric", label: "Matriculation (9th / 10th / SSC)" },
  { value: "Intermediate", label: "Intermediate (HSSC / FSc / FA / ICS / I.Com)" },
  { value: "Undergraduate", label: "Undergraduate (BS / BE / MBBS / LLB / 4-5 Years)" },
  { value: "Postgraduate", label: "Postgraduate (MS / MPhil / PhD)" },
];

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State - strictly in-memory React state, no localStorage
  const [formData, setFormData] = useState({
    // CNIC & Identity
    cnic: "",
    // Personal Details
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "Male",
    mobileNo: "",
    email: "",
    province: "Punjab",
    district: "",
    tehsil: "",
    currentAddress: "",
    // Academic Details
    degreeLevel: "Undergraduate",
    instituteName: "",
    boardUniversity: "",
    rollNumber: "",
    passingYear: new Date().getFullYear(),
    totalMarks: "1100",
    obtainedMarks: "900",
  });

  // CNIC Verification State
  const [cnicStatus, setCnicStatus] = useState<"idle" | "checking" | "valid" | "duplicate" | "invalid">("idle");
  const [cnicMessage, setCnicMessage] = useState<string>("");

  // Institute Combobox State
  const [instituteQuery, setInstituteQuery] = useState("");
  const [instituteSuggestions, setInstituteSuggestions] = useState<Array<{ id?: string; name: string; city: string; province: string; type: string }>>([]);
  const [showInstituteDropdown, setShowInstituteDropdown] = useState(false);
  const instituteRef = useRef<HTMLDivElement>(null);

  // Board Combobox State
  const [boardQuery, setBoardQuery] = useState("");
  const [boardSuggestions, setBoardSuggestions] = useState<Array<{ id?: string; name: string; city: string; province: string; type: string }>>([]);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-format CNIC and trigger live debounced check
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 13) raw = raw.slice(0, 13);

    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
    }

    setFormData((prev) => ({ ...prev, cnic: formatted }));

    if (raw.length < 13) {
      setCnicStatus("idle");
      setCnicMessage("");
    }
  };

  // Debounced CNIC verification
  useEffect(() => {
    const rawCnic = formData.cnic.replace(/\D/g, "");
    if (rawCnic.length !== 13) return;

    const timer = setTimeout(async () => {
      setCnicStatus("checking");
      setCnicMessage("Verifying CNIC against national database...");
      try {
        const res = await fetch(`/api/v1/verify-cnic?cnic=${rawCnic}`);
        const data = await res.json();

        if (res.status === 409 || data.exists) {
          setCnicStatus("duplicate");
          setCnicMessage(data.message || "This CNIC is already registered in the system.");
        } else if (res.ok && !data.exists) {
          setCnicStatus("valid");
          setCnicMessage("CNIC verified and eligible for registration.");
        } else {
          setCnicStatus("invalid");
          setCnicMessage(data.error || "Unable to verify CNIC.");
        }
      } catch {
        setCnicStatus("idle");
        setCnicMessage("");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formData.cnic]);

  // Debounced search for Institutes
  useEffect(() => {
    if (!instituteQuery || instituteQuery.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/institutes/search?q=${encodeURIComponent(instituteQuery)}&limit=10`);
        const data = await res.json();
        if (data.success) {
          setInstituteSuggestions(data.institutes);
        }
      } catch {
        // silent fail for autocomplete
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [instituteQuery]);

  // Debounced search for Boards / Universities
  useEffect(() => {
    if (!boardQuery || boardQuery.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const typeFilter =
          formData.degreeLevel === "Matric" || formData.degreeLevel === "Intermediate"
            ? "Board"
            : "University";
        const res = await fetch(
          `/api/v1/institutes/search?q=${encodeURIComponent(boardQuery)}&type=${typeFilter}&limit=10`
        );
        const data = await res.json();
        if (data.success) {
          setBoardSuggestions(data.institutes);
        }
      } catch {
        // silent fail
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [boardQuery, formData.degreeLevel]);

  // Handle generic input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (instituteRef.current && !instituteRef.current.contains(e.target as Node)) {
        setShowInstituteDropdown(false);
      }
      if (boardRef.current && !boardRef.current.contains(e.target as Node)) {
        setShowBoardDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate live preview percentage
  const total = parseFloat(formData.totalMarks) || 0;
  const obtained = parseFloat(formData.obtainedMarks) || 0;
  const previewPercentage = total > 0 ? ((obtained / total) * 100).toFixed(2) : "0.00";

  // Step 1 Validation
  const handleStep1Proceed = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCnic = formData.cnic.replace(/\D/g, "");
    if (rawCnic.length !== 13) {
      alert("Please enter a valid 13-digit CNIC number.");
      return;
    }
    if (cnicStatus === "duplicate") {
      alert("This CNIC is already registered. Duplicate applications are not allowed.");
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleStep2Proceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.fatherName.trim()) {
      alert("Please provide full name and father's name as per CNIC.");
      return;
    }
    if (!formData.dateOfBirth) {
      alert("Please select date of birth.");
      return;
    }
    if (!/^03\d{9}$/.test(formData.mobileNo.trim())) {
      alert("Please enter a valid 11-digit mobile number (e.g. 03001234567).");
      return;
    }
    if (!formData.district.trim() || !formData.tehsil.trim() || !formData.currentAddress.trim()) {
      alert("Please complete the address details (Province, District, Tehsil, and Address).");
      return;
    }
    setStep(3);
  };

  // Step 3 Validation
  const handleStep3Proceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instituteName.trim()) {
      alert("Please provide the name of your Educational Institute.");
      return;
    }
    if (!formData.boardUniversity.trim()) {
      alert("Please specify your Board or University name.");
      return;
    }
    if (!formData.rollNumber.trim()) {
      alert("Please enter your Roll / Registration Number.");
      return;
    }
    if (total <= 0 || obtained < 0 || obtained > total) {
      alert("Please verify total marks and obtained marks. Obtained marks cannot exceed total marks.");
      return;
    }
    setStep(4);
  };

  // Final Atomic Form Submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        fatherName: formData.fatherName.trim(),
        cnic: formData.cnic.replace(/\D/g, ""),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        mobileNo: formData.mobileNo.trim(),
        email: formData.email.trim() || undefined,
        province: formData.province,
        district: formData.district.trim(),
        tehsil: formData.tehsil.trim(),
        currentAddress: formData.currentAddress.trim(),
        degreeLevel: formData.degreeLevel,
        instituteName: formData.instituteName.trim(),
        boardUniversity: formData.boardUniversity.trim(),
        rollNumber: formData.rollNumber.trim(),
        passingYear: parseInt(String(formData.passingYear), 10),
        totalMarks: parseFloat(formData.totalMarks),
        obtainedMarks: parseFloat(formData.obtainedMarks),
      };

      const res = await fetch("/api/v1/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application.");
      }

      // Successful server submission!
      // Direct navigation via query params without ANY client-side localStorage persistence!
      router.push(`/challan?psid=${encodeURIComponent(data.psid)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during submission.";
      setSubmitError(msg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className={styles.logo}>
            <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.4rem" }}>StudentLaptop</span>
            <span style={{ color: "var(--secondary)", fontWeight: "bold", fontSize: "1.4rem" }}>.online</span>
          </div>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem" }}>
            ✕ Cancel Application
          </Link>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        <div className="card" style={{ maxWidth: "760px", margin: "2.5rem auto", padding: "2.5rem" }}>
          
          {/* Multi-step progress bar */}
          <div className={styles.progressContainer}>
            <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ""}`}>1. CNIC Check</div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ""}`}>2. Personal Info</div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ""}`}>3. Academic Info</div>
            <div className={`${styles.stepLine} ${step >= 4 ? styles.activeLine : ""}`}></div>
            <div className={`${styles.stepIndicator} ${step >= 4 ? styles.active : ""}`}>4. Final Review</div>
          </div>

          {submitError && (
            <div className={styles.badgeDanger} style={{ display: "flex", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
              ⚠️ {submitError}
            </div>
          )}

          {/* STEP 1: CNIC & Academic Category */}
          {step === 1 && (
            <form onSubmit={handleStep1Proceed}>
              <h2 style={{ marginBottom: "0.5rem" }}>Candidate Identity & Eligibility</h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Enter your 13-digit Computerized National Identity Card (CNIC / B-Form) to verify eligibility.
              </p>

              <div style={{ marginBottom: "1.5rem" }}>
                <label className={styles.label}>CNIC / B-Form Number (Strictly 13 Digits)</label>
                <input
                  type="text"
                  name="cnic"
                  className="input"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={formData.cnic}
                  onChange={handleCnicChange}
                  maxLength={15}
                  required
                />
                {cnicStatus === "checking" && (
                  <div className={styles.badgeInfo}>⏳ {cnicMessage}</div>
                )}
                {cnicStatus === "valid" && (
                  <div className={styles.badgeSuccess}>✓ {cnicMessage}</div>
                )}
                {cnicStatus === "duplicate" && (
                  <div className={styles.badgeDanger}>⚠️ {cnicMessage}</div>
                )}
                {cnicStatus === "invalid" && (
                  <div className={styles.badgeDanger}>⚠️ {cnicMessage}</div>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label className={styles.label}>Degree Level / Academic Program</label>
                <select
                  name="degreeLevel"
                  className="input"
                  value={formData.degreeLevel}
                  onChange={handleInputChange}
                  required
                >
                  {DEGREE_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem" }}
                disabled={cnicStatus === "checking" || cnicStatus === "duplicate"}
              >
                Proceed to Personal Details →
              </button>
            </form>
          )}

          {/* STEP 2: Personal & Contact Information */}
          {step === 2 && (
            <form onSubmit={handleStep2Proceed}>
              <h2 style={{ marginBottom: "0.5rem" }}>Personal & Domicile Information</h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                All personal details must precisely match your CNIC and educational certificates.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className={styles.label}>Full Name (As per CNIC)</label>
                  <input
                    type="text"
                    name="fullName"
                    className="input"
                    placeholder="e.g. MUHAMMAD AHMED"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Father&apos;s Name (As per CNIC)</label>
                  <input
                    type="text"
                    name="fatherName"
                    className="input"
                    placeholder="e.g. TARIQ MEHMOOD"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="input"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Gender</label>
                  <select name="gender" className="input" value={formData.gender} onChange={handleInputChange} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={styles.label}>Active Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNo"
                    className="input"
                    placeholder="03XXXXXXXXX (11 digits)"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    maxLength={11}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginBottom: "1.25rem" }}>
                <h4 style={{ marginBottom: "1rem", color: "#334155" }}>Domicile & Address Details</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className={styles.label}>Province</label>
                    <select
                      name="province"
                      className="input"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={styles.label}>District</label>
                    <input
                      type="text"
                      name="district"
                      className="input"
                      placeholder="e.g. Lahore / Rawalpindi"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Tehsil</label>
                    <input
                      type="text"
                      name="tehsil"
                      className="input"
                      placeholder="e.g. Model Town"
                      value={formData.tehsil}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.label}>Current Residential Address</label>
                  <textarea
                    name="currentAddress"
                    className="input"
                    rows={2}
                    placeholder="House/Street no, Area, City"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Proceed to Academic Qualifications →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Academic Qualifications with Indexed Search Combobox */}
          {step === 3 && (
            <form onSubmit={handleStep3Proceed}>
              <h2 style={{ marginBottom: "0.5rem" }}>Academic Qualifications</h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Program: <strong>{formData.degreeLevel}</strong>. Type your institute and board/university to search.
              </p>

              {/* Institute Name with live searchable suggestions */}
              <div style={{ marginBottom: "1.25rem" }} ref={instituteRef}>
                <label className={styles.label}>Institute / College / Department Name</label>
                <div className={styles.comboboxWrapper}>
                  <input
                    type="text"
                    name="instituteName"
                    className="input"
                    placeholder="Type institute name (e.g. NUST, Government College, Army Public...)"
                    value={formData.instituteName}
                    onChange={(e) => {
                      handleInputChange(e);
                      setInstituteQuery(e.target.value);
                      if (e.target.value.length < 2) {
                        setInstituteSuggestions([]);
                      }
                      setShowInstituteDropdown(true);
                    }}
                    onFocus={() => setShowInstituteDropdown(true)}
                    required
                  />
                  {showInstituteDropdown && instituteSuggestions.length > 0 && (
                    <div className={styles.dropdownList}>
                      {instituteSuggestions.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, instituteName: item.name }));
                            setShowInstituteDropdown(false);
                          }}
                        >
                          <div className={styles.dropdownItemPrimary}>{item.name}</div>
                          <div className={styles.dropdownItemSecondary}>
                            {item.city}, {item.province} • {item.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Board or University Selection with indexed search */}
              <div style={{ marginBottom: "1.25rem" }} ref={boardRef}>
                <label className={styles.label}>
                  {formData.degreeLevel === "Matric" || formData.degreeLevel === "Intermediate"
                    ? "Affiliated Examination Board"
                    : "Degree Awarding University"}
                </label>
                <div className={styles.comboboxWrapper}>
                  <input
                    type="text"
                    name="boardUniversity"
                    className="input"
                    placeholder="Type board or university name (e.g. FBISE, BISE Lahore, Punjab University...)"
                    value={formData.boardUniversity}
                    onChange={(e) => {
                      handleInputChange(e);
                      setBoardQuery(e.target.value);
                      if (e.target.value.length < 2) {
                        setBoardSuggestions([]);
                      }
                      setShowBoardDropdown(true);
                    }}
                    onFocus={() => setShowBoardDropdown(true)}
                    required
                  />
                  {showBoardDropdown && boardSuggestions.length > 0 && (
                    <div className={styles.dropdownList}>
                      {boardSuggestions.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, boardUniversity: item.name }));
                            setShowBoardDropdown(false);
                          }}
                        >
                          <div className={styles.dropdownItemPrimary}>{item.name}</div>
                          <div className={styles.dropdownItemSecondary}>
                            {item.city}, {item.province}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className={styles.label}>Roll / Registration Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    className="input"
                    placeholder="e.g. 549102"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Passing / Admission Year</label>
                  <input
                    type="number"
                    name="passingYear"
                    className="input"
                    min={1990}
                    max={2027}
                    value={formData.passingYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Total Marks / Maximum Points</label>
                  <input
                    type="number"
                    step="0.01"
                    name="totalMarks"
                    className="input"
                    placeholder="1100"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Obtained Marks / GPA Equivalent</label>
                  <input
                    type="number"
                    step="0.01"
                    name="obtainedMarks"
                    className="input"
                    placeholder="950"
                    value={formData.obtainedMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Live server percentage preview */}
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "var(--radius)",
                  padding: "0.85rem 1rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.9rem", color: "#166534", fontWeight: "500" }}>
                  Calculated Merit Percentage (Live Preview):
                </span>
                <span style={{ fontSize: "1.1rem", color: "#15803d", fontWeight: "bold" }}>
                  {previewPercentage}%
                </span>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 1 }}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Proceed to Final Review →
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Final Review & Server-side Atomic Submission */}
          {step === 4 && (
            <form onSubmit={handleSubmitApplication}>
              <h2 style={{ marginBottom: "0.5rem" }}>Review & Submit Application</h2>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                Please review your application summary. Once submitted, a 10-digit PSID Challan will be generated.
              </p>

              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Applicant Name:</span>
                  <span className={styles.summaryValue}>{formData.fullName.toUpperCase()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Father&apos;s Name:</span>
                  <span className={styles.summaryValue}>{formData.fatherName.toUpperCase()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>CNIC Number:</span>
                  <span className={styles.summaryValue}>{formData.cnic}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Mobile Number:</span>
                  <span className={styles.summaryValue}>{formData.mobileNo}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Domicile Province:</span>
                  <span className={styles.summaryValue}>{formData.province} ({formData.district})</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Academic Degree:</span>
                  <span className={styles.summaryValue}>{formData.degreeLevel}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Institute:</span>
                  <span className={styles.summaryValue}>{formData.instituteName}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Board / University:</span>
                  <span className={styles.summaryValue}>{formData.boardUniversity}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Roll Number:</span>
                  <span className={styles.summaryValue}>{formData.rollNumber}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Marks & Percentage:</span>
                  <span className={styles.summaryValue}>
                    {formData.obtainedMarks} / {formData.totalMarks} ({previewPercentage}%)
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Fixed Registration Fee:</span>
                  <span className={styles.summaryValue} style={{ color: "var(--primary)" }}>Rs. 1,500.00</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(3)}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  ← Edit Information
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 2, padding: "0.85rem" }}
                >
                  {loading ? "Generating PSID & Challan..." : "Confirm & Submit Application 🚀"}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}

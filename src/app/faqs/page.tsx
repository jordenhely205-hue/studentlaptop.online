import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";

export default function FaqsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <header className={styles.header}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <Link href="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </header>

      <main className="container" style={{ padding: "4rem 0" }}>
        <div className="card" style={{ padding: "3rem", margin: "0 auto", maxWidth: "800px" }}>
          <h1 style={{ color: "var(--primary)", marginBottom: "2rem", fontWeight: 800 }}>
            Frequently Asked Questions
          </h1>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1.25rem" }}>
              <h3 style={{ color: "#1e3a8a", marginBottom: "0.5rem", fontSize: "1.15rem" }}>
                1. Who is eligible for Student Laptop Online?
              </h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                Matriculation, Intermediate (FA, FSc, ICS, I.Com), and University undergraduate & postgraduate students currently enrolled in recognized educational institutions who have achieved at least 60% marks in their recent examination are eligible.
              </p>
            </div>

            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1.25rem" }}>
              <h3 style={{ color: "#1e3a8a", marginBottom: "0.5rem", fontSize: "1.15rem" }}>
                2. What is the application processing fee and how do I pay?
              </h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                The application processing fee is <strong>Rs. 475/- (Four Hundred Seventy Five Rupees Only)</strong>. Complete payment instructions, merchant Till ID, and official QR scanner are provided on your personalized printable Challan Voucher upon completing the online registration form.
              </p>
            </div>

            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1.25rem" }}>
              <h3 style={{ color: "#1e3a8a", marginBottom: "0.5rem", fontSize: "1.15rem" }}>
                3. What is the Online Test and what does it cover?
              </h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                The Online Assessment Test consists of 50 Multiple Choice Questions (MCQs) covering Basic IT & Computer Literacy (25%), English Comprehension (25%), General Knowledge (25%), and Core Academic Subject Knowledge (25%). Final merit is formulated based on 50% academic marks and 50% online test score.
              </p>
            </div>

            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1.25rem" }}>
              <h3 style={{ color: "#1e3a8a", marginBottom: "0.5rem", fontSize: "1.15rem" }}>
                4. How can I track my application status?
              </h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                Upon completing registration and submitting your payment Transaction ID (TID), visit the "Login / Track" section using your registered CNIC and password to monitor your verification status in real time.
              </p>
            </div>

            <div style={{ paddingBottom: "1rem" }}>
              <h3 style={{ color: "#1e3a8a", marginBottom: "0.5rem", fontSize: "1.15rem" }}>
                5. What if I entered incorrect academic details?
              </h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                Providing inaccurate data may cause application disqualification. If you made an error during registration, please contact our support team immediately at: <a href="mailto:info@studentlaptop.online" style={{ color: "var(--primary)", fontWeight: 600 }}>info@studentlaptop.online</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

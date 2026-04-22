import Link from "next/link";
import styles from "../page.module.css";

export default function FaqsPage() {
  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc"}}>
      <header className={styles.header}>
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className={styles.logo}>
            <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
            <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
          </div>
          <Link href="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </header>

      <main className="container" style={{padding: "4rem 0"}}>
        <div className="card" style={{padding: "3rem", margin: "0 auto", maxWidth: "800px"}}>
          <h1 style={{color: "var(--primary)", marginBottom: "2rem"}}>Frequently Asked Questions</h1>
          
          <div style={{display: "flex", flexDirection: "column", gap: "1.5rem"}}>
            <div style={{borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem"}}>
              <h3 style={{color: "#1e3a8a", marginBottom: "0.5rem"}}>1. Who is eligible for this scheme?</h3>
              <p style={{color: "#475569"}}>Matric, Intermediate (FA/FSc), and University level students currently enrolled in recognized public sector institutes in Punjab are eligible.</p>
            </div>
            <div style={{borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem"}}>
              <h3 style={{color: "#1e3a8a", marginBottom: "0.5rem"}}>2. What is the Rs. 475 fee for?</h3>
              <p style={{color: "#475569"}}>The Rs. 475 is a non-refundable registration processing fee charged to verify the credentials dynamically from HEC and target Boards.</p>
            </div>
            <div style={{borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem"}}>
              <h3 style={{color: "#1e3a8a", marginBottom: "0.5rem"}}>3. How will I know my application is approved?</h3>
              <p style={{color: "#475569"}}>Upon completing registration, visit the "Application Status" section via your Login Tracker. Your status will update once verification is processed by your Focal Person.</p>
            </div>
            <div style={{paddingBottom: "1rem"}}>
              <h3 style={{color: "#1e3a8a", marginBottom: "0.5rem"}}>4. I entered wrong information. What can I do?</h3>
              <p style={{color: "#475569"}}>As per the General Instructions, providing incorrect information leads to automatic cancellation. You will need to contact studentlaptoponline@gmail.com for further guidance.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

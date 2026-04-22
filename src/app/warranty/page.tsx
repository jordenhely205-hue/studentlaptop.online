import Link from "next/link";
import styles from "../page.module.css";

export default function WarrantyPage() {
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
        <div className="card" style={{padding: "3rem", maxWidth: "800px", margin: "0 auto"}}>
          <h1 style={{color: "var(--primary)", marginBottom: "2rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "1rem"}}>Warranty Guidelines</h1>
          
          <div style={{lineHeight: "1.8", color: "#334155"}}>
            <h3>1. Warranty Period</h3>
            <p style={{marginBottom: "1.5rem"}}>All laptops distributed under the scheme come with a standard 1-year hardware warranty starting from the date of activation/receipt.</p>
            
            <h3>2. What is Covered?</h3>
            <ul style={{marginBottom: "1.5rem", paddingLeft: "1.5rem"}}>
              <li>Motherboard and Processor defects</li>
              <li>RAM and Storage drive failures</li>
              <li>Display Screen malfunctioning (manufacturing defects only)</li>
              <li>Battery issues (within first 6 months)</li>
            </ul>

            <h3>3. What is NOT Covered?</h3>
            <ul style={{marginBottom: "1.5rem", paddingLeft: "1.5rem", color: "#991b1b"}}>
              <li>Physical damage (broken screen, liquid spills, drops)</li>
              <li>Software corruption due to viruses or unauthorized OS installations</li>
              <li>Usage of third-party chargers causing burns</li>
            </ul>

            <h3>4. How to Claim?</h3>
            <p>To claim your warranty, bring the laptop along with your original CNIC and the printed Challan/Allotment letter to your nearest designated Laptop Service Center or contact your University's Focal Person for guidance.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

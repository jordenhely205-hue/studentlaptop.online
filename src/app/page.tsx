import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { SearchIcon, BanknoteIcon, LaptopIcon } from 'lucide-react'; // Using lucide-react since it was installed

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div className={styles.logo}>
            <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
            <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/#eligibility">Eligibility</Link>
            <Link href="/#process">How to Apply</Link>
            <Link href="/login" className="btn btn-secondary">Login / Track</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>Empower Your Future: <br/><span style={{color: "#facc15"}}>Apply for your Laptop!</span></h1>
              <p className={styles.subtitle}>A Digital Initiative for Deserving Students - Register Now!</p>
              <div className={styles.heroActions}>
                <Link href="/check-eligibility" className="btn btn-secondary" style={{padding: '1rem 1.5rem', fontSize: '1.1rem', borderRadius: '50px', marginRight: "1rem"}}>Check Eligibility</Link>
                <Link href="/check-eligibility" className="btn" style={{backgroundColor: "#4ade80", color: "#064e3b", padding: '1rem 1.5rem', fontSize: '1.1rem', borderRadius: '50px'}}>Apply Now ✨</Link>
              </div>
            </div>
            <div className={styles.heroImageWrapper}>
               <Image 
                  src="/hero_students.png" 
                  alt="Students studying" 
                  width={600} 
                  height={400} 
                  className={styles.heroImage}
                  priority
               />
               <div className={styles.feeBadge}>
                 <h3>Rs. 475</h3>
                 <p>Challan</p>
               </div>
            </div>
          </div>
        </section>

        <section id="process" className={styles.processSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Easy 3-Step Process</h2>
            <div className={styles.stepGrid}>
              
              <Link href="/check-eligibility" style={{textDecoration: "none"}}>
                <div className={styles.stepCard} style={{cursor: "pointer", transition: "transform 0.2s"}}>
                  <div className={styles.iconWrapper}><SearchIcon size={40} color="var(--primary)" /></div>
                  <h3>1. Check Eligibility</h3>
                </div>
              </Link>

              <Link href="/register" style={{textDecoration: "none"}}>
                <div className={styles.stepCard} style={{cursor: "pointer", transition: "transform 0.2s"}}>
                  <div className={styles.iconWrapper}><BanknoteIcon size={40} color="var(--secondary)" /></div>
                  <h3>2. Pay Processing Fee</h3>
                </div>
              </Link>
              
              <Link href="/login" style={{textDecoration: "none"}}>
                <div className={styles.stepCard} style={{cursor: "pointer", transition: "transform 0.2s"}}>
                  <div className={styles.iconWrapper}><LaptopIcon size={40} color="#f59e0b" /></div>
                  <h3>3. Get Your Laptop!</h3>
                </div>
              </Link>

            </div>
          </div>
        </section>

        <section id="eligibility" className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Eligibility Criteria</h2>
            <div className={styles.grid}>
              <div className="card">
                <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Enrolled Students</h3>
                <p>Must be currently enrolled in a recognized Board or HEC-recognized public sector university.</p>
              </div>
              <div className="card">
                <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Academic Limits</h3>
                <p>Matric Level, Inter Level (FA/FSc/ICS) as well as University Level (BS, MS/MPhil, PhD) candidates are eligible to apply.</p>
              </div>
              <div className="card">
                <h3 style={{color: 'var(--danger)', marginBottom: '0.5rem'}}>Exclusions</h3>
                <p>Students who have already received a laptop under any federal/provincial scheme are NOT eligible at any stage.</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.section} style={{paddingTop: "2rem"}}>
          <div className="container">
            <div className={styles.instructionsBox}>
              <h3 style={{marginBottom: "1rem", fontSize: "1.25rem", color: "#1e293b"}}>General Instructions:</h3>
              <ul className={styles.instructionsList}>
                <li>Once registered, please go to <Link href="/login">Application Status</Link> to view your current application status.</li>
                <li>To claim your laptop warranty (Phase-IV), please read the <Link href="/warranty">Warranty Guidelines</Link>.</li>
                <li>To view the list of eligible universities for PM Laptop Scheme, please click on <Link href="/eligible-institutes">List of Eligible Universities</Link> tab.</li>
                <li>To search the name and contact information of your respective university focal person for PM Laptop Scheme, please go to <Link href="/focal-persons">Search Focal person</Link> tab.</li>
                <li>In order to view the frequently asked questions about PM Laptop Scheme, please go to <Link href="/faqs">FAQs</Link> tab.</li>
                <li style={{color: "#b91c1c"}}>Student must submit his/her own CNIC, mobile number and email address during the registration process, as the provided data will be used for further processing. Submitting incorrect or fallacious data may lead to the cancellation of registration.</li>
                <li>Students who are encountering issue in receiving SMS while applying under Prime Minister's Laptop Scheme Phase-VI are advised to register their complaints along with their cell phone number on <a href="mailto:studentlaptoponline@gmail.com">studentlaptoponline@gmail.com</a>.</li>
              </ul>
            </div>
          </div>
        </section>

      </main>
      
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} StudentLaptop.online - Supported by the PMYP Initiative Framework.</p>
          <p style={{marginTop: "0.5rem", fontSize: "0.85rem"}}>Contact: <a href="mailto:studentlaptoponline@gmail.com" style={{color: "var(--primary)"}}>studentlaptoponline@gmail.com</a></p>
        </div>
      </footer>
    </div>
  );
}

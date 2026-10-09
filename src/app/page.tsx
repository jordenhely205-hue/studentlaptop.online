import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Search,
  CreditCard,
  Laptop,
  GraduationCap,
  Award,
  CheckCircle2,
  BookOpen,
  Calendar,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo & Capitalized Title */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="STUDENT LAPTOP ONLINE"
              width={46}
              height={46}
              priority
              style={{ objectFit: "contain" }}
            />
            <span className={styles.logoText}>STUDENT LAPTOP ONLINE</span>
          </Link>

          {/* Navigation Links */}
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="#online-test">Online Test Info</Link>
            <Link href="#eligibility">Eligibility</Link>
            <Link href="#process">How to Apply</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
              Login / Track
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <Award size={16} /> Honahar Merit Initiative • Session 2026
              </div>

              {/* Exact Scheme Positioning */}
              <h1 className={styles.title}>
                Scholarship & Laptop Scheme for Honahar Students based on{" "}
                <span className={styles.highlightText}>
                  Online Test & Merit Performance.
                </span>
              </h1>

              <p className={styles.subtitle}>
                Official Online Application Portal for Student Laptop Online.
                Empowering high-achieving and deserving students across Pakistan
                with state-of-the-art digital laptops and academic scholarships to
                excel in higher education.
              </p>

              {/* 3 Explicit Call-To-Action (CTA) Buttons */}
              <div className={styles.heroActions}>
                <Link href="/register" className={styles.btnApply}>
                  Apply Online <ArrowRight size={18} />
                </Link>
                <Link href="/check-eligibility" className={styles.btnCheck}>
                  Check Eligibility
                </Link>
                <Link href="#online-test" className={styles.btnTest}>
                  <BookOpen size={18} /> Online Test Info
                </Link>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className={styles.heroImageWrapper}>
              <div className={styles.heroCard}>
                <span className={styles.heroCardBadge}>
                  Application Phase 2026
                </span>
                <h3 className={styles.heroCardTitle}>
                  Candidate Registration Open
                </h3>
                <p className={styles.heroCardDesc}>
                  Applications are actively being received. Check your eligibility
                  and submit registration before the deadline.
                </p>

                <div className={styles.heroCardStats}>
                  <div className={styles.statBox}>
                    <span className={styles.statBoxTitle}>Application Fee</span>
                    <span className={styles.statBoxValue} style={{ color: "#16a34a" }}>
                      Rs. 475/-
                    </span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statBoxTitle}>Last Date to Apply</span>
                    <span className={styles.statBoxValue} style={{ color: "#dc2626" }}>
                      25 Oct 2026
                    </span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statBoxTitle}>JazzCash/EasyPaisa</span>
                    <span className={styles.statBoxValue} style={{ color: "#0f172a", fontSize: "1rem" }}>
                      Till: 984703000
                    </span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statBoxTitle}>Assessment Type</span>
                    <span className={styles.statBoxValue} style={{ color: "#2563eb", fontSize: "0.95rem" }}>
                      Computer Online Test
                    </span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", fontWeight: 700 }}
                >
                  Start Registration Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS STRIP */}
        <section className={styles.highlightsBar}>
          <div className="container">
            <div className={styles.highlightsGrid}>
              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <GraduationCap size={24} />
                </div>
                <div className={styles.highlightTextWrap}>
                  <h4>100% Merit Based</h4>
                  <p>Transparent evaluation criteria</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <Laptop size={24} />
                </div>
                <div className={styles.highlightTextWrap}>
                  <h4>Brand New Laptops</h4>
                  <p>Latest generation tech specs</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <BookOpen size={24} />
                </div>
                <div className={styles.highlightTextWrap}>
                  <h4>Online Assessment</h4>
                  <p>Computerized objective test</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <CheckCircle2 size={24} />
                </div>
                <div className={styles.highlightTextWrap}>
                  <h4>Instant Verification</h4>
                  <p>Real-time candidate tracking</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ONLINE TEST INFO SECTION */}
        <section id="online-test" className={styles.testSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Assessment Guidelines</span>
              <h2 className={styles.sectionTitle}>Online Test Information</h2>
              <p className={styles.sectionSubtitle}>
                The Student Laptop Scheme incorporates a standardized online
                assessment test to ensure merit-based transparent selection for all
                registered candidates.
              </p>
            </div>

            <div className={styles.testGrid}>
              <div className={styles.testCard}>
                <span className={styles.testWeightBadge}>25% Weightage</span>
                <h3 className={styles.testCardTitle}>Computer & IT Literacy</h3>
                <p className={styles.testCardDesc}>
                  Basic computer operations, operating systems, internet safety,
                  word processing, and general digital technology concepts.
                </p>
              </div>

              <div className={styles.testCard}>
                <span className={styles.testWeightBadge}>25% Weightage</span>
                <h3 className={styles.testCardTitle}>English Comprehension</h3>
                <p className={styles.testCardDesc}>
                  Grammar essentials, sentence structure, reading comprehension,
                  and vocabulary relevant to academic learning.
                </p>
              </div>

              <div className={styles.testCard}>
                <span className={styles.testWeightBadge}>25% Weightage</span>
                <h3 className={styles.testCardTitle}>General Knowledge</h3>
                <p className={styles.testCardDesc}>
                  Current affairs, science basics, geographical awareness, and
                  everyday logical reasoning.
                </p>
              </div>

              <div className={styles.testCard}>
                <span className={styles.testWeightBadge}>25% Weightage</span>
                <h3 className={styles.testCardTitle}>Academic Field Core</h3>
                <p className={styles.testCardDesc}>
                  Conceptual questions tailored to your enrolled level (Matric,
                  Intermediate, or University Degree).
                </p>
              </div>
            </div>

            {/* Merit Formula Highlight Box */}
            <div className={styles.meritFormulaBox}>
              <div>
                <div className={styles.formulaTitle}>
                  Aggregate Merit Formulation
                </div>
                <p style={{ color: "#cbd5e1", fontSize: "0.95rem", margin: 0 }}>
                  Candidates must secure a minimum of 60% in the Online Test to
                  qualify for the laptop allocation quota.
                </p>
              </div>
              <div>
                <div className={styles.formulaEquation}>
                  50% Academic Marks + 50% Online Test Score
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-STEP APPLICATION PROCESS */}
        <section id="process" className={styles.processSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Simple Workflow</span>
              <h2 className={styles.sectionTitle}>How to Apply in 3 Steps</h2>
              <p className={styles.sectionSubtitle}>
                Follow our streamlined online registration procedure to confirm
                your candidature.
              </p>
            </div>

            <div className={styles.stepGrid}>
              <Link href="/check-eligibility" style={{ textDecoration: "none" }}>
                <div className={styles.stepCard}>
                  <span className={styles.stepNumber}>1</span>
                  <div className={styles.iconWrapper}>
                    <Search size={36} color="var(--primary)" />
                  </div>
                  <h3>Check Eligibility</h3>
                  <p>
                    Verify your CNIC and academic credentials to confirm qualification for the 2026 scheme.
                  </p>
                </div>
              </Link>

              <Link href="/register" style={{ textDecoration: "none" }}>
                <div className={styles.stepCard}>
                  <span className={styles.stepNumber}>2</span>
                  <div className={styles.iconWrapper}>
                    <CreditCard size={36} color="var(--secondary)" />
                  </div>
                  <h3>Submit Info & Pay Fee</h3>
                  <p>
                    Enter your academic details, pay the Rs. 475/- fee via JazzCash/EasyPaisa Till ID 984703000, and upload your TID.
                  </p>
                </div>
              </Link>

              <Link href="/login" style={{ textDecoration: "none" }}>
                <div className={styles.stepCard}>
                  <span className={styles.stepNumber}>3</span>
                  <div className={styles.iconWrapper}>
                    <Laptop size={36} color="#d97706" />
                  </div>
                  <h3>Appear in Test & Track</h3>
                  <p>
                    Attempt your scheduled online test, review aggregate merit rankings, and track laptop allotment.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY CRITERIA SECTION */}
        <section id="eligibility" className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Candidate Guidelines</span>
              <h2 className={styles.sectionTitle}>Eligibility Criteria</h2>
              <p className={styles.sectionSubtitle}>
                Clear, transparent benchmarks ensure laptops reach genuine,
                deserving, and hardworking students.
              </p>
            </div>

            <div className={styles.grid}>
              <div className={styles.eligibilityCard}>
                <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
                  Enrolled Students
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Candidates must be actively enrolled in any recognized Board,
                  College, or Degree-Awarding University.
                </p>
              </div>

              <div className={styles.eligibilityCard}>
                <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
                  Academic Levels
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Matriculation (9th/10th), Intermediate (FA, FSc, ICS, I.Com), and
                  Higher Education (BS, MS, MPhil, PhD) candidates are fully eligible.
                </p>
              </div>

              <div className={styles.eligibilityCard}>
                <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
                  Minimum Merit Score
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  A minimum of 60% marks in previous examinations or current CGPA
                  equivalent is required for candidate validation.
                </p>
              </div>

              <div className={styles.eligibilityCard}>
                <h3 style={{ color: "#b91c1c", marginBottom: "0.5rem" }}>
                  Exclusion Policy
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Applicants who have previously received a laptop from this scheme
                  are not eligible to apply again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GENERAL INSTRUCTIONS */}
        <section className={styles.section} style={{ paddingTop: "0" }}>
          <div className="container">
            <div className={styles.instructionsBox}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "#1e293b", fontWeight: 700 }}>
                Important Applicant Instructions:
              </h3>
              <ul className={styles.instructionsList}>
                <li>
                  Once registered, please visit the <Link href="/login">Application Tracker</Link> to check your verification and test schedule.
                </li>
                <li>
                  To review hardware warranty guidelines, please check the <Link href="/warranty">Warranty Guidelines</Link> section.
                </li>
                <li>
                  To view recognized educational institutions, please browse the <Link href="/eligible-institutes">List of Eligible Institutes</Link>.
                </li>
                <li>
                  To view assigned institutional coordinators, visit the <Link href="/focal-persons">Search Focal Persons</Link> page.
                </li>
                <li>
                  Frequently asked questions and troubleshooting steps can be viewed under <Link href="/faqs">FAQs</Link>.
                </li>
                <li style={{ color: "#b91c1c", fontWeight: 600 }}>
                  Candidates must submit their own accurate CNIC/B-Form, mobile number, and email. Incorrect data leads to immediate disqualification.
                </li>
                <li>
                  For support inquiries or verification assistance, email our official helpline:{" "}
                  <a href="mailto:studentlaptoponline@gmail.com" style={{ color: "var(--primary)", fontWeight: 700 }}>
                    studentlaptoponline@gmail.com
                  </a>.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <Image
                  src="/logo.png"
                  alt="STUDENT LAPTOP ONLINE"
                  width={38}
                  height={38}
                  style={{ objectFit: "contain" }}
                />
                <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.5px" }}>
                  STUDENT LAPTOP ONLINE
                </span>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0, maxWidth: "400px" }}>
                Honahar Students Scholarship & Laptop Scheme based on Merit & Online Test.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <Link href="/">Home</Link>
              <Link href="#online-test">Online Test</Link>
              <Link href="/check-eligibility">Check Eligibility</Link>
              <Link href="/register">Apply Online</Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/login">Login Tracker</Link>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p style={{ margin: 0 }}>
              &copy; 2026 STUDENT LAPTOP ONLINE. All Rights Reserved.
            </p>
            <p style={{ marginTop: "0.35rem", fontSize: "0.8rem", color: "#64748b" }}>
              Official Helpline:{" "}
              <a href="mailto:studentlaptoponline@gmail.com" style={{ color: "#93c5fd" }}>
                studentlaptoponline@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

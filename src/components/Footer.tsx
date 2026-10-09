import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        padding: "3rem 0",
        marginTop: "auto",
        borderTop: "1px solid #1e293b",
      }}
    >
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            borderBottom: "1px solid #1e293b",
            paddingBottom: "2rem",
            marginBottom: "1.5rem",
          }}
        >
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
            <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0, maxWidth: "420px", lineHeight: 1.5 }}>
              Honahar Students Scholarship & Laptop Scheme based on Merit & Online Test.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#cbd5e1", fontSize: "0.9rem", textDecoration: "none" }}>
              Home
            </Link>
            <Link href="/#online-test" style={{ color: "#cbd5e1", fontSize: "0.9rem", textDecoration: "none" }}>
              Online Test
            </Link>
            <Link href="/check-eligibility" style={{ color: "#cbd5e1", fontSize: "0.9rem", textDecoration: "none" }}>
              Check Eligibility
            </Link>
            <Link href="/register" style={{ color: "#cbd5e1", fontSize: "0.9rem", textDecoration: "none" }}>
              Apply Online
            </Link>
            <Link href="/faqs" style={{ color: "#cbd5e1", fontSize: "0.9rem", textDecoration: "none" }}>
              FAQs
            </Link>
            <Link href="/login" style={{ color: "#cbd5e1", fontSize: "0.9rem", textDecoration: "none" }}>
              Login Tracker
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#64748b" }}>
          <p style={{ margin: 0 }}>
            &copy; 2026 STUDENT LAPTOP ONLINE. All Rights Reserved.
          </p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#94a3b8" }}>
            Official Helpline:{" "}
            <a
              href="mailto:info@studentlaptop.online"
              style={{
                color: "#60a5fa",
                textDecoration: "underline",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              info@studentlaptop.online
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

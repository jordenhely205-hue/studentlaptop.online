"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column"}}>
      <header style={{padding: "1rem 0", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0"}}>
        <div className="container" style={{display: "flex", justifyContent: "space-between"}}>
           <div style={{display: "flex", alignItems: "center"}}>
             <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
           </div>
           <nav style={{display: "flex", gap: "1rem", alignItems: "center"}}>
             <Link href="/" style={{color: "var(--foreground)", textDecoration: "none", fontWeight: "500"}}>Home</Link>
             <button onClick={handleLogout} className="btn" style={{backgroundColor: "#e2e8f0", color: "#1e293b"}}>Logout</button>
           </nav>
        </div>
      </header>

      <main className="container" style={{flex: 1, padding: "3rem 0"}}>
        <h1 style={{marginBottom: "2rem"}}>Student Dashboard</h1>
        
        <div className="card" style={{padding: "2rem", borderLeft: "4px solid var(--secondary)", backgroundColor: "#f0fdf4", marginBottom: "2rem"}}>
           <h3 style={{color: "#166534", marginBottom: "0.5rem"}}>Application Status: Under Review</h3>
           <p style={{color: "#15803d"}}>Your application and uploaded fee receipt are currently being verified by the Focal Person. Please check back later.</p>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem"}}>
            <div className="card">
                <h3>My Details</h3>
                <ul style={{marginTop: "1rem", lineHeight: "1.8", color: "#475569"}}>
                    <li><strong>CNIC:</strong> XXXXX-XXXXXXX-X</li>
                    <li><strong>Category:</strong> University / Inter</li>
                    <li><strong>Fee Status:</strong> Submitted (Pending Verification)</li>
                </ul>
            </div>
            <div className="card">
                <h3>Downloads</h3>
                <div style={{marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <Link href="/challan" className="btn btn-secondary" style={{textAlign: "center"}}>
                        View/Download Print Challan
                    </Link>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

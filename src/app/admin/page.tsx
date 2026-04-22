"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column"}}>
      <header style={{padding: "1rem 0", backgroundColor: "#1e293b", color: "white"}}>
        <div className="container" style={{display: "flex", justifyContent: "space-between"}}>
           <div style={{display: "flex", alignItems: "center"}}>
             <span style={{color: "white", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.admin</span>
           </div>
           <nav style={{display: "flex", gap: "1rem", alignItems: "center"}}>
             <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
           </nav>
        </div>
      </header>

      <main className="container" style={{flex: 1, padding: "3rem 0"}}>
        <h1 style={{marginBottom: "2rem"}}>Super Admin Dashboard</h1>
        
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem"}}>
            <div className="card" style={{borderTop: "4px solid var(--primary)"}}>
                <h3 style={{color: "#475569", marginBottom: "0.5rem", fontSize: "1rem"}}>Total Applications</h3>
                <p style={{fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)"}}>12,450</p>
            </div>
            <div className="card" style={{borderTop: "4px solid var(--secondary)"}}>
                <h3 style={{color: "#475569", marginBottom: "0.5rem", fontSize: "1rem"}}>Total Revenue Collected</h3>
                <p style={{fontSize: "2.5rem", fontWeight: "bold", color: "var(--secondary)"}}>Rs. 5,913,750</p>
            </div>
            <div className="card" style={{borderTop: "4px solid #f59e0b"}}>
                <h3 style={{color: "#475569", marginBottom: "0.5rem", fontSize: "1rem"}}>Pending Verification</h3>
                <p style={{fontSize: "2.5rem", fontWeight: "bold", color: "#d97706"}}>4,120</p>
            </div>
        </div>

        <div className="card">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem"}}>
              <h2>Recent Applications Overview</h2>
              <button className="btn btn-primary" style={{fontSize: "0.9rem"}}>Export Data (CSV)</button>
            </div>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
                <thead>
                    <tr style={{borderBottom: "2px solid #e2e8f0", textAlign: "left"}}>
                        <th style={{padding: "1rem"}}>CNIC</th>
                        <th style={{padding: "1rem"}}>Name</th>
                        <th style={{padding: "1rem"}}>Category</th>
                        <th style={{padding: "1rem"}}>Status</th>
                        <th style={{padding: "1rem"}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{borderBottom: "1px solid #e2e8f0"}}>
                        <td style={{padding: "1rem"}}>35202-1234567-1</td>
                        <td style={{padding: "1rem"}}>Ahmad Ali</td>
                        <td style={{padding: "1rem"}}>Undergraduate</td>
                        <td style={{padding: "1rem"}}><span style={{backgroundColor: "#fef3c7", color: "#92400e", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem"}}>Pending</span></td>
                        <td style={{padding: "1rem"}}><button className="btn btn-secondary" style={{padding: "0.25rem 0.75rem"}}>Review</button></td>
                    </tr>
                    <tr style={{borderBottom: "1px solid #e2e8f0"}}>
                        <td style={{padding: "1rem"}}>42101-9876543-2</td>
                        <td style={{padding: "1rem"}}>Ayesha Khan</td>
                        <td style={{padding: "1rem"}}>Inter Level</td>
                        <td style={{padding: "1rem"}}><span style={{backgroundColor: "#dcfce7", color: "#166534", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem"}}>Verified</span></td>
                        <td style={{padding: "1rem"}}><button className="btn" style={{backgroundColor: "#e2e8f0", padding: "0.25rem 0.75rem"}}>View</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
}

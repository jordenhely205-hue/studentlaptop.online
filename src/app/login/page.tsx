"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login authentication logic
    setTimeout(() => {
      setLoading(false);
      
      // Admin Login Check
      if (formData.identifier === "admin@studentlaptop.online" && formData.password === "admin123") {
        router.push("/admin");
        return;
      }
      
      // Student Login Check (All other inputs mock a student)
      if (formData.identifier && formData.password) {
        // Just simulate success for demo purposes
        router.push("/dashboard");
      } else {
        setError("Invalid CNIC/Email or password.");
      }
    }, 1000);
  };

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column"}}>
      <header style={{padding: "1rem 0", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0"}}>
        <div className="container" style={{display: "flex", justifyContent: "space-between"}}>
           <div style={{display: "flex", alignItems: "center"}}>
             <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
           </div>
           <Link href="/" style={{color: "var(--foreground)", textDecoration: "none", fontWeight: "500"}}>Home</Link>
        </div>
      </header>

      <main className="container" style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem 0"}}>
        <div className="card" style={{width: "100%", maxWidth: "450px", padding: "2.5rem"}}>
          <h2 style={{textAlign: "center", marginBottom: "0.5rem", color: "var(--foreground)"}}>Welcome Back</h2>
          <p style={{textAlign: "center", color: "#64748b", marginBottom: "2rem"}}>Login to track your scheme application.</p>
          
          <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "1.5rem"}}>
            <div>
              <label style={{display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.95rem"}}>Email or CNIC</label>
              <input 
                type="text" 
                name="identifier" 
                className="input" 
                placeholder="XXXXX-XXXXXXX-X or example@email.com" 
                value={formData.identifier}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
               <label style={{display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.95rem"}}>Password</label>
               <input 
                 type="password" 
                 name="password" 
                 className="input" 
                 placeholder="••••••••" 
                 value={formData.password}
                 onChange={handleInputChange}
                 required
               />
            </div>

            {error && <div style={{color: "var(--danger)", fontSize: "0.9rem", textAlign: "center"}}>{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{width: "100%", padding: "0.75rem", fontSize: "1.1rem", marginTop: "0.5rem"}}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div style={{marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "#64748b"}}>
            Don't have an application yet? <Link href="/check-eligibility" style={{color: "var(--primary)", fontWeight: "600"}}>Apply Now</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

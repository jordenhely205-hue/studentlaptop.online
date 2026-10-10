"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanId = formData.identifier.trim().toLowerCase();

    // 1. Admin Login via live database verification
    if (cleanId === "admin@studentlaptop.online" || cleanId === "admin") {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: cleanId, password: formData.password }),
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok && data.success) {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "adminUser",
              JSON.stringify({
                email: "admin@studentlaptop.online",
                name: data.user?.name || "Super Administrator",
                loggedInAt: Date.now(),
              })
            );
          }
          router.push("/admin");
          return;
        } else {
          setError(data.error || "Invalid admin credentials.");
          return;
        }
      } catch (err: any) {
        setLoading(false);
        setError("Unable to authenticate. Please check network connection and try again.");
        return;
      }
    }

    // 2. Student Login Check
    setTimeout(() => {
      setLoading(false);
      if (formData.identifier && formData.password) {
        router.push("/dashboard");
      } else {
        setError("Invalid CNIC/Email or password.");
      }
    }, 500);
  };

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column"}}>
      <header style={{padding: "1rem 0", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0"}}>
        <div className="container" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
           <Link href="/" style={{display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none"}}>
             <img src="/logo.png" alt="STUDENT LAPTOP ONLINE" width={40} height={40} style={{objectFit: "contain"}} />
             <span style={{color: "var(--primary)", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "0.5px"}}>STUDENT LAPTOP ONLINE</span>
           </Link>
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
      <Footer />
    </div>
  );
}


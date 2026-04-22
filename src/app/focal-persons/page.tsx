"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

export default function FocalPersonsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const persons = [
    { name: "Dr. Ali Raza", title: "Director IT", unviersity: "Punjab University (PU)", email: "ali.raza@pu.edu.pk" },
    { name: "Prof. Saima Tariq", title: "Head of Student Affairs", unviersity: "University of Agriculture", email: "saima.t@uaf.edu.pk" },
    { name: "Muhammad Usman", title: "Registrar", unviersity: "Kinnaird College for Women", email: "usman.r@kinnaird.edu.pk" },
    { name: "Dr. Bilal Ahmed", title: "IT Administrator", unviersity: "GCU Lahore", email: "bilal.ahmed@gcu.edu.pk" }
  ];

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
        <div className="card" style={{padding: "3rem", margin: "0 auto", maxWidth: "900px"}}>
          <h1 style={{color: "var(--primary)", marginBottom: "1rem"}}>Search Focal Persons</h1>
          <p style={{color: "#64748b", marginBottom: "2rem"}}>Contact your university focal person assigned exclusively for laptop distribution concerns and application verifications.</p>
          
          <input 
            type="text" 
            placeholder="Search by Person, University or Email..." 
            className="input" 
            style={{marginBottom: "2rem"}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <table style={{width: "100%", borderCollapse: "collapse"}}>
             <tr style={{backgroundColor: "#1e3a8a", color: "white", textAlign: "left"}}>
               <th style={{padding: "1rem"}}>Focal Person</th>
               <th style={{padding: "1rem"}}>Designation</th>
               <th style={{padding: "1rem"}}>Institute</th>
               <th style={{padding: "1rem"}}>Email Contact</th>
             </tr>
             {persons.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.unviersity.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                <tr key={i} style={{borderBottom: "1px solid #e2e8f0"}}>
                  <td style={{padding: "1rem", fontWeight: "bold"}}>{p.name}</td>
                  <td style={{padding: "1rem", color: "#475569"}}>{p.title}</td>
                  <td style={{padding: "1rem"}}>{p.unviersity}</td>
                  <td style={{padding: "1rem"}}><a href={`mailto:${p.email}`} style={{color: "#0284c7"}}>{p.email}</a></td>
                </tr>
             ))}
          </table>
        </div>
      </main>
    </div>
  );
}

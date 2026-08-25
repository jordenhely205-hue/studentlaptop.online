"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./challan.module.css";

export default function ChallanPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("challanData");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        // Fallback for demo
        setData({
          name: "AIMAN KHAN",
          fatherName: "ABDUL REHMAN",
          cnic: "42101-2345678-0",
          boardOrUniversity: "UNIVERSITY OF KARACHI"
        });
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!data) return <div className="container" style={{padding: "2rem", textAlign: "center"}}>Loading...</div>;

  const ChallanCopy = ({ type }: { type: string }) => (
    <div className={styles.challanBox}>
      <div className={styles.header}>
        <div className={styles.logoArea}>
           🎓 'STUDENTLAPTOP.ONLINE <br /> SCHEME 2026'
        </div>
        <div className={styles.metaArea}>
          Date: 22nd April 2026<br />
          Challan No: SL-2026-89731<br />
          Application ID: APP-99120
        </div>
      </div>

      <div className={styles.titleBar}>
        FEE PAYMENT CHALLAN - STUDENT LAPTOP SCHEME 2026
      </div>
      <div className={styles.subTitleBar}>
        REGISTRATION FEE (NON-REFUNDABLE)
        <span className={styles.copyType}>{type}</span>
      </div>

      <div className={styles.detailsSplit}>
        <table className={styles.tableBlock}>
          <tbody>
            <tr>
              <td className={styles.labelCell}>Student Name</td>
              <td className={styles.valueCell}>{data.name.toUpperCase()}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>Father's Name</td>
              <td className={styles.valueCell}>{data.fatherName.toUpperCase()}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>CNIC</td>
              <td className={styles.valueCell}>{data.cnic}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>{data.level === "Inter" ? "Board" : "University"}</td>
              <td className={styles.valueCell}>{data.boardOrUniversity.toUpperCase()}</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.feeBlock}>
          <table className={styles.tableBlock}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>Purpose</td>
                <td className={styles.valueCell}>REGISTRATION FEE</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Amount</td>
                <td className={styles.valueCell}>Rs. 475/-</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Amount in Words</td>
                <td className={styles.valueCell}>Four Hundred Seventy-Five Rupees Only</td>
              </tr>
            </tbody>
          </table>
          
          <div className={styles.tillBox}>
            <span style={{fontSize: "0.8rem", color: "#333"}}>Merchant Till ID</span><br/>
            <strong>112233</strong>
          </div>
        </div>
      </div>

      <div className={styles.footerSplit}>
        <div className={styles.instructions}>
          <strong>Instructions for Payment</strong>
          <ol>
            <li>Use JazzCash / EasyPaisa / Any Bank App.</li>
            <li>Select 'Pay to Merchant' / 'Till Payment'.</li>
            <li>Enter <strong>Merchant Till ID: 112233</strong>.</li>
            <li>Pay <strong>Rs. 475</strong>.</li>
            <li>Enter Transaction ID (TID) and upload screenshot on website: studentlaptop.online</li>
          </ol>
        </div>
        <div className={styles.signatures}>
           <div className={styles.sigLine}>Depositor</div>
           <div className={styles.sigLine}>Authorized Officer/Bank Stamp</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div className="container" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
           <div className={styles.logo}>
             <span style={{color: "var(--primary)", fontWeight: "bold", fontSize: "1.5rem"}}>StudentLaptop</span>
             <span style={{color: "var(--secondary)", fontWeight: "bold", fontSize: "1.5rem"}}>.online</span>
           </div>
           <div>
             <button onClick={handlePrint} className="btn btn-secondary" style={{marginRight: "1rem"}}>Print Challan</button>
             <Link href="/" className="btn btn-primary">Done</Link>
           </div>
        </div>
      </header>
      
      <main className={`container ${styles.mainContent}`}>
         <div className={styles.printArea}>
           <ChallanCopy type="BANK/MERCHANT COPY" />
           <div className={styles.scissorLine}>
             ✂------------------------------------------------------------------------------------------------------
           </div>
           <ChallanCopy type="STUDENT COPY" />
         </div>
      </main>
    </div>
  );
}


"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Download,
  Printer,
  Shield,
  Key,
  Calendar,
  Megaphone,
  Award,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  School,
  GraduationCap,
  BookOpen,
  X,
  Sliders,
  Clock,
  FileText,
} from "lucide-react";

interface Application {
  id: string;
  applicationNo: string;
  cnic: string;
  fullName: string;
  fatherName: string;
  gender: string;
  mobileNo: string;
  email: string;
  province: string;
  district: string;
  degreeLevel: string;
  instituteName: string;
  boardUniversity: string;
  rollNumber: string;
  passingYear: string;
  totalMarks: string;
  obtainedMarks: string;
  percentage: string;
  status: string;
  matricRollNumber?: string;
  matricBoard?: string;
  matricInstitute?: string;
  matricPassingYear?: string;
  matricTotalMarks?: string;
  matricObtainedMarks?: string;
  matricPercentage?: string;
  interRollNumber?: string;
  interBoard?: string;
  interInstitute?: string;
  interPassingYear?: string;
  interTotalMarks?: string;
  interObtainedMarks?: string;
  interPercentage?: string;
  gradUniversity?: string;
  gradRollNumber?: string;
  gradProgram?: string;
  gradScore?: string;
  createdAt: string;
  updatedAt: string;
  psid?: string;
  challanAmount?: number;
  isPaid?: boolean;
  tid?: string;
  receiptUrl?: string | null;
  verifiedByAdmin?: boolean;
  paymentSubmittedAt?: string;
}

interface Stats {
  totalApplications: number;
  totalRevenue: number;
  pendingVerification: number;
  approvedCount: number;
  rejectedCount: number;
}

interface TestSchedule {
  id: string;
  stream: string;
  date: string;
  time: string;
  venue: string;
  status: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"applications" | "merit" | "selected" | "schedule" | "security">("applications");

  // Live Applications State
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    totalRevenue: 0,
    pendingVerification: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [streamFilter, setStreamFilter] = useState("ALL");

  // Selected Candidate for Verification Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedTid, setCopiedTid] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Merit Criteria State
  const [meritCriteria, setMeritCriteria] = useState({
    matric: 70,
    inter: 65,
    university: 65,
  });
  const [savingMerit, setSavingMerit] = useState(false);
  const [meritGenerated, setMeritGenerated] = useState(false);

  // Security / Password State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Test Schedule & Banner State
  const [bannerText, setBannerText] = useState("");
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerNotice, setBannerNotice] = useState("");
  const [testSchedules, setTestSchedules] = useState<TestSchedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    stream: "Matriculation (SSC)",
    date: "",
    time: "",
    venue: "",
  });
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Fetch live applications & stats
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (res.ok && data.applications) {
        setApplications(data.applications);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings (banner, merit, schedules)
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        if (data.settings.announcement_banner) {
          setBannerText(data.settings.announcement_banner);
        }
        if (data.settings.merit_criteria) {
          setMeritCriteria(data.settings.merit_criteria);
        }
        if (data.settings.test_schedules) {
          setTestSchedules(data.settings.test_schedules);
        }
      }
    } catch (err) {
      console.warn("Could not fetch settings:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchSettings();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminUser");
    }
    router.push("/login");
  };

  // Filter applications by search and dropdowns
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        !searchTerm ||
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.cnic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.mobileNo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "APPROVED" && (app.status === "APPROVED" || app.verifiedByAdmin)) ||
        (statusFilter === "REJECTED" && app.status === "REJECTED") ||
        (statusFilter === "UNDER_REVIEW" && app.status === "UNDER_REVIEW") ||
        (statusFilter === "PAYMENT_PENDING" && (app.status === "PAYMENT_PENDING" || !app.status));

      const matchStream =
        streamFilter === "ALL" ||
        (streamFilter === "Matric" && app.degreeLevel?.toLowerCase().includes("matric")) ||
        (streamFilter === "Intermediate" && app.degreeLevel?.toLowerCase().includes("inter")) ||
        (streamFilter === "Undergraduate" &&
          (app.degreeLevel?.toLowerCase().includes("undergrad") || app.degreeLevel?.toLowerCase().includes("uni")));

      return matchSearch && matchStatus && matchStream;
    });
  }, [applications, searchTerm, statusFilter, streamFilter]);

  // Update candidate status (Verify & Approve / Reject)
  const handleUpdateStatus = async (targetStatus: "APPROVED" | "REJECTED" | "UNDER_REVIEW" | "PAYMENT_PENDING") => {
    if (!selectedApp) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedApp.id,
          cnic: selectedApp.cnic,
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update local state immediately
        const updated = {
          ...selectedApp,
          status: targetStatus,
          verifiedByAdmin: targetStatus === "APPROVED",
          isPaid: targetStatus === "APPROVED" ? true : selectedApp.isPaid,
        };
        setSelectedApp(updated);

        setApplications((prev) =>
          prev.map((app) => (app.id === selectedApp.id ? updated : app))
        );

        // Refresh stats
        fetchApplications();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err: any) {
      alert("Error updating status: " + err?.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Copy TID to clipboard
  const handleCopyTid = (tid: string) => {
    if (!tid) return;
    navigator.clipboard.writeText(tid);
    setCopiedTid(true);
    setTimeout(() => setCopiedTid(false), 2000);
  };

  // Save Merit Criteria
  const handleSaveMerit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMerit(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "merit_criteria", value: meritCriteria }),
      });
      if (res.ok) {
        alert("Merit Criteria successfully saved to database!");
      }
    } catch {
      alert("Failed to save merit criteria.");
    } finally {
      setSavingMerit(false);
    }
  };

  // Merit Qualified Applicants calculation
  const meritQualifiedList = useMemo(() => {
    return applications
      .filter((app) => {
        // Must be approved / payment verified
        const isApproved = app.status === "APPROVED" || app.verifiedByAdmin;
        if (!isApproved) return false;

        const level = (app.degreeLevel || "").toLowerCase();
        let pct = parseFloat(app.percentage?.replace(/[^\d.]/g, "") || "0");

        if (level.includes("matric")) {
          const matricPct = parseFloat(app.matricPercentage?.replace(/[^\d.]/g, "") || String(pct));
          return matricPct >= meritCriteria.matric;
        } else if (level.includes("inter")) {
          const interPct = parseFloat(app.interPercentage?.replace(/[^\d.]/g, "") || String(pct));
          return interPct >= meritCriteria.inter;
        } else {
          return pct >= meritCriteria.university;
        }
      })
      .sort((a, b) => {
        const pctA = parseFloat(a.percentage?.replace(/[^\d.]/g, "") || "0");
        const pctB = parseFloat(b.percentage?.replace(/[^\d.]/g, "") || "0");
        return pctB - pctA;
      });
  }, [applications, meritCriteria]);

  // Selected Candidates (Approved candidates)
  const selectedCandidates = useMemo(() => {
    return applications.filter((app) => app.status === "APPROVED" || app.verifiedByAdmin);
  }, [applications]);

  // Export to CSV
  const exportToCsv = (dataList: Application[], filename: string) => {
    if (dataList.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Application No",
      "Candidate Name",
      "Father Name",
      "CNIC",
      "Mobile",
      "Email",
      "Academic Stream",
      "Institute",
      "Board",
      "Roll No",
      "Passing Year",
      "Total Marks",
      "Obtained Marks",
      "Percentage",
      "Challan PSID",
      "Fee Amount",
      "Transaction ID (TID)",
      "Status",
      "Applied Date",
    ];

    const rows = dataList.map((app) => [
      `"${app.applicationNo || ""}"`,
      `"${app.fullName || ""}"`,
      `"${app.fatherName || ""}"`,
      `"${app.cnic || ""}"`,
      `"${app.mobileNo || ""}"`,
      `"${app.email || ""}"`,
      `"${app.degreeLevel || ""}"`,
      `"${(app.instituteName || "").replace(/"/g, '""')}"`,
      `"${(app.boardUniversity || "").replace(/"/g, '""')}"`,
      `"${app.rollNumber || ""}"`,
      `"${app.passingYear || ""}"`,
      `"${app.totalMarks || ""}"`,
      `"${app.obtainedMarks || ""}"`,
      `"${app.percentage || ""}"`,
      `"${app.psid || "984703000"}"`,
      `"${app.challanAmount || 475}"`,
      `"${app.tid || ""}"`,
      `"${app.status || "Pending"}"`,
      `"${new Date(app.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityNotice(null);

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityNotice({ type: "error", message: "New password and Confirm password do not match." });
      return;
    }

    if (securityForm.newPassword.length < 6) {
      setSecurityNotice({ type: "error", message: "New password must be at least 6 characters long." });
      return;
    }

    setSecurityLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSecurityNotice({ type: "success", message: "Admin password updated successfully! Please keep it secure." });
        setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setSecurityNotice({ type: "error", message: data.error || "Failed to change password." });
      }
    } catch (err: any) {
      setSecurityNotice({ type: "error", message: "Network error: " + err?.message });
    } finally {
      setSecurityLoading(false);
    }
  };

  // Save Announcement Banner
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBanner(true);
    setBannerNotice("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "announcement_banner", value: bannerText }),
      });
      if (res.ok) {
        setBannerNotice("Announcement banner updated live on the homepage!");
        setTimeout(() => setBannerNotice(""), 3500);
      }
    } catch {
      alert("Failed to update banner.");
    } finally {
      setSavingBanner(false);
    }
  };

  // Add Test Schedule
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.date || !newSchedule.time || !newSchedule.venue) {
      alert("Please fill in date, time, and venue.");
      return;
    }

    setSavingSchedule(true);
    const updatedSchedules: TestSchedule[] = [
      ...testSchedules,
      {
        id: `ts_${Date.now()}`,
        stream: newSchedule.stream,
        date: newSchedule.date,
        time: newSchedule.time,
        venue: newSchedule.venue,
        status: "Published",
      },
    ];

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "test_schedules", value: updatedSchedules }),
      });
      if (res.ok) {
        setTestSchedules(updatedSchedules);
        setNewSchedule({ stream: "Matriculation (SSC)", date: "", time: "", venue: "" });
      }
    } catch {
      alert("Failed to save schedule.");
    } finally {
      setSavingSchedule(false);
    }
  };

  // Delete Test Schedule
  const handleDeleteSchedule = async (id: string) => {
    const updated = testSchedules.filter((s) => s.id !== id);
    setTestSchedules(updated);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "test_schedules", value: updated }),
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", display: "flex", flexDirection: "column" }}>
      {/* 1. TOP HEADER NAVIGATION */}
      <header
        style={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          borderBottom: "1px solid #1e293b",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.85rem 1rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Image src="/logo.png" alt="Logo" width={36} height={36} style={{ objectFit: "contain" }} />
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.5px", color: "#ffffff" }}>
                STUDENT LAPTOP ONLINE
              </span>
              <span
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  marginLeft: "0.5rem",
                  letterSpacing: "0.5px",
                }}
              >
                SUPER ADMIN PORTAL
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={fetchApplications}
              className="btn btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                padding: "0.4rem 0.75rem",
                backgroundColor: "#1e293b",
                color: "#94a3b8",
                borderColor: "#334155",
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Live Data
            </button>
            <button
              onClick={handleLogout}
              className="btn"
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                padding: "0.4rem 0.75rem",
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div style={{ backgroundColor: "#1e293b", borderTop: "1px solid #334155" }}>
          <div
            className="container"
            style={{
              display: "flex",
              gap: "0.25rem",
              overflowX: "auto",
              padding: "0 1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("applications")}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === "applications" ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeTab === "applications" ? "#ffffff" : "#94a3b8",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              <Users size={16} /> Applications & Verification ({stats.totalApplications})
            </button>

            <button
              onClick={() => setActiveTab("merit")}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === "merit" ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeTab === "merit" ? "#ffffff" : "#94a3b8",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              <Award size={16} /> Merit Criteria & Generator ({meritQualifiedList.length})
            </button>

            <button
              onClick={() => setActiveTab("selected")}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === "selected" ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeTab === "selected" ? "#ffffff" : "#94a3b8",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              <GraduationCap size={16} /> Selected Candidates ({selectedCandidates.length})
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === "schedule" ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeTab === "schedule" ? "#ffffff" : "#94a3b8",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              <Calendar size={16} /> Test Schedule & Banner
            </button>

            <button
              onClick={() => setActiveTab("security")}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === "security" ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeTab === "security" ? "#ffffff" : "#94a3b8",
                padding: "0.75rem 1rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              <Shield size={16} /> Security Settings
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="container" style={{ flex: 1, padding: "2rem 1rem" }}>
        
        {/* ============================================================== */}
        {/* TAB 1: APPLICATIONS & VERIFICATION */}
        {/* ============================================================== */}
        {activeTab === "applications" && (
          <div>
            {/* REAL-TIME STAT CARDS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              <div className="card" style={{ padding: "1.25rem", borderLeft: "5px solid #2563eb" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Total Live Applications
                </span>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1e3a8a", marginTop: "0.25rem" }}>
                  {stats.totalApplications}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Live Postgres Records</span>
              </div>

              <div className="card" style={{ padding: "1.25rem", borderLeft: "5px solid #16a34a" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Total Fee Collected
                </span>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#166534", marginTop: "0.25rem" }}>
                  Rs. {stats.totalRevenue.toLocaleString()}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>@ Rs. 475/- per application</span>
              </div>

              <div className="card" style={{ padding: "1.25rem", borderLeft: "5px solid #f59e0b" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Pending Verification
                </span>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#b45309", marginTop: "0.25rem" }}>
                  {stats.pendingVerification}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>TID / Verification Queued</span>
              </div>

              <div className="card" style={{ padding: "1.25rem", borderLeft: "5px solid #059669" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Verified & Approved
                </span>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#065f46", marginTop: "0.25rem" }}>
                  {stats.approvedCount}
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Eligible for Merit Listing</span>
              </div>
            </div>

            {/* SEARCH & FILTERS TOOLBAR */}
            <div
              className="card"
              style={{
                padding: "1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Search input */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: "1 1 280px" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <Search
                    size={18}
                    style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Search by CNIC, Name, TID, App No, or Mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: "2.25rem", fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              {/* Status filter */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Status:</span>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: "auto", fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="UNDER_REVIEW">Under Review (TID Submitted)</option>
                  <option value="PAYMENT_PENDING">Payment Pending</option>
                  <option value="APPROVED">Approved / Verified</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Stream filter */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Stream:</span>
                <select
                  className="input"
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  style={{ width: "auto", fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
                >
                  <option value="ALL">All Streams</option>
                  <option value="Matric">Matriculation</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Undergraduate">University / Degree</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={() => exportToCsv(filteredApplications, "student_laptop_online_applications")}
                className="btn btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.85rem",
                  padding: "0.5rem 0.85rem",
                }}
              >
                <Download size={15} /> Export CSV
              </button>
            </div>

            {/* LIVE DATA TABLE */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#0f172a", color: "#ffffff", textAlign: "left" }}>
                      <th style={{ padding: "0.85rem 1rem" }}>App #</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Candidate Info</th>
                      <th style={{ padding: "0.85rem 1rem" }}>CNIC / B-Form</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Stream & Marks</th>
                      <th style={{ padding: "0.85rem 1rem" }}>TID (Transaction ID)</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Fee Status</th>
                      <th style={{ padding: "0.85rem 1rem", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                          <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 0.5rem" }} />
                          Loading live applications from Neon Postgres...
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                          No candidate applications found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => {
                        const isApproved = app.status === "APPROVED" || app.verifiedByAdmin;
                        const isRejected = app.status === "REJECTED";
                        const isUnderReview = app.status === "UNDER_REVIEW";

                        return (
                          <tr
                            key={app.id}
                            style={{
                              borderBottom: "1px solid #e2e8f0",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#1e3a8a" }}>
                              {app.applicationNo || "SLO-98470"}
                              <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500 }}>
                                {new Date(app.createdAt).toLocaleDateString()}
                              </div>
                            </td>

                            <td style={{ padding: "0.85rem 1rem" }}>
                              <div style={{ fontWeight: 700, color: "#0f172a" }}>{app.fullName}</div>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>S/D/O {app.fatherName}</div>
                              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>📱 {app.mobileNo}</div>
                            </td>

                            <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontWeight: 700 }}>
                              {app.cnic}
                            </td>

                            <td style={{ padding: "0.85rem 1rem" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>
                                {app.degreeLevel || "Intermediate"}
                              </span>
                              <div style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: 700 }}>
                                Score: {app.percentage || "N/A"}
                              </div>
                            </td>

                            <td style={{ padding: "0.85rem 1rem" }}>
                              {app.tid ? (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                                  <span
                                    style={{
                                      fontFamily: "monospace",
                                      fontWeight: 800,
                                      color: "#1e3a8a",
                                      backgroundColor: "#eff6ff",
                                      padding: "0.15rem 0.4rem",
                                      borderRadius: "4px",
                                      border: "1px solid #bfdbfe",
                                    }}
                                  >
                                    {app.tid}
                                  </span>
                                  {app.receiptUrl && (
                                    <span style={{ fontSize: "0.7rem", color: "#16a34a", fontWeight: 700 }}>📎 Pic</span>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontStyle: "italic" }}>
                                  Not Submitted
                                </span>
                              )}
                            </td>

                            <td style={{ padding: "0.85rem 1rem" }}>
                              {isApproved ? (
                                <span
                                  style={{
                                    backgroundColor: "#dcfce7",
                                    color: "#166534",
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: "50px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <CheckCircle2 size={13} /> Approved
                                </span>
                              ) : isRejected ? (
                                <span
                                  style={{
                                    backgroundColor: "#fee2e2",
                                    color: "#991b1b",
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: "50px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <XCircle size={13} /> Rejected
                                </span>
                              ) : isUnderReview ? (
                                <span
                                  style={{
                                    backgroundColor: "#fef3c7",
                                    color: "#92400e",
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: "50px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  <Clock size={13} /> Under Review
                                </span>
                              ) : (
                                <span
                                  style={{
                                    backgroundColor: "#f1f5f9",
                                    color: "#64748b",
                                    padding: "0.25rem 0.6rem",
                                    borderRadius: "50px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  Pending
                                </span>
                              )}
                            </td>

                            <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="btn btn-primary"
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "0.35rem 0.75rem",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                }}
                              >
                                <Eye size={13} /> Review Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MERIT CRITERIA & GENERATOR */}
        {/* ============================================================== */}
        {activeTab === "merit" && (
          <div>
            <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Award size={22} color="var(--primary)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  Merit Criteria Configurator & Engine
                </h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Configure qualification thresholds per academic stream to filter approved candidates for the Laptop Scheme.
              </p>

              <form onSubmit={handleSaveMerit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      Matriculation / SSC Threshold (%)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={100}
                      className="input"
                      value={meritCriteria.matric}
                      onChange={(e) => setMeritCriteria((prev) => ({ ...prev, matric: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Minimum percentage required for Matric stream.
                    </span>
                  </div>

                  <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      Intermediate / HSSC Threshold (%)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={100}
                      className="input"
                      value={meritCriteria.inter}
                      onChange={(e) => setMeritCriteria((prev) => ({ ...prev, inter: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Minimum percentage required for Inter stream.
                    </span>
                  </div>

                  <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      University / Degree Threshold (%)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={100}
                      className="input"
                      value={meritCriteria.university}
                      onChange={(e) => setMeritCriteria((prev) => ({ ...prev, university: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                      Equivalent percentage required for University stream.
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingMerit}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem" }}
                  >
                    <Sliders size={16} /> {savingMerit ? "Saving Settings..." : "Save Merit Thresholds"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeritGenerated(true)}
                    className="btn btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem" }}
                  >
                    <Award size={16} /> Auto-Generate Merit List
                  </button>
                </div>
              </form>
            </div>

            {/* MERIT QUALIFIED CANDIDATES LIST */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                    Generated Official Merit Ranking ({meritQualifiedList.length} Qualified)
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Ranked by verified marks and configured stream cut-offs.
                  </span>
                </div>
                <button
                  onClick={() => exportToCsv(meritQualifiedList, "student_laptop_online_merit_list")}
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}
                >
                  <Download size={15} /> Export Merit List (CSV)
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1e3a8a", color: "#ffffff", textAlign: "left" }}>
                      <th style={{ padding: "0.85rem 1rem" }}>Merit Rank</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Student Name</th>
                      <th style={{ padding: "0.85rem 1rem" }}>CNIC</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Stream</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Calculated Score</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Institute</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Merit Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meritQualifiedList.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "#64748b" }}>
                          No approved candidates currently meet the configured thresholds. Make sure candidates are marked as "Approved" in the Applications tab.
                        </td>
                      </tr>
                    ) : (
                      meritQualifiedList.map((app, idx) => (
                        <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "#1e3a8a" }}>
                            #{idx + 1}
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                            {app.fullName}
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>App #{app.applicationNo}</div>
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace" }}>{app.cnic}</td>
                          <td style={{ padding: "0.85rem 1rem" }}>{app.degreeLevel}</td>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "#16a34a" }}>
                            {app.percentage || "N/A"}
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", color: "#475569" }}>
                            {app.instituteName}
                          </td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <span
                              style={{
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                                padding: "0.25rem 0.6rem",
                                borderRadius: "50px",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                              }}
                            >
                              ★ Merit Qualified
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SELECTED CANDIDATES */}
        {/* ============================================================== */}
        {activeTab === "selected" && (
          <div>
            <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                    Final Selected Candidates Roster ({selectedCandidates.length})
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                    Verified applicants approved for official laptop award and voucher validation.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => exportToCsv(selectedCandidates, "student_laptop_online_selected_candidates")}
                    className="btn btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
                  >
                    <Download size={15} /> Export CSV
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
                  >
                    <Printer size={15} /> Print Roster
                  </button>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#15803d", color: "#ffffff", textAlign: "left" }}>
                      <th style={{ padding: "0.85rem 1rem" }}>#</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Application No</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Candidate Name</th>
                      <th style={{ padding: "0.85rem 1rem" }}>CNIC / B-Form</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Mobile</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Stream & Score</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Verified TID</th>
                      <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                          No candidates are currently marked as Approved. Use the Applications tab to verify and approve candidates.
                        </td>
                      </tr>
                    ) : (
                      selectedCandidates.map((app, idx) => (
                        <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "#1e3a8a" }}>
                            {app.applicationNo || "SLO-98470"}
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>{app.fullName}</td>
                          <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace" }}>{app.cnic}</td>
                          <td style={{ padding: "0.85rem 1rem" }}>{app.mobileNo}</td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            {app.degreeLevel} - <strong style={{ color: "#16a34a" }}>{app.percentage}</strong>
                          </td>
                          <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace" }}>{app.tid || "Verified"}</td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <span
                              style={{
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                                padding: "0.25rem 0.6rem",
                                borderRadius: "50px",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                              }}
                            >
                              ✓ Selected
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TEST SCHEDULE & BANNER MANAGER */}
        {/* ============================================================== */}
        {activeTab === "schedule" && (
          <div>
            {/* DYNAMIC ANNOUNCEMENT BANNER MANAGER */}
            <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Megaphone size={22} color="var(--primary)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  Homepage Announcement Banner Manager
                </h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Control the top running marquee announcement banner across the entire public website in real time.
              </p>

              {bannerNotice && (
                <div
                  style={{
                    backgroundColor: "#dcfce7",
                    border: "1px solid #86efac",
                    color: "#166534",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  ✓ {bannerNotice}
                </div>
              )}

              <form onSubmit={handleSaveBanner}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    Announcement Ticker Text
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    required
                    style={{ fontSize: "0.95rem" }}
                  />
                </div>

                {/* Banner preview */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                    Live Banner Preview:
                  </span>
                  <div
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      padding: "0.6rem 1rem",
                      borderRadius: "6px",
                      marginTop: "0.25rem",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Megaphone size={16} /> {bannerText}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingBanner}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  {savingBanner ? "Updating Live Banner..." : "Publish Announcement Banner"}
                </button>
              </form>
            </div>

            {/* TEST SCHEDULER */}
            <div className="card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Calendar size={22} color="var(--primary)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  Online Test Scheduler & Venues
                </h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Schedule and publish test dates, timings, and regional venues for applicants.
              </p>

              {/* Add schedule form */}
              <form
                onSubmit={handleAddSchedule}
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "1.75rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                      Academic Stream
                    </label>
                    <select
                      className="input"
                      value={newSchedule.stream}
                      onChange={(e) => setNewSchedule((prev) => ({ ...prev, stream: e.target.value }))}
                      required
                    >
                      <option value="Matriculation (SSC)">Matriculation (SSC)</option>
                      <option value="Intermediate (HSSC)">Intermediate (HSSC)</option>
                      <option value="University / Degree">University / Degree</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                      Test Date
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Sunday, 15 Nov 2026"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                      Timings
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 10:00 AM - 11:30 AM"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule((prev) => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                      Venue / Examination Center
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Regional BISE Center / Online Portal"
                      value={newSchedule.venue}
                      onChange={(e) => setNewSchedule((prev) => ({ ...prev, venue: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingSchedule}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Calendar size={15} /> Add Test Schedule Slot
                </button>
              </form>

              {/* Published schedules table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#0f172a", color: "#ffffff", textAlign: "left" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>Stream</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Date</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Timings</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Venue / Portal</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testSchedules.map((schedule) => (
                      <tr key={schedule.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{schedule.stream}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{schedule.date}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{schedule.time}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{schedule.venue}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            style={{
                              backgroundColor: "#dcfce7",
                              color: "#166534",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            Published
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SECURITY / PASSWORD RESET */}
        {/* ============================================================== */}
        {activeTab === "security" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Key size={24} color="var(--primary)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  Super Admin Security & Password Reset
                </h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.75rem" }}>
                Manage your credentials for the Super Admin account (<code>admin@studentlaptop.online</code>).
              </p>

              {securityNotice && (
                <div
                  style={{
                    backgroundColor: securityNotice.type === "success" ? "#dcfce7" : "#fee2e2",
                    border: securityNotice.type === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
                    color: securityNotice.type === "success" ? "#166534" : "#991b1b",
                    padding: "0.85rem 1rem",
                    borderRadius: "6px",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {securityNotice.message}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                    Current Password <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter current admin password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                    New Password <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter new strong password (min 6 chars)"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                    Confirm New Password <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Re-type new password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={securityLoading}
                  style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", fontWeight: 700 }}
                >
                  {securityLoading ? "Updating Password..." : "Update Admin Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* CANDIDATE DETAILS & VERIFICATION MODAL / DRAWER */}
      {/* ============================================================== */}
      {selectedApp && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "1rem",
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "860px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 0,
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                padding: "1.25rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>
                  Application Review: {selectedApp.fullName}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  Application No: <strong>{selectedApp.applicationNo || "SLO-98470"}</strong> | CNIC: {selectedApp.cnic}
                </span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem" }}>
              
              {/* TOP SPLIT: APPLICANT PROFILE & CHALLAN DETAILS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {/* Left: Student Personal & Contact Info */}
                <div style={{ backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.95rem", fontWeight: 700, color: "#1e3a8a" }}>
                    Student Identification & Contact
                  </h4>
                  <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ color: "#64748b", padding: "0.25rem 0", width: "40%" }}>Full Name:</td>
                        <td style={{ fontWeight: 700, color: "#0f172a" }}>{selectedApp.fullName}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#64748b", padding: "0.25rem 0" }}>Father's Name:</td>
                        <td style={{ fontWeight: 600 }}>{selectedApp.fatherName}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#64748b", padding: "0.25rem 0" }}>CNIC / B-Form:</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{selectedApp.cnic}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#64748b", padding: "0.25rem 0" }}>Mobile Number:</td>
                        <td style={{ fontWeight: 600 }}>{selectedApp.mobileNo}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#64748b", padding: "0.25rem 0" }}>Email:</td>
                        <td>{selectedApp.email || "N/A"}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "#64748b", padding: "0.25rem 0" }}>Institute:</td>
                        <td style={{ fontSize: "0.8rem", fontWeight: 600 }}>{selectedApp.instituteName}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right: Payment & Challan Verification */}
                <div style={{ backgroundColor: "#f0fdf4", padding: "1.25rem", borderRadius: "8px", border: "1.5px solid #86efac" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#166534" }}>
                      Payment Voucher & TID Record
                    </h4>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "50px",
                        backgroundColor: selectedApp.status === "APPROVED" ? "#dcfce7" : "#fef3c7",
                        color: selectedApp.status === "APPROVED" ? "#15803d" : "#b45309",
                      }}
                    >
                      {selectedApp.status || "Payment Pending"}
                    </span>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>Payable Amount:</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#15803d" }}>
                      Rs. 475/- <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>(Till: 984703000)</span>
                    </div>
                  </div>

                  {/* TID display box */}
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1.5px dashed #16a34a",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                      Submitted Transaction ID (TID):
                    </span>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.25rem" }}>
                      <strong style={{ fontSize: "1.1rem", fontFamily: "monospace", color: "#0f172a" }}>
                        {selectedApp.tid || "NO TID SUBMITTED"}
                      </strong>
                      {selectedApp.tid && (
                        <button
                          type="button"
                          onClick={() => handleCopyTid(selectedApp.tid || "")}
                          className="btn"
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            backgroundColor: copiedTid ? "#16a34a" : "#e2e8f0",
                            color: copiedTid ? "white" : "#1e293b",
                          }}
                        >
                          {copiedTid ? "Copied!" : "Copy TID"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Receipt screenshot preview */}
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534" }}>
                      Uploaded Payment Receipt Screenshot:
                    </span>
                    {selectedApp.receiptUrl ? (
                      <div style={{ marginTop: "0.35rem" }}>
                        <img
                          src={selectedApp.receiptUrl}
                          alt="Receipt Preview"
                          onClick={() => setEnlargedImage(selectedApp.receiptUrl || null)}
                          style={{
                            maxHeight: "120px",
                            maxWidth: "100%",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            cursor: "pointer",
                            display: "block",
                          }}
                        />
                        <span style={{ fontSize: "0.7rem", color: "#2563eb", cursor: "pointer", marginTop: "0.25rem", display: "inline-block" }} onClick={() => setEnlargedImage(selectedApp.receiptUrl || null)}>
                          🔍 Click to Enlarge / Zoom Receipt
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic", marginTop: "0.25rem" }}>
                        Applicant has not attached receipt screenshot.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEQUENTIAL ACADEMIC HISTORY SECTION */}
              <div style={{ backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
                <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.95rem", fontWeight: 700, color: "#1e3a8a" }}>
                  Sequential Academic Milestone History
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  {/* Matriculation */}
                  <div style={{ backgroundColor: "#ffffff", padding: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    <div style={{ fontWeight: 700, color: "#1e3a8a", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                      1. Matriculation / SSC
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                      Roll No: <strong>{selectedApp.matricRollNumber || selectedApp.rollNumber || "N/A"}</strong><br />
                      Board: {selectedApp.matricBoard || selectedApp.boardUniversity || "N/A"}<br />
                      Marks: {selectedApp.matricObtainedMarks || "0"} / {selectedApp.matricTotalMarks || "1100"}<br />
                      Score: <strong style={{ color: "#16a34a" }}>{selectedApp.matricPercentage || selectedApp.percentage || "N/A"}</strong>
                    </div>
                  </div>

                  {/* Intermediate */}
                  {(selectedApp.interRollNumber || selectedApp.degreeLevel?.toLowerCase().includes("inter") || selectedApp.degreeLevel?.toLowerCase().includes("uni")) && (
                    <div style={{ backgroundColor: "#ffffff", padding: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                      <div style={{ fontWeight: 700, color: "#166534", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                        2. Intermediate / HSSC
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                        Roll No: <strong>{selectedApp.interRollNumber || "N/A"}</strong><br />
                        Board: {selectedApp.interBoard || "N/A"}<br />
                        Marks: {selectedApp.interObtainedMarks || "0"} / {selectedApp.interTotalMarks || "1100"}<br />
                        Score: <strong style={{ color: "#16a34a" }}>{selectedApp.interPercentage || "N/A"}</strong>
                      </div>
                    </div>
                  )}

                  {/* University */}
                  {(selectedApp.gradUniversity || selectedApp.degreeLevel?.toLowerCase().includes("uni")) && (
                    <div style={{ backgroundColor: "#ffffff", padding: "0.85rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                      <div style={{ fontWeight: 700, color: "#86198f", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                        3. University / Degree
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                        University: {selectedApp.gradUniversity || "N/A"}<br />
                        Program: {selectedApp.gradProgram || "Undergraduate"}<br />
                        Roll / Reg: <strong>{selectedApp.gradRollNumber || "N/A"}</strong><br />
                        Score / CGPA: <strong style={{ color: "#86198f" }}>{selectedApp.gradScore || "N/A"}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ONE-CLICK VERIFICATION ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "flex-end",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("REJECTED")}
                  disabled={actionLoading}
                  className="btn"
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.6rem 1.25rem",
                    fontWeight: 700,
                  }}
                >
                  <XCircle size={16} /> Reject Payment
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus("UNDER_REVIEW")}
                  disabled={actionLoading}
                  className="btn btn-secondary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.6rem 1.25rem",
                    fontWeight: 700,
                  }}
                >
                  <Clock size={16} /> Mark Under Review
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus("APPROVED")}
                  disabled={actionLoading}
                  className="btn"
                  style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.6rem 1.5rem",
                    fontWeight: 800,
                    boxShadow: "0 4px 10px rgba(22, 163, 74, 0.3)",
                  }}
                >
                  <CheckCircle2 size={16} /> Verify Payment & Approve
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ENLARGED IMAGE MODAL */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          <img
            src={enlargedImage}
            alt="Enlarged Receipt"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
          />
        </div>
      )}
    </div>
  );
}

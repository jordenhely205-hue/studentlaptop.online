"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface SearchableSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type: "institute" | "board";
  required?: boolean;
}

export default function SearchableSelect({
  label,
  name,
  value,
  onChange,
  placeholder = "Select or search...",
  type,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch initial/filtered options
  useEffect(() => {
    let active = true;
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/institutes?type=${type}&query=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.results)) {
            setOptions(data.results);
          }
        }
      } catch (err) {
        console.error("Failed to load options", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchOptions();
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [type, query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedVal: string) => {
    onChange(selectedVal);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }} ref={containerRef}>
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontWeight: 600,
          color: "#334155",
          fontSize: "0.95rem",
        }}
      >
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>

      {/* Select button / trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          border: isOpen ? "2px solid var(--primary)" : "1px solid #cbd5e1",
          borderRadius: "0.5rem",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          minHeight: "48px",
          transition: "border-color 0.15s ease",
        }}
      >
        <span
          style={{
            color: value ? "#0f172a" : "#94a3b8",
            fontSize: "0.95rem",
            fontWeight: value ? 500 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginRight: "0.5rem",
          }}
        >
          {value || placeholder}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
              title="Clear selection"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={18}
            style={{
              color: "#64748b",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      </div>

      {/* Dropdown modal / panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "0.35rem",
            backgroundColor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            zIndex: 999,
            maxHeight: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search bar inside dropdown */}
          <div
            style={{
              padding: "0.5rem",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Search size={16} style={{ color: "#64748b" }} />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${type === "board" ? "board..." : "institute..."}`}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "0.9rem",
                color: "#1e293b",
                backgroundColor: "transparent",
              }}
            />
          </div>

          {/* Options list */}
          <div
            style={{
              overflowY: "auto",
              flex: 1,
              maxHeight: "240px",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "0.85rem",
                }}
              >
                Searching database...
              </div>
            ) : options.length > 0 ? (
              options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  style={{
                    padding: "0.65rem 1rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: value === opt ? "#eff6ff" : "transparent",
                    color: value === opt ? "var(--primary)" : "#1e293b",
                    borderBottom: "1px solid #f8fafc",
                    transition: "background-color 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== opt) {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== opt) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span>{opt}</span>
                  {value === opt && <Check size={16} color="var(--primary)" />}
                </div>
              ))
            ) : (
              <div style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                  No exact matches found.
                </p>
                {query.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelect(query.trim())}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.85rem",
                      backgroundColor: "var(--primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Use "{query.trim()}"
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

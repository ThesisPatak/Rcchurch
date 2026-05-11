import React, { useEffect, useMemo, useState } from "react";
import ChurchAdminLogin from "./ChurchAdminLogin";

type ChurchCategory = "Baptismal" | "Wedding" | "Funeral";

interface BaseRecord {
  id: string;
  category: ChurchCategory;
  createdAt: string;
}

interface BaptismalRecord extends BaseRecord {
  category: "Baptismal";
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  notes: string;
}

interface WeddingRecord extends BaseRecord {
  category: "Wedding";
  husbandFirstName: string;
  husbandMiddleName: string;
  husbandLastName: string;
  wifeFirstName: string;
  wifeMiddleName: string;
  wifeLastName: string;
  weddingDate: string;
  notes: string;
}

interface FuneralRecord extends BaseRecord {
  category: "Funeral";
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  notes: string;
}

type ChurchRecord = BaptismalRecord | WeddingRecord | FuneralRecord;

const CATEGORY_OPTIONS: ChurchCategory[] = ["Baptismal", "Wedding", "Funeral"];
const RECORD_STORAGE_KEY = "churchRecords";
const TOKEN_STORAGE_KEY = "churchAdminToken";
const USERNAME_STORAGE_KEY = "churchAdminUsername";
const ADMIN_CREDENTIALS_KEY = "churchAdminCredentials";

interface AdminCredentials {
  username: string;
  password: string;
}

const ChurchAdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_STORAGE_KEY) || "");
  const [adminUsername, setAdminUsername] = useState<string>(() => localStorage.getItem(USERNAME_STORAGE_KEY) || "");
  const [records, setRecords] = useState<ChurchRecord[]>(() => {
    const saved = localStorage.getItem(RECORD_STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved) as ChurchRecord[];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<ChurchCategory>("Baptismal");
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [husbandFirstName, setHusbandFirstName] = useState("");
  const [husbandMiddleName, setHusbandMiddleName] = useState("");
  const [husbandLastName, setHusbandLastName] = useState("");
  const [wifeFirstName, setWifeFirstName] = useState("");
  const [wifeMiddleName, setWifeMiddleName] = useState("");
  const [wifeLastName, setWifeLastName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [accountCurrentPassword, setAccountCurrentPassword] = useState("");
  const [accountNewPassword, setAccountNewPassword] = useState("");
  const [accountConfirmPassword, setAccountConfirmPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [accountMessageType, setAccountMessageType] = useState<"success" | "error">("success");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const handleLogin = (username: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "authenticated");
    localStorage.setItem(USERNAME_STORAGE_KEY, username);
    setToken("authenticated");
    setAdminUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    setToken("");
    setAdminUsername("");
  };

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDateOfBirth("");
    setDateOfDeath("");
    setHusbandFirstName("");
    setHusbandMiddleName("");
    setHusbandLastName("");
    setWifeFirstName("");
    setWifeMiddleName("");
    setWifeLastName("");
    setWeddingDate("");
    setNotes("");
    setMessage("");
  };

  const handleAddRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (selectedCategory === "Baptismal") {
      if (!firstName.trim() || !lastName.trim() || !dateOfBirth.trim()) {
        setMessageType("error");
        setMessage("First name, last name, and date of birth are required for baptismal records.");
        return;
      }

      const newRecord: BaptismalRecord = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        category: "Baptismal",
        createdAt: new Date().toISOString(),
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        notes: notes.trim(),
      };

      setRecords((current) => [newRecord, ...current]);
      setMessageType("success");
      setMessage("Baptismal record saved.");
      resetForm();
      return;
    }

    if (selectedCategory === "Wedding") {
      if (!husbandFirstName.trim() || !husbandLastName.trim() || !wifeFirstName.trim() || !wifeLastName.trim() || !weddingDate.trim()) {
        setMessageType("error");
        setMessage("Husband and wife names plus wedding date are required for wedding records.");
        return;
      }

      const newRecord: WeddingRecord = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        category: "Wedding",
        createdAt: new Date().toISOString(),
        husbandFirstName: husbandFirstName.trim(),
        husbandMiddleName: husbandMiddleName.trim(),
        husbandLastName: husbandLastName.trim(),
        wifeFirstName: wifeFirstName.trim(),
        wifeMiddleName: wifeMiddleName.trim(),
        wifeLastName: wifeLastName.trim(),
        weddingDate,
        notes: notes.trim(),
      };

      setRecords((current) => [newRecord, ...current]);
      setMessageType("success");
      setMessage("Wedding record saved.");
      resetForm();
      return;
    }

    if (selectedCategory === "Funeral") {
      if (!firstName.trim() || !lastName.trim() || !dateOfBirth.trim() || !dateOfDeath.trim()) {
        setMessageType("error");
        setMessage("Full name, date of birth, and date of death are required for funeral records.");
        return;
      }

      const newRecord: FuneralRecord = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        category: "Funeral",
        createdAt: new Date().toISOString(),
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        dateOfDeath,
        notes: notes.trim(),
      };

      setRecords((current) => [newRecord, ...current]);
      setMessageType("success");
      setMessage("Funeral record saved.");
      resetForm();
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (!window.confirm("Delete this record permanently?")) {
      return;
    }

    setRecords((current) => current.filter((record) => record.id !== id));
    setMessageType("success");
    setMessage("Record removed successfully.");
  };

  const handleCategorySelect = (category: ChurchCategory) => {
    setSelectedCategory(category);
    setShowAccountPanel(false);
    setSearchTerm("");
    setMessage("");
    resetForm();
  };

  const categoryRecords = useMemo(
    () => records.filter((record) => record.category === selectedCategory),
    [records, selectedCategory]
  );

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categoryRecords;

    return categoryRecords.filter((record) => {
      if (record.category === "Wedding") {
        return [
          record.husbandFirstName,
          record.husbandMiddleName,
          record.husbandLastName,
          record.wifeFirstName,
          record.wifeMiddleName,
          record.wifeLastName,
        ].some((value) => value.toLowerCase().includes(query));
      }

      return [record.firstName, record.middleName, record.lastName].some((value) => value.toLowerCase().includes(query));
    });
  }, [categoryRecords, searchTerm]);

  const summaryCounts = useMemo(
    () =>
      CATEGORY_OPTIONS.reduce(
        (summary, option) => ({
          ...summary,
          [option]: records.filter((record) => record.category === option).length,
        }),
        { Baptismal: 0, Wedding: 0, Funeral: 0 } as Record<ChurchCategory, number>
      ),
    [records]
  );

  const handlePasswordUpdate = () => {
    setAccountMessage("");

    const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!stored) {
      setAccountMessageType("error");
      setAccountMessage("Admin credentials not found.");
      return;
    }

    const credentials = JSON.parse(stored) as AdminCredentials;

    if (!accountCurrentPassword || !accountNewPassword || !accountConfirmPassword) {
      setAccountMessageType("error");
      setAccountMessage("All password fields are required.");
      return;
    }

    if (credentials.password !== accountCurrentPassword) {
      setAccountMessageType("error");
      setAccountMessage("Current password is incorrect.");
      return;
    }

    if (accountNewPassword !== accountConfirmPassword) {
      setAccountMessageType("error");
      setAccountMessage("New password and confirmation do not match.");
      return;
    }

    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify({
      ...credentials,
      password: accountNewPassword,
    }));
    setAccountCurrentPassword("");
    setAccountNewPassword("");
    setAccountConfirmPassword("");
    setAccountMessageType("success");
    setAccountMessage("Password updated successfully.");
  };

  if (!token) {
    return <ChurchAdminLogin onLogin={handleLogin} />;
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Roboto', sans-serif", minHeight: "100vh", width: "100vw", background: "#f8f9fb", margin: 0, padding: 0, boxSizing: "border-box" }}>
      <header style={{ background: "#1a3a52", color: "#ffffff", padding: isMobile ? "1.4rem 1rem" : "1.8rem 2.5rem", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: "1rem", borderBottom: "1px solid #172c44", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        <div>
          <div style={{ fontSize: isMobile ? "1.5rem" : "1.95rem", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "0.25rem" }}>
            Church Records Management
          </div>
          <div style={{ color: "#c9d6e5", fontSize: "0.95rem", fontWeight: 500 }}>
            View and manage baptismal, wedding, and funeral records.
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ color: "#edf2f7", fontSize: "0.95rem", fontWeight: 500 }}>
            {adminUsername}
          </div>
          <button
            onClick={() => setShowAccountPanel((current) => !current)}
            style={{ border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#ffffff", padding: "0.75rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s ease" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Account
          </button>
          <button
            onClick={handleLogout}
            style={{ border: "none", background: "#ffffff", color: "#1a3a52", padding: "0.75rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s ease" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: isMobile ? "1rem" : "2rem" }}>
        {showAccountPanel && (
          <section style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)", border: "1px solid #e8ecf1", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#1a3a52" }}>
                  Admin Account Details
                </h2>
                <p style={{ margin: "0.65rem 0 0", color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Manage your account securely. Only one admin account is supported.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
              <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e8ecf1" }}>
                <div style={{ color: "#6b7280", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}>Username</div>
                <div style={{ color: "#1a3a52", fontWeight: 700 }}>{adminUsername}</div>
              </div>
              <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e8ecf1" }}>
                <div style={{ color: "#6b7280", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}>Account Type</div>
                <div style={{ color: "#1a3a52", fontWeight: 700 }}>Single Admin</div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ marginBottom: "1rem", color: "#2c3e50", fontWeight: 700, fontSize: "1rem" }}>Change Password</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                <input
                  type="password"
                  value={accountCurrentPassword}
                  onChange={(event) => setAccountCurrentPassword(event.target.value)}
                  placeholder="Current password"
                  style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                />
                <input
                  type="password"
                  value={accountNewPassword}
                  onChange={(event) => setAccountNewPassword(event.target.value)}
                  placeholder="New password"
                  style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                />
              </div>
              <input
                type="password"
                value={accountConfirmPassword}
                onChange={(event) => setAccountConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                style={{ marginTop: "1rem", width: "100%", padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
              />

              {accountMessage && (
                <div style={{ marginTop: "1rem", padding: "0.95rem 1rem", borderRadius: "8px", border: accountMessageType === "success" ? "1px solid #a7f3d0" : "1px solid #fca5a5", background: accountMessageType === "success" ? "#dcfce7" : "#fee2e2", color: accountMessageType === "success" ? "#065f46" : "#7f1d1d", fontWeight: 600 }}>
                  {accountMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handlePasswordUpdate}
                style={{ marginTop: "1.25rem", padding: "1rem 1.2rem", background: "#1a3a52", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#142a3a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1a3a52";
                }}
              >
                Update Password
              </button>
            </div>
          </section>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "5fr 2fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleCategorySelect(option)}
                style={{
                  border: "none",
                  padding: "0.95rem 1.25rem",
                  borderRadius: "999px",
                  background: selectedCategory === option ? "#1a3a52" : "#ffffff",
                  color: selectedCategory === option ? "#ffffff" : "#1a3a52",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: selectedCategory === option ? "0 8px 20px rgba(26, 58, 82, 0.14)" : "0 1px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: isMobile ? "flex-start" : "flex-end", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ color: "#1a3a52", fontWeight: 600 }}>Summary</div>
              {CATEGORY_OPTIONS.map((option) => (
                <div key={option} style={{ padding: "0.85rem 1rem", background: "#ffffff", borderRadius: "12px", border: "1px solid #e8ecf1", minWidth: "90px", textAlign: "center" }}>
                  <div style={{ color: "#6b7280", fontSize: "0.82rem", marginBottom: "0.4rem" }}>{option}</div>
                  <div style={{ color: "#1a3a52", fontSize: "1.2rem", fontWeight: 700 }}>{summaryCounts[option]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "380px 1fr", gap: "1.5rem" }}>
          <section style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)", border: "1px solid #e8ecf1" }}>
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#1a3a52" }}>{selectedCategory} Record</h2>
            <p style={{ marginTop: "0.65rem", color: "#6b7280", lineHeight: 1.6, fontSize: "0.95rem" }}>Enter the required details for the selected record type.</p>

            <form onSubmit={handleAddRecord} style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
              {selectedCategory === "Wedding" ? (
                <>
                  <div style={{ color: "#2c3e50", fontWeight: 700, marginBottom: "0.5rem" }}>Husband</div>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <input
                      type="text"
                      value={husbandFirstName}
                      onChange={(event) => setHusbandFirstName(event.target.value)}
                      placeholder="First name"
                      style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                    <input
                      type="text"
                      value={husbandMiddleName}
                      onChange={(event) => setHusbandMiddleName(event.target.value)}
                      placeholder="Middle name"
                      style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                    <input
                      type="text"
                      value={husbandLastName}
                      onChange={(event) => setHusbandLastName(event.target.value)}
                      placeholder="Last name"
                      style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div style={{ color: "#2c3e50", fontWeight: 700, marginTop: "1rem", marginBottom: "0.5rem" }}>Wife</div>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <input
                      type="text"
                      value={wifeFirstName}
                      onChange={(event) => setWifeFirstName(event.target.value)}
                      placeholder="First name"
                      style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                    <input
                      type="text"
                      value={wifeMiddleName}
                      onChange={(event) => setWifeMiddleName(event.target.value)}
                      placeholder="Middle name"
                      style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                    <input
                      type="text"
                      value={wifeLastName}
                      onChange={(event) => setWifeLastName(event.target.value)}
                      placeholder="Last name"
                      style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", color: "#2c3e50", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                      Wedding date
                    </label>
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(event) => setWeddingDate(event.target.value)}
                      style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First name"
                    style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                  />
                  <input
                    type="text"
                    value={middleName}
                    onChange={(event) => setMiddleName(event.target.value)}
                    placeholder="Middle name"
                    style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last name"
                    style={{ padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                  />
                  <div>
                    <label style={{ display: "block", color: "#2c3e50", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                      Date of birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(event) => setDateOfBirth(event.target.value)}
                      style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                    />
                  </div>
                  {selectedCategory === "Funeral" && (
                    <div>
                      <label style={{ display: "block", color: "#2c3e50", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                        Date of death
                      </label>
                      <input
                        type="date"
                        value={dateOfDeath}
                        onChange={(event) => setDateOfDeath(event.target.value)}
                        style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
                      />
                    </div>
                  )}
                </>
              )}

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes or ceremony details"
                rows={4}
                style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem", resize: "vertical" }}
              />

              {message ? (
                <div
                  style={{
                    color: messageType === "success" ? "#065f46" : "#991b1b",
                    background: messageType === "success" ? "#d1fae5" : "#fee2e2",
                    borderRadius: "8px",
                    padding: "0.95rem 1rem",
                    border: messageType === "success" ? "1px solid #6ee7b7" : "1px solid #fecaca",
                    fontWeight: 600,
                  }}
                >
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "1rem 1.2rem",
                  background: "#1a3a52",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#142a3a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1a3a52";
                }}
              >
                Save Record
              </button>
            </form>
          </section>

          <section style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)", border: "1px solid #e8ecf1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#1a3a52" }}>{selectedCategory} Records</h2>
                <p style={{ margin: "0.5rem 0 0", color: "#6b7280", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  Records for the selected category only.
                </p>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name"
                style={{ width: isMobile ? "100%" : "280px", padding: "0.95rem 1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fafbfc", fontSize: "0.95rem" }}
              />
            </div>

            {filteredRecords.length === 0 ? (
              <div style={{ color: "#6b7280", fontSize: "0.95rem", padding: "1.6rem 1rem", background: "#f8fafc", borderRadius: "10px", textAlign: "center" }}>
                {searchTerm ? `No ${selectedCategory.toLowerCase()} records match "${searchTerm}".` : `No ${selectedCategory.toLowerCase()} records yet.`}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredRecords.map((record) => (
                  <div key={record.id} style={{ padding: "1rem 1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e8ecf1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        {record.category === "Wedding" ? (
                          <>
                            <div style={{ fontWeight: 700, color: "#1a3a52", marginBottom: "0.4rem" }}>
                              {record.husbandFirstName} {record.husbandMiddleName} {record.husbandLastName} & {record.wifeFirstName} {record.wifeMiddleName} {record.wifeLastName}
                            </div>
                            <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                              Wedding date: {new Date(record.weddingDate).toLocaleDateString()}
                            </div>
                          </>
                        ) : record.category === "Funeral" ? (
                          <>
                            <div style={{ fontWeight: 700, color: "#1a3a52", marginBottom: "0.4rem" }}>
                              {record.firstName} {record.middleName} {record.lastName}
                            </div>
                            <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                              DOB: {new Date(record.dateOfBirth).toLocaleDateString()} · DOD: {new Date(record.dateOfDeath).toLocaleDateString()}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontWeight: 700, color: "#1a3a52", marginBottom: "0.4rem" }}>
                              {record.firstName} {record.middleName} {record.lastName}
                            </div>
                            <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                              Date of birth: {new Date(record.dateOfBirth).toLocaleDateString()}
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        style={{ border: "none", background: "#dc2626", color: "#ffffff", padding: "0.7rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", transition: "all 0.3s ease" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#b91c1c";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    {record.notes && (
                      <div style={{ marginTop: "0.95rem", color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.6 }}>
                        {record.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ChurchAdminDashboard;

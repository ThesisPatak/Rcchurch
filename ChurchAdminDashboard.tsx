import React, { useEffect, useMemo, useState } from "react";
import ChurchAdminLogin from "./ChurchAdminLogin";

type ChurchCategory = "Baptismal" | "Wedding" | "Funeral";

interface ChurchRecord {
  id: string;
  category: ChurchCategory;
  firstName: string;
  lastName: string;
  date: string;
  details: string;
  createdAt: string;
}

const CATEGORY_OPTIONS: ChurchCategory[] = ["Baptismal", "Wedding", "Funeral"];
const RECORD_STORAGE_KEY = "churchRecords";
const TOKEN_STORAGE_KEY = "churchAdminToken";
const USERNAME_STORAGE_KEY = "churchAdminUsername";

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

  const [category, setCategory] = useState<ChurchCategory>("Baptismal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
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

  const handleAddRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!firstName.trim() || !lastName.trim() || !date.trim()) {
      setMessageType("error");
      setMessage("First name, last name, and date are required.");
      return;
    }

    const newRecord: ChurchRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      date,
      details: details.trim(),
      createdAt: new Date().toISOString(),
    };

    setRecords((current) => [newRecord, ...current]);
    setFirstName("");
    setLastName("");
    setDate("");
    setDetails("");
    setMessageType("success");
    setMessage("Record saved successfully.");
  };

  const handleDeleteRecord = (id: string) => {
    if (!window.confirm("Delete this record permanently?")) {
      return;
    }

    setRecords((current) => current.filter((record) => record.id !== id));
    setMessageType("success");
    setMessage("Record deleted successfully.");
  };

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return records;
    }

    return records.filter((record) => {
      return (
        record.firstName.toLowerCase().includes(query) ||
        record.lastName.toLowerCase().includes(query)
      );
    });
  }, [records, searchTerm]);

  const recordsByCategory = useMemo(
    () =>
      CATEGORY_OPTIONS.map((option) => ({
        category: option,
        items: filteredRecords.filter((record) => record.category === option),
      })),
    [filteredRecords]
  );

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

  if (!token) {
    return <ChurchAdminLogin onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        fontFamily: "Poppins, Arial, sans-serif",
        minHeight: "100vh",
        width: "100vw",
        background: "#f3f6fb",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          background: "#0f2b67",
          color: "#ffffff",
          padding: isMobile ? "1.15rem 1rem" : "1.5rem 2rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ fontSize: isMobile ? "1.3rem" : "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            Church Records Admin
          </div>
          <div style={{ color: "#dbe2ff", fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Manage baptismal, wedding, and funeral records in one place.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ color: "#ffffff", opacity: 0.9, fontSize: "0.95rem" }}>
            Admin: {adminUsername}
          </div>
          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "#ffffff",
              color: "#0f2b67",
              padding: "0.8rem 1.1rem",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "360px 1fr",
          gap: "1.5rem",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: isMobile ? "1.25rem" : "1.75rem",
            boxShadow: "0 18px 50px rgba(12, 25, 80, 0.08)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#0f2b67" }}>
            Add a new record
          </h2>
          <p style={{ marginTop: "0.75rem", color: "#525f7a", lineHeight: 1.6 }}>
            Select the category and enter the person’s full name, event date, and a short detail.
          </p>

          <form onSubmit={handleAddRecord} style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
            <label style={{ display: "block", color: "#3b4c78", fontWeight: 600 }}>Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ChurchCategory)}
              style={{
                width: "100%",
                padding: "0.95rem 1rem",
                borderRadius: "12px",
                border: "1px solid #d8dde9",
                fontSize: "1rem",
              }}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", color: "#3b4c78", fontWeight: 600, marginBottom: "0.5rem" }}>
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  style={{
                    width: "100%",
                    padding: "0.95rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid #d8dde9",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#3b4c78", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  style={{
                    width: "100%",
                    padding: "0.95rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid #d8dde9",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <label style={{ display: "block", color: "#3b4c78", fontWeight: 600, marginBottom: "0.5rem" }}>
              Event date
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={{
                width: "100%",
                padding: "0.95rem 1rem",
                borderRadius: "12px",
                border: "1px solid #d8dde9",
                fontSize: "1rem",
              }}
            />

            <label style={{ display: "block", color: "#3b4c78", fontWeight: 600, marginBottom: "0.5rem" }}>
              Details
            </label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Short notes, pastor, sponsor names, or ceremony details"
              rows={4}
              style={{
                width: "100%",
                padding: "0.95rem 1rem",
                borderRadius: "12px",
                border: "1px solid #d8dde9",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />

            {message ? (
              <div
                style={{
                  color: messageType === "success" ? "#115e59" : "#b91c1c",
                  background: messageType === "success" ? "#d1fae5" : "#fee2e2",
                  borderRadius: "12px",
                  padding: "0.9rem 1rem",
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
                padding: "1rem 1.1rem",
                background: "#0f2b67",
                color: "#ffffff",
                border: "none",
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Save record
            </button>
          </form>
        </section>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: isMobile ? "1.25rem" : "1.75rem",
              boxShadow: "0 18px 50px rgba(12, 25, 80, 0.08)",
            }}
          >
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#0f2b67" }}>
                  Search records
                </h2>
                <p style={{ margin: "0.6rem 0 0", color: "#525f7a", lineHeight: 1.6 }}>
                  Type the first name or last name of the person to filter results.
                </p>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or surname"
                style={{
                  width: isMobile ? "100%" : "320px",
                  padding: "0.95rem 1rem",
                  borderRadius: "14px",
                  border: "1px solid #d8dde9",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: "1rem" }}>
              {CATEGORY_OPTIONS.map((option) => (
                <div key={option} style={{ padding: "1rem", background: "#f9fbff", borderRadius: "16px", border: "1px solid #d8dde9" }}>
                  <div style={{ color: "#3b4c78", fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>{option}</div>
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "#0f2b67" }}>{summaryCounts[option]}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: isMobile ? "1.25rem" : "1.75rem",
              boxShadow: "0 18px 50px rgba(12, 25, 80, 0.08)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#0f2b67" }}>
              Records
            </h2>
            <p style={{ margin: "0.75rem 0 0", color: "#525f7a", lineHeight: 1.6 }}>
              Records are stored locally in this browser. Use the delete button to remove outdated or incorrect entries.
            </p>

            {filteredRecords.length === 0 ? (
              <div style={{ marginTop: "1.5rem", color: "#6b7280", fontSize: "0.98rem" }}>
                {searchTerm
                  ? `No records match "${searchTerm}". Try a different name or surname.`
                  : "No records found yet. Add a new record using the form on the left."}
              </div>
            ) : (
              <div style={{ marginTop: "1.75rem", display: "grid", gap: "1.25rem" }}>
                {recordsByCategory.map(({ category: sectionCategory, items }) => (
                  <div key={sectionCategory}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.85rem" }}>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f2b67" }}>{sectionCategory}</div>
                      <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>{items.length} record{items.length === 1 ? "" : "s"}</div>
                    </div>
                    {items.length === 0 ? (
                      <div style={{ color: "#6b7280", fontSize: "0.94rem", padding: "1rem", background: "#f8fafc", borderRadius: "16px" }}>
                        No {sectionCategory.toLowerCase()} records match your search.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {items.map((record) => (
                          <div
                            key={record.id}
                            style={{
                              padding: "1rem 1.1rem",
                              background: "#f8fbff",
                              borderRadius: "18px",
                              border: "1px solid #e3e8f4",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                              <div>
                                <div style={{ fontWeight: 700, color: "#111827", fontSize: "1rem" }}>
                                  {record.firstName} {record.lastName}
                                </div>
                                <div style={{ marginTop: "0.35rem", color: "#475569", fontSize: "0.95rem" }}>
                                  {record.category} • {new Date(record.date).toLocaleDateString()}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteRecord(record.id)}
                                style={{
                                  border: "none",
                                  background: "#ef4444",
                                  color: "#ffffff",
                                  padding: "0.65rem 0.95rem",
                                  borderRadius: "999px",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                              >
                                Delete
                              </button>
                            </div>
                            {record.details && (
                              <div style={{ marginTop: "0.85rem", color: "#475569", lineHeight: 1.7 }}>
                                {record.details}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChurchAdminDashboard;

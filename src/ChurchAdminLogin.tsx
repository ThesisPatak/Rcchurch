import React, { useEffect, useState } from "react";

interface ChurchAdminLoginProps {
  onLogin: (username: string) => void;
}

interface AdminCredentials {
  username: string;
  password: string;
}

const STORAGE_KEY = "churchAdminCredentials";

const ChurchAdminLogin: React.FC<ChurchAdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [setupMode, setSetupMode] = useState(() => !Boolean(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    const storedCredentials = localStorage.getItem(STORAGE_KEY);

    if (setupMode || !storedCredentials) {
      const credentials: AdminCredentials = { username: trimmedUsername, password };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
      localStorage.setItem("churchAdminToken", "authenticated");
      localStorage.setItem("churchAdminUsername", trimmedUsername);
      onLogin(trimmedUsername);
      return;
    }

    const parsedCredentials = JSON.parse(storedCredentials) as AdminCredentials;

    if (
      parsedCredentials.username === trimmedUsername &&
      parsedCredentials.password === password
    ) {
      localStorage.setItem("churchAdminToken", "authenticated");
      localStorage.setItem("churchAdminUsername", trimmedUsername);
      onLogin(trimmedUsername);
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        background: "#f8f9fb",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "95vw" : "450px",
          margin: "1rem",
          padding: isMobile ? "2rem 1.5rem" : "3rem 2.5rem",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e8ecf1",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              color: "#1a3a52",
              fontSize: isMobile ? "1.8rem" : "2.2rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              letterSpacing: "-0.5px",
            }}
          >
            Church Records
          </div>
          <div
            style={{
              color: "#6b7280",
              fontSize: isMobile ? "0.95rem" : "1.05rem",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {setupMode
              ? "Create your admin account to begin managing church records."
              : "Sign in to your account"}
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="adminUsername"
            style={{
              display: "block",
              marginBottom: "0.7rem",
              color: "#2c3e50",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Username
          </label>
          <input
            id="adminUsername"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.95rem 1.1rem",
              marginBottom: "1.3rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              background: "#fafbfc",
              transition: "all 0.3s ease",
              cursor: loading ? "not-allowed" : "text",
              opacity: loading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a3a52";
              e.currentTarget.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.background = "#fafbfc";
            }}
          />

          <label
            htmlFor="adminPassword"
            style={{
              display: "block",
              marginBottom: "0.7rem",
              color: "#2c3e50",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Password
          </label>
          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.95rem 1.1rem",
              marginBottom: error ? "1rem" : "1.5rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              background: "#fafbfc",
              transition: "all 0.3s ease",
              cursor: loading ? "not-allowed" : "text",
              opacity: loading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1a3a52";
              e.currentTarget.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.background = "#fafbfc";
            }}
          />

          {error && (
            <div
              style={{
                marginBottom: "1.5rem",
                color: "#d32f2f",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "0.85rem 1rem",
                background: "#ffebee",
                borderRadius: "8px",
                border: "1px solid #ffcdd2",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#1a3a52",
              color: "#ffffff",
              padding: "1rem 1.2rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#142a3a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a3a52";
            }}
          >
            {loading ? "Verifying..." : setupMode ? "Create Account" : "Sign In"}
          </button>

          {setupMode && (
            <div style={{ marginTop: "1.3rem", color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.7 }}>
              This account will be stored securely in your browser. After setup, only this account can access the system.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChurchAdminLogin;

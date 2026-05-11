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
        fontFamily: "Poppins, Arial, sans-serif",
        background: "#f4f7fc",
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
          maxWidth: isMobile ? "95vw" : "420px",
          margin: "1rem",
          padding: isMobile ? "1.5rem" : "2.5rem",
          background: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 18px 50px rgba(15, 34, 64, 0.08)",
          border: "1px solid #e4e9f2",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ color: "#0f2b67", fontSize: isMobile ? "1.5rem" : "1.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Church Records Admin
          </div>
          <div style={{ color: "#5b6b85", fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.6 }}>
            {setupMode
              ? "Create the first admin account for the church database."
              : "Sign in to manage baptismal, wedding, and funeral records."}
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="adminUsername"
            style={{ display: "block", marginBottom: "0.6rem", color: "#3a456b", fontWeight: 600 }}
          >
            Username
          </label>
          <input
            id="adminUsername"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your admin username"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.95rem 1rem",
              marginBottom: "1rem",
              borderRadius: "10px",
              border: "1px solid #d8dde9",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <label
            htmlFor="adminPassword"
            style={{ display: "block", marginBottom: "0.6rem", color: "#3a456b", fontWeight: 600 }}
          >
            Password
          </label>
          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.95rem 1rem",
              marginBottom: "1rem",
              borderRadius: "10px",
              border: "1px solid #d8dde9",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                color: "#b91c1c",
                fontWeight: 600,
                fontSize: "0.95rem",
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
              background: "#0f2b67",
              color: "#ffffff",
              padding: "0.95rem 1rem",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : setupMode ? "Create account" : "Log in"}
          </button>

          {setupMode && (
            <div style={{ marginTop: "1rem", color: "#5b6b85", fontSize: "0.9rem" }}>
              This admin account is stored in your browser so you can start adding church records immediately.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChurchAdminLogin;

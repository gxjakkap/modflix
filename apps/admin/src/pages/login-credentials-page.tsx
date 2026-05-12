import { useState } from "react";
import { authClient } from "../lib/auth-client";
import logoPic from "../assets/Logo.png";
import closeEye from "../assets/closepassword.png";
import openEye from "../assets/openpassword.png";

interface LoginCredentialsPageProps {
  onLogin: () => void;
}

export default function LoginCredentialsPage({
  onLogin,
}: LoginCredentialsPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("กรุณากรอก Email และ Password");
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Login failed");
      setSubmitting(false);
      return;
    }

    await onLogin();
    setSubmitting(false);
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <img src={logoPic} style={s.logo} alt="logo" />

        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}

          <div style={s.row}>
            <label style={s.label}>Email</label>
            <div style={s.inputWrap}>
              <input
                style={s.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={s.row}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <input
                style={s.input}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button style={s.eye} onClick={() => setShowPass((p) => !p)}>
                <img
                  src={showPass ? openEye : closeEye}
                  alt="toggle"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
            </div>
          </div>
        </div>

        <button style={s.btn} onClick={handleSubmit} disabled={submitting}>
          {submitting ? "LOGGING IN…" : "LOGIN"}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
    position: "relative",
    zIndex: 1,
    width: "600px",
  },
  logo: { width: "min(400px, 40vw)", height: "auto", marginBottom: "32px" },
  card: {
    background: "#FFD7B5",
    borderRadius: "20px",
    padding: "32px 48px",
    width: "100%",
    marginBottom: "0px",
  },
  error: {
    color: "#c0392b",
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "center",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  label: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a0a00",
    width: "140px",
  },
  inputWrap: { position: "relative", flex: 1 },
  input: {
    width: "100%",
    padding: "10px 40px 10px 14px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  btn: {
    marginTop: "28px",
    width: "60%",
    padding: "18px",
    borderRadius: "30px",
    background: "#e85d00",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "800",
    border: "none",
    cursor: "pointer",
    letterSpacing: "2px",
  },
};

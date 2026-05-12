import { useNavigate } from "react-router-dom";
import styles from "./login-page.module.css";
import logoPic from "../assets/Logo.png";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.loginContainer}>
      <img src={logoPic} className={styles.logo} alt="logo" />
      <h1 className={styles.adminText}>-ADMIN-</h1>
      <button
        className={styles.toLogin}
        onClick={() => navigate("/login/credentials")}
      >
        LOGIN
      </button>
    </div>
  );
}

import styles from './login-page.module.css'
import logoPic from '../assets/Logo.png'

interface LoginPageProps {
    onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    return (
        <div className={styles.loginContainer}>
            <img src={logoPic} className={styles.logo} />
            <h1 className={styles.adminText}>-ADMIN-</h1>
            <button
                className={styles.toLogin}
                onClick={onLogin}
            >
                LOGIN
            </button>
        </div>
    );
}

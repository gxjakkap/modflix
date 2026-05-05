import styles from './loginPage.module.css'
import logoPic from '../assets/Logo.png'

export default function LoginPage({ onLogin, onSignup }) {
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

            <button className={styles.toSignup} onClick={onSignup}>  
                SIGNUP
            </button>
        </div>
    );
}
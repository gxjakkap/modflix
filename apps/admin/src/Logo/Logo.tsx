import Mod from '../assets/modLogin.png'
import styles from './logo.module.css'

export default function Logo(): React.JSX.Element {
    return (
        <div className={styles.modflixLogo}>
            <img className={styles.modLogo} src={Mod} alt="Mod" />
            <h1 className={styles.modflixText}>MODFLIX</h1>
        </div>
    )
}
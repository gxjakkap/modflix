import { NavLink } from 'react-router-dom'
import logoPic from '../assets/Logo.png'
import defaultProfilePic from '../assets/usericon.png'
import styles from './navbar.module.css'

interface NavbarProps {
    pic?: string
    username?: string
}

export default function Navbar({ pic, username = 'Guest' }: NavbarProps) {
    return (
        <div className={styles.headerContainer}>
            <img src={logoPic} className={styles.logo} />
            <div className={styles.navbarContainer}>
                <div className={styles.navbarText}>
                    <NavLink to="/"           className={({ isActive }) => isActive ? styles.active : styles.home}>Home</NavLink>
                    <NavLink to="/products"   className={({ isActive }) => isActive ? styles.active : styles.product}>Products</NavLink>
                    <NavLink to="/cast"       className={({ isActive }) => isActive ? styles.active : styles.cast}>Cast</NavLink>
                    <NavLink to="/customers"  className={({ isActive }) => isActive ? styles.active : styles.customer}>Customers</NavLink>

                    {/* Reports dropdown — keep as li */}
                    <li className={styles.reportList}>
                        <NavLink to="/reports" className={({ isActive }) => isActive ? styles.active : styles.reports}>Reports</NavLink>
                        <div className={styles.dropdown}>
                            <NavLink to="/reports/sales"      className={styles.dropdownItem}>Sales</NavLink>
                            <NavLink to="/reports/users"      className={styles.dropdownItem}>Users</NavLink>
                            <NavLink to="/reports/popularity" className={styles.dropdownItem}>Popularity</NavLink>
                        </div>
                    </li>

                    <NavLink to="/management" className={({ isActive }) => isActive ? styles.active : styles.management}>Management</NavLink>
                </div>
            </div>
            <NavLink to="/admin-profile" className={styles.navbarProfile}>
                <img className={styles.profilePic} src={pic || defaultProfilePic} />
                <h1 className={styles.username}>
                    {username.length > 10 ? username.slice(0, 10) + '...' : username}
                </h1>
            </NavLink>
        </div>
    );
}

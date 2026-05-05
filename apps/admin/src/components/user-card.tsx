import styles from '../pages/landing-page.module.css'
import defaultProfilePic from '../assets/usericon.png'

interface UserCardProps {
    username?: string
    pic?: string
}

export default function UserCard({ username = 'guest', pic }: UserCardProps) {
    return (
        <div className={styles.userContainer}>
            <img src={pic || defaultProfilePic} className={styles.profilepic} />
            <h2 className={styles.username}>{username}</h2>
        </div>
    );
}

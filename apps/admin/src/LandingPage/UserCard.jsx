import styles from './landingpage.module.css'
import defaultProfilePic from '../assets/usericon.png'

export default function UserCard({username='guest', pic})
{
    return(
        <div className={styles.userContainer}>
            <img src={pic || defaultProfilePic} className={styles.profilepic}/>
            <h2 className={styles.username}>{username}</h2>
        </div>
    );
}
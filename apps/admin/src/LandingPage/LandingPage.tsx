import mockGraph from '../assets/normal.jpg'
import styles from './landingpage.module.css'
import Navbar from '../navbar/Navbar.tsx'
import ReportCard from '../ReportCard/ReportCard.tsx'
import UserCard from './UserCard.tsx'

interface LandingPageProps {
    pic?: string
    username?: string
}

export default function LandingPage({ pic, username = 'Guest' }: LandingPageProps) {
    return (
        <>
            <Navbar pic={pic} username={username} />
            <h1 className={styles.dashboardText}>Dashboard</h1>
            <div className={styles.reportContainer}>
                <div className={styles.reportCardContainer}>
                    <ReportCard picIndex={1} Data={452} Changes={5} />
                    <ReportCard picIndex={2} Data={21} Changes={-1} />
                    <ReportCard picIndex={3} Data={67} Changes={67} />
                </div>
                <h1 className={styles.detailText}>Sales detail</h1>
                <div className={styles.detailContainer}>
                    <div className={styles.graphContainer}>
                        <img src={mockGraph} className={styles.graph} />
                    </div>
                    <div className={styles.topUserContainer}>
                        <h1 className={styles.topUsersText}>Top Users</h1>
                        <UserCard username='Stephan' pic={pic} />
                        <UserCard username='Stanphe' />
                        <UserCard username='Sphetan' />
                    </div>
                </div>
            </div>
        </>
    );
}
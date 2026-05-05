import styles from './rpcard.module.css'
import salesPic from '../assets/sales.png'
import usersPic from '../assets/users.png'
import ordersPic from '../assets/orders.png'

interface ReportCardProps {
    picIndex: number
    Data: number
    Changes?: number
}

const optMap: Record<number, { pic: string; label: string }> = {
    1: { pic: usersPic, label: 'Users' },
    2: { pic: ordersPic, label: 'Order' },
    3: { pic: salesPic, label: 'Sales' },
}

export default function ReportCard({ picIndex, Data, Changes = 0 }: ReportCardProps) {
    const selected = optMap[picIndex] ?? null;

    const text = Changes < 0 ? 'down' : Changes === 0 ? 'nothing' : 'up';

    const normChanges = Changes < 0 ? Changes * -1 : Changes

    return (
        <>
            <div className={styles.cardContainer}>
                <h1 className={styles.title}> Total {selected.label}</h1>
                <img src={selected.pic} className={styles.pic} />
                <h1 className={styles.Data}>{Data}</h1>
                <h1 className={styles.changes}>{normChanges}% {text} from yesterday</h1>
            </div>
        </>
    );
}
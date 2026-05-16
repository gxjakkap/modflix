import ecTR from "../assets/EclipseTR.png";
import ecBL from "../assets/EclipseBL.png";
import gdTR from "../assets/GradientTR.png";
import styles from "./background.module.css";

export default function Background() {
  return (
    <div className={styles.glowElements}>
      <img className={styles.ecTR} src={ecTR} alt="eclipse" />
      <img className={styles.gdTR} src={gdTR} alt="eclipse" />
      <img className={styles.ecBL} src={ecBL} alt="eclipse" />
    </div>
  );
}

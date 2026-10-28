import { FadeLoader } from "react-spinners";
import styles from "./Loading.module.css";

export default function Loading({ text = "데이터를 불러오는 중입니다." }) {
  return (
    <div className={styles.loadingBox}>
      <FadeLoader color="#3E45EC" speedMultiplier={1} />
      <p>{text}</p>
    </div>
  );
}
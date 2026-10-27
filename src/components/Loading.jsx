import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from "./Loading.module.css";

export default function Loading({
  text = "데이터를 불러오는 중입니다.",
  className = ""
}) {

  return (
    <div className={`${styles.loadingBox} ${className}`}>
      <AiOutlineLoading3Quarters
        className={styles.loadingIcon}
        size={40}
      />

      {text && <p>{text}</p>}
    </div>
  );

}
import { AiOutlineExclamationCircle } from "react-icons/ai";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({
  text = "데이터를 불러오지 못했습니다.",
  onRetry
}) {

  return (
    <div className={styles.errorBox} role="alert">
      <AiOutlineExclamationCircle
        className={styles.errorIcon}
        size={40}
      />

      <p>{text}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );

}
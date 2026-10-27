import { useId, useState } from "react";
import styles from "./Input.module.css";

export default function Input({
  label,
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
  required = false,
  disabled = false,
  error = "",
  className = "",
  ...props
}) {

  const id = useId();

  const [fileName, setFileName] = useState("");

  function handleChange(e) {
    if (type === "file") {
      setFileName(e.target.files[0]?.name || "");
    }

    onChange?.(e);
  }

  return (
    <div className={`${styles.inputBox} ${className}`}>

      <div className={styles.inputInfo}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {type === "file" ? (
          <p className={styles.placeholder}>
            {fileName || placeholder}
          </p>
        ) : (
          <input
            id={id}
            className={`${styles.input} ${error ? styles.error : ""}`}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
        )}
      </div>

      {type === "file"  && (
        <>
          <input
            id={id}
            className="blind"
            name={name}
            type="file"
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />

          <label htmlFor={id} className={styles.fileButton}>
            파일 첨부
          </label>
        </>
      )}

      {error && (
        <p className={styles.errorMessage}>
          {error}
        </p>
      )}

    </div>
  );
}
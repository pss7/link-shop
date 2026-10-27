import styles from "./Button.module.css";

export default function Button({
  text,
  variant = "primary",
  size = "medium",
  width = "auto",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  ...props
}) {

  return (
    <button
      type={type}
      className={
        `
          ${styles.button}
          ${styles[variant] || ""}
          ${styles[size] || ""}
          ${styles[width] || ""}
          ${className} 
        `
      }
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  )

}
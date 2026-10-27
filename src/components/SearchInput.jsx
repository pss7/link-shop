import styles from "./SearchInput.module.css";

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "샵 이름으로 검색해 보세요.",
  className,
  ...props
}) {

  return (
    <form
      className={`${styles.searchBox} ${className}`}
    >

      <button
        type="submit"
        className={styles.searchButton}
      ></button>

      <input
        type="search"
        className={styles.searchInput}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />

    </form>
  )

}
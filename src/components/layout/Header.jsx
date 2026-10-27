import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Button from "../Button";

export default function Header() {

  const navigate = useNavigate();

  return (
    <header id={styles.headerWrap}>
      <div className="container">
        <div className={styles.headerBox}>

          <div className={styles.logoBox}>
            <h1>
              <Link to="/shop-list">
                <img src="/assets/images/common/logo.svg" alt="LINK SHOP" />
              </Link>
            </h1>
          </div>

          <Button
            text="생성하기"
            size="small"
            onClick={function () {
              navigate("/shop-create")
            }}
          />

        </div>
      </div>
    </header>
  )

}
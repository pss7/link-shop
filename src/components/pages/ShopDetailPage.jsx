
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { deleteShop, getShopDetail } from "../../api/shopApi";

import Main from "../layout/Main";
import ShopLike from "../ShopLike";
import Loading from "../Loading";

import styles from "./ShopDetailPage.module.css";
import ErrorMessage from "../ErrorMessage";

export default function ShopDetailPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  /* 상태 관리 */
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [isToggle, setIsToggle] = useState(false);

  /* 상세 조회 */
  useEffect(function () {

    let cancelled = false;

    async function fetchDetailData() {

      try {
        setLoading(true);
        setError("");

        const response = await getShopDetail(id);

        if (cancelled) return;

        setShop(response);

      } catch (error) {

        if (!cancelled) {
          console.error("조회 실패:", error);
          setError("쇼핑몰 정보를 불러오지 못했습니다.");
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }

    fetchDetailData();

    return function () {
      cancelled = true;
    };

  }, [id]);

  /* 설정 메뉴 */
  function handleToggle() {
    setIsToggle(function (prev) {
      return !prev;
    });
  }

  /* 좋아요 */
  function handleLikeUpdate(response) {
    setShop(response);
  }

  /* 쇼핑몰 삭제 */
  async function handleDelete() {

    if (deleting) return;

    if (!window.confirm("쇼핑몰을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setDeleting(true);

      await deleteShop(id);

      toast.success("삭제가 완료되었습니다.", {
        autoClose: 1000,
        onClose: function () {
          navigate("/shop-list", { replace: true });
        }
      });

    } catch (error) {
      console.error("삭제 실패:", error);
      toast.error("삭제에 실패했습니다.");

    } finally {
      setDeleting(false);
    }

  }

  return (
    <Main id="sub">
      <div className={styles.shopDetailBox}>
        <div className="container">

          <Link to="/shop-list" className={styles.backLink}>
            돌아가기
          </Link>

          {loading ? (
            <Loading text="쇼핑몰 정보를 불러오는 중입니다." />
          ) : error ? (
            <p className="errorMessage" role="alert">
              <ErrorMessage text={error} />
            </p>
          ) : shop ? (
            <>
              <div className={styles.shopDetailTopBox}>

                <ShopLike
                  className={styles.shopLikeBox}
                  shop={shop}
                  onUpdate={handleLikeUpdate}
                />

                <div className={styles.shopDetailTopInfoBox}>
                  <img src={shop.profileImage} alt={shop.name} />
                  <h1>{shop.name}</h1>
                  <span>{shop.account}</span>
                </div>

                <div
                  className={`${styles.shopDetailActionBox} ${isToggle ? styles.active : ""}`}
                >
                  <button
                    type="button"
                    className={styles.shareBtn}
                  />

                  <button
                    type="button"
                    className={styles.settingBtn}
                    onClick={handleToggle}
                  />

                  <div className={styles.settingMenu}>

                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={function () {
                        navigate(`/shop-update/${id}`);
                      }}
                      disabled={deleting}
                    >
                      수정하기
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "삭제 중..." : "삭제하기"}
                    </button>

                  </div>
                </div>

              </div>

              <h2 className={styles.shopDetailProductTitle}>
                대표상품
              </h2>

              <ul className={styles.shopDetailProductList}>
                {shop.products.map(function (product) {
                  return (
                    <li key={product.productId}>
                      <img
                        src={product.productImage}
                        alt={product.productName}
                      />

                      <div className={styles.shopDetailProductTextBox}>
                        <h3>{product.productName}</h3>

                        <span className={styles.shopDetailProductPrice}>
                          {product.productPrice}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {deleting && (
                <Loading text="쇼핑몰을 삭제하는 중입니다." />
              )}
            </>
          ) : null}

        </div>
      </div>
    </Main>
  );

}

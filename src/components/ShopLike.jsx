import { updateShopLike } from '../api/shopApi';
import styles from './ShopLike.module.css';

export default function ShopLike({ className, shop, onUpdate }) {

  /* 좋아요 */
  async function handleLike() {
    
    try {
      let response;

      if (shop.liked) {
        response = await updateShopLike(shop.id, shop.likes - 1, false);
      } else {
        response = await updateShopLike(shop.id, shop.likes + 1, true);
      }

      onUpdate(response);

    } catch (error) {
      console.error("좋아요 수정 실패:", error);
    }
  }

  return (
    <div className={`${styles.shopLikeBox} ${className}`}>
      <button
        type="button"
        className={styles.shopLikeBtn}
        onClick={function () {
          handleLike(shop.id);
        }}
      >
        {
          shop.liked ? (
            <img src="../assets/images/sub/like_icon02.svg" alt="" />
          ) : (
            <img src="../assets/images/sub/like_icon.svg" alt="" />
          )
        }
      </button>
      <span className={styles.shopLikeNumber}>
        {shop.likes}
      </span>
    </div>
  )

}
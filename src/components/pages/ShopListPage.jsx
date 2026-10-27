
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getShops } from "../../api/shopApi";

import Header from "../layout/Header";
import Main from "../layout/Main";
import SearchInput from "../SearchInput";
import ShopLike from "../ShopLike";
import Loading from "../Loading";

import styles from "./ShopListPage.module.css";
import ErrorMessage from "../ErrorMessage";

export default function ShopListPage() {

  /* URL 검색 조건 */
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "all";

  /* 상태 관리 */
  const [shops, setShops] = useState([]);
  const [keyword, setKeyword] = useState(search);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  /* 목록 조회 */
  useEffect(function () {

    let cancelled = false;

    async function fetchListData() {

      try {
        setLoading(true);
        setError("");

        let mappedSort = "";

        if (sort === "latest") {
          mappedSort = "id";
        } else if (sort === "likes") {
          mappedSort = "likes";
        } else if (sort === "products") {
          mappedSort = "productCount";
        }

        const response = await getShops(search, mappedSort, page);

        if (cancelled) return;

        if (page === 1) {
          setShops(response);
        } else {
          setShops(function (prev) {
            return [...prev, ...response];
          });
        }

        setHasMore(response.length === 10);

      } catch (error) {

        if (!cancelled) {
          console.error("목록 조회 실패:", error);
          setError("쇼핑몰 목록을 불러오지 못했습니다.");
          setHasMore(false);
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }

    fetchListData();

    return function () {
      cancelled = true;
    };

  }, [search, sort, page]);

  /* 좋아요 */
  function handleLikeUpdate(response) {

    setShops(function (prev) {
      return prev.map(function (shop) {
        if (shop.id === response.id) {
          return response;
        }

        return shop;
      });
    });

  }

  /* 검색 */
  function handleSearch(e) {

    const value = e.target.value;

    setKeyword(value);
    setPage(1);
    setShops([]);
    setHasMore(true);
    setLoading(true);

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  }

  /* 정렬 */
  function handleSort(e) {

    const value = e.currentTarget.value;

    if (sort === value) return;

    setPage(1);
    setShops([]);
    setHasMore(true);
    setLoading(true);

    const params = new URLSearchParams(searchParams);

    params.set("sort", value);

    setSearchParams(params);
  }

  /* 무한 스크롤 */
  useEffect(function () {

    if (loading || !hasMore || shops.length === 0 || error) {
      return;
    }

    const observer = new IntersectionObserver(function (entries) {

      if (entries[0].isIntersecting) {

        observer.disconnect();

        setLoading(true);

        setPage(function (prev) {
          return prev + 1;
        });

      }

    }, {
      rootMargin: "100px"
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return function () {
      observer.disconnect();
    };

  }, [loading, hasMore, shops.length, error]);

  return (
    <>
      <Header />

      <Main id="sub">
        <div className={`${styles.contentBox} contentBox`}>
          <div className={styles.shopListBox}>
            <div className="container">

              <SearchInput
                className={styles.searchInput}
                value={keyword}
                onChange={handleSearch}
              />

              <div className={styles.sortFilter}>

                <button
                  type="button"
                  value="all"
                  className={`${styles.sortBtn} ${sort === "all" ? styles.active : ""}`}
                  onClick={handleSort}
                >
                  전체
                </button>

                <button
                  type="button"
                  value="latest"
                  className={`${styles.sortBtn} ${sort === "latest" ? styles.active : ""}`}
                  onClick={handleSort}
                >
                  최신순
                </button>

                <button
                  type="button"
                  value="likes"
                  className={`${styles.sortBtn} ${sort === "likes" ? styles.active : ""}`}
                  onClick={handleSort}
                >
                  좋아요순
                </button>

                <button
                  type="button"
                  value="products"
                  className={`${styles.sortBtn} ${sort === "products" ? styles.active : ""}`}
                  onClick={handleSort}
                >
                  등록된상품순
                </button>

              </div>

              {loading && page === 1 ? (
                <Loading />
              ) : error && shops.length === 0 ? (
                <p className="errorMessage">
                  <ErrorMessage text={error} />
                </p>
              ) : shops.length > 0 ? (
                <ul className={styles.shopList}>

                  {shops.map(function (shop) {
                    return (
                      <li key={shop.id}>

                        <Link to={`/shop-detail/${shop.id}`}>

                          <div className={styles.shopListTopBox}>
                            <img
                              src={shop.profileImage}
                              alt={shop.name}
                              className={styles.profileImage}
                            />

                            <div className={styles.shopListTextBox}>
                              <h2>{shop.name}</h2>
                              <span>{shop.account}</span>
                            </div>
                          </div>

                          <div className={styles.productBox}>
                            <h3>
                              대표상품 {shop.products.length}
                            </h3>

                            <ul className={styles.productList}>
                              {shop.products.slice(0, 3).map(function (product) {
                                return (
                                  <li key={product.productId}>
                                    <img
                                      src={product.productImage}
                                      alt={product.productName}
                                    />
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                        </Link>

                        <ShopLike
                          className={styles.shopLikeBox}
                          shop={shop}
                          onUpdate={handleLikeUpdate}
                        />

                      </li>
                    );
                  })}

                </ul>
              ) : (
                <div className={styles.noSearchBox}>
                  <img
                    src="/assets/images/common/no_search.png"
                    alt=""
                  />

                  <p className={styles.noSearchMessage}>
                    검색 결과가 없어요 <br />
                    지금 프로필을 만들고 내 상품을 소개해보세요
                  </p>
                </div>
              )}

              {/* 무한 스크롤 로딩 */}
              {loading && page > 1 && <Loading />}

              {/* 추가 조회 실패 */}
              {error && shops.length > 0 && (
                <ErrorMessage text={error} />
              )}

              {/* 스크롤 감지 영역 */}
              <div ref={bottomRef} />

            </div>
          </div>
        </div>
      </Main>
    </>
  );

}


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getShopDetail,
  uploadImage,
  updateShop
} from "../../api/shopApi";

import Input from "../Input";
import Button from "../Button";
import Loading from "../Loading";
import Header from "../layout/Header";
import Main from "../layout/Main";

import styles from "./ShopForm.module.css";

export default function ShopUpdatePage() {

  const { id } = useParams();
  const navigate = useNavigate();

  /* 상태 관리 */
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* 기존 쇼핑몰 조회 */
  useEffect(function () {

    let cancelled = false;

    async function fetchShop() {

      try {
        setLoading(true);

        const shop = await getShopDetail(id);

        if (cancelled) return;

        setFormData({
          products: shop.products.map(function (product) {
            return {
              productId: product.productId,
              productImage: product.productImage,
              productName: product.productName,
              productPrice: String(product.productPrice)
            };
          }),
          shopImage: shop.profileImage,
          name: shop.name || "",
          url: shop.url || "",
          account: shop.account || ""
        });

        setErrors({});
        setSubmitted(false);

      } catch (error) {

        if (!cancelled) {
          console.error("조회 실패:", error);
          toast.error("쇼핑몰 정보를 불러오지 못했습니다.");
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }

    fetchShop();

    return function () {
      cancelled = true;
    };

  }, [id]);

  /* 대표상품 추가 */
  function handleAddProduct() {

    if (submitting || !formData) return;

    const updatedData = {
      ...formData,
      products: [
        ...formData.products,
        {
          productId: String(Date.now()),
          productImage: null,
          productName: "",
          productPrice: ""
        }
      ]
    };

    setFormData(updatedData);

    if (submitted) {
      setErrors(validateForm(updatedData));
    }

  }

  /* 유효성 검사 */
  function validateForm(data) {

    const newErrors = {};

    /* 대표상품 */
    data.products.forEach(function (product, index) {

      if (!product.productImage) {
        newErrors[`productImage_${index}`] = "상품 이미지를 첨부해주세요.";
      }

      if (!product.productName.trim()) {
        newErrors[`productName_${index}`] = "상품 이름을 입력해주세요.";
      }

      if (!product.productPrice.trim()) {
        newErrors[`productPrice_${index}`] = "상품 가격을 입력해주세요.";
      } else if (!/^\d+$/.test(product.productPrice.trim())) {
        newErrors[`productPrice_${index}`] = "상품 가격은 숫자만 입력해주세요.";
      }

    });

    /* 쇼핑몰 */
    if (!data.shopImage) {
      newErrors.shopImage = "쇼핑몰 이미지를 첨부해주세요.";
    }

    if (!data.name.trim()) {
      newErrors.name = "쇼핑몰 이름을 입력해주세요.";
    }

    if (!data.url.trim()) {
      newErrors.url = "URL을 입력해주세요.";
    } else if (!/^https?:\/\/.+\..+/.test(data.url.trim())) {
      newErrors.url = "올바른 URL을 입력해주세요.";
    }

    if (!data.account.trim()) {
      newErrors.account = "유저 ID를 입력해주세요.";
    }

    return newErrors;
  }

  /* 일반 입력값 변경 */
  function handleChange(e) {

    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedData);

    if (submitted) {
      setErrors(validateForm(updatedData));
    }

  }

  /* 파일 입력값 변경 */
  function handleFileChange(e, index) {

    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    let updatedData;

    if (index !== undefined) {

      updatedData = {
        ...formData,
        products: formData.products.map(function (product, i) {

          if (i === index) {
            return {
              ...product,
              [name]: file
            };
          }

          return product;
        })
      };

    } else {

      updatedData = {
        ...formData,
        [name]: file
      };

    }

    setFormData(updatedData);

    if (submitted) {
      setErrors(validateForm(updatedData));
    }

  }

  /* 대표상품 입력값 변경 */
  function handleProductChange(e, index) {

    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      products: formData.products.map(function (product, i) {

        if (i === index) {
          return {
            ...product,
            [name]: value
          };
        }

        return product;
      })
    };

    setFormData(updatedData);

    if (submitted) {
      setErrors(validateForm(updatedData));
    }

  }

  /* 쇼핑몰 수정 */
  async function handleSubmit(e) {

    e.preventDefault();

    if (submitting || !formData) return;

    /* 유효성 검사 */
    setSubmitted(true);

    const newErrors = validateForm(formData);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      /* 쇼핑몰 이미지 처리 */
      let shopImage = formData.shopImage;

      if (shopImage instanceof File) {
        shopImage = await uploadImage(shopImage);
      }

      /* 대표상품 이미지 처리 */
      const products = [];

      for (const product of formData.products) {

        let productImage = product.productImage;

        if (productImage instanceof File) {
          productImage = await uploadImage(productImage);
        }

        products.push({
          productId: product.productId,
          productName: product.productName,
          productPrice: Number(product.productPrice),
          productImage: productImage
        });

      }

      /* 수정 데이터 */
      const data = {
        name: formData.name,
        account: formData.account,
        profileImage: shopImage,
        url: formData.url,
        products: products,
        productCount: products.length
      };

      /* 수정 API */
      await updateShop(id, data);

      toast.success("수정이 완료되었습니다.", {
        autoClose: 1000,
        onClose: function () {
          navigate(`/shop-detail/${id}`, { replace: true });
        }
      });

    } catch (error) {
      console.error("수정 실패:", error);
      toast.error("수정에 실패했습니다.");

    } finally {
      setSubmitting(false);
    }

  }

  return (
    <>
      <Header />

      <Main id="sub">
        <div className="contentBox">
          <div className={styles.shopFormBox}>
            <div className="container">

              {loading ? (
                <Loading text="쇼핑몰 정보를 불러오는 중입니다." />
              ) : formData ? (

                <form onSubmit={handleSubmit} noValidate>

                  <div className={styles.formTitleBox}>
                    <h2 className={styles.formTitle}>
                      대표 상품
                    </h2>

                    <button
                      type="button"
                      className={styles.btn}
                      onClick={handleAddProduct}
                      disabled={submitting}
                    >
                      추가
                    </button>
                  </div>

                  {formData.products.map(function (product, index) {
                    return (
                      <div
                        className={styles.formBox}
                        key={product.productId || index}
                      >

                        {/* 기존 상품 이미지 */}
                        {typeof product.productImage === "string" && (
                          <img
                            src={product.productImage}
                            alt="상품 이미지"
                            className={styles.img}
                          />
                        )}

                        <Input
                          type="file"
                          name="productImage"
                          className={styles.inputBox}
                          label="상품 대표 이미지"
                          placeholder="상품 이미지를 첨부해주세요"
                          accept=".jpg,.jpeg,.png"
                          onChange={function (e) {
                            handleFileChange(e, index);
                          }}
                          disabled={submitting}
                        />

                        {errors[`productImage_${index}`] && (
                          <p className="errorMessage">
                            {errors[`productImage_${index}`]}
                          </p>
                        )}

                        <Input
                          name="productName"
                          className={styles.inputBox}
                          value={product.productName}
                          onChange={function (e) {
                            handleProductChange(e, index);
                          }}
                          label="상품 이름"
                          placeholder="상품 이름을 입력해 주세요."
                          disabled={submitting}
                        />

                        {errors[`productName_${index}`] && (
                          <p className="errorMessage">
                            {errors[`productName_${index}`]}
                          </p>
                        )}

                        <Input
                          name="productPrice"
                          className={styles.inputBox}
                          value={product.productPrice}
                          onChange={function (e) {
                            handleProductChange(e, index);
                          }}
                          label="상품 가격"
                          placeholder="원화로 표기해 주세요."
                          disabled={submitting}
                        />

                        {errors[`productPrice_${index}`] && (
                          <p className="errorMessage">
                            {errors[`productPrice_${index}`]}
                          </p>
                        )}

                      </div>
                    );
                  })}

                  <div className={styles.formTitleBox}>
                    <h2 className={styles.formTitle}>
                      내 쇼핑몰
                    </h2>
                  </div>

                  <div className={styles.formBox}>

                    {/* 기존 쇼핑몰 이미지 */}
                    {typeof formData.shopImage === "string" && (
                      <img
                        src={formData.shopImage}
                        alt="쇼핑몰 이미지"
                        className={styles.img}
                      />
                    )}

                    <Input
                      name="name"
                      className={styles.inputBox}
                      value={formData.name}
                      onChange={handleChange}
                      label="쇼핑몰 이름"
                      placeholder="쇼핑몰 이름을 입력해주세요."
                      disabled={submitting}
                    />

                    {errors.name && (
                      <p className="errorMessage">
                        {errors.name}
                      </p>
                    )}

                    <Input
                      type="file"
                      name="shopImage"
                      className={styles.inputBox}
                      onChange={handleFileChange}
                      label="쇼핑몰 대표 이미지"
                      placeholder="쇼핑몰 이미지를 첨부해주세요"
                      accept=".jpg,.jpeg,.png"
                      disabled={submitting}
                    />

                    {errors.shopImage && (
                      <p className="errorMessage">
                        {errors.shopImage}
                      </p>
                    )}

                    <Input
                      name="url"
                      className={styles.inputBox}
                      value={formData.url}
                      onChange={handleChange}
                      label="URL"
                      placeholder="URL을 입력해주세요"
                      disabled={submitting}
                    />

                    {errors.url && (
                      <p className="errorMessage">
                        {errors.url}
                      </p>
                    )}

                    <Input
                      name="account"
                      className={styles.inputBox}
                      value={formData.account}
                      onChange={handleChange}
                      label="유저 ID"
                      placeholder="유저 ID를 입력해주세요"
                      disabled={submitting}
                    />

                    {errors.account && (
                      <p className="errorMessage">
                        {errors.account}
                      </p>
                    )}

                  </div>

                  {submitting && (
                    <Loading text="쇼핑몰 정보를 수정하는 중입니다." />
                  )}

                  <Button
                    type="submit"
                    width="full"
                    variant="secondary"
                    text={submitting ? "수정 중..." : "수정하기"}
                    disabled={submitting}
                  />

                </form>

              ) : null}

            </div>
          </div>
        </div>
      </Main>
    </>
  );

}

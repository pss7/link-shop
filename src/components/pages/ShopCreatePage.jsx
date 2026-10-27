
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { uploadImage, createShop } from "../../api/shopApi";

import Input from "../Input";
import Button from "../Button";
import Loading from "../Loading";
import Header from "../layout/Header";
import Main from "../layout/Main";

import styles from "./ShopForm.module.css";

export default function ShopCreatePage() {

  const navigate = useNavigate();

  /* 상태 관리 */
  const [formData, setFormData] = useState({
    products: [
      {
        productImage: null,
        productName: "",
        productPrice: ""
      }
    ],
    shopImage: null,
    name: "",
    url: "",
    account: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* 대표상품 추가 */
  function handleAddProduct() {

    if (loading) return;

    const updatedData = {
      ...formData,
      products: [
        ...formData.products,
        {
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

    /* 대표상품 검사 */
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

    /* 쇼핑몰 검사 */
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

    if (!data.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (data.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상 입력해주세요.";
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
    const file = files[0] || null;

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

  /* 쇼핑몰 등록 */
  async function handleSubmit(e) {

    e.preventDefault();

    /* 중복 등록 방지 */
    if (loading) return;

    /* 제출 여부 */
    setSubmitted(true);

    /* 유효성 검사 */
    const newErrors = validateForm(formData);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {

      setLoading(true);

      /* 쇼핑몰 이미지 업로드 */
      const shopImageUrl = await uploadImage(formData.shopImage);

      /* 대표상품 이미지 업로드 */
      const products = [];

      for (let i = 0; i < formData.products.length; i++) {

        const product = formData.products[i];

        const productImageUrl = await uploadImage(product.productImage);

        products.push({
          productId: String(i + 1),
          productName: product.productName,
          productPrice: Number(product.productPrice),
          productImage: productImageUrl
        });

      }

      /* 쇼핑몰 데이터 */
      const data = {
        name: formData.name,
        account: formData.account,
        profileImage: shopImageUrl,
        url: formData.url,
        likes: 0,
        liked: false,
        productCount: products.length,
        products: products
      };

      /* 등록 API */
      await createShop(data);

      toast.success("등록이 완료되었습니다.", {
        autoClose: 1000,
        onClose: function () {
          navigate("/shop-list", { replace: true });
        }
      });

    } catch (error) {

      console.error("등록 실패:", error);
      toast.error("등록에 실패했습니다.");

    } finally {

      setLoading(false);

    }

  }

  return (
    <>
      <Header />

      <Main id="sub">
        <div className="contentBox">
          <div className={styles.shopFormBox}>
            <div className="container">

              <form onSubmit={handleSubmit} noValidate>

                <div className={styles.formTitleBox}>
                  <h2 className={styles.formTitle}>
                    대표 상품
                  </h2>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={handleAddProduct}
                    disabled={loading}
                  >
                    추가
                  </button>
                </div>

                {formData.products.map(function (product, index) {
                  return (
                    <div className={styles.formBox} key={index}>

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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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

                  <Input
                    type="file"
                    name="shopImage"
                    className={styles.inputBox}
                    onChange={handleFileChange}
                    label="쇼핑몰 대표 이미지"
                    placeholder="쇼핑몰 이미지를 첨부해주세요"
                    accept=".jpg,.jpeg,.png"
                    disabled={loading}
                  />

                  {errors.shopImage && (
                    <p className="errorMessage">
                      {errors.shopImage}
                    </p>
                  )}

                  <Input
                    name="name"
                    className={styles.inputBox}
                    value={formData.name}
                    onChange={handleChange}
                    label="쇼핑몰 이름"
                    placeholder="쇼핑몰 이름을 입력해주세요."
                    disabled={loading}
                  />

                  {errors.name && (
                    <p className="errorMessage">
                      {errors.name}
                    </p>
                  )}

                  <Input
                    name="url"
                    className={styles.inputBox}
                    value={formData.url}
                    onChange={handleChange}
                    label="URL"
                    placeholder="URL을 입력해주세요"
                    disabled={loading}
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
                    disabled={loading}
                  />

                  {errors.account && (
                    <p className="errorMessage">
                      {errors.account}
                    </p>
                  )}

                  <Input
                    type="password"
                    name="password"
                    className={styles.inputBox}
                    value={formData.password}
                    onChange={handleChange}
                    label="비밀번호"
                    placeholder="비밀번호를 입력해주세요."
                    disabled={loading}
                  />

                  {errors.password && (
                    <p className="errorMessage">
                      {errors.password}
                    </p>
                  )}

                </div>

                {/* 등록 중 로딩 */}
                {loading && (
                  <Loading text="쇼핑몰을 등록하는 중입니다." />
                )}

                <Button
                  type="submit"
                  width="full"
                  variant="secondary"
                  text={loading ? "등록 중..." : "생성하기"}
                  disabled={loading}
                />

              </form>

            </div>
          </div>
        </div>
      </Main>
    </>
  );

}

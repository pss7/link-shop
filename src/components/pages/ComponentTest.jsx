import styles from "./ComponentTest.module.css";
import Button from "../Button";
import Input from "../Input";
import SearchInput from "../SearchInput";
import { useState } from "react";

export default function ComponentTest() {

  const [keyword, setKeyword] = useState("");

  function handleChange(e) {
    setKeyword(e.target.value);
  }

  function handelSearch() {
    console.log("검색어", keyword);
  }

  return (
    <div className="container">
      <div className={styles.box}>
        <h1 className={styles.title}>
          Button
        </h1>
        <Button
          text="버튼"
        />
      </div>

      <div className={styles.box}>
        <h1 className={styles.title}>
          Input
        </h1>

        <Input
          name="name"
          label="이름"
          placeholder="표시하고 싶은 이름을 적어 주세요"
        />

        <span className={styles.border}></span>

        <Input
          type="file"
          name="productImage"
          label="상품 대표 이미지"
          placeholder="상품 이미지를 첨부해주세요"
          accept=".jpg,.jpeg,.png"
        />

        <span className={styles.border}></span>

        <SearchInput
          value={keyword}
          onChange={handleChange}
          onSearch={handelSearch}
        />

      </div>

    </div>
  )

}
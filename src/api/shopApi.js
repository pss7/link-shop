/* 목록 조회 */
export async function getShops(search, sort, page) {

  const params = new URLSearchParams();

  params.set("_page", page);
  params.set("_limit", 10);

  if (search) {
    params.append("name_like", search);
  }

  if (sort) {
    params.append("_sort", sort);
    params.append("_order", "desc");
  }

  const response = await fetch(`http://localhost:3002/shops?${params}`);

  if (!response.ok) {
    throw new Error("목록 조회 실패");
  }

  return response.json();
}

/* 상세 조회 */
export async function getShopDetail(id) {

  const response = await fetch(`http://localhost:3002/shops/${id}`);

  if (!response.ok) {
    throw new Error("상세 조회 실패");
  }

  return response.json();

}

/* 좋아요 */
export async function updateShopLike(id, likes, liked) {

  const response = await fetch(`http://localhost:3002/shops/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      likes: likes,
      liked: liked
    })
  });

  if (!response.ok) {
    throw new Error("좋아요 수정 실패");
  }

  return response.json();
}

/* 쇼핑몰 등록 */
export async function createShop(data) {

  const response = await fetch("http://localhost:3002/shops", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("쇼핑몰 등록 실패");
  }

  return response.json();

}

/* 쇼핑몰 삭제 */
export async function deleteShop(id) {

  const response = await fetch(`http://localhost:3002/shops/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("쇼핑몰 삭제 실패");
  }

}

/* 이미지 업로드 */
export async function uploadImage(file) {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "linkshop_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/iuyjshos/image/upload",
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("이미지 업로드 실패");
  }

  const data = await response.json();

  return data.secure_url;
}

/* 쇼핑몰 수정 */
export async function updateShop(id, data) {

  const response = await fetch(`http://localhost:3001/shops/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("쇼핑몰 수정 실패");
  }

  return response.json();
}
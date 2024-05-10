import { dataPhong } from "./data_phong.js";

for (let i = 0; i < dataPhong.length; i++) {
  fetch("http://127.0.0.1:3000/api/phong", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataPhong[i]),
  })
    .then((response) => {
      return response.json(); // Thêm return ở đây
    })
    .then((data) => {
      console.log(data);
    });
}

const socket = io();

const ul = document.getElementById("productsList");

const code = document.getElementById("code");
const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const addButton = document.getElementById("addProduct");

const productIdToDelete = document.getElementById("productIdToDelete");
const delButton = document.getElementById("deleteProduct");

//** List products */
socket.on("products", (data) => {
  ul.innerHTML = `
  ${data.map((p) => `<li>${p.id} - ${p.title} (${p.code})</li>`).join("")}
  `;
});

//** Add new product */
addButton.addEventListener("click", () => {
  const product = {
    code: code.value,
    title: title.value,
    description: description.value,
    category: category.value,
    price: +price.value,
    stock: +stock.value,
  };
  socket.emit("addProduct", product);
});

//** Delete existing product */
delButton.addEventListener("click", () => {
  const id = +productIdToDelete.value;
  socket.emit("delProduct", id);
});

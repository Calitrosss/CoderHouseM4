const socket = io();

const div = document.getElementById("productsList");

socket.on("products", (data) => {
  div.innerHTML = `
  ${data.map((p) => `<li>${p.id} - ${p.title} (${p.code})</li>`)}
  `;
});

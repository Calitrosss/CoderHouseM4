const socket = io();

let userName;

Swal.fire({
  title: "Identifícate",
  input: "email",
  inputLabel: "Dirección de correo electrónico",
  inputPlaceholder: "Ingresa tu email",
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((data) => {
  userName = data.value;
  socket.emit("userLogged", { user: userName });
});

const chatBox = document.getElementById("chatBox");
const messageLogs = document.getElementById("messageLogs");

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: userName, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let messages = "";
  data.forEach((m) => {
    messages += `${m.user} dice: ${m.message}<br/>`;
  });
  messageLogs.innerHTML = messages;
});

socket.on("userLogged", (data) => {
  Swal.fire({
    title: `${data.user} se conectó al chat`,
    toast: true,
    position: "top-end",
    icon: "success",
    showConfirmButton: false,
    timer: 2500,
  });
});

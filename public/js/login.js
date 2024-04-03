const btnRegister = document.getElementById("btnRegister");
const btnForgotPass = document.getElementById("btnForgotPass");

btnRegister.addEventListener("click", async (e) => {
  window.location.href = "/register";
});

btnForgotPass.addEventListener("click", async (e) => {
  window.location.href = "/forgot-pass";
});

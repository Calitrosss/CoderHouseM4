const email = document.getElementById("email");
const password = document.getElementById("password");
const btnReset = document.getElementById("btnReset");

btnReset.addEventListener("click", async (e) => {
  try {
    const data = {
      email: email.value,
      password: password.value,
    };

    const response = await fetch("http://localhost:8080/api/sessions/reset-pass", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ocurrió un error al procesar la solicitud.");
    }

    window.location.href = "/login";
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/login";
  }
});

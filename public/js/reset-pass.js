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

    const responseData = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 403:
          return Swal.fire({
            title: `${responseData.error ?? "Ocurrió un error al procesar la solicitud."}`,
            toast: true,
            position: "top-end",
            icon: "warning",
            showConfirmButton: false,
            timer: 2500,
          });

        default:
          throw new Error("Ocurrió un error al procesar la solicitud.");
      }
    }

    await Swal.fire({
      title: `Se restableció la contraseña`,
      toast: true,
      position: "top-end",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });

    window.location.href = "/login";
  } catch (error) {
    Swal.fire({
      title: `${error}`,
      toast: true,
      position: "top-end",
      icon: "error",
      showConfirmButton: false,
      timer: 2500,
    });
  }
});

const btnSend = document.getElementById("btnSend");

btnSend.addEventListener("click", async (e) => {
  try {
    Swal.fire({
      title: `Se envió un email, revise su bandeja`,
      toast: true,
      position: "top-end",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
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

const btnBuy = document.getElementById("btnBuy");

btnBuy.addEventListener("click", async (e) => {
  try {
    let current = await getCurrent();
    let cid = current.user.cart;

    if (!cid) {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        cid = responseData.payload._id;
      }
    }

    let response = await fetch(`/api/carts/${cid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let responseData = await response.json();

    if (!response.ok)
      return Swal.fire({
        title: `${responseData.error ?? "Ocurrió un error al procesar la solicitud."}`,
        toast: true,
        position: "top-end",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });

    if (!responseData.payload.length) {
      return Swal.fire({
        title: "El carrito está vacío",
        toast: true,
        position: "top-end",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });
    }

    response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    responseData = await response.json();

    if (!response.ok)
      return Swal.fire({
        title: `${responseData.error ?? "Ocurrió un error al procesar la solicitud."}`,
        toast: true,
        position: "top-end",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });

    const { code, amount } = responseData.payload.ticket;
    Swal.fire({
      icon: "success",
      title: "Compra finalizada",
      text: `Se ha generado el ticket #${code} por un total de ${amount}`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      location.reload();
    });
  } catch (error) {
    await Swal.fire({
      title: `${error}`,
      toast: true,
      position: "top-end",
      icon: "error",
      showConfirmButton: false,
      timer: 2500,
    });
    location.reload();
  }
});

const getCurrent = async () => {
  const result = await fetch("/api/sessions/current", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const current = await result.json();

  return current;
};

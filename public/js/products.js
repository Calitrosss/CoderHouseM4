const btnLogout = document.getElementById("btnLogout");
const btnProfile = document.getElementById("btnProfile");
const btnCart = document.getElementById("btnCart");

btnLogout.addEventListener("click", async (e) => {
  const result = await fetch("/api/sessions/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { redirect } = await result.json();

  window.location.href = redirect;
});

btnProfile?.addEventListener("click", async (e) => {
  let current = await getCurrent();
  const { id } = current.user;

  window.location.href = `/user-profile/${id}`;
});

document.querySelectorAll(".btnAddToCart").forEach((button) => {
  button.addEventListener("click", addToCart);
});

async function addToCart(event) {
  try {
    const button = event.target;
    const row = button.parentNode.parentNode;

    const pid = row.cells[0].innerText;

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

    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();

    if (!response.ok)
      return Swal.fire({
        title: `${responseData.error ?? "Ocurrió un error al procesar la solicitud."}`,
        toast: true,
        position: "top-end",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });

    Swal.fire({
      title: `${responseData.payload}`,
      toast: true,
      position: "top-end",
      icon: "success",
      showConfirmButton: false,
      timer: 2500,
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
}

btnCart?.addEventListener("click", async (e) => {
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

  window.location.href = `/carts/${cid}`;
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

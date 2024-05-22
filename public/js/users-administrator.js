const btnLogout = document.getElementById("btnLogout");

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

document.querySelectorAll(".btnRole").forEach((button) => {
  button.addEventListener("click", swicthRole);
});

async function swicthRole(event) {
  try {
    const button = event.target;
    const row = button.parentNode.parentNode;

    const id = row.cells[0].innerText;
    const role = row.cells[2].innerText;

    const response = await fetch(`/api/users/premium/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok && !contentType.includes("application/json")) throw new Error(responseData);

    if (!response.ok)
      return Swal.fire({
        title: `${responseData?.error ?? "Ocurrió un error al procesar la solicitud."}`,
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

    const newRole = role === "PREMIUM" ? "USER" : "PREMIUM";
    row.cells[2].innerText = newRole;
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

document.querySelectorAll(".btnDelete").forEach((button) => {
  button.addEventListener("click", deleteUser);
});

async function deleteUser(event) {
  try {
    const button = event.target;
    const row = button.parentNode.parentNode;

    const id = row.cells[0].innerText;

    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok && !contentType.includes("application/json")) throw new Error(responseData);

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

    row.remove();
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

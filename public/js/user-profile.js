document.addEventListener("DOMContentLoaded", async () => {
  const frmUpdate = document.getElementById("frmUpdate");
  const txtFirstName = document.getElementById("first_name");
  const txtLasttName = document.getElementById("last_name");
  const txtAge = document.getElementById("age");
  const txtEmail = document.getElementById("email");
  const btnLogout = document.getElementById("btnLogout");
  const btnUpdate = document.getElementById("btnUpdate");

  const profile = document.getElementById("profile");
  const identity = document.getElementById("identity");
  const residence = document.getElementById("residence");
  const account = document.getElementById("account");
  const products = document.getElementById("product");

  const uid = window.location.pathname.split("/")[2];

  let current = await getCurrent();
  const { id, first_name, last_name, age, email } = current.user;

  if (current.status === "error" || current.user?.id !== uid) {
    txtFirstName.value = "";
    txtLasttName.value = "";
    txtAge.value = "";
    txtEmail.value = "";
  } else {
    txtFirstName.value = first_name || "";
    txtLasttName.value = last_name || "";
    txtAge.value = age || "";
    txtEmail.value = email || "";
  }

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

  btnUpdate.addEventListener("click", async (e) => {
    try {
      e.preventDefault();

      if (
        !profile.value &&
        !identity.value &&
        !residence.value &&
        !account.value &&
        !products.value
      )
        return Swal.fire({
          title: `Por favor seleccione al menos un archivo para subir`,
          toast: true,
          position: "top-end",
          icon: "warning",
          showConfirmButton: false,
          timer: 2500,
        });

      if (uid !== id) return console.error("ERROR");

      const url = `/api/users/${uid}/documents`;

      const formData = new FormData(frmUpdate);

      //** */
      // for (const entry of formData.entries()) {
      //   console.log(entry);
      // }

      const response = await fetch(url, {
        method: "PATCH",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.status === "error")
          return Swal.fire({
            title: `Ocurrió un error al subir los archivos seleccionados.`,
            toast: true,
            position: "top-end",
            icon: "error",
            showConfirmButton: false,
            timer: 2500,
          });

        Swal.fire({
          title: `Archivos subidos exitosamente`,
          toast: true,
          position: "top-end",
          icon: "success",
          showConfirmButton: false,
          timer: 2500,
        });

        profile.value = "";
        identity.value = "";
        residence.value = "";
        account.value = "";
        products.value = "";
      } else {
        Swal.fire({
          title: `Ocurrió un error al subir los archivos.`,
          toast: true,
          position: "top-end",
          icon: "error",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: `Ocurrió un error en la solicitud: ${error}`,
        toast: true,
        position: "top-end",
        icon: "error",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  });
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

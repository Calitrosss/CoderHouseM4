document.addEventListener("DOMContentLoaded", async () => {
  const frmUpdate = document.getElementById("frmUpdate");
  const txtFirstName = document.getElementById("first_name");
  const txtLasttName = document.getElementById("last_name");
  const txtAge = document.getElementById("age");
  const txtEmail = document.getElementById("email");
  const btnUpdate = document.getElementById("btnUpdate");

  let current = await getCurrent();
  if (current.status === "error") return console.error(current.error);

  const { first_name, last_name, age, email } = current.user;

  txtFirstName.value = first_name || "";
  txtLasttName.value = last_name || "";
  txtAge.value = age || "";
  txtEmail.value = email || "";

  btnUpdate.addEventListener("click", async (e) => {
    try {
      e.preventDefault();

      const uid = window.location.pathname.split("/")[2];

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

      if (response.ok) {
        console.log("Archivos subidos exitosamente");
      } else {
        console.error("Error al subir archivos");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
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
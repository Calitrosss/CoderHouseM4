document.addEventListener("DOMContentLoaded", async () => {
  const frmUpdate = document.getElementById("frmUpdate");
  const txtFirstName = document.getElementById("first_name");
  const txtLasttName = document.getElementById("last_name");
  const txtAge = document.getElementById("age");
  const txtEmail = document.getElementById("email");
  const btnUpdate = document.getElementById("btnUpdate");

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

  btnUpdate.addEventListener("click", async (e) => {
    try {
      e.preventDefault();

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

      if (response.ok) {
        console.log("Archivos subidos exitosamente");
        console.log(await response.json());
      } else {
        console.error("Error al subir archivos");
        console.warn(await response.json());
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

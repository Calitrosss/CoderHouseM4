const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", async (e) => {
  const result = await fetch("http://localhost:8080/api/sessions/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { redirect } = await result.json();

  window.location.href = redirect;
});

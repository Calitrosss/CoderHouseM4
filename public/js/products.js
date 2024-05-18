const btnLogout = document.getElementById("btnLogout");
const btnProfile = document.getElementById("btnProfile");

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

btnProfile.addEventListener("click", async (e) => {
  let current = await getCurrent();
  const { id } = current.user;

  window.location.href = `/user-profile/${id}`;
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

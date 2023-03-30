const formSignIn = document.getElementById("formSignIn");

formSignIn.addEventListener("submit", (e) => {
  e.preventDefault();

  window.location.assign("/dashboard/index.html");
});

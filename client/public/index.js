const API_URL = "http://localhost:3000/tweet";
function showPassword() {
  const password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

export function showPassword();

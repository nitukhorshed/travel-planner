const API_URL = "http://localhost:5001/api/auth";

const roleSelect = document.getElementById("role");
const organizationInput = document.getElementById("organizationName");

if (roleSelect) {
  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "planner") {
      organizationInput.classList.remove("hidden");
      organizationInput.required = true;
    } else {
      organizationInput.classList.add("hidden");
      organizationInput.required = false;
      organizationInput.value = "";
    }
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const organizationName = document.getElementById("organizationName").value;

    const body = {
      fullName,
      email,
      password,
      role,
    };

    if (role === "planner") {
      body.organizationName = organizationName;
    }

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const message = document.getElementById("registerMessage");

    if (res.ok) {
      message.style.color = "#16a34a";
      message.textContent = "Registration successful. Please login.";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Registration failed";
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    const message = document.getElementById("loginMessage");

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      message.style.color = "#16a34a";
      message.textContent = "Login successful.";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Login failed";
    }
  });
}
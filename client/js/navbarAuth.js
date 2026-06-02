const navButtons = document.querySelector(".nav-buttons");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (navButtons) {

  if (token && user) {

    const dashboardUrl =
      user.role === "planner"
        ? "planner-dashboard.html"
        : user.role === "admin"
        ? "admin-dashboard.html"
        : "my-bookings.html";

    const currentPage =
      window.location.pathname.split("/").pop();

    const hideDashboardButton = [
      "planner-dashboard.html",
      "planner-packages.html",
      "planner-bookings.html",
      "planner-profile.html",
      "create-package.html",
      "edit-package.html",
      "admin-dashboard.html"
    ].includes(currentPage);

    navButtons.innerHTML = `
      <span class="nav-user" onclick="window.location.href='profile.html'">
        Welcome, ${user.fullName}
      </span>

      ${
        hideDashboardButton
          ? ""
          : `
            <button class="btn-outline" id="dashboardBtn">
              Dashboard
            </button>
          `
      }

      <button class="btn-primary" id="logoutBtn">
        Logout
      </button>
    `;

    const dashboardBtn =
      document.getElementById("dashboardBtn");

    if (dashboardBtn) {
      dashboardBtn.addEventListener("click", () => {
        window.location.href = dashboardUrl;
      });
    }

    document
      .getElementById("logoutBtn")
      .addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";
      });

  } else {

    navButtons.innerHTML = `
      <button
        class="btn-outline"
        onclick="window.location.href='login.html'"
      >
        Login
      </button>

      <button
        class="btn-primary"
        onclick="window.location.href='register.html'"
      >
        Register
      </button>
    `;
  }
}
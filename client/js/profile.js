const profileToken = localStorage.getItem("token");
const profileUser = JSON.parse(localStorage.getItem("user"));

const profileCard = document.getElementById("profileCard");

if (!profileToken || !profileUser) {
  window.location.href = "login.html";
}

const getDashboardLink = () => {
  if (profileUser.role === "planner") {
    return "planner-dashboard.html";
  }

  if (profileUser.role === "admin") {
    return "admin-dashboard.html";
  }

  return "my-bookings.html";
};

profileCard.innerHTML = `
  <div class="profile-avatar">
    ${profileUser.fullName.charAt(0).toUpperCase()}
  </div>

  <h2>${profileUser.fullName}</h2>

  <p>
    <strong>Email:</strong>
    ${profileUser.email}
  </p>

  <p>
    <strong>Role:</strong>
    ${profileUser.role}
  </p>

  ${
    profileUser.role === "planner"
      ? `
        <p>
          <strong>Status:</strong>
          ${profileUser.plannerStatus || "pending"}
        </p>
      `
      : ""
  }

  <div class="profile-actions">

    <a
      href="${getDashboardLink()}"
      class="btn-primary profile-btn"
    >
      Go to Dashboard
    </a>

    <button
      class="btn-outline profile-btn"
      id="editProfileBtn"
    >
      Edit Profile
    </button>

  </div>
`;

document
  .getElementById("editProfileBtn")
  .addEventListener("click", () => {
    window.location.href = "edit-profile.html";
  });
  
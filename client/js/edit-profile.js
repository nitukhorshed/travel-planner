const editProfileToken = localStorage.getItem("token");
let editProfileUser = JSON.parse(localStorage.getItem("user"));

if (!editProfileToken || !editProfileUser) {
  window.location.href = "login.html";
}

const editProfileForm = document.getElementById("editProfileForm");
const editProfileMessage = document.getElementById("editProfileMessage");

const loadProfile = async () => {
  try {
    const res = await fetch("https://travel-planner-3ro5.onrender.com/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${editProfileToken}`,
      },
    });

    const profile = await res.json();

    if (!res.ok) {
      editProfileMessage.style.color = "red";
      editProfileMessage.textContent = profile.message || "Failed to load profile.";
      return;
    }

    document.getElementById("fullName").value = profile.fullName || "";
    document.getElementById("email").value = profile.email || "";
  } catch (error) {
    console.error(error);
    editProfileMessage.style.color = "red";
    editProfileMessage.textContent = "Something went wrong.";
  }
};

editProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const body = {
    fullName,
    email,
  };

  if (password.trim()) {
    body.password = password;
  }

  try {
    const res = await fetch("https://travel-planner-3ro5.onrender.com/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${editProfileToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));

      if (typeof showToast === "function") {
        showToast("Profile updated successfully.", "success");
      }

      editProfileMessage.style.color = "#16a34a";
      editProfileMessage.textContent = "Profile updated successfully.";

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1000);
    } else {
      if (typeof showToast === "function") {
        showToast(data.message || "Profile update failed.", "error");
      }

      editProfileMessage.style.color = "red";
      editProfileMessage.textContent = data.message || "Profile update failed.";
    }
  } catch (error) {
    console.error(error);

    editProfileMessage.style.color = "red";
    editProfileMessage.textContent = "Something went wrong.";
  }
});

loadProfile();
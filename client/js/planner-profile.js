const plannerProfileToken = localStorage.getItem("token");
const plannerProfileUser = JSON.parse(localStorage.getItem("user"));

if (
  !plannerProfileToken ||
  !plannerProfileUser ||
  plannerProfileUser.role !== "planner"
) {
  window.location.href = "login.html";
}

const form = document.getElementById("plannerProfileForm");
const message = document.getElementById("profileMessage");

const loadPlannerProfile = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/planner-profile/me", {
      headers: {
        Authorization: `Bearer ${plannerProfileToken}`,
      },
    });

    const profile = await res.json();

    if (!res.ok) {
      message.style.color = "red";
      message.textContent = profile.message || "Profile not found.";
      return;
    }

    document.getElementById("organizationName").value = profile.organizationName || "";
    document.getElementById("logo").value = profile.logo || "";
    document.getElementById("coverImage").value = profile.coverImage || "";
    document.getElementById("description").value = profile.description || "";
    document.getElementById("phone").value = profile.phone || "";
    document.getElementById("website").value = profile.website || "";
    document.getElementById("address").value = profile.address || "";
  } catch (error) {
    console.error(error);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    organizationName: document.getElementById("organizationName").value,
    logo: document.getElementById("logo").value,
    coverImage: document.getElementById("coverImage").value,
    description: document.getElementById("description").value,
    phone: document.getElementById("phone").value,
    website: document.getElementById("website").value,
    address: document.getElementById("address").value,
  };

  try {
    const res = await fetch("http://localhost:5001/api/planner-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${plannerProfileToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "#16a34a";
      message.textContent = "Profile updated successfully.";
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Failed to update profile.";
    }
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = "Something went wrong.";
  }
});

loadPlannerProfile();
const adminProfileToken = localStorage.getItem("token");
const adminProfileUser = JSON.parse(localStorage.getItem("user"));

if (
  !adminProfileToken ||
  !adminProfileUser ||
  adminProfileUser.role !== "admin"
) {
  window.location.href = "login.html";
}

const plannerProfilesList =
  document.getElementById("plannerProfilesList");

const imageBaseUrlAdminProfile = "http://travel-planner-3ro5.onrender.com";

const getProfileImage = (url) => {
  if (!url) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
  }

  return url.startsWith("/uploads")
    ? imageBaseUrlAdminProfile + url
    : url;
};

const loadPlannerProfiles = async () => {
  try {
    const res = await fetch(
      "http://travel-planner-3ro5.onrender.com/api/admin/planner-profiles",
      {
        headers: {
          Authorization: `Bearer ${adminProfileToken}`,
        },
      }
    );

    const profiles = await res.json();

    plannerProfilesList.innerHTML = profiles.length
      ? profiles.map((profile) => `
          <div class="booking-card booking-card-image">
            <img
              src="${getProfileImage(profile.logo)}"
              class="my-booking-img"
              alt="${profile.organizationName}"
            >

            <div class="booking-card-content">
              <h3>${profile.organizationName}</h3>
              <p><strong>Owner:</strong> ${profile.plannerId?.fullName || "N/A"}</p>
              <p><strong>Email:</strong> ${profile.plannerId?.email || "N/A"}</p>
              <p><strong>Address:</strong> ${profile.address || "N/A"}</p>
              <p><strong>Status:</strong> ${profile.verified ? "Verified" : "Not Verified"}</p>
            </div>

            <div>
              ${
                profile.verified
                  ? `
                    <button
                      class="delete-btn"
                      onclick="unverifyProfile('${profile._id}')"
                    >
                      Unverify
                    </button>
                  `
                  : `
                    <button
                      class="btn-primary"
                      onclick="verifyProfile('${profile._id}')"
                    >
                      Verify
                    </button>
                  `
              }
            </div>
          </div>
        `).join("")
      : "<p>No planner profiles found.</p>";

  } catch (error) {
    console.error(error);
    plannerProfilesList.innerHTML =
      "<p>Failed to load planner profiles.</p>";
  }
};

const verifyProfile = async (profileId) => {
  try {
    const res = await fetch(
      `http://travel-planner-3ro5.onrender.com/api/admin/planner-profiles/${profileId}/verify`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminProfileToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      showToast("Planner profile verified.", "success");
      loadPlannerProfiles();
    } else {
      alert(data.message || "Verification failed.");
    }
  } catch (error) {
    console.error(error);
  }
};

const unverifyProfile = async (profileId) => {
  try {
    const res = await fetch(
      `http://travel-planner-3ro5.onrender.com/api/admin/planner-profiles/${profileId}/unverify`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminProfileToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      showToast("Planner profile unverified.", "success");
      loadPlannerProfiles();
    } else {
      alert(data.message || "Unverify failed.");
    }
  } catch (error) {
    console.error(error);
  }
};

loadPlannerProfiles();
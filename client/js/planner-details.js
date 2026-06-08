const plannerDetailsContainer = document.getElementById("plannerDetails");
const plannerPackagesContainer = document.getElementById("plannerPackages");

const imageBaseUrlPlannerDetails = "http://travel-planner-3ro5.onrender.com";

const params = new URLSearchParams(window.location.search);
const plannerId = params.get("id");

if (!plannerId) {
  plannerDetailsContainer.innerHTML = "<p>Planner ID missing.</p>";
  throw new Error("Planner ID missing");
}

const getImageUrl = (url) => {
  if (!url) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
  }

  return url.startsWith("/uploads")
    ? imageBaseUrlPlannerDetails + url
    : url;
};

const getPackageImage = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? imageBaseUrlPlannerDetails + images[0]
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const loadPlannerDetails = async () => {
  try {
    const profileRes = await fetch(
      `http://travel-planner-3ro5.onrender.com/api/planner-profile/${plannerId}`
    );

    const profile = await profileRes.json();

    if (!profileRes.ok) {
      plannerDetailsContainer.innerHTML =
        `<p>${profile.message || "Planner not found."}</p>`;
      return;
    }

    plannerDetailsContainer.innerHTML = `
      <div class="planner-cover">
        <img src="${getImageUrl(profile.coverImage)}" alt="${profile.organizationName}">
      </div>

      <div class="planner-info-card">
        <img class="planner-logo" src="${getImageUrl(profile.logo)}" alt="${profile.organizationName}">

        <div>
          <h1>${profile.organizationName}</h1>
          <p class="verified-text">${profile.verified ? "Verified Planner" : ""}</p>
          <p>${profile.description || ""}</p>
          <p><strong>Phone:</strong> ${profile.phone || "N/A"}</p>
          <p><strong>Email:</strong> ${profile.plannerId?.email || "N/A"}</p>
          <p><strong>Address:</strong> ${profile.address || "N/A"}</p>
          ${
            profile.website
              ? `<p><strong>Website:</strong> ${profile.website}</p>`
              : ""
          }
        </div>
      </div>
    `;

    loadPlannerPackages();

  } catch (error) {
    console.error(error);
    plannerDetailsContainer.innerHTML = "<p>Failed to load planner.</p>";
  }
};

const loadPlannerPackages = async () => {
  try {
    const res = await fetch("http://travel-planner-3ro5.onrender.com/api/packages");
    const data = await res.json();

    const packages = data.packages || data;

    const plannerPackages = packages.filter(
      (pkg) => pkg.plannerId?._id === plannerId
    );

    plannerPackagesContainer.innerHTML = plannerPackages.length
      ? plannerPackages.map((pkg) => `
          <div class="card">
            <img src="${getPackageImage(pkg.images)}" alt="${pkg.title}">
            <div class="card-content">
              <h3>${pkg.title}</h3>
              <p>${pkg.destination} • ${pkg.duration} Days</p>
              <span>৳${pkg.price}</span>

              <button class="btn-primary card-btn" onclick="viewPackage('${pkg._id}')">
                View Details
              </button>
            </div>
          </div>
        `).join("")
      : "<p>No packages found for this planner.</p>";

  } catch (error) {
    console.error(error);
    plannerPackagesContainer.innerHTML = "<p>Failed to load packages.</p>";
  }
};

const viewPackage = (id) => {
  window.location.href = `package-details.html?id=${id}`;
};

loadPlannerDetails();
const imageBaseUrl = "https://travel-planner-3ro5.onrender.com";
const homeSearchInput = document.getElementById("homeSearchInput");
const homeSearchBtn = document.getElementById("homeSearchBtn");

if (homeSearchBtn) {
  homeSearchBtn.addEventListener("click", () => {
    const searchValue = homeSearchInput.value.trim();

    if (searchValue) {
      window.location.href =
        `packages.html?search=${encodeURIComponent(searchValue)}`;
    } else {
      window.location.href = "packages.html";
    }
  });
}

if (homeSearchInput) {
  homeSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      homeSearchBtn.click();
    }
  });
}

const packageCard = (pkg) => {
  const image =
    pkg.images && pkg.images.length > 0
      ? pkg.images[0].startsWith("/uploads")
        ? imageBaseUrl + pkg.images[0]
        : pkg.images[0]
      : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

  return `
  <div class="card">
    <img src="${image}" alt="${pkg.title}">
    <div class="card-badges">
      ${pkg.featured ? `<span class="badge badge-featured">Featured</span>` : ""}
      ${pkg.bookingCount > 0 ? `<span class="badge badge-trending">Trending</span>` : ""}
    </div>
    <div class="card-content">
      <h3>${pkg.title}</h3>
      <p>${pkg.destination} • ${pkg.duration} Days</p>
      <p>By ${pkg.plannerId?.organizationName || "Travel Planner"}</p>
      <span>৳${pkg.price}</span>

      <button class="btn-primary card-btn" onclick="viewPackageDetails('${pkg._id}')">
        View Details
      </button>
    </div>
  </div>
` ;
};


const plannerCard = (planner) => {
  const logo =
    planner.logo && planner.logo.startsWith("/uploads")
      ? imageBaseUrl + planner.logo
      : planner.logo ||
        "https://images.unsplash.com/photo-1522199710521-72d69614c702";

  return `
    <div
      class="card"
      onclick="viewPlannerDetails('${planner.plannerId?._id}')"
      style="cursor:pointer;"
    >
      <img src="${logo}" alt="${planner.organizationName}">

      <div class="card-content">
        <h3>
          ${planner.organizationName}
          ${
            planner.verified
              ? `<span class="small-verified-icon">✔</span>`
              : ""
          }
        </h3>

        <p>${planner.address || "Bangladesh"}</p>

        ${
          planner.verified
            ? `<span class="verified-badge">✔ Verified Planner</span>`
            : `<span class="planner-badge">Planner</span>`
        }
      </div>
    </div>
  `;
};

const loadHomeData = async () => {
  try {
    console.log("Loading homepage data...");

    const featuredPackages = await api.getFeaturedPackages();
    console.log("Featured:", featuredPackages);

    const trendingPackages = await api.getTrendingPackages();
    console.log("Trending:", trendingPackages);

    const featuredPlanners = await api.getFeaturedPlanners();
    console.log("Planners:", featuredPlanners);

    document.getElementById("featuredPackages").innerHTML =
      featuredPackages.length
        ? featuredPackages.slice(0, 5).map(packageCard).join("")
        : "<p>No featured packages available.</p>";

    document.getElementById("trendingPackages").innerHTML =
      trendingPackages.length
        ? trendingPackages.slice(0, 5).map(packageCard).join("")
        : "<p>No trending packages available.</p>";

    document.getElementById("featuredPlanners").innerHTML =
      featuredPlanners.length
        ? featuredPlanners.slice(0, 5).map(plannerCard).join("")
        : "<p>No featured planners available.</p>";
  } catch (error) {
    console.error(error);
  }
};

const viewPackageDetails = (id) => {
  window.location.href = `package-details.html?id=${id}`;
};

const viewPlannerDetails = (id) => {
  window.location.href = `planner-details.html?id=${id}`;
};

loadHomeData();

const loadPublicStats = async () => {
  try {
    const res = await fetch("https://travel-planner-3ro5.onrender.com/api/statistics/public");
    const stats = await res.json();

    document.getElementById("happyTravelers").textContent = stats.happyTravelers;
    document.getElementById("tourPackages").textContent = stats.tourPackages;
    document.getElementById("verifiedPlanners").textContent = stats.verifiedPlanners;
    document.getElementById("totalBookings").textContent = stats.totalBookings;
    document.getElementById("destinations").textContent = stats.destinations;
  } catch (error) {
    console.error(error);
  }
};

loadPublicStats();
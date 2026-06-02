const adminPackageToken = localStorage.getItem("token");
const adminPackageUser = JSON.parse(localStorage.getItem("user"));

if (!adminPackageToken || !adminPackageUser || adminPackageUser.role !== "admin") {
  window.location.href = "login.html";
}

const adminPackagesList = document.getElementById("adminPackagesList");
const adminPackageImageBase = "http://localhost:5001";

const getAdminPackageImage = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? adminPackageImageBase + images[0]
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const loadAdminPackages = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/packages");
    const data = await res.json();

    const packages = data.packages || data;

    adminPackagesList.innerHTML = packages.length
      ? packages.map((pkg) => `
          <div class="planner-package-card">
            <img src="${getAdminPackageImage(pkg.images)}" alt="${pkg.title}">

            <div class="planner-package-info">
              <h3>${pkg.title}</h3>
              <p>${pkg.destination} • ${pkg.duration} Days</p>
              <p>Planner: ${pkg.plannerId?.organizationName || "N/A"}</p>
              <p>Price: ৳${pkg.price}</p>
              <p>Seats: ${pkg.availableSeats}/${pkg.totalSeats}</p>
              <p>Status: ${pkg.status}</p>
              <p>Featured: ${pkg.featured ? "Yes" : "No"}</p>
            </div>

            <div class="planner-package-actions">
              <button class="btn-outline" onclick="viewPackage('${pkg._id}')">
                View
              </button>
            </div>
          </div>
        `).join("")
      : "<p>No packages found.</p>";
  } catch (error) {
    console.error(error);
    adminPackagesList.innerHTML = "<p>Failed to load packages.</p>";
  }
};

const viewPackage = (id) => {
  window.location.href = `package-details.html?id=${id}`;
};

loadAdminPackages();
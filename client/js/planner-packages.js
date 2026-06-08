const plannerPackageToken = localStorage.getItem("token");
const plannerPackageUser = JSON.parse(localStorage.getItem("user"));

const plannerPackagesList = document.getElementById("plannerPackagesList");

if (
  !plannerPackageToken ||
  !plannerPackageUser ||
  plannerPackageUser.role !== "planner"
) {
  window.location.href = "login.html";
}

const imageBaseUrlPlanner = "https://travel-planner-3ro5.onrender.com";

const getPlannerPackageImage = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? imageBaseUrlPlanner + images[0]
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const loadPlannerPackages = async () => {
  try {
    const res = await fetch("https://travel-planner-3ro5.onrender.com/api/packages/my-packages", {
      headers: {
        Authorization: `Bearer ${plannerPackageToken}`,
      },
    });

    const packages = await res.json();

    plannerPackagesList.innerHTML = packages.length
      ? packages.map((pkg) => `
          <div class="planner-package-card">
            <img src="${getPlannerPackageImage(pkg.images)}" alt="${pkg.title}">

            <div class="planner-package-info">
              <h3>${pkg.title}</h3>
              <p>${pkg.destination} • ${pkg.duration} Days</p>
              <p>Price: ৳${pkg.price}</p>
              <p>Seats: ${pkg.availableSeats}/${pkg.totalSeats}</p>
              <p>Status: ${pkg.status}</p>
            </div>

            <div class="planner-package-actions">
              <button class="btn-outline" onclick="viewPackage('${pkg._id}')">
                View
              </button>

              <button class="btn-outline" onclick="editPackage('${pkg._id}')">
                Edit
              </button>

              <button class="delete-btn" onclick="deletePackage('${pkg._id}')">
                Delete
              </button>
            </div>
          </div>
        `).join("")
      : "<p>No packages found.</p>";

  } catch (error) {
    console.error(error);
    plannerPackagesList.innerHTML = "<p>Failed to load packages.</p>";
  }
};

const viewPackage = (id) => {
  window.location.href = `package-details.html?id=${id}`;
};

const editPackage = (id) => {
  window.location.href = `edit-package.html?id=${id}`;
};

const deletePackage = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this package?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`https://travel-planner-3ro5.onrender.com/api/packages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${plannerPackageToken}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Package deleted successfully");
      loadPlannerPackages();
    } else {
      alert(data.message || "Failed to delete package");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

loadPlannerPackages();
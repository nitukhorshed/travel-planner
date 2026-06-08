const packageList = document.getElementById("packageList");
const imageBaseUrl = "https://travel-planner-3ro5.onrender.com";

const getImageUrl = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? imageBaseUrl + images[0]
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const renderPackageCard = (pkg) => {
  return `
    <div class="card">
      <img src="${getImageUrl(pkg.images)}" alt="${pkg.title}">
      <div class="card-content">
        <h3>${pkg.title}</h3>
        <p>${pkg.destination} • ${pkg.duration} Days</p>
        <p>Seats left: ${pkg.availableSeats}</p>
        <span>৳${pkg.price}</span>
        <button class="btn-primary card-btn" onclick="viewDetails('${pkg._id}')">
          View Details
        </button>
      </div>
    </div>
  `;
};

const loadPackages = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const search =
    document.getElementById("searchInput").value ||
    urlParams.get("search") ||
    "";

  const category =
    document.getElementById("categoryFilter").value ||
    urlParams.get("category") ||
    "";

  const sort =
    document.getElementById("sortFilter").value ||
    urlParams.get("sort") ||
    "";

  if (category) {
    document.getElementById("categoryFilter").value = category;
  }

  if (sort) {
    document.getElementById("sortFilter").value = sort;
  }

  let query = [];

  if (search) query.push(`search=${encodeURIComponent(search)}`);
  if (category) query.push(`category=${encodeURIComponent(category)}`);
  if (sort) query.push(`sort=${encodeURIComponent(sort)}`);

  const url =
    `https://travel-planner-3ro5.onrender.com/api/packages` +
    (query.length ? `?${query.join("&")}` : "");

  const res = await fetch(url);
  const data = await res.json();

  const packages = data.packages || data;

  packageList.innerHTML = packages.length
    ? packages.map(renderPackageCard).join("")
    : '<div class="empty-state">No packages found.</div>';
};

const viewDetails = (id) => {
  window.location.href = `package-details.html?id=${id}`;
};

document.getElementById("searchBtn").addEventListener("click", loadPackages);
document.getElementById("categoryFilter").addEventListener("change", loadPackages);
document.getElementById("sortFilter").addEventListener("change", loadPackages);

loadPackages();
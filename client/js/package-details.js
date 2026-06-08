const imageBaseUrl = "https://travel-planner-3ro5.onrender.com";
const detailsContainer = document.getElementById("packageDetails");

const params = new URLSearchParams(window.location.search);
const packageId = params.get("id");

const normalizeImageUrl = (url) => {
  if (!url) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
  }

  return url.startsWith("/uploads")
    ? imageBaseUrl + url
    : url;
};

const getGalleryImages = (images) => {
  if (images && images.length > 0) {
    return images.map(normalizeImageUrl);
  }

  return [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];
};

const renderGallery = (images, title) => {
  const galleryImages = getGalleryImages(images);

  return `
    <div class="package-gallery">
      <img
        src="${galleryImages[0]}"
        alt="${title}"
        id="mainPackageImage"
        class="main-package-image"
      >

      <div class="gallery-thumbnails">
        ${galleryImages
          .map(
            (img, index) => `
              <img
                src="${img}"
                alt="${title}"
                class="gallery-thumb ${index === 0 ? "active-thumb" : ""}"
                onclick="changeMainImage('${img}', this)"
              >
            `
          )
          .join("")}
      </div>
    </div>
  `;
};

const renderItinerary = (itinerary) => {
  if (!itinerary || itinerary.length === 0) {
    return "<p>No itinerary available.</p>";
  }

  return itinerary
    .map(
      (day) => `
        <div class="itinerary-day">
          <h3>Day ${day.dayNumber}: ${day.dayTitle}</h3>

          ${day.activities
            .map(
              (activity) => `
                <div class="activity-item">
                  <h4>${activity.activityTitle}</h4>
                  <p>${activity.description}</p>
                  <small>
                    ${activity.startTime || ""} - ${activity.endTime || ""}
                    ${activity.location ? ` • ${activity.location}` : ""}
                  </small>
                </div>
              `
            )
            .join("")}
        </div>
      `
    )
    .join("");
};

const loadPackageDetails = async () => {
  if (!packageId) {
    detailsContainer.innerHTML = "<p>Package ID is missing.</p>";
    return;
  }

  try {
    const res = await fetch(`https://travel-planner-3ro5.onrender.com/api/packages/${packageId}`);
    const pkg = await res.json();

    if (!res.ok) {
      detailsContainer.innerHTML = `<p>${pkg.message || "Package not found."}</p>`;
      return;
    }

    detailsContainer.innerHTML = `
      ${renderGallery(pkg.images, pkg.title)}

      <div class="details-layout">
        <div class="details-main">
          <h1>${pkg.title}</h1>
          <p class="details-subtitle">${pkg.destination} • ${pkg.duration} Days</p>

          <p class="details-description">${pkg.description}</p>

          <div class="details-info-grid">
            <div>
              <strong>Start Location</strong>
              <span>${pkg.startLocation}</span>
            </div>
            <div>
              <strong>Category</strong>
              <span>${pkg.category}</span>
            </div>
            <div>
              <strong>Available Seats</strong>
              <span>${pkg.availableSeats}</span>
            </div>
            <div>
              <strong>Price</strong>
              <span>৳${pkg.price}</span>
            </div>
          </div>

          <h2>Itinerary</h2>
          ${renderItinerary(pkg.itinerary)}
        </div>

        <aside class="booking-box">
          <h3>৳${pkg.price}</h3>
          <p>per person</p>

          ${
            !JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(localStorage.getItem("user"))?.role === "user"
              ? `
                <button class="btn-primary booking-btn" onclick="bookPackage('${pkg._id}')">
                  Book Now
                </button>
              `
              : ""
          }

          <div class="planner-box">
            <h4>Offered By</h4>
            <p
              class="planner-link"
              onclick="viewPlanner('${pkg.plannerId?._id}')"
            >
              ${pkg.plannerId?.organizationName || "Travel Planner"}
            </p>
            <small>${pkg.plannerId?.email || ""}</small>
          </div>
        </aside>
      </div>
    `;
  } catch (error) {
    console.error(error);
    detailsContainer.innerHTML = "<p>Failed to load package details.</p>";
  }
};

const changeMainImage = (imageUrl, thumbElement) => {
  document.getElementById("mainPackageImage").src = imageUrl;

  document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
    thumb.classList.remove("active-thumb");
  });

  thumbElement.classList.add("active-thumb");
};

const viewPlanner = (plannerId) => {
  if (plannerId) {
    window.location.href = `planner-details.html?id=${plannerId}`;
  }
};

const bookPackage = (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.setItem("redirectAfterLogin", `package-details.html?id=${id}`);
    window.location.href = "login.html";
    return;
  }

  window.location.href = `booking.html?id=${id}`;
};

loadPackageDetails();
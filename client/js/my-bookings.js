const myBookingToken = localStorage.getItem("token");
const bookingsList = document.getElementById("myBookingsList");
const imageBaseUrl = "https://travel-planner-3ro5.onrender.com";

if (!myBookingToken) {
  window.location.href = "login.html";
}

const statusClass = (status) => {
  if (status === "approved") return "status-approved";
  if (status === "cancelled") return "status-cancelled";
  return "status-pending";
};

const getImageUrl = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? imageBaseUrl + images[0]
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const loadMyBookings = async () => {
  try {
    const res = await fetch("https://travel-planner-3ro5.onrender.com/api/bookings/my-bookings", {
      headers: {
        Authorization: `Bearer ${myBookingToken}`,
      },
    });

    const bookings = await res.json();

    bookingsList.innerHTML = bookings.length
      ? bookings.map((booking) => `
          <div class="booking-card booking-card-image">
            <img
              src="${getImageUrl(booking.packageId?.images)}"
              alt="${booking.packageId?.title || "Package"}"
              class="my-booking-img"
            >

            <div class="booking-card-content">
              <h3>${booking.packageId?.title || "Package"}</h3>
              <p>${booking.packageId?.destination || ""}</p>
              <p>Travelers: ${booking.numberOfTravelers}</p>
              <p>Total Amount: ৳${booking.totalAmount}</p>
              <p>Planner: ${booking.plannerId?.organizationName || "Travel Planner"}</p>
              <button
                class="btn-primary"
                onclick="viewPackageDetails('${booking.packageId?._id}')"
              >
                View Package
              </button>
            </div>

            <div>
              <span class="booking-status ${statusClass(booking.bookingStatus)}">
                ${booking.bookingStatus}
              </span>
            </div>
          </div>
        `).join("")
      : "<p>No bookings found.</p>";

  } catch (error) {
    console.error(error);
    bookingsList.innerHTML = "<p>Failed to load bookings.</p>";
  }
};

const viewPackageDetails = (packageId) => {
  window.location.href = `package-details.html?id=${packageId}`;
};

loadMyBookings();
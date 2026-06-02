const plannerBookingToken = localStorage.getItem("token");
const plannerBookingUser = JSON.parse(localStorage.getItem("user"));

const bookingsContainer =
  document.getElementById("plannerBookingsList");

if (
  !plannerBookingToken ||
  !plannerBookingUser ||
  plannerBookingUser.role !== "planner"
) {
  window.location.href = "login.html";
}

const imageBaseUrl = "http://localhost:5001";

const getImageUrl = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? imageBaseUrl + images[0]
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const statusClass = (status) => {
  if (status === "approved") return "status-approved";
  if (status === "cancelled") return "status-cancelled";
  return "status-pending";
};

const loadPlannerBookings = async () => {
  try {

    const res = await fetch(
      "http://localhost:5001/api/bookings/planner-bookings",
      {
        headers: {
          Authorization: `Bearer ${plannerBookingToken}`,
        },
      }
    );

    const bookings = await res.json();

    bookingsContainer.innerHTML = bookings.length
      ? bookings.map((booking) => `
          <div class="booking-card booking-card-image">

            <img
              src="${getImageUrl(
                booking.packageId?.images
              )}"
              class="my-booking-img"
              alt="${booking.packageId?.title}"
            >

            <div class="booking-card-content">

              <h3>${booking.packageId?.title}</h3>

              <p>
                Traveler:
                ${booking.userId?.fullName || "User"}
              </p>

              <p>
                Email:
                ${booking.userId?.email || ""}
              </p>

              <p>
                Travelers:
                ${booking.numberOfTravelers}
              </p>

              <p>
                Amount:
                ৳${booking.totalAmount}
              </p>

              ${
                booking.specialRequest
                  ? `<p><strong>Request:</strong> ${booking.specialRequest}</p>`
                  : ""
              }

            </div>

            <div>

              <span
                class="booking-status ${statusClass(
                  booking.bookingStatus
                )}"
              >
                ${booking.bookingStatus}
              </span>

              ${
                booking.bookingStatus === "pending"
                  ? `
                  <div style="margin-top:12px;display:flex;gap:8px;">
                    <button
                      class="btn-primary"
                      onclick="approveBooking('${booking._id}')"
                    >
                      Approve
                    </button>

                    <button
                      class="delete-btn"
                      onclick="cancelBooking('${booking._id}')"
                    >
                      Cancel
                    </button>
                  </div>
                `
                  : ""
              }

            </div>

          </div>
        `).join("")
      : "<p>No bookings found.</p>";

  } catch (error) {
    console.error(error);
  }
};

const approveBooking = async (bookingId) => {
  try {

    const res = await fetch(
      `http://localhost:5001/api/bookings/${bookingId}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${plannerBookingToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      if (typeof showToast === "function") {
        showToast("Booking approved.", "success");
      }
      loadPlannerBookings();
    } else {
      if (typeof showToast === "function") {
        showToast(data.message || "Action failed.", "error");
      } else {
        alert(data.message || "Action failed.");
      }
    }

  } catch (error) {
    console.error(error);
  }
};

const cancelBooking = async (bookingId) => {
  try {

    const res = await fetch(
      `http://localhost:5001/api/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${plannerBookingToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      if (typeof showToast === "function") {
        showToast("Booking cancelled.", "success");
      }
      loadPlannerBookings();
    } else {
      if (typeof showToast === "function") {
        showToast(data.message || "Action failed.", "error");
      } else {
        alert(data.message || "Action failed.");
      }
    }

  } catch (error) {
    console.error(error);
  }
};

loadPlannerBookings();
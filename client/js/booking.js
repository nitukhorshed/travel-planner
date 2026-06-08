const bookingToken = localStorage.getItem("token");

if (!bookingToken) {
  window.location.href = "login.html";
}

const packageInfo = document.getElementById("packageInfo");

const params = new URLSearchParams(window.location.search);
const packageId = params.get("id");

if (!packageId) {
  packageInfo.innerHTML = "<p>Package ID is missing.</p>";
  throw new Error("Package ID missing");
}

let packagePrice = 0;

const getImageUrl = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? `https://travel-planner-3ro5.onrender.com${images[0]}`
      : images[0];
  }

  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
};

const loadPackage = async () => {
  try {
    const res = await fetch(
      `https://travel-planner-3ro5.onrender.com/api/packages/${packageId}`
    );

    const pkg = await res.json();

    if (!res.ok) {
      packageInfo.innerHTML = `<p>${pkg.message || "Package not found."}</p>`;
      return;
    }

    packagePrice = pkg.price;

    packageInfo.innerHTML = `
      <img src="${getImageUrl(pkg.images)}" class="booking-package-img" alt="${pkg.title}">

      <h2>${pkg.title}</h2>

      <p>${pkg.destination} • ${pkg.duration} Days</p>

      <p>${pkg.description}</p>

      <p>Available Seats: ${pkg.availableSeats}</p>

      <h3>৳${pkg.price}</h3>
    `;

    calculateTotal();

  } catch (error) {
    console.error(error);
    packageInfo.innerHTML = "<p>Failed to load package.</p>";
  }
};

const calculateTotal = () => {
  const travelers = Number(document.getElementById("travelers").value);

  document.getElementById("totalPrice").textContent =
    `৳${travelers * packagePrice}`;
};

document
  .getElementById("travelers")
  .addEventListener("input", calculateTotal);

document
  .getElementById("bookingForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const travelers = Number(document.getElementById("travelers").value);
    const specialRequest = document.getElementById("specialRequest").value;

    try {
      const res = await fetch("https://travel-planner-3ro5.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bookingToken}`,
        },
        body: JSON.stringify({
          packageId,
          numberOfTravelers: travelers,
          specialRequest,
        }),
      });

      const data = await res.json();

      const message = document.getElementById("bookingMessage");

      if (res.ok) {
        message.className = "success-message";
        message.innerHTML = `
            ✅ Booking request submitted successfully.
            <br>
            Redirecting to My Bookings...
        `;

        setTimeout(() => {
            window.location.href = "my-bookings.html";
        }, 1800);
    } else {
        message.className = "error-message";
        message.textContent = data.message || "Booking failed";
      }
    } catch (error) {
      console.error(error);
    }
  });

loadPackage();
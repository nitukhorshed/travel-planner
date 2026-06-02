const plannerToken = localStorage.getItem("token");
const plannerUser = JSON.parse(localStorage.getItem("user"));

if (!plannerToken || !plannerUser || plannerUser.role !== "planner") {
  window.location.href = "login.html";
}

const loadPlannerDashboard = async () => {
  try {
    const packagesRes = await fetch("http://localhost:5001/api/packages/my-packages", {
      headers: {
        Authorization: `Bearer ${plannerToken}`,
      },
    });

    const bookingsRes = await fetch("http://localhost:5001/api/bookings/planner-bookings", {
      headers: {
        Authorization: `Bearer ${plannerToken}`,
      },
    });

    const packages = await packagesRes.json();
    const bookings = await bookingsRes.json();

    document.getElementById("totalPackages").textContent = packages.length || 0;
    document.getElementById("totalBookings").textContent = bookings.length || 0;

    const pending = bookings.filter(
      (booking) => booking.bookingStatus === "pending"
    ).length;

    document.getElementById("pendingBookings").textContent = pending;
  } catch (error) {
    console.error(error);
  }
};

loadPlannerDashboard();
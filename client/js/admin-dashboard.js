const adminToken = localStorage.getItem("token");
const adminUser = JSON.parse(localStorage.getItem("user"));

if (
  !adminToken ||
  !adminUser ||
  adminUser.role !== "admin"
) {
  window.location.href = "login.html";
}

const loadDashboard = async () => {
  try {

    const res = await fetch(
      "http://localhost:5001/api/admin/stats",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const stats = await res.json();

    document.getElementById("totalUsers").textContent =
      stats.totalUsers;

    document.getElementById("totalPlanners").textContent =
      stats.totalPlanners;

    document.getElementById("pendingPlanners").textContent =
      stats.pendingPlanners;

    document.getElementById("approvedPlanners").textContent =
      stats.approvedPlanners;

    document.getElementById("totalPackages").textContent =
      stats.totalPackages;

    document.getElementById("totalBookings").textContent =
      stats.totalBookings;

  } catch (error) {
    console.error(error);
  }
};

loadDashboard();
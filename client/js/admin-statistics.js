const adminStatsToken = localStorage.getItem("token");
const adminStatsUser = JSON.parse(localStorage.getItem("user"));

if (!adminStatsToken || !adminStatsUser || adminStatsUser.role !== "admin") {
  window.location.href = "login.html";
}

const loadStatistics = async () => {
  try {
    const res = await fetch("https://travel-planner-3ro5.onrender.com/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${adminStatsToken}`,
      },
    });

    const stats = await res.json();

    document.getElementById("totalUsers").textContent = stats.totalUsers;
    document.getElementById("totalPlanners").textContent = stats.totalPlanners;
    document.getElementById("pendingPlanners").textContent = stats.pendingPlanners;
    document.getElementById("approvedPlanners").textContent = stats.approvedPlanners;
    document.getElementById("rejectedPlanners").textContent = stats.rejectedPlanners;

    document.getElementById("totalPackages").textContent = stats.totalPackages;
    document.getElementById("activePackages").textContent = stats.activePackages;
    document.getElementById("inactivePackages").textContent = stats.inactivePackages;
    document.getElementById("featuredPackages").textContent = stats.featuredPackages;

    document.getElementById("totalBookings").textContent = stats.totalBookings;
    document.getElementById("pendingBookings").textContent = stats.pendingBookings;
    document.getElementById("approvedBookings").textContent = stats.approvedBookings;
    document.getElementById("cancelledBookings").textContent = stats.cancelledBookings;
  } catch (error) {
    console.error(error);
  }
};

loadStatistics();
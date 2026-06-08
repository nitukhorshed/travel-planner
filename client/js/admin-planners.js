const adminPlannerToken =
  localStorage.getItem("token");

const adminPlannerUser =
  JSON.parse(localStorage.getItem("user"));

if (
  !adminPlannerToken ||
  !adminPlannerUser ||
  adminPlannerUser.role !== "admin"
) {
  window.location.href = "login.html";
}

const plannerList =
  document.getElementById("plannerList");

const statusClass = (status) => {

  if (status === "approved") {
    return "status-approved";
  }

  if (status === "rejected") {
    return "status-cancelled";
  }

  return "status-pending";
};

const loadPlanners = async () => {

  try {

    const res = await fetch(
      "http://travel-planner-3ro5.onrender.com/api/admin/planners",
      {
        headers: {
          Authorization:
            `Bearer ${adminPlannerToken}`,
        },
      }
    );

    const planners = await res.json();

    plannerList.innerHTML =
      planners.length > 0
        ? planners.map((planner) => `
            <div class="booking-card">

              <div class="booking-card-content">

                <h3>
                  ${planner.organizationName || "No Organization"}
                </h3>

                <p>
                  <strong>Name:</strong>
                  ${planner.fullName}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${planner.email}
                </p>

                <p>
                  <strong>Status:</strong>

                  <span class="
                    booking-status
                    ${statusClass(
                      planner.plannerStatus
                    )}
                  ">
                    ${planner.plannerStatus}
                  </span>
                </p>

              </div>

              <div>

                ${
                  planner.plannerStatus !== "approved"
                    ? `
                      <button
                        class="btn-primary"
                        onclick="approvePlanner('${planner._id}')"
                      >
                        Approve
                      </button>
                    `
                    : ""
                }

                ${
                  planner.plannerStatus !== "rejected"
                    ? `
                      <button
                        class="delete-btn"
                        onclick="rejectPlanner('${planner._id}')"
                      >
                        Reject
                      </button>
                    `
                    : ""
                }

              </div>

            </div>
          `).join("")
        : "<p>No planners found.</p>";

  } catch (error) {
    console.error(error);
  }
};

const approvePlanner = async (plannerId) => {

  try {

    const res = await fetch(
      `http://travel-planner-3ro5.onrender.com/api/admin/planners/${plannerId}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization:
            `Bearer ${adminPlannerToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {

      showToast("Planner approved.", "success");

      loadPlanners();

    } else {

      alert(data.message);
    }

  } catch (error) {
    console.error(error);
  }
};

const rejectPlanner = async (plannerId) => {

  try {

    const res = await fetch(
      `http://travel-planner-3ro5.onrender.com/api/admin/planners/${plannerId}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization:
            `Bearer ${adminPlannerToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {

      showToast("Planner rejected.", "success");

      loadPlanners();

    } else {

      alert(data.message);
    }

  } catch (error) {
    console.error(error);
  }
};

loadPlanners();
const plannerList = document.getElementById("plannerList");
const plannerImageBase = "http://localhost:5001";

const getPlannerImage = (url) => {
  if (!url) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
  }

  return url.startsWith("/uploads")
    ? plannerImageBase + url
    : url;
};

const loadPlanners = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/planner-profile/featured");
    const planners = await res.json();

    plannerList.innerHTML = planners.length
      ? planners.map((planner) => `
          <div class="card" onclick="viewPlanner('${planner.plannerId?._id}')" style="cursor:pointer;">
            <img src="${getPlannerImage(planner.coverImage || planner.logo)}" alt="${planner.organizationName}">

            <div class="card-content">
              <h3>${planner.organizationName}</h3>
              <p>${planner.address || "Bangladesh"}</p>
              <p class="verified-text">Verified</p>
            </div>
          </div>
        `).join("")
      : "<p>No featured planners found.</p>";

  } catch (error) {
    console.error(error);
    plannerList.innerHTML = "<p>Failed to load planners.</p>";
  }
};

const viewPlanner = (id) => {
  window.location.href = `planner-details.html?id=${id}`;
};

loadPlanners();
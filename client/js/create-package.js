const createPackageToken = localStorage.getItem("token");
const createPackageUser = JSON.parse(localStorage.getItem("user"));

if (
  !createPackageToken ||
  !createPackageUser ||
  createPackageUser.role !== "planner"
) {
  window.location.href = "login.html";
}

const form = document.getElementById("createPackageForm");
const itineraryContainer = document.getElementById("itineraryContainer");
const addDayBtn = document.getElementById("addDayBtn");
const imageInput = document.getElementById("packageImages");
const imagePreview = document.getElementById("imagePreview");
const message = document.getElementById("createPackageMessage");

let dayCount = 0;

const addDay = () => {
  dayCount++;

  const dayDiv = document.createElement("div");
  dayDiv.className = "itinerary-form-day";
  dayDiv.dataset.day = dayCount;

  dayDiv.innerHTML = `
    <h3>Day ${dayCount}</h3>

    <input type="text" class="day-title" placeholder="Day Title" required>

    <div class="activities-container"></div>

    <button type="button" class="btn-outline add-activity-btn">
      + Add Activity
    </button>
  `;

  itineraryContainer.appendChild(dayDiv);

  dayDiv
    .querySelector(".add-activity-btn")
    .addEventListener("click", () => addActivity(dayDiv));
};

const addActivity = (dayDiv) => {
  const activitiesContainer = dayDiv.querySelector(".activities-container");

  const activityDiv = document.createElement("div");
  activityDiv.className = "activity-form-box";

  activityDiv.innerHTML = `
    <input type="text" class="activity-title" placeholder="Activity Title" required>
    <textarea class="activity-description" placeholder="Activity Description" rows="2"></textarea>
    <input type="text" class="activity-start" placeholder="Start Time">
    <input type="text" class="activity-end" placeholder="End Time">
    <input type="text" class="activity-location" placeholder="Location">
    <button type="button" class="delete-btn remove-activity-btn">Remove</button>
  `;

  activitiesContainer.appendChild(activityDiv);

  activityDiv
    .querySelector(".remove-activity-btn")
    .addEventListener("click", () => activityDiv.remove());
};

const uploadImages = async () => {
  const files = imageInput.files;

  if (!files || files.length === 0) {
    return [];
  }

  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch("http://localhost:5001/api/uploads/package-images", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${createPackageToken}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.imageUrls;
};

imageInput.addEventListener("change", () => {
  const files = imageInput.files;

  if (!files || files.length === 0) {
    imagePreview.innerHTML = "";
    return;
  }

  imagePreview.innerHTML = Array.from(files)
    .map(
      (file) => `
        <img
          src="${URL.createObjectURL(file)}"
          class="image-preview"
          alt="Package preview"
        >
      `
    )
    .join("");
});

const collectItinerary = () => {
  const days = document.querySelectorAll(".itinerary-form-day");

  return Array.from(days).map((dayDiv, index) => {
    const activities = dayDiv.querySelectorAll(".activity-form-box");

    return {
      dayNumber: index + 1,
      dayTitle: dayDiv.querySelector(".day-title").value,
      activities: Array.from(activities).map((activityDiv) => ({
        activityTitle: activityDiv.querySelector(".activity-title").value,
        description: activityDiv.querySelector(".activity-description").value,
        startTime: activityDiv.querySelector(".activity-start").value,
        endTime: activityDiv.querySelector(".activity-end").value,
        location: activityDiv.querySelector(".activity-location").value,
      })),
    };
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    message.textContent = "Creating package...";
    message.style.color = "#64748b";

    const uploadedImageUrls = await uploadImages();

    const totalSeats = Number(document.getElementById("totalSeats").value);

    const body = {
      title: document.getElementById("title").value,
      destination: document.getElementById("destination").value,
      startLocation: document.getElementById("startLocation").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      price: Number(document.getElementById("price").value),
      duration: Number(document.getElementById("duration").value),
      totalSeats,
      availableSeats: totalSeats,
      images: uploadedImageUrls,
      itinerary: collectItinerary(),
      featured: false,
      status: "active",
    };

    const res = await fetch("http://localhost:5001/api/packages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${createPackageToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "#16a34a";
      showToast("Package created successfully.", "success");

      setTimeout(() => {
        window.location.href = "planner-packages.html";
      }, 1200);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Failed to create package";
    }
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = error.message || "Something went wrong";
  }
});

addDay();
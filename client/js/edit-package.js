const editPackageToken = localStorage.getItem("token");
const editPackageUser = JSON.parse(localStorage.getItem("user"));

if (
  !editPackageToken ||
  !editPackageUser ||
  editPackageUser.role !== "planner"
) {
  window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const packageId = params.get("id");

const form = document.getElementById("editPackageForm");
const itineraryContainer = document.getElementById("itineraryContainer");
const addDayBtn = document.getElementById("addDayBtn");
const imageInput = document.getElementById("packageImages");
const imagePreview = document.getElementById("imagePreview");
const message = document.getElementById("editPackageMessage");

let currentImages = [];

if (!packageId) {
  message.textContent = "Package ID missing.";
  message.style.color = "red";
  throw new Error("Package ID missing");
}

const getImageUrl = (images) => {
  if (images && images.length > 0) {
    return images[0].startsWith("/uploads")
      ? `https://travel-planner-3ro5.onrender.com${images[0]}`
      : images[0];
  }

  return "";
};

const addDay = (dayData = null) => {
  const dayNumber = itineraryContainer.children.length + 1;

  const dayDiv = document.createElement("div");
  dayDiv.className = "itinerary-form-day";

  dayDiv.innerHTML = `
    <h3>Day ${dayNumber}</h3>

    <input
      type="text"
      class="day-title"
      placeholder="Day Title"
      value="${dayData?.dayTitle || ""}"
      required
    >

    <div class="activities-container"></div>

    <button type="button" class="btn-outline add-activity-btn">
      + Add Activity
    </button>

    <button type="button" class="delete-btn remove-day-btn">
      Remove Day
    </button>
  `;

  itineraryContainer.appendChild(dayDiv);

  const activitiesContainer = dayDiv.querySelector(".activities-container");

  if (dayData && dayData.activities && dayData.activities.length > 0) {
    dayData.activities.forEach((activity) => {
      addActivity(dayDiv, activity);
    });
  }

  dayDiv
    .querySelector(".add-activity-btn")
    .addEventListener("click", () => addActivity(dayDiv));

  dayDiv
    .querySelector(".remove-day-btn")
    .addEventListener("click", () => {
      dayDiv.remove();
      refreshDayNumbers();
    });
};

const addActivity = (dayDiv, activityData = null) => {
  const activitiesContainer = dayDiv.querySelector(".activities-container");

  const activityDiv = document.createElement("div");
  activityDiv.className = "activity-form-box";

  activityDiv.innerHTML = `
    <input
      type="text"
      class="activity-title"
      placeholder="Activity Title"
      value="${activityData?.activityTitle || ""}"
      required
    >

    <textarea
      class="activity-description"
      placeholder="Activity Description"
      rows="2"
    >${activityData?.description || ""}</textarea>

    <input
      type="text"
      class="activity-start"
      placeholder="Start Time"
      value="${activityData?.startTime || ""}"
    >

    <input
      type="text"
      class="activity-end"
      placeholder="End Time"
      value="${activityData?.endTime || ""}"
    >

    <input
      type="text"
      class="activity-location"
      placeholder="Location"
      value="${activityData?.location || ""}"
    >

    <button type="button" class="delete-btn remove-activity-btn">
      Remove Activity
    </button>
  `;

  activitiesContainer.appendChild(activityDiv);

  activityDiv
    .querySelector(".remove-activity-btn")
    .addEventListener("click", () => activityDiv.remove());
};

const refreshDayNumbers = () => {
  document.querySelectorAll(".itinerary-form-day").forEach((day, index) => {
    day.querySelector("h3").textContent = `Day ${index + 1}`;
  });
};

const loadPackage = async () => {
  try {
    const res = await fetch(`https://travel-planner-3ro5.onrender.com/api/packages/${packageId}`);
    const pkg = await res.json();

    if (!res.ok) {
      message.textContent = pkg.message || "Failed to load package.";
      message.style.color = "red";
      return;
    }

    document.getElementById("title").value = pkg.title;
    document.getElementById("destination").value = pkg.destination;
    document.getElementById("startLocation").value = pkg.startLocation;
    document.getElementById("category").value = pkg.category;
    document.getElementById("description").value = pkg.description;
    document.getElementById("price").value = pkg.price;
    document.getElementById("duration").value = pkg.duration;
    document.getElementById("totalSeats").value = pkg.totalSeats;
    document.getElementById("availableSeats").value = pkg.availableSeats;
    document.getElementById("status").value = pkg.status;

    currentImages = pkg.images || [];

    imagePreview.innerHTML = currentImages.length
      ? currentImages
          .map(
            (img) => `
              <img
                src="${img.startsWith("/uploads") ? "https://travel-planner-3ro5.onrender.com" + img : img}"
                class="image-preview"
              >
            `
          )
          .join("")
      : "";

    itineraryContainer.innerHTML = "";

    if (pkg.itinerary && pkg.itinerary.length > 0) {
      pkg.itinerary.forEach((day) => addDay(day));
    } else {
      addDay();
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Something went wrong.";
    message.style.color = "red";
  }
};

const uploadImages = async () => {
  const files = imageInput.files;

    if (!files.length) return [];

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch(
      "https://travel-planner-3ro5.onrender.com/api/uploads/package-images",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${editPackageToken}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.imageUrls;
};

imageInput.addEventListener("change", () => {
  const files = imageInput.files;

  if (!files || files.length === 0) {
    imagePreview.innerHTML = currentImages
      .map(
        (img) => `
          <img
            src="${img.startsWith("/uploads") ? "https://travel-planner-3ro5.onrender.com" + img : img}"
            class="image-preview"
          >
        `
      )
      .join("");

    return;
  }

  const newImagePreviews = Array.from(files)
    .map(
      (file) => `
        <img
          src="${URL.createObjectURL(file)}"
          class="image-preview"
        >
      `
    )
    .join("");

  const existingImagePreviews = currentImages
    .map(
      (img) => `
        <img
          src="${img.startsWith("/uploads") ? "https://travel-planner-3ro5.onrender.com" + img : img}"
          class="image-preview"
        >
      `
    )
    .join("");

  imagePreview.innerHTML = existingImagePreviews + newImagePreviews;
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
    message.textContent = "Updating package...";
    message.style.color = "#64748b";

    const uploadedImages = await uploadImages();

    const images = [
      ...currentImages,
      ...uploadedImages,
    ];

    const body = {
      title: document.getElementById("title").value,
      destination: document.getElementById("destination").value,
      startLocation: document.getElementById("startLocation").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      price: Number(document.getElementById("price").value),
      duration: Number(document.getElementById("duration").value),
      totalSeats: Number(document.getElementById("totalSeats").value),
      availableSeats: Number(document.getElementById("availableSeats").value),
      status: document.getElementById("status").value,
      images,
      itinerary: collectItinerary(),
    };

    const res = await fetch(`https://travel-planner-3ro5.onrender.com/api/packages/${packageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${editPackageToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "#16a34a";
      message.textContent = "Package updated successfully.";

      setTimeout(() => {
        window.location.href = "planner-packages.html";
      }, 1200);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Failed to update package.";
    }
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = error.message || "Something went wrong.";
  }
});

addDayBtn.addEventListener("click", () => addDay());

loadPackage();
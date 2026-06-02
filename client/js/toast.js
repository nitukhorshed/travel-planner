const showToast = (
  message,
  type = "success"
) => {

  let container =
    document.getElementById("toastContainer");

  if (!container) {

    container = document.createElement("div");

    container.id = "toastContainer";

    document.body.appendChild(container);
  }

  const toast =
    document.createElement("div");

  toast.className =
    `toast toast-${type}`;

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".dropdown-toggle");

  button.addEventListener("click", (e) => {
    e.stopPropagation();

    dropdowns.forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove("active");
      }
    });

    dropdown.classList.toggle("active");
  });
});

document.addEventListener("click", () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active");
  });
});
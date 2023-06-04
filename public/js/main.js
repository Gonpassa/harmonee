const pastEntries = document.querySelectorAll(".pastEntry");

pastEntries.forEach((entry) => {
  entry.addEventListener("click", async () => {
    window.location.href = `/edit/${entry.dataset.id}`;
  });
});

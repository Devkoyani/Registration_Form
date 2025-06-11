document.addEventListener("DOMContentLoaded", function () {

  // 1. On click of Add button open a popup to add record data.
  const addButton = document.getElementById("addButton");
  const formModal = document.getElementById("formModal");

  addButton.addEventListener("click", openAddModal);

  function openAddModal() {
    formModal.style.display = "block";
  }
});
document.addEventListener("DOMContentLoaded", function () {

  // 1. On click of Add button open a popup to add record data.
  const addButton = document.getElementById("addButton");
  const formModal = document.getElementById("formModal");

  addButton.addEventListener("click", openAddModal);

  function openAddModal() {
    formModal.style.display = "block";
  }

  // Close Button Functionality
  const closeButtons = document.querySelectorAll(".close");
  const deleteModal = document.getElementById("deleteModal");

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      formModal.style.display = "none";
      deleteModal.style.display = "none";
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === formModal || event.target === deleteModal) {
      formModal.style.display = "none";
      deleteModal.style.display = "none";
    }
  });


  // 2. On submission of location record form data, it should appear in the location table list.
  const recordForm = document.getElementById("recordForm");
  const showInactiveCheckbox = document.getElementById("inactive");
  const tableBody = document.getElementById("table-body");

  recordForm.addEventListener("submit", handleFormSubmit);
  showInactiveCheckbox.addEventListener("change", renderTable);

  let records = [];
  renderTable();

  function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("recordId").value;
    const name = document.getElementById("locationName").value;
    const description = document.getElementById("locationDescription").value;
    const status = document.querySelector('input[name="status"]:checked').value;

    const record = {
      id: id ? parseInt(id) : Date.now(),
      name,
      description,
      status,
    };

    if (id) {
      const index = records.findIndex((r) => r.id == id);
      if (index !== -1) {
        records[index] = record;
      }
    } else {
      records.push(record);
    }

    renderTable();
    formModal.style.display = "none";
  }

  function renderTable() {
    tableBody.innerHTML = "";

    const filteredRecords = showInactiveCheckbox.checked
      ? records
      : records.filter((record) => record.status === "active");

    filteredRecords.forEach((record, index) => {
      const row = document.createElement("tr");

        row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${index + 1}</td>
                        <td>${record.name}</td>
                        <td>${record.description}</td>
                        <td>
                            <div class="action">
                                <div class="action-view" data-id="${record.id}">
                                    <i class="fa-solid fa-eye"></i><span> View</span>
                                </div>
                                <div class="action-edit" data-id="${record.id}">
                                    <i class="fa-solid fa-pen-to-square"></i><span> Edit</span>
                                </div>
                                <div class="action-delete" data-id="${
                                  record.id
                                }">
                                    <i class="fa-solid fa-circle-minus"></i><span> Delete</span>
                                </div>
                            </div>
                        </td>
                    `;

      tableBody.appendChild(row);
    });
  }
});

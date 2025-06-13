document.addEventListener("DOMContentLoaded", function () {

  // 1. On click of Add button open a popup to add record data.
  const addButton = document.getElementById("addButton");
  const formModal = document.getElementById("formModal");

  addButton.addEventListener("click", openAddModal);

  function openAddModal() {
    document.getElementById("formTitle").textContent = "Add Record";

    document.getElementById("recordId").value = "";
    document.getElementById("locationName").value = "";
    document.getElementById("locationDescription").value = "";
    document.getElementById("active").checked = true;

    document.getElementById("locationName").readOnly = false;
    document.getElementById("locationDescription").readOnly = false;
    document.querySelectorAll('input[name="status"]').forEach((radio) => {
      radio.disabled = false;
    });

    document.getElementById("submitBtn").querySelector("span").textContent =
      "Add";
    document.getElementById("submitBtn").style.display = "block";

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

  // Filter functionality
  const statusFilter = document.getElementById("statusFilter");
  statusFilter.addEventListener("change", renderTable);

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", renderTable);


  // 2. On submission of location record form data, it should appear in the location table list.
  const recordForm = document.getElementById("recordForm");
  const tableBody = document.getElementById("table-body");
  
  recordForm.addEventListener("submit", handleFormSubmit);

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


  //  Rendering the table with records
  function renderTable() {
    tableBody.innerHTML = "";

    const filterValue = statusFilter.value;
    const searchValue = searchInput.value.toLowerCase();

    const filteredRecords = records.filter(record => {

        if (filterValue !== "all" && record.status !== filterValue) {
            return false;
        }
        
        if (searchValue && 
            !record.name.toLowerCase().includes(searchValue) && 
            !record.description.toLowerCase().includes(searchValue)) {
            return false;
        }
        
        return true;
    });

    filteredRecords.forEach((record, index) => {
      const row = document.createElement("tr");

       if (record.status === "inactive") {
            row.classList.add("inactive-row");
        }

      row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${record.id}</td>
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

    document.querySelectorAll(".action-view").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        const record = records.find((r) => r.id == id);
        openEditModal(record, true);
      });
    });

    document.querySelectorAll(".action-edit").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        const record = records.find((r) => r.id == id);
        openEditModal(record);
      });
    });

    document.querySelectorAll(".action-delete").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        openDeleteModal(id);
      });
    });
  }

  
  // 3. On click of Edit or View button, it should open a popup with pre-filled data.
  function openEditModal(record, viewOnly = false) {
    document.getElementById("formTitle").textContent = viewOnly
      ? "View Record"
      : "Edit Record";
    document.getElementById("submitBtn").querySelector("span").textContent =
      "Update";
    document.getElementById("recordId").value = record.id;
    document.getElementById("locationName").value = record.name;
    document.getElementById("locationDescription").value = record.description;

    if (record.status === "active") {
      document.getElementById("active").checked = true;
    } else {
      document.getElementById("inactiveRadio").checked = true;
    }

    if (viewOnly) {
      document.getElementById("locationName").readOnly = true;
      document.getElementById("locationDescription").readOnly = true;
      document.querySelectorAll('input[name="status"]').forEach((radio) => {
        radio.disabled = true;
      });
      document.getElementById("submitBtn").style.display = "none";
    } else {
      document.getElementById("locationName").readOnly = false;
      document.getElementById("locationDescription").readOnly = false;
      document.querySelectorAll('input[name="status"]').forEach((radio) => {
        radio.disabled = false;
      });
      document.getElementById("submitBtn").style.display = "block";
    }

    formModal.style.display = "block";
  }


  // 4. On click of Delete button, it should open a confirmation modal.
  let currentRecordId = null;

  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  confirmDeleteBtn.addEventListener("click", confirmDelete);
  cancelDeleteBtn.addEventListener("click", cancelDelete);

  function openDeleteModal(id) {
    currentRecordId = id;
    deleteModal.style.display = "block";
  }

  function confirmDelete() {
    records = records.filter((record) => record.id != currentRecordId);
    renderTable();
    deleteModal.style.display = "none";
    currentRecordId = null;
  }

  function cancelDelete() {
    deleteModal.style.display = "none";
    currentRecordId = null;
  }
});

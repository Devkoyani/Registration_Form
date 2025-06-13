document.addEventListener("DOMContentLoaded", function () {
  // Pagination variables
  const recordsPerPage = 3;
  let currentPage = 1;
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");
  const pageNumbersContainer = document.getElementById("pageNumbers");

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
  statusFilter.addEventListener("change", function () {
    currentPage = 1;
    renderTable();
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    currentPage = 1;
    renderTable();
  });

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

    currentPage = 1;
    renderTable();
    formModal.style.display = "none";
  }

  //  Rendering the table with records
  function renderTable() {
    tableBody.innerHTML = "";

    const filterValue = statusFilter.value;
    const searchValue = searchInput.value.toLowerCase();

    const filteredRecords = records.filter((record) => {
      if (filterValue !== "all" && record.status !== filterValue) {
        return false;
      }

      if (
        searchValue &&
        !record.name.toLowerCase().includes(searchValue) &&
        !record.description.toLowerCase().includes(searchValue)
      ) {
        return false;
      }

      return true;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(
      startIndex + recordsPerPage,
      filteredRecords.length
    );
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    // Render page numbers
    renderPageNumbers(totalPages);

    // Update pagination buttons
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages || totalPages === 0;

    // Render table rows
    paginatedRecords.forEach((record, index) => {
      const row = document.createElement("tr");
      const globalIndex = startIndex + index + 1;

      if (record.status === "inactive") {
        row.classList.add("inactive-row");
      }

      row.innerHTML = `
                        <td>${globalIndex}</td>
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
                                <div class="action-delete" data-id="${record.id}">
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


  // 3. Render page numbers based on the total number of records.
  function renderPageNumbers(totalPages) {
    pageNumbersContainer.innerHTML = "";

    if (totalPages === 0) {
      return;
    }

    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      if (currentPage <= half + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      addPageNumber(1);
      if (startPage > 2) {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        pageNumbersContainer.appendChild(ellipsis);
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      addPageNumber(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        pageNumbersContainer.appendChild(ellipsis);
      }
      addPageNumber(totalPages);
    }
  }

  function addPageNumber(pageNumber) {
    const pageElement = document.createElement("span");
    pageElement.textContent = pageNumber;
    pageElement.className = "page-number";
    if (pageNumber === currentPage) {
      pageElement.classList.add("active");
    }

    pageElement.addEventListener("click", () => {
      currentPage = pageNumber;
      renderTable();
    });

    pageNumbersContainer.appendChild(pageElement);
  }

  // Pagination button event listeners
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextPageButton.addEventListener("click", () => {
    const filterValue = statusFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    const filteredRecords = records.filter((record) => {
      if (filterValue !== "all" && record.status !== filterValue) return false;
      if (
        searchValue &&
        !record.name.toLowerCase().includes(searchValue) &&
        !record.description.toLowerCase().includes(searchValue)
      )
        return false;
      return true;
    });

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });


  // 4. On click of Edit or View button, it should open a popup with pre-filled data.
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

  // 5. On click of Delete button, it should open a confirmation modal.
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
    // Reset to first page if current page is empty after deletion
    const filterValue = statusFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    const filteredRecords = records.filter((record) => {
      if (filterValue !== "all" && record.status !== filterValue) return false;
      if (
        searchValue &&
        !record.name.toLowerCase().includes(searchValue) &&
        !record.description.toLowerCase().includes(searchValue)
      )
        return false;
      return true;
    });

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    } else if (totalPages === 0) {
      currentPage = 1;
    }

    renderTable();
    deleteModal.style.display = "none";
    currentRecordId = null;
  }

  function cancelDelete() {
    deleteModal.style.display = "none";
    currentRecordId = null;
  }
});

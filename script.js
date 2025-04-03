document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#club-table tbody");

  // Function to fetch and parse CSV data
  async function loadCSV() {
    const response = await fetch("clubs.csv");
    const data = await response.text();
    const rows = data.split("\n").slice(1); // Skip header row

    rows.forEach(row => {
      const columns = row.split(",");
      const tableRow = document.createElement("tr");

      columns.forEach((column, index) => {
        const cell = document.createElement("td");
        cell.textContent = column.trim();
        tableRow.appendChild(cell);
      });

      // Add "More Info" button
      const moreInfoCell = document.createElement("td");
      const moreInfoButton = document.createElement("button");
      moreInfoButton.textContent = "More Info";
      moreInfoButton.addEventListener("click", () => {
        alert(`Details for ${columns[0]}: Coming soon!`);
      });
      moreInfoCell.appendChild(moreInfoButton);
      tableRow.appendChild(moreInfoCell);

      tableBody.appendChild(tableRow);
    });
  }

  loadCSV();
});

document.getElementById("dark-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const searchBar = document.getElementById("search-bar");
const filterDropdown = document.getElementById("filter-dropdown");

searchBar.addEventListener("input", filterTable);
filterDropdown.addEventListener("change", filterTable);

function filterTable() {
  const searchQuery = searchBar.value.toLowerCase();
  const filterValue = filterDropdown.value;

  const rows = document.querySelectorAll("#club-table tbody tr");
  
  rows.forEach(row => {
    const clubName = row.children[0].textContent.toLowerCase();
    const openPositions = parseInt(row.children[2].textContent);

    let matchesSearch = clubName.includes(searchQuery);
    let matchesFilter =
      filterValue === "all" || (filterValue === "open" && openPositions > 0);

    row.style.display =
      matchesSearch && matchesFilter ? "" : "none";
  });
}

document.querySelectorAll("thead th[data-sort]").forEach(header => {
  header.addEventListener("click", () => {
    const sortKey = header.dataset.sort;
    sortTable(sortKey);
  });
});

function sortTable(key) {
  const rowsArray = Array.from(document.querySelectorAll("#club-table tbody tr"));
  
  rowsArray.sort((a, b) => {
    const valA = a.querySelector(`td:nth-child(${getColumnIndex(key)})`).textContent.trim();
    const valB = b.querySelector(`td:nth-child(${getColumnIndex(key)})`).textContent.trim();

    return key === "positions"
      ? parseInt(valA) - parseInt(valB)
      : valA.localeCompare(valB);
  });

  rowsArray.forEach(row => document.querySelector("#club-table tbody").appendChild(row));
}

function getColumnIndex(key) {
   return key === "name" ? "1" : key === "time" ? "2" : key === "positions" ? "3" : null; 
}

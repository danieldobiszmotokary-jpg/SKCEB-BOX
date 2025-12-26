// =====================
// GLOBAL STATE
// =====================
let teams = [];
let pitRows = [];

// =====================
// TEAM SETUP
// =====================
function addTeam() {
  const nameInput = document.getElementById("teamName");
  const kartSelect = document.getElementById("teamKartSelect");

  const name = nameInput.value.trim();
  const kartNumber = kartSelect.value;

  if (!name || !kartNumber) {
    alert("Select kart number and enter team name");
    return;
  }

  if (teams.find(t => t.kartNumber === kartNumber)) {
    alert("Kart number already assigned");
    return;
  }

  teams.push({
    name,
    kartNumber,
    color: "blue"
  });

  nameInput.value = "";
  renderTeams();
}

function renderTeams() {
  const list = document.getElementById("teamList");
  list.innerHTML = "";

  teams.forEach(team => {
    const div = document.createElement("div");
    div.className = "team";
    div.style.background = team.color;
    div.textContent = `${team.name} — Kart ${team.kartNumber}`;
    list.appendChild(div);
  });
}

// =====================
// PIT LANE SETUP
// =====================
function buildPitLane() {
  const rows = parseInt(document.getElementById("rowCount").value);
  const karts = parseInt(document.getElementById("kartsPerRow").value);

  if (isNaN(rows) || isNaN(karts)) {
    alert("Invalid pit setup");
    return;
  }

  pitRows = [];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let k = 0; k < karts; k++) {
      row.push({
        kartNumber: null,
        color: "blue"
      });
    }
    pitRows.push(row);
  }

  renderPitLane();
}

function renderPitLane() {
  const container = document.getElementById("pitContainer");
  container.innerHTML = "";

  pitRows.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "pit-row";

    row.forEach(kart => {
      const kartDiv = document.createElement("div");
      kartDiv.className = "kart";
      kartDiv.style.background = kart.color;
      kartDiv.textContent = kart.kartNumber ?? "";
      rowDiv.appendChild(kartDiv);
    });

    const btn = document.createElement("button");
    btn.textContent = "+";
    btn.onclick = () => pitEntry(rowIndex);
    rowDiv.appendChild(btn);

    container.appendChild(rowDiv);
  });
}

// =====================
// PIT ENTRY LOGIC
// =====================
function pitEntry(rowIndex) {
  if (teams.length === 0) {
    alert("No teams available");
    return;
  }

  const kartNumber = promptSelectKart();
  if (!kartNumber) return;

  const team = teams.find(t => t.kartNumber === kartNumber);
  if (!team) return;

  const row = pitRows[rowIndex];

  // Kart that team takes
  const takenKart = row.shift();

  // Team switches to taken kart (kart removed from pits)
  team.color = takenKart.color;

  // Team's old kart goes to back of row
  row.push({
    kartNumber: team.kartNumber,
    color: team.color
  });

  renderTeams();
  renderPitLane();
}

// =====================
// SELECT UI (NO TYPING)
// =====================
function promptSelectKart() {
  const options = teams.map(t => t.kartNumber).join(", ");
  const selected = prompt(`Select kart number:\n${options}`);
  return teams.find(t => t.kartNumber === selected) ? selected : null;
}

// =====================
// INIT HELPERS
// =====================
function populateKartSelect(max = 50) {
  const select = document.getElementById("teamKartSelect");
  select.innerHTML = `<option value="">Select kart</option>`;
  for (let i = 1; i <= max; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    select.appendChild(opt);
  }
}

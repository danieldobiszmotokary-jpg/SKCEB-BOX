let teams = [];
let pitRows = [];

const colors = {
  blue: "#3498db",
  red: "#e74c3c",
  orange: "#e67e22",
  yellow: "#f1c40f",
  green: "#2ecc71",
  purple: "#9b59b6"
};

// Populate kart numbers dropdown
const kartSelect = document.getElementById("teamKart");
for (let i = 1; i <= 99; i++) {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = i;
  kartSelect.appendChild(opt);
}

// ADD TEAM
function addTeam() {
  const name = document.getElementById("teamName").value.trim();
  const kart = document.getElementById("teamKart").value;

  if (!name) return alert("Enter team name");

  teams.push({
    name,
    kart,
    color: "blue"
  });

  document.getElementById("teamName").value = "";
  renderTeams();
}

function renderTeams() {
  const list = document.getElementById("teamList");
  list.innerHTML = "";

  teams.forEach(t => {
    const div = document.createElement("div");
    div.className = "team";
    div.style.background = colors[t.color];
    div.textContent = `${t.name} – Kart ${t.kart}`;
    list.appendChild(div);
  });
}

// SETUP PIT LANE
function setupPitLane() {
  const rows = Number(document.getElementById("rowCount").value);
  const perRow = Number(document.getElementById("kartsPerRow").value);

  pitRows = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let k = 0; k < perRow; k++) {
      row.push({ color: "blue", kart: null });
    }
    pitRows.push(row);
  }

  renderPitLane();
}

function renderPitLane() {
  const lane = document.getElementById("pitLane");
  lane.innerHTML = "";

  pitRows.forEach((row, rowIndex) => {
    const col = document.createElement("div");
    col.className = "row";

    row.forEach(k => {
      const div = document.createElement("div");
      div.className = "kart";
      div.style.background = colors[k.color];
      div.textContent = k.kart ?? "";
      col.appendChild(div);
    });

    const btn = document.createElement("button");
    btn.textContent = "+";
    btn.onclick = () => pitAction(rowIndex);
    col.appendChild(btn);

    lane.appendChild(col);
  });
}

// PIT ACTION
function pitAction(rowIndex) {
  if (teams.length === 0) return alert("No teams");

  const choice = prompt(
    "Enter kart number of team entering pits:\n" +
    teams.map(t => t.kart).join(", ")
  );

  const team = teams.find(t => t.kart === choice);
  if (!team) return alert("Invalid kart");

  const row = pitRows[rowIndex];

  // Team takes first kart
  const takenKart = row.shift();

  // Place team's current kart at back
  row.push({
    color: team.color,
    kart: team.kart
  });

  // Team inherits taken kart color
  team.color = takenKart.color;

  renderTeams();
  renderPitLane();
}

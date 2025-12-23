let teams = [];
let teamHistory = {};
let teamCurrentKart = {};
let selectedTeam = null;

let pitRows = [];
let kartIdCounter = 1;

const colors = ["blue", "red", "orange", "yellow", "green", "purple"];

function addTeam() {
  const name = document.getElementById("teamNameInput").value.trim();
  const number = document.getElementById("teamNumberInput").value.trim();

  if (!name || !number) {
    alert("Enter both team name and number");
    return;
  }

  teams.push({ name, number });
  document.getElementById("teamNameInput").value = "";
  document.getElementById("teamNumberInput").value = "";
  renderTeamSetup();
}

function removeTeam(index) {
  teams.splice(index, 1);
  renderTeamSetup();
}

function renderTeamSetup() {
  const list = document.getElementById("teamSetupList");
  list.innerHTML = "";

  teams.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "setup-team";
    div.innerHTML = `${t.name} (#${t.number}) <span class="remove" onclick="removeTeam(${i})">✖</span>`;
    list.appendChild(div);
  });
}

function initialize() {
  teamHistory = {};
  teamCurrentKart = {};
  pitRows = [];
  kartIdCounter = 1;
  selectedTeam = null;

  teams.forEach(t => {
    teamHistory[t.name] = [];
    teamCurrentKart[t.name] = null;
  });

  const rowCount = parseInt(document.getElementById("rowCount").value);
  const kartsPerRow = parseInt(document.getElementById("kartsPerRow").value);

  for (let r = 0; r < rowCount; r++) {
    let row = [];
    for (let k = 0; k < kartsPerRow; k++) {
      row.push({ id: kartIdCounter++, color: "blue" });
    }
    pitRows.push(row);
  }

  document.getElementById("main").classList.remove("hidden");
  render();
}

function render() {
  renderTeams();
  renderPits();
  renderHistory();
}

function renderTeams() {
  const list = document.getElementById("teamList");
  list.innerHTML = "";

  teams.forEach(t => {
    const div = document.createElement("div");
    div.className = "team" + (selectedTeam === t.name ? " active" : "");
    div.textContent = `${t.name} (#${t.number})`;
    div.onclick = () => {
      selectedTeam = t.name;
      render();
    };
    list.appendChild(div);
  });
}

function renderPits() {
  const pitLane = document.getElementById("pitLane");
  pitLane.innerHTML = "";

  const container = document.createElement("div");
  container.className = "pit-container";

  pitRows.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "pit-row";

    row.forEach(kart => {
      const div = document.createElement("div");
      div.className = `kart ${kart.color}`;
      div.textContent = kart.id;
      div.onclick = () => cycleColor(kart);
      rowDiv.appendChild(div);
    });

    const plus = document.createElement("div");
    plus.className = "plus";
    plus.textContent = "+";
    plus.onclick = () => pitAction(rowIndex);
    rowDiv.appendChild(plus);

    container.appendChild(rowDiv);
  });

  pitLane.appendChild(container);
}

function cycleColor(kart) {
  kart.color = colors[(colors.indexOf(kart.color) + 1) % colors.length];
  render();
}

function pitAction(rowIndex) {
  if (!selectedTeam) {
    alert("Select a team first");
    return;
  }

  const row = pitRows[rowIndex];
  const takenKart = row.shift();

  if (teamCurrentKart[selectedTeam]) {
    row.push(teamCurrentKart[selectedTeam]);
  }

  teamCurrentKart[selectedTeam] = takenKart;
  teamHistory[selectedTeam].push(takenKart);
  render();
}

function renderHistory() {
  const title = document.getElementById("historyTitle");
  const content = document.getElementById("historyContent");

  if (!selectedTeam) {
    title.textContent = "Team History";
    content.textContent = "Select a team";
    return;
  }

  title.textContent = `History – ${selectedTeam}`;
  content.innerHTML = "";

  const container = document.createElement("div");
  container.className = "history-karts";

  teamHistory[selectedTeam].forEach(kart => {
    const div = document.createElement("div");
    div.className = `kart ${kart.color}`;
    div.textContent = kart.id;
    container.appendChild(div);
  });

  content.appendChild(container);
}


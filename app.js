let teams = [];
let teamHistory = {};
let teamCurrentKart = {};
let selectedTeam = null;

let pitRows = [];
let kartIdCounter = 1;

const colors = ["blue", "red", "orange", "yellow", "green", "purple"];

function initialize() {
  teams = [];
  teamHistory = {};
  teamCurrentKart = {};
  pitRows = [];
  kartIdCounter = 1;
  selectedTeam = null;

  const teamLines = document.getElementById("teamsInput").value.split("\n");
  teamLines.forEach(line => {
    if (!line.trim()) return;
    const [name, number] = line.split("|").map(s => s.trim());
    teams.push({ name, number });
    teamHistory[name] = [];
    teamCurrentKart[name] = null;
  });

  const rowCount = parseInt(document.getElementById("rowCount").value);
  const kartsPerRow = parseInt(document.getElementById("kartsPerRow").value);

  for (let r = 0; r < rowCount; r++) {
    let row = [];
    for (let k = 0; k < kartsPerRow; k++) {
      row.push(createKart());
    }
    pitRows.push(row);
  }

  document.getElementById("main").classList.remove("hidden");
  render();
}

function createKart() {
  return {
    id: kartIdCounter++,
    color: "blue"
  };
}

function render() {
  renderTeams();
  renderPits();
  renderHistory();
}

function renderTeams() {
  const list = document.getElementById("teamList");
  list.innerHTML = "";

  teams.forEach(team => {
    const div = document.createElement("div");
    div.className = "team" + (selectedTeam === team.name ? " active" : "");
    div.textContent = `${team.name} (#${team.number})`;
    div.onclick = () => {
      selectedTeam = team.name;
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
      const kartDiv = document.createElement("div");
      kartDiv.className = `kart ${kart.color}`;
      kartDiv.textContent = kart.id;
      kartDiv.onclick = () => changeKartColor(kart);
      rowDiv.appendChild(kartDiv);
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

function changeKartColor(kart) {
  const next = (colors.indexOf(kart.color) + 1) % colors.length;
  kart.color = colors[next];
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

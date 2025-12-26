document.addEventListener("DOMContentLoaded", () => {

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

  // Populate kart number dropdown
  const kartSelect = document.getElementById("teamKart");
  for (let i = 1; i <= 50; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    kartSelect.appendChild(opt);
  }

  // BUTTON REFERENCES
  document.getElementById("addTeamBtn").onclick = addTeam;
  document.getElementById("buildPitBtn").onclick = setupPitLane;

  function addTeam() {
    const name = document.getElementById("teamName").value.trim();
    const kart = document.getElementById("teamKart").value;

    if (!name) {
      alert("Please enter a team name");
      return;
    }

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

    teams.forEach(team => {
      const div = document.createElement("div");
      div.className = "team";
      div.style.backgroundColor = colors[team.color];
      div.textContent = `${team.name} – Kart ${team.kart}`;
      list.appendChild(div);
    });
  }

  function setupPitLane() {
    const rows = Number(document.getElementById("rowCount").value);
    const perRow = Number(document.getElementById("kartsPerRow").value);

    if (!rows || !perRow) {
      alert("Enter rows and karts per row");
      return;
    }

    pitRows = [];

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let k = 0; k < perRow; k++) {
        row.push({ color: "blue", kart: "" });
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
        div.style.backgroundColor = colors[k.color];
        div.textContent = k.kart;
        col.appendChild(div);
      });

      const btn = document.createElement("button");
      btn.textContent = "+";
      btn.onclick = () => pitAction(rowIndex);
      col.appendChild(btn);

      lane.appendChild(col);
    });
  }

  function pitAction(rowIndex) {
    if (teams.length === 0) {
      alert("No teams available");
      return;
    }

    const kartNumbers = teams.map(t => t.kart).join(", ");
    const chosenKart = prompt(
      `Enter kart number of team entering pits:\n${kartNumbers}`
    );

    const team = teams.find(t => t.kart === chosenKart);
    if (!team) {
      alert("Invalid kart number");
      return;
    }

    const row = pitRows[rowIndex];

    const takenKart = row.shift();

    row.push({
      color: team.color,
      kart: team.kart
    });

    team.color = takenKart.color;

    renderTeams();
    renderPitLane();
  }

});


// GLOBAL STATE
var teams = [];
var pitRows = [];

function addTeam() {
  alert("Add Team clicked");

  var name = document.getElementById("teamName").value;
  var kart = document.getElementById("teamKart").value;

  if (!name) {
    alert("No team name");
    return;
  }

  teams.push({
    name: name,
    kart: kart,
    color: "blue"
  });

  renderTeams();
}

function renderTeams() {
  var list = document.getElementById("teamList");
  list.innerHTML = "";

  teams.forEach(function(team) {
    var div = document.createElement("div");
    div.className = "team";
    div.innerText = team.name + " – Kart " + team.kart;
    list.appendChild(div);
  });
}

function setupPitLane() {
  alert("Build Pit Lane clicked");

  var rows = Number(document.getElementById("rowCount").value);
  var perRow = Number(document.getElementById("kartsPerRow").value);

  pitRows = [];

  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var k = 0; k < perRow; k++) {
      row.push({ kart: "", color: "blue" });
    }
    pitRows.push(row);
  }

  renderPitLane();
}

function renderPitLane() {
  var lane = document.getElementById("pitLane");
  lane.innerHTML = "";

  pitRows.forEach(function(row, rowIndex) {
    var col = document.createElement("div");
    col.className = "row";

    row.forEach(function(k) {
      var div = document.createElement("div");
      div.className = "kart";
      div.innerText = k.kart;
      col.appendChild(div);
    });

    var btn = document.createElement("button");
    btn.innerText = "+";
    btn.onclick = function() {
      pitAction(rowIndex);
    };
    col.appendChild(btn);

    lane.appendChild(col);
  });
}

function pitAction(rowIndex) {
  alert("Plus pressed on row " + (rowIndex + 1));

  if (teams.length === 0) {
    alert("No teams added");
    return;
  }

  var team = teams[0]; // simple test behavior

  var row = pitRows[rowIndex];
  row.shift();
  row.push({ kart: team.kart, color: "blue" });

  renderPitLane();
}

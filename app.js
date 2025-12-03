let manualKartColors = {}; 
let pitData = [];

document.getElementById("generateBtn").onclick = generatePit;
document.getElementById("addKartBtn").onclick = addKartToList;

/* Generate pit layout */
function generatePit() {
    const rows = parseInt(document.getElementById("rowsInput").value);
    const slots = parseInt(document.getElementById("slotsInput").value);

    pitData = Array.from({ length: rows }, () =>
        Array.from({ length: slots }, () => null)
    );

    renderPit();
}

/* Add manual kart color */
function addKartToList() {
    const num = document.getElementById("kartNumberInput").value;
    const color = document.getElementById("kartColorInput").value;

    if (!num) return;

    manualKartColors[num] = color;
    renderKartList();
}

/* Render manual kart list */
function renderKartList() {
    const div = document.getElementById("kartListDisplay");
    div.innerHTML = "";

    for (let kart in manualKartColors) {
        const row = document.createElement("div");
        row.className = "kart-entry";

        const label = document.createElement("span");
        label.innerText = `Kart ${kart}`;

        const colBox = document.createElement("div");
        colBox.className = "kart-color-box";
        colBox.style.background = manualKartColors[kart];

        row.appendChild(label);
        row.appendChild(colBox);
        div.appendChild(row);
    }
}

/* Render pits */
function renderPit() {
    const pitDiv = document.getElementById("pitRows");
    pitDiv.innerHTML = "";

    pitData.forEach((row, rowIndex) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "pit-row";

        const title = document.createElement("div");
        title.className = "pit-title";
        title.innerText = `Row ${rowIndex + 1}`;
        rowDiv.appendChild(title);

        const slotsDiv = document.createElement("div");
        slotsDiv.className = "slot-container";

        row.forEach(kart => {
            const slot = document.createElement("div");
            slot.className = "kart-slot";

            if (kart !== null) {
                slot.innerText = kart.number;

                const color = manualKartColors[kart.number] || "#555"; // gray if unknown
                slot.style.background = color;
            } else {
                slot.innerText = "-";
                slot.style.background = "#444";
            }

            slotsDiv.appendChild(slot);
        });

        rowDiv.appendChild(slotsDiv);

        const addBtn = document.createElement("button");
        addBtn.className = "add-btn";
        addBtn.innerText = "+ Add Kart";
        addBtn.onclick = () => insertKart(rowIndex);
        rowDiv.appendChild(addBtn);

        pitDiv.appendChild(rowDiv);
    });
}

/* Insert kart into row and shift */
function insertKart(rowIndex) {
    const kartNum = prompt("Enter kart number:");

    if (!kartNum) return;

    const kartObj = {
        number: kartNum,
        color: manualKartColors[kartNum] || null
    };

    // Shift row
    pitData[rowIndex].shift();         
    pitData[rowIndex].push(kartObj);   

    renderPit();
}

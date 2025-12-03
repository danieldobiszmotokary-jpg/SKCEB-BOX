// Manual pit - prefilled karts version
// Behavior:
// - Pit rows are prefilled with placeholder karts U1..UN with default color (blue).
// - You can add manual kart colors (kart number -> color).
// - Press + on a column: prompt for kart number, shift that column (remove first), push new kart (with number) to end.
// - If a pushed kart number has a manual color, it is shown; otherwise the default placeholder color is used.

const rowsInput = document.getElementById('rowsInput');
const slotsInput = document.getElementById('slotsInput');
const generateBtn = document.getElementById('generateBtn');
const addKartBtn = document.getElementById('addKartBtn');
const kartNumberInput = document.getElementById('kartNumberInput');
const kartColorInput = document.getElementById('kartColorInput');
const statusEl = document.getElementById('status');
const pitRowsEl = document.getElementById('pitRows');
const kartListDisplay = document.getElementById('kartListDisplay');

let manualKartColors = {}; // '12' -> '#ff0000'
let pitData = []; // pitData[rowIndex] = [ slotObj, ... ]
const DEFAULT_PLACEHOLDER_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--unknown-gray').trim() || '#2b6cb0';

generateBtn.addEventListener('click', generatePit);
addKartBtn.addEventListener('click', addKartToList);

// initial
generatePit();

function setStatus(s){ statusEl.textContent = s; }

function generatePit(){
  const rows = Math.max(1, parseInt(rowsInput.value) || 1);
  const slots = Math.max(1, parseInt(slotsInput.value) || 1);

  pitData = [];
  let uid = 1;
  for(let r=0;r<rows;r++){
    const row = [];
    for(let s=0;s<slots;s++){
      // placeholder physical kart
      row.push({
        id: `U${uid++}`,   // unique physical kart id
        number: null,     // not assigned to a team yet
        color: DEFAULT_PLACEHOLDER_COLOR
      });
    }
    pitData.push(row);
  }
  renderAll();
  setStatus(`Created ${rows} rows × ${slots} slots (placeholders prefilled)`);
}

function addKartToList(){
  const num = (kartNumberInput.value || '').trim();
  const color = kartColorInput.value;
  if(!num){
    alert('Enter kart number');
    return;
  }
  manualKartColors[num] = color;
  renderKartList();
  renderAll(); // update any slots showing that kart number
  setStatus(`Kart ${num} color saved`);
}

function renderKartList(){
  kartListDisplay.innerHTML = '';
  const keys = Object.keys(manualKartColors).sort((a,b)=> +a - +b);
  if(keys.length === 0){
    kartListDisplay.innerHTML = '<div style="color:var(--muted)">No manual karts yet</div>';
    return;
  }
  keys.forEach(k=>{
    const entry = document.createElement('div'); entry.className = 'kart-entry';
    const label = document.createElement('div'); label.className = 'label'; label.textContent = `Kart ${k}`;
    const sw = document.createElement('div'); sw.className = 'swatch'; sw.style.background = manualKartColors[k];
    entry.appendChild(label); entry.appendChild(sw);
    kartListDisplay.appendChild(entry);
  });
}

function renderAll(){
  renderPit();
  renderKartList();
}

function renderPit(){
  pitRowsEl.innerHTML = '';
  pitData.forEach((row, rIdx)=>{
    const col = document.createElement('div'); col.className = 'pit-column';
    const title = document.createElement('div'); title.className = 'col-title'; title.textContent = `Row ${rIdx+1}`;
    col.appendChild(title);

    row.forEach(slot=>{
      const slotEl = document.createElement('div'); slotEl.className = 'kart-slot';
      if(slot.number){
        slotEl.textContent = slot.number;
        const color = manualKartColors[slot.number] || slot.color || DEFAULT_PLACEHOLDER_COLOR;
        slotEl.style.background = color;
        // choose text color based on bg
        slotEl.style.color = getContrastColor(color);
      } else {
        slotEl.textContent = slot.id; // show placeholder id
        slotEl.style.background = slot.color || DEFAULT_PLACEHOLDER_COLOR;
        slotEl.classList.add('empty');
        slotEl.style.color = '#fff';
      }
      col.appendChild(slotEl);
    });

    const addBtn = document.createElement('button'); addBtn.className = 'col-add-btn'; addBtn.textContent = '+ Add Kart (enter team number)';
    addBtn.onclick = ()=> onAddClick(rIdx);
    col.appendChild(addBtn);
    pitRowsEl.appendChild(col);
  });
}

function onAddClick(rowIndex){
  const kartNum = prompt('Enter kart number (team number) to add:');
  if(kartNum === null) return;
  const num = kartNum.trim();
  if(!num) return;

  // create a new kart object using manual color if available; otherwise use default placeholder blue
  const newSlot = {
    id: `K${num}-${Date.now()}`,
    number: num,
    color: manualKartColors[num] || DEFAULT_PLACEHOLDER_COLOR
  };

  // shift: remove first element, push new to bottom
  pitData[rowIndex].shift();
  pitData[rowIndex].push(newSlot);

  renderAll();
  setStatus(`Inserted kart ${num} into Row ${rowIndex+1}`);
}

/* contrast color helper */
function getContrastColor(bg){
  if(!bg) return '#fff';
  if(bg.startsWith('var(')) return '#fff';
  try{
    let c = bg.replace('#','');
    if(c.length === 3) c = c.split('').map(ch=>ch+ch).join('');
    const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
    const yiq = (r*299 + g*587 + b*114)/1000;
    return (yiq >= 160) ? '#111' : '#fff';
  }catch(e){
    return '#fff';
  }
}

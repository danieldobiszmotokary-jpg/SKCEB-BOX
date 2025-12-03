/* Manual Pit Lane — squares layout
   - Rows are horizontal (pit columns)
   - Each column stacks kart squares vertically
   - Manual kart list with colors
   - Insert (shift) behavior: shift up (remove first), push new kart to bottom
   - Unknown kart => gray background
*/

const rowsInput = document.getElementById('rowsInput');
const slotsInput = document.getElementById('slotsInput');
const generateBtn = document.getElementById('generateBtn');
const addKartBtn = document.getElementById('addKartBtn');
const kartNumberInput = document.getElementById('kartNumberInput');
const kartColorInput = document.getElementById('kartColorInput');
const statusEl = document.getElementById('status');

let manualKartColors = {}; // map 'kartNumber' -> color string
let pitData = []; // array of rows: pitData[rowIndex] = [ slotObj or null, ... ]

// wire buttons
generateBtn.addEventListener('click', generatePit);
addKartBtn.addEventListener('click', addKartToList);

// initial generate
generatePit();

function setStatus(s){
  statusEl.textContent = s;
}

/* Generate pit layout with given rows & slots */
function generatePit(){
  const rows = Math.max(1, parseInt(rowsInput.value) || 1);
  const slots = Math.max(1, parseInt(slotsInput.value) || 1);

  pitData = [];
  for(let r=0;r<rows;r++){
    const row = [];
    for(let s=0;s<slots;s++){
      row.push(null); // empty slot
    }
    pitData.push(row);
  }
  renderPit();
  renderKartList();
  setStatus(`Created ${rows} rows × ${slots} slots`);
}

/* Add or update manual kart color */
function addKartToList(){
  const num = (kartNumberInput.value || '').trim();
  const color = kartColorInput.value;
  if(!num){
    alert('Enter kart number');
    return;
  }
  manualKartColors[num] = color;
  renderKartList();
  setStatus(`Kart ${num} color saved`);
}

/* Render manual kart list */
function renderKartList(){
  const display = document.getElementById('kartListDisplay');
  display.innerHTML = '';
  const keys = Object.keys(manualKartColors).sort((a,b)=> +a - +b);
  if(keys.length === 0){
    display.innerHTML = '<div style="color:var(--muted)">No manual karts yet</div>';
    return;
  }
  keys.forEach(k => {
    const entry = document.createElement('div');
    entry.className = 'kart-entry';
    const label = document.createElement('div'); label.className='label'; label.textContent = `Kart ${k}`;
    const sw = document.createElement('div'); sw.className='swatch'; sw.style.background = manualKartColors[k];
    entry.appendChild(label); entry.appendChild(sw);
    display.appendChild(entry);
  });
}

/* Render pit columns (rows horizontally) */
function renderPit(){
  const container = document.getElementById('pitRows');
  container.innerHTML = '';

  pitData.forEach((row, rIdx) => {
    const col = document.createElement('div');
    col.className = 'pit-column';

    const title = document.createElement('div');
    title.className = 'col-title';
    title.textContent = `Row ${rIdx + 1}`;
    col.appendChild(title);

    // slots: stack vertically top->bottom (first = top)
    row.forEach((slot, sIdx) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'kart-slot';

      if(slot && slot.number){
        slotEl.textContent = slot.number;
        // color from manual list or gray if unknown
        const color = manualKartColors[slot.number] || 'var(--unknown-gray)';
        slotEl.style.background = color;
        // choose text color contrast (dark text for bright colors)
        slotEl.style.color = getContrastColor(color);
      } else {
        slotEl.textContent = '-';
        slotEl.style.background = 'var(--slot-gray)';
        slotEl.style.color = '#fff';
      }

      col.appendChild(slotEl);
    });

    // add button under column
    const addBtn = document.createElement('button');
    addBtn.className = 'col-add-btn';
    addBtn.textContent = '+ Add Kart (team enters this row)';
    addBtn.onclick = () => onAddClick(rIdx);
    col.appendChild(addBtn);

    container.appendChild(col);
  });
}

/* Called when user presses + for a row */
function onAddClick(rowIndex){
  const kartNum = prompt('Enter kart number to add (this will be pushed into the row):');
  if(kartNum === null) return; // cancel
  const num = kartNum.trim();
  if(!num) return;

  // create slot object
  const slotObj = { number: num };

  // shift: remove first element, push new to bottom
  pitData[rowIndex].shift();
  pitData[rowIndex].push(slotObj);

  renderPit();
  setStatus(`Inserted kart ${num} into row ${rowIndex+1}`);
}

/* helper: choose readable text color depending on background */
function getContrastColor(bg){
  // if bg is a CSS variable name
  if(bg.startsWith('var(')) return '#fff';
  // parse hex
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

/* initialize with default */
generatePit();


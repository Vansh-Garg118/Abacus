const beads = [0, 0, 0, 0, 0];
const maxBeads = 9;
const abacus = document.getElementById('abacus');
const targetEl = document.getElementById('targetNumber');
const currentEl = document.getElementById('currentValue');
const statusEl = document.getElementById('statusMessage');
const newQuestionBtn = document.getElementById('newQuestionBtn');
const setCustomBtn = document.getElementById('setCustomBtn');
const customInput = document.getElementById('customNumber');
const toggleSetDropdown = document.getElementById('toggleSetDropdown');
const setDropdown = document.getElementById('setDropdown');
const sound=document.getElementById('successSound')

let targetNumber = 0;

function createRods() {
    const labels = ['T-Th', 'Th', 'H', 'T', 'U'];
    abacus.innerHTML = '';

    for (let i = 0; i < beads.length; i++) {
        const rod = document.createElement('div');
        rod.className = 'flex flex-col items-center w-16 sm:w-20';


        const label = document.createElement('div');
        label.className = 'font-semibold text-sm sm:text-base mb-2 text-center';
        label.textContent = labels[i];

        const controls = document.createElement('div');
        controls.className = 'flex space-x-1 mb-3';
        controls.innerHTML = `
            <button data-index="${i}" data-action="decrement"
                class="w-5 h-5 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 text-white text-base rounded-full shadow-md">
                &minus;
            </button>
            <button data-index="${i}" data-action="increment"
                class="w-5 h-5 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md">
                &#43;
            </button>
        `;

        const stickContainer = document.createElement('div');
        stickContainer.className = 'rod-stick';
        stickContainer.id = `rod-${i}`;

        rod.appendChild(label);
        rod.appendChild(controls);
        rod.appendChild(stickContainer);
        abacus.appendChild(rod);
    }
}

function renderRod(index) {
    const rodEl = document.getElementById(`rod-${index}`);
    rodEl.innerHTML = '';
    const spacing = 25;
    const beadColors = ['#3b82f6', '#a855f7', '#06b6d4', '#6366f1', '#f472b6'];

    // const beadColors = ['#0ff', '#ff0', '#ff5df0', '#00ff87', '#ff7b00'];
    // const beadColors = ['#8b5e3c', '#c4a484', '#6b705c', '#a98467', '#b5a98f'];
    // const beadColors = ['#a5b4fc', '#f9a8d4', '#fde68a', '#b5f5ec', '#d8b4fe'];

    for (let b = 0; b < beads[index]; b++) {
        const bead = document.createElement('div');
        bead.className = 'bead';
        bead.style.top = `${220 - (b * spacing + 4)}px`;
        bead.style.color = beadColors[index];
        rodEl.appendChild(bead);
    }
}

function renderAllRods() {
    beads.forEach((_, i) => renderRod(i));
}

function playCelerationSound(){
    sound.currentTime = 0;  
    sound.play();
}

function updateDisplay() {
    const value = beads.reduce((sum, val, i) => sum + val * Math.pow(10, beads.length - 1 - i), 0);
    currentEl.textContent = value;
    if (value === targetNumber) {
        statusEl.textContent = '🎉 You matched the number!';
        statusEl.classList.replace('text-gray-300', 'text-green-400');
        statusEl.classList.add('font-semibold');
        showWinStars();
        playCelerationSound();h
    } else {
        statusEl.textContent = 'Keep adjusting the beads.';
        statusEl.classList.replace('text-green-400', 'text-gray-300');
        statusEl.classList.replace('text-red-500', 'text-gray-300');
        statusEl.classList.remove('font-semibold');
    }
}

function showWinStars() {
    const container = document.getElementById('star-container');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '⭐';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 80 + 10}%`;
        star.style.fontSize = `${Math.random() * 1 + 1.2}rem`;
        container.appendChild(star);
        setTimeout(() => star.remove(), 5000);
    }
}


// function for implementing carry and other similar task
// Input index of beeds, delta (1 for increment  and -1 for decrement), and boolean f (for optimization) defaukt value false
// First check for delta whether increment or decrement
// check if it overflow or underflow
// if overflow check the at other indices 
// if it found any index with suitable condition it return and pass f as true by which in recurssion for loop calls reduces

function changeBead(index, delta, f = false) {
    if (delta === 1) {
        if (beads[index] + 1 > maxBeads) {
            if (!f) {
                let flag = false;
                for (let idx = index - 1; idx >= 0; idx--) {
                    if (beads[idx] != maxBeads) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    beads[index] = 0;
                    changeBead(index - 1, 1, true);
                }
            } else {
                beads[index] = 0;
                changeBead(index - 1, 1, true);
            }
        } else {
            beads[index] += 1;
        }
    } else if (delta === -1) {
        if (beads[index] - 1 < 0) {
            if (!f) {
                let flag = false;
                for (let idx = index - 1; idx >= 0; idx--) {
                    if (beads[idx] > 0) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    beads[index] = maxBeads;
                    changeBead(index - 1, -1, true);
                }
            } else {
                beads[index] = maxBeads;
                changeBead(index - 1, -1, true);
            }
        } else {
            beads[index] -= 1;
        }
    }

    renderAllRods();
    updateDisplay();
}

function newQuestion() {
    beads.fill(0);
    renderAllRods();
    targetNumber = Math.floor(Math.random() * 100000);
    targetEl.textContent = targetNumber;
    updateDisplay();
}

function setCustomNumber() {
    const val = parseInt(customInput.value, 10);
    if (isNaN(val) || val < 0 || val > 99999) {
        statusEl.textContent = 'Enter a valid number (0-99999)';
        statusEl.classList.replace('text-gray-300', 'text-red-500');
        statusEl.classList.replace('text-green-400', 'text-red-500');
        statusEl.classList.add('font-semibold');
        return;
    }
    beads.fill(0);
    renderAllRods();
    targetNumber = val;
    targetEl.textContent = targetNumber;
    updateDisplay();
    customInput.value = '';
    setDropdown.classList.add('hidden');
}

abacus.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    changeBead(+btn.dataset.index, btn.dataset.action === 'increment' ? 1 : -1);
});

toggleSetDropdown.addEventListener('click', () => {
    setDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!toggleSetDropdown.contains(e.target) && !setDropdown.contains(e.target)) {
        setDropdown.classList.add('hidden');
    }
});

setCustomBtn.addEventListener('click', setCustomNumber);
newQuestionBtn.addEventListener('click', newQuestion);


// load all roads and generate new number at starting
createRods();
newQuestion();
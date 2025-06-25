// app.js

const corkBoard = document.getElementById('corkBoard');
const detailPanel = document.getElementById('detailPanel');
const detailedContent = document.getElementById('detailedContent');
const boardButtons = document.querySelectorAll('.board-btn');
const instructionText = document.querySelector('.instruction-text');
const linkSvg = document.getElementById('linkSvg'); // Get the SVG element

// Global variable to keep track of the currently loaded board's links
let currentBoardLinks = [];

// --- Helper function to get the absolute center of a note's pushpin (the red circle) ---
function getPushpinCenter(noteElement) {
    const noteRect = noteElement.getBoundingClientRect();
    const corkBoardRect = corkBoard.getBoundingClientRect();

    // The pushpin is relative to the note's top-left corner
    // It's a circle with width/height 18px, centered horizontally at 50%
    const pinDiameter = 18; // From your CSS .note::before
    const pinCenterX = noteRect.left + (noteRect.width / 2);
    const pinCenterY = noteRect.top + (pinDiameter / 2); // It's at top: -10px, so 10px above the note top, plus half its diameter

    // Return coordinates relative to the corkBoard's top-left
    return {
        x: pinCenterX - corkBoardRect.left,
        y: pinCenterY - corkBoardRect.top
    };
}

// --- Function to draw all lines for the current board ---
function drawLinks() {
    linkSvg.innerHTML = ''; // Clear existing lines

    currentBoardLinks.forEach(link => {
        const fromNote = document.getElementById(link.from);
        const toNote = document.getElementById(link.to);

        if (fromNote && toNote) { // Ensure both notes exist on the board
            const fromPin = getPushpinCenter(fromNote);
            const toPin = getPushpinCenter(toNote);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromPin.x);
            line.setAttribute('y1', fromPin.y);
            line.setAttribute('x2', toPin.x);
            line.setAttribute('y2', toPin.y);
            line.setAttribute('class', 'link-line'); // Apply CSS class for styling

            linkSvg.appendChild(line);
        }
    });
}

// --- Function to update links (called after a drag ends or on board load) ---
function updateLinks() {
    // Debounce this function if it's called very frequently during drag
    // For now, calling it on dragEnd is sufficient
    drawLinks();
}


// --- Board Loading Function ---
function loadBoard(boardName) {
    corkBoard.innerHTML = ''; // Clear current notes (and old SVG if it was inside)
    linkSvg.innerHTML = ''; // Ensure SVG lines are cleared before re-drawing
    corkBoard.appendChild(linkSvg); // Re-append SVG after clearing corkBoard notes

    detailedContent.innerHTML = ''; // Clear detailed content
    instructionText.style.display = 'block'; // Show instructions again

    const notes = boardsData[boardName];
    currentBoardLinks = boardLinks[boardName] || []; // Set the links for the current board

    // Sort notes by z-index or a custom property if you want notes on top of lines
    // For now, the SVG z-index handles lines being under notes
    notes.forEach(noteData => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.id = noteData.id;
        noteDiv.setAttribute('data-detailed-info', noteData.detailed || 'No detailed information available.');
        noteDiv.setAttribute('data-mechanics-info', noteData.mechanicsInfo || 'No mechanics information available.');
        noteDiv.setAttribute('data-title', noteData.title);

        // Temporarily append to DOM to get dimensions for random positioning
        // Insert notes *after* the SVG so they render on top
        corkBoard.appendChild(noteDiv);

        const noteRect = noteDiv.getBoundingClientRect();
        const randomPos = getRandomPosition(noteRect.width, noteRect.height);

        noteDiv.style.top = randomPos.top + 'px';
        noteDiv.style.left = randomPos.left + 'px';
        noteDiv.style.transform = `rotate(${getRandomRotation()}deg)`;

        noteDiv.innerHTML = `
            <div class="note-header">${noteData.title}</div>
            <div class="note-body">
                <p>${noteData.brief}</p>
            </div>
            <div class="note-signature">${noteData.signature}</div>
            <div class="note-buttons">
                <button class="info-btn" data-info-type="detailed">More Info</button>
                <button class="info-btn" data-info-type="mechanics">Mechanics</button>
            </div>
        `;

        // Re-attach drag listeners to new notes
        noteDiv.addEventListener('mousedown', dragStart);
        noteDiv.addEventListener('touchstart', dragStartTouch, { passive: false });

        // Re-attach info button listeners
        noteDiv.querySelectorAll('.info-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const note = this.closest('.note');
                const title = note.dataset.title || 'No Title';
                const infoType = this.dataset.infoType;

                let infoContent = '';
                if (infoType === 'detailed') {
                    infoContent = note.dataset.detailedInfo;
                } else if (infoType === 'mechanics') {
                    infoContent = note.dataset.mechanicsInfo;
                } else {
                    infoContent = 'No information available for this type.';
                }

                detailedContent.innerHTML = `
                    <h2>${title}</h2>
                    <div class="pre-formatted-text">${infoContent}</div>
                `;
                instructionText.style.display = 'none';
            });
        });
    });

    // After all notes are loaded, draw the links
    drawLinks();
}

// --- Initial Load ---
loadBoard('board1'); // Load the first board by default

// --- Menu Button Event Listeners ---
boardButtons.forEach(button => {
    button.addEventListener('click', function() {
        boardButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        loadBoard(this.dataset.board);
    });
});
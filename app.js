// app.js
const corkBoard = document.getElementById('corkBoard');
const detailPanel = document.getElementById('detailPanel');
const detailedContent = document.getElementById('detailedContent');
const boardButtons = document.querySelectorAll('.board-btn');
const instructionText = document.querySelector('.instruction-text');

// --- Board Loading Function ---
function loadBoard(boardName) {
    corkBoard.innerHTML = ''; // Clear current notes
    detailedContent.innerHTML = ''; // Clear detailed content
    instructionText.style.display = 'block'; // Show instructions again

    const notes = boardsData[boardName];
    notes.forEach(noteData => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.id = noteData.id;
        noteDiv.setAttribute('data-title', noteData.title);
        noteDiv.setAttribute('data-detailed-info', noteData.detailed);

        // Append to DOM temporarily to get its dimensions
        corkBoard.appendChild(noteDiv);

        // Get the note's calculated width and height
        const noteRect = noteDiv.getBoundingClientRect();
        const randomPos = getRandomPosition(noteRect.width, noteRect.height);

        // Apply calculated position and rotation
        noteDiv.style.top = randomPos.top + 'px';
        noteDiv.style.left = randomPos.left + 'px';
        noteDiv.style.transform = `rotate(${getRandomRotation()}deg)`;

        noteDiv.innerHTML = `
            <div class="note-header">${noteData.title}</div>
            <div class="note-body">
                <p>${noteData.brief}</p>
            </div>
            <div class="note-signature">${noteData.signature}</div>
            <button class="more-info-btn">More Info</button>
        `;

        // Re-attach drag listeners to new notes
        noteDiv.addEventListener('mousedown', dragStart);
        noteDiv.addEventListener('touchstart', dragStartTouch, { passive: false });

        // Re-attach more info button listeners
        noteDiv.querySelector('.more-info-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            const note = this.closest('.note');
            const title = note.dataset.title || 'No Title';
            const detailedInfo = note.dataset.detailedInfo || 'No detailed information available.';

            detailedContent.innerHTML = `
                <h2>${title}</h2>
                <p>${detailedInfo}</p>
            `;
            instructionText.style.display = 'none'; // Hide instructions once content is displayed
        });
    });
}

// --- Initial Load ---
loadBoard('board1'); // Load the first board by default

// --- Menu Button Event Listeners ---
boardButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        boardButtons.forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to the clicked button
        this.classList.add('active');
        loadBoard(this.dataset.board); // Load the selected board
    });
});
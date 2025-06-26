// drag.js
// Make sure activeNote and initialX, initialY are still declared at the top if they are not global.
// (They are global in your current app, so this is fine.)
let activeNote = null;
let initialX, initialY;

// Event listeners for dragging
document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag);
document.addEventListener('touchend', dragEndTouch);
document.addEventListener('touchmove', dragTouch, { passive: false });

function dragStart(e) {
    // Only allow drag if it's not the more info or mechanics button
    if (e.target.classList.contains('info-btn')) {
        return; // Do not start drag if button is clicked
    }

    if (e.target.classList.contains('note') || e.target.closest('.note-body') || e.target.closest('.note-header') || e.target.closest('.note-signature')) {
        activeNote = e.target.closest('.note');
        initialX = e.clientX - activeNote.offsetLeft;
        initialY = e.clientY - activeNote.offsetTop;
        activeNote.style.zIndex = "1000";
    }
}

function dragEnd() {
    if (activeNote) {
        maxZIndex++; // Increment the global z-index counter
        activeNote.style.zIndex = maxZIndex; // Apply the new highest z-index
        // Ensure links are updated one last time when drag ends
        if (typeof updateLinks === 'function') {
            updateLinks();
        }
    }
    activeNote = null;
}

function drag(e) {
    if (activeNote) {
        e.preventDefault();
        let clientX = e.clientX;
        let clientY = e.clientY;

        const corkBoard = document.getElementById('corkBoard');
        const parentRect = corkBoard.getBoundingClientRect();
        const noteRect = activeNote.getBoundingClientRect();

        // Calculate the current position of the note's top-left corner
        let currentNoteLeft = clientX - initialX;
        let currentNoteTop = clientY - initialY;

        // Calculate the pushpin's center coordinates relative to the note's current top-left
        // (These are consistent regardless of note's position on corkboard)
        const pushpinCenterRelNoteX = noteRect.width / 2;
        const pushpinCenterRelNoteY = PUSHPIN_RADIUS + Math.abs(PUSHPIN_OFFSET_FROM_NOTE_TOP); // pin center is 9px + 10px below note's top line

        // Calculate the pushpin's current absolute center on the corkBoard
        let pushpinAbsX = currentNoteLeft + pushpinCenterRelNoteX;
        let pushpinAbsY = currentNoteTop + pushpinCenterRelNoteY;

        // Define the boundaries for the pushpin's center (relative to corkBoard)
        const minPinX = PUSHPIN_RADIUS; // Pin's left edge (x - radius) must be >= 0
        const maxPinX = parentRect.width - PUSHPIN_RADIUS; // Pin's right edge (x + radius) must be <= parent width
        const minPinY = PUSHPIN_RADIUS; // Pin's top edge (y - radius) must be >= 0
        const maxPinY = parentRect.height - PUSHPIN_RADIUS; // Pin's bottom edge (y + radius) must be <= parent height

        // Clamp the pushpin's absolute center within the corkBoard boundaries
        pushpinAbsX = Math.max(minPinX, Math.min(pushpinAbsX, maxPinX));
        pushpinAbsY = Math.max(minPinY, Math.min(pushpinAbsY, maxPinY));

        // Now, translate the clamped pushpin absolute position back to the note's top-left
        currentNoteLeft = pushpinAbsX - pushpinCenterRelNoteX;
        currentNoteTop = pushpinAbsY - pushpinCenterRelNoteY;

        activeNote.style.left = currentNoteLeft + 'px';
        activeNote.style.top = currentNoteTop + 'px';

        if (typeof updateLinks === 'function') {
            updateLinks();
        }
    }
}

function dragStartTouch(e) {
    if (e.target.classList.contains('info-btn')) {
        return;
    }

    if (e.target.classList.contains('note') || e.target.closest('.note-body') || e.target.closest('.note-header') || e.target.closest('.note-signature')) {
        e.preventDefault();
        activeNote = e.target.closest('.note');
        initialX = e.touches[0].clientX - activeNote.offsetLeft;
        initialY = e.touches[0].clientY - activeNote.offsetTop;
        activeNote.style.zIndex = "1000";
    }
}

function dragEndTouch() {
    if (activeNote) {
        maxZIndex++; // Increment the global z-index counter
        activeNote.style.zIndex = maxZIndex; // Apply the new highest z-index
        // Ensure links are updated one last time when touch drag ends
        if (typeof updateLinks === 'function') {
            updateLinks();
        }
    }
    activeNote = null;
}

function dragTouch(e) {
    if (activeNote) {
        e.preventDefault();
        let clientX = e.touches[0].clientX;
        let clientY = e.touches[0].clientY;

        const corkBoard = document.getElementById('corkBoard');
        const parentRect = corkBoard.getBoundingClientRect();
        const noteRect = activeNote.getBoundingClientRect(); // Get current dimensions for note's width/height

        // Calculate the current position of the note's top-left corner
        let currentNoteLeft = clientX - initialX;
        let currentNoteTop = clientY - initialY;

        // Calculate the pushpin's center coordinates relative to the note's current top-left
        const pushpinCenterRelNoteX = noteRect.width / 2;
        const pushpinCenterRelNoteY = PUSHPIN_RADIUS + Math.abs(PUSHPIN_OFFSET_FROM_NOTE_TOP);

        // Calculate the pushpin's current absolute center on the corkBoard
        let pushpinAbsX = currentNoteLeft + pushpinCenterRelNoteX;
        let pushpinAbsY = currentNoteTop + pushpinCenterRelNoteY;

        // Define the boundaries for the pushpin's center (relative to corkBoard)
        const minPinX = PUSHPIN_RADIUS;
        const maxPinX = parentRect.width - PUSHPIN_RADIUS;
        const minPinY = PUSHPIN_RADIUS;
        const maxPinY = parentRect.height - PUSHPin_RADIUS;

        // Clamp the pushpin's absolute center within the corkBoard boundaries
        pushpinAbsX = Math.max(minPinX, Math.min(pushpinAbsX, maxPinX));
        pushpinAbsY = Math.max(minPinY, Math.min(pushpinAbsY, maxPinY));

        // Now, translate the clamped pushpin absolute position back to the note's top-left
        currentNoteLeft = pushpinAbsX - pushpinCenterRelNoteX;
        currentNoteTop = pushpinAbsY - pushpinCenterRelNoteY;

        activeNote.style.left = currentNoteLeft + 'px';
        activeNote.style.top = currentNoteTop + 'px';

        if (typeof updateLinks === 'function') {
            updateLinks();
        }
    }
}
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
        activeNote.style.zIndex = "100";
    }
}

function dragEnd() {
    if (activeNote) {
        activeNote.style.zIndex = "10";
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
        let currentX = e.clientX - initialX;
        let currentY = e.clientY - initialY;

        const corkBoard = document.getElementById('corkBoard');
        const parentRect = corkBoard.getBoundingClientRect();
        const noteRect = activeNote.getBoundingClientRect();

        currentX = Math.max(0, Math.min(currentX, parentRect.width - noteRect.width));
        currentY = Math.max(0, Math.min(currentY, parentRect.height - noteRect.height));

        activeNote.style.left = currentX + 'px';
        activeNote.style.top = currentY + 'px';

        // --- UNCOMMENTED AND NOW ACTIVE: Update links during desktop drag ---
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
        activeNote.style.zIndex = "100";
    }
}

function dragEndTouch() {
    if (activeNote) {
        activeNote.style.zIndex = "10";
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
        let currentX = e.touches[0].clientX - initialX;
        let currentY = e.touches[0].clientY - initialY;

        const corkBoard = document.getElementById('corkBoard');
        const parentRect = corkBoard.getBoundingClientRect();
        const noteRect = activeNote.getBoundingClientRect();

        currentX = Math.max(0, Math.min(currentX, parentRect.width - noteRect.width));
        currentY = Math.max(0, Math.min(currentY, parentRect.height - noteRect.height));

        activeNote.style.left = currentX + 'px';
        activeNote.style.top = currentY + 'px';

        // --- UNCOMMENTED AND NOW ACTIVE: Update links during touch drag ---
        if (typeof updateLinks === 'function') {
            updateLinks();
        }
    }
}
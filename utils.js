// utils.js
function getRandomRotation() {
    return (Math.random() - 0.5) * 10; // -5 to +5 degrees
}

function getRandomPosition(noteWidth, noteHeight) {
    const corkBoard = document.getElementById('corkBoard');
    const boardRect = corkBoard.getBoundingClientRect();

    const padding = 20;

    const maxLeft = boardRect.width - noteWidth - padding;
    const maxTop = boardRect.height - noteHeight - padding;

    const randomLeft = Math.random() * maxLeft;
    const randomTop = Math.random() * maxTop;

    return {
        top: Math.max(padding, randomTop),
        left: Math.max(padding, randomLeft)
    };
}
let selectedColumn = null;
let pendingChange = 0;
let isTransferMode = false;
let transferColumn = null;
// Add event listener to the table, not just to the cells, to improve flexibility
document.getElementById('scoreTable').addEventListener('click', function(e) {
    let targetCell = e.target.closest('td[id^="score"]');
    // alert(targetCell);
    if (targetCell) {
        if (selectedColumn && selectedColumn !== targetCell) {
            // alert('Please submit your changes before selecting another cell.');
            selectedColumn.style.backgroundColor = '';
            clearSelectedColumn();  // Ensure we clear the previous selection properly
            // alert("here1")
        }
        if (!selectedColumn || selectedColumn !== targetCell) {
            selectedColumn = targetCell;
            selectedColumn.style.backgroundColor = 'yellow';
            pendingChange = 0; // Reset pendingChange when a new cell is selected
            // alert("here2")

            updateDisplayChange();  // Update the display immediately when a new column is selected
        }
    } else {
        clearSelectedColumn();  // Clear selection if clicking outside of score cells
    }
});

function prepareScoreAdjustment(change) {
    if (selectedColumn) {
        pendingChange += change;
        updateDisplayChange(); // Update the display with the new pending change
    } else {
        alert('Please click on a score cell to select it before making changes.');
    }
}

function toggleTransferMode() {
    isTransferMode = !isTransferMode;
    if (isTransferMode) {
        alert('Transfer mode activated. Click on the source column to transfer points.');
    } else {
        alert('Transfer mode deactivated.');
    }
}

function submitScoreChange() {
    if (selectedColumn && pendingChange !== 0) {
        let currentScore = parseInt(selectedColumn.textContent.split(' ')[0]);
        // alert(currentScore);
        selectedColumn.textContent = currentScore + pendingChange;
        // alert(currentScore);
        clearSelectedColumn(); // Clear the current selection after submission
        pendingChange = 0; // Ensure pendingChange is reset after submission
        updateDisplayChange();  // Update the display to reflect reset pendingChange
    } else {
        alert('No changes to submit. Adjust the score first or select a score cell.');
    }
}

function clearSelectedColumn() {
    if (selectedColumn) {
        let changeDisplayId = 'change' + selectedColumn.id.slice(5); // Get the ID of the change display element
        let changeDisplay = document.getElementById(changeDisplayId);
        if (!changeDisplay) {
            changeDisplay = document.createElement('span'); // Create the change display element if it does not exist
            changeDisplay.id = changeDisplayId;
            selectedColumn.appendChild(changeDisplay);
        }
        changeDisplay.textContent = ''; // Ensure the change display is cleared
        selectedColumn.style.backgroundColor = ''; // Reset the background color of the selected cell
        selectedColumn = null; // Reset selectedColumn
    }
}

function updateDisplayChange() {
    if (selectedColumn) {
        let changeDisplayId = 'change' + selectedColumn.id.slice(5);
        let changeDisplay = document.getElementById(changeDisplayId);
        if (!changeDisplay) {
            changeDisplay = document.createElement('span'); // Create the change display element if it does not exist
            changeDisplay.id = changeDisplayId;
            selectedColumn.appendChild(changeDisplay);
        }
        changeDisplay.textContent = pendingChange === 0 ? " 0" : (pendingChange > 0 ? " +" + pendingChange : " " + pendingChange.toString());
    }
}
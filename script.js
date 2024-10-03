let selectedColumn = null;
let pendingChange = 0;
let isTransferMode = false;
let transferColumn = null;
let history = []; // Array to store the history of changes

// Add event listener to the table, not just to the cells, to improve flexibility
document.getElementById('scoreTable').addEventListener('click', function(e) {
    let targetCell = e.target.closest('td[id^="score"]');
    if (targetCell) {
        if (selectedColumn && selectedColumn !== targetCell) {
            selectedColumn.style.backgroundColor = '';
            clearSelectedColumn();  // Ensure we clear the previous selection properly
        }
        if (!selectedColumn || selectedColumn !== targetCell) {
            selectedColumn = targetCell;
            selectedColumn.style.backgroundColor = 'yellow';
            pendingChange = 0; // Reset pendingChange when a new cell is selected
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

function submitScoreChange() {
    if (selectedColumn && pendingChange !== 0) {
        let currentScore = parseInt(selectedColumn.textContent.split(' ')[0]);
        let newScore = currentScore + pendingChange;
        let playerId = selectedColumn.id.replace("score", "player"); // Get the player ID

        // Update the score
        selectedColumn.textContent = newScore;

        // Get the player's name from the corresponding input field
        let playerName = document.getElementById(playerId).value || playerId; // Default to ID if name is empty
        let historyEntry = `${playerName} \t \t ${pendingChange} points.`;
        addToHistory(historyEntry); // Add to the history array and display

        clearSelectedColumn(); // Clear the current selection after submission
        pendingChange = 0; // Ensure pendingChange is reset after submission
        updateDisplayChange();  // Update the display to reflect reset pendingChange
    } else {
        alert('No changes to submit. Adjust the score first or select a score cell.');
    }
}

// Add to the history and update the display
function addToHistory(entry) {
    // Add the new entry to the history array
    history.unshift(entry);
    
    // Limit the history to the 5 most recent entries
    if (history.length > 5) {
        history.pop();
    }
    
    // Update the history display
    updateHistoryDisplay();
}

// Function to display the history
function updateHistoryDisplay() {
    const historyList = document.getElementById("history-list");
    if (historyList) {
        historyList.innerHTML = ''; // Clear the history list
        history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = entry;
            historyList.appendChild(listItem);
        });
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

window.onbeforeunload = function() {
    return "";
}

// Insert the recent changes list in the HTML:
document.addEventListener("DOMContentLoaded", function() {
    const historyContainer = document.createElement('div');
    historyContainer.id = 'history-container';
    historyContainer.innerHTML = `
        <ul id="history-list">
            <!-- History will be dynamically updated here -->
        </ul>
    `;
    document.body.appendChild(historyContainer); // Append the history container to the body
});

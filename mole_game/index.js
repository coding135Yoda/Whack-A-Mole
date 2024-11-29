let currMoleTile;
let currCactusTile;
let moleInterval, cactusInterval;
let score = 0; // Initialize score
let gameOver = false; // Initialize game state
let timer = 60; // 60-second countdown
let username = '';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Handle form submission
document.getElementById("submit-btn").addEventListener("click", () => {
  username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    document.getElementById("home-page").style.display = 'none'; // Hide registration
    document.getElementById("game-section").style.display = 'block'; // Show game section
    setGame();
    startTimer();
  } else {
    alert("Please enter both username and password.");
  }
});

function setGame() {
  // Create game board grid
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  }
  moleInterval = setInterval(setMole, 600); //spawn mole  eve 1sec
  cactusInterval = setInterval(setCactus, 400);
}

function getRandomTile() {
  let num = Math.floor(Math.random() * 9);
  return num.toString();
}

function setMole() {
  if (gameOver) return;

  if (currMoleTile) {
    currMoleTile.innerHTML = "";
  }

  let mole = document.createElement("img");
  mole.src = "./flower.png";

  let num = getRandomTile();

  if (currCactusTile && currCactusTile.id === num) {
    return;
  }

  currMoleTile = document.getElementById(num);
  currMoleTile.appendChild(mole);
}

function setCactus() {
  if (gameOver) return;

  if (currCactusTile) {
    currCactusTile.innerHTML = "";
  }

  let cactus = document.createElement("img");
  cactus.src = "./cactus.png";

  let num = getRandomTile();

  if (currMoleTile && currMoleTile.id === num) {
    return;
  }

  currCactusTile = document.getElementById(num);
  currCactusTile.appendChild(cactus);
}

function selectTile() {
  if (gameOver) return;

  if (this === currMoleTile) {
    score += 10;
    document.getElementById("score").innerText = `Score: ${score}`;
  } else if (this === currCactusTile) {
    timer -= 1;
    if (timer <= 0) {
      endGame();
    }
  }
}

function startTimer() {
  const timerElement = document.getElementById("timer");

  const interval = setInterval(() => {
    if (gameOver) {
      clearInterval(interval);
      return;
    }

    timer--;
    timerElement.innerText = `Time Left: ${timer}s`;

    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(moleInterval);
  clearInterval(cactusInterval);
  gameOver = true;
  document.getElementById("score").innerText = `GAME OVER: ${score}`;
  document.getElementById("timer").innerText = "Time's Up!";
  updateLeaderboard(username, score);
  displayLeaderboard();
}

function updateLeaderboard(username, score) {
  // Check if username already exists
  const index = leaderboard.findIndex(entry => entry.username === username);

  if (index > -1) {
    // Update existing user's score if higher
    if (score > leaderboard[index].score) {
      leaderboard[index].score = score;
    }
  } else {
    // Add new user to leaderboard
    leaderboard.push({ username, score });
  }

  // Sort leaderboard by score in descending order
  leaderboard.sort((a, b) => b.score - a.score);

  // Save to localStorage
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  // Show only top 10 players
  const topPlayers = leaderboard.slice(0, 10);

  const leaderboardTableBody = document.querySelector("#leaderboard-table tbody");
  leaderboardTableBody.innerHTML = ''; // Clear previous leaderboard

  topPlayers.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.username}</td>
      <td>${entry.score}</td>
    `;
    leaderboardTableBody.appendChild(row);
  });

  // Hide game section and show leaderboard
  document.getElementById("game-section").style.display = 'none';
  document.getElementById("leaderboard").style.display = 'block';
}

// Back to the game button event
document.getElementById("back-to-game").addEventListener("click", () => {
  // Hide leaderboard and show the game section
  document.getElementById("leaderboard").style.display = 'none';
  document.getElementById("game-section").style.display = 'block';
  
  // Reset the game for a new round
  resetGame();
});

function resetGame() {
  // Reset the score and timer
  score = 0;
  timer = 60;
  gameOver = false;

  // Clear the existing intervals to stop mole and cactus spawn from previous game
  clearInterval(moleInterval);
  clearInterval(cactusInterval);

  // Update the score and timer display
  document.getElementById("score").innerText = `Score: ${score}`;
  document.getElementById("timer").innerText = `Time Left: ${timer}s`;

  // Recreate the game board (if needed)
  document.getElementById("board").innerHTML = ''; // Clear the previous game board
  setGame();  // Reinitialize game with fresh tiles and new intervals

  // Start a new timer
  startTimer();
}


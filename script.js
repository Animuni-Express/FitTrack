const exercises = [
    { id: 'ex1', name: 'Push Ups', reps: '3 Sets of 15', icon: 'fa-person-running', completed: false },
    { id: 'ex2', name: 'Squats', reps: '3 Sets of 20', icon: 'fa-person', completed: false },
    { id: 'ex3', name: 'Plank', reps: '3 Sets of 1 min', icon: 'fa-stopwatch', completed: false },
    { id: 'ex4', name: 'Lunges', reps: '3 Sets of 12/leg', icon: 'fa-person-walking', completed: false },
    { id: 'ex5', name: 'Burpees', reps: '3 Sets of 10', icon: 'fa-fire', completed: false }
];

const dummyFriends = [
    { name: 'Alex T.', points: 15400, avatar: 'AT' },
    { name: 'Sarah K.', points: 12300, avatar: 'SK' },
    { name: 'Mike R.', points: 9800, avatar: 'MR' },
    { name: 'You', points: 0, avatar: 'YO', isUser: true },
    { name: 'Jessica L.', points: 8500, avatar: 'JL' },
    { name: 'David B.', points: 6200, avatar: 'DB' }
];

// DOM Elements
const exerciseList = document.getElementById('exercise-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const finishBtn = document.getElementById('finish-btn');
const modal = document.getElementById('reward-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

const streakCount = document.getElementById('streak-count');
const userPointsDisplay = document.getElementById('user-points');
const modalTotalPoints = document.getElementById('modal-total-points');
const leaderboardList = document.getElementById('leaderboard-list');

// Menu Elements
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const appMenu = document.getElementById('app-menu');

// State
let currentStreak = parseInt(localStorage.getItem('streak')) || 0;
let lastWorkoutDate = localStorage.getItem('lastWorkoutDate');
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

// Init
function init() {
    renderExercises();
    checkStreakRepair();
    renderLeaderboard();
    updateUI();
}

function checkStreakRepair() {
    streakCount.innerText = currentStreak;
    userPointsDisplay.innerText = userPoints.toLocaleString();
}

function renderExercises() {
    exerciseList.innerHTML = '';
    exercises.forEach((ex, index) => {
        const item = document.createElement('div');
        item.className = `exercise-item ${ex.completed ? 'completed' : ''}`;
        item.onclick = () => toggleExercise(index);

        item.innerHTML = `
            <div class="exercise-content">
                <div class="exercise-icon">
                    <i class="fa-solid ${ex.icon}"></i>
                </div>
                <div class="exercise-details">
                    <h4>${ex.name}</h4>
                    <p>${ex.reps}</p>
                </div>
            </div>
            <div class="check-circle">
                <i class="fa-solid fa-check"></i>
            </div>
        `;
        exerciseList.appendChild(item);
    });
}

function renderLeaderboard() {
    leaderboardList.innerHTML = '';

    // Update user's points in the friends list
    const userEntry = dummyFriends.find(f => f.isUser);
    userEntry.points = userPoints;

    // Sort by points desc
    const sorted = [...dummyFriends].sort((a, b) => b.points - a.points);

    sorted.forEach((friend, index) => {
        const item = document.createElement('div');
        item.className = `leaderboard-item ${friend.isUser ? 'highlight' : ''}`;

        item.innerHTML = `
            <div class="rank ${index < 3 ? 'top-' + (index + 1) : ''}">#${index + 1}</div>
            <div class="player-info">
                <div class="player-avatar">${friend.avatar}</div>
                <div class="player-name">${friend.name}</div>
            </div>
            <div class="player-points">${friend.points.toLocaleString()}</div>
        `;
        leaderboardList.appendChild(item);
    });
}

function toggleExercise(index) {
    exercises[index].completed = !exercises[index].completed;
    renderExercises();
    updateUI();
}

function updateUI() {
    const total = exercises.length;
    const completed = exercises.filter(e => e.completed).length;
    const percentage = Math.round((completed / total) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}% Completed`;

    if (percentage === 100) {
        finishBtn.classList.add('active');
        finishBtn.disabled = false;
        finishBtn.innerText = "Finish & Claim 500 PTS";
    } else {
        finishBtn.classList.remove('active');
        finishBtn.disabled = true;
        finishBtn.innerText = "Complete Workout";
    }
}

finishBtn.addEventListener('click', () => {
    finishWorkout();
});

function finishWorkout() {
    // Celebrate
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ea', '#ff0055', '#ffd700']
    });

    // Update Streak
    const today = new Date().toDateString();
    if (lastWorkoutDate !== today) {
        currentStreak++;
        localStorage.setItem('streak', currentStreak);
        localStorage.setItem('lastWorkoutDate', today);
        streakCount.innerText = currentStreak;
    }

    // Add Points
    const pointsEarned = 500;
    userPoints += pointsEarned;
    localStorage.setItem('userPoints', userPoints);

    // UI Updates
    userPointsDisplay.innerText = userPoints.toLocaleString();
    modalTotalPoints.innerText = userPoints.toLocaleString();
    renderLeaderboard(); // Re-render to show updated rank

    // Show Modal
    setTimeout(() => {
        modal.classList.remove('hidden');
    }, 800);
}

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    exercises.forEach(e => e.completed = false);
    renderExercises();
    updateUI();
});

// Menu Logic
menuBtn.addEventListener('click', () => {
    appMenu.classList.remove('hidden');
});

closeMenuBtn.addEventListener('click', () => {
    appMenu.classList.add('hidden');
});

// Start
init();

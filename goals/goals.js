//creating database structure
const db = new Dexie("Goals");
/*
++id: ID of the goal
goal: Name of the goal
progress: A number; every time you complete 1 focus session, add 1 to the goal
total: Number that progress should reach; if it is -1, then it does not have a total.
*/
db.version(2).stores({
    goals: "++id, goal, progress, total"
});

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

const form = document.getElementById("create-new-goal");
const newGoalDiv = document.getElementById("new-goal-div");
const newGoalName = document.getElementById("new-goal-name");
const newGoalTotal = document.getElementById("new-goal-total");
const goalList = document.getElementById("goals");
const createGoalButton = document.getElementById("create-button");
const clickcapture = document.getElementById("clickcapture");

//add todo
form.onsubmit = async(event) => {
    event.preventDefault();
    await addGoal(sanitize(newGoalName.value),0,parseInt(newGoalTotal.value)>0?parseInt(newGoalTotal.value):-1)
};
async function addGoal(name,progress,total){
    console.log({goal:name,progress:progress,total:total});
    await db.goals.add({goal:name,progress:progress,total:total});
    await getGoals();
    form.reset();
}
function toggleScreen(event){
    newGoalDiv.hidden = !newGoalDiv.hidden;
    clickcapture.hidden = !clickcapture.hidden;
}

//display goals
async function getGoals() {
    const allGoals = await db.goals.reverse().toArray();
    allGoals.forEach(goal => {
        console.log(goal.goal, goal.id);
    });
    goalList.innerHTML = allGoals.map((goal) => `
	
    <div class="goal">
        <div class="content">
            <span class="text">${goal.goal}</span><br/>
            <span class="progress">Progress:${goal.progress} ${goal.total == -1?"":"out of " + goal.total}</span>
        </div>
        <div class="actions">
            <button class="delete" onclick="deleteGoal(event, ${goal.id})">Delete</button>
            <button class="timer" onclick="gotoTimer(event, ${goal.id})">Go To Timer</button>
            
        </div>
    </div>
	`).join("");
};
window.onload = getGoals;

//delete todo
async function deleteGoal(event, id) {
    await db.goals.delete(id);
    await getGoals();
};

function gotoTimer(event, id) {
    localStorage.setItem("focus_goal_id", id);
    transitionToPage('../timer/timer.html')
}

createGoalButton.onclick = toggleScreen;
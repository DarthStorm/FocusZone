//db required to load dropdown
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

let end_time = localStorage.getItem("end_time")
if (end_time == null) {
    end_time = -1; //unset
    localStorage.setItem("end_time", end_time);
}
let work_time = 0.1;
let rest_time = 0.05;

let timerInterval;

async function end_timer(){
    let curr_goal_id = parseInt(document.getElementById("goal-dropdown").value);

    await db.goals.get(curr_goal_id).then(async function (goal) {
        // an async function will most definitely cause no problems at all
        console.log(goal);
        if (goal) {
            // Increment the progress by 1
            goal.progress++;
            console.log(goal, "added progress +1");
            // Update the goal in the database
            await db.goals.put(goal);
        }
    }).catch(function (err) {})
}

function timer_tick() {
    if (end_time == -1) {
        timerButton.innerHTML = "TIMER";
        return;
    }
    // set text to time
    let timeLeft;
    if (end_time - Date.now() <= 0) {
        dropdown.disabled = false;
        timerButton.disabled = false;
        // end timer
        timerButton.innerHTML = "0";
        end_time = -1;
        // register progress
        end_timer();
        
    } else {
        dropdown.disabled = true;
        timerButton.disabled = true;
        if (end_time - Date.now() < rest_time * 60 * 1000) {
        // resting
        timeLeft = Math.ceil((end_time - Date.now()) / 1000);
        } else if (end_time != -1) {
            // working
            timeLeft = Math.ceil((end_time - Date.now() - rest_time * 1000 * 60) / 1000);
        }
    }
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    if (!timeString.toLowerCase().includes("nan")){
        timerButton.innerHTML = timeString;
    }
}

let timerButton = document.getElementById("timer")
let dropdown = document.getElementById("goal-dropdown");

function startTimer() {
    // first figure out when to end
    end_time = Date.now() + (work_time + rest_time) * 60 * 1000 // work in miliseconds
    localStorage.setItem("end_time", end_time);
    console.log(end_time, Date.now())
}

//window loaded
timerInterval = setInterval(timer_tick, 1);

async function getGoals() {
    const goalList = document.getElementById("goal-dropdown");
    const allGoals = await db.goals.reverse().toArray();
    let curr_goal_id = localStorage.getItem("focus_goal_id");
    allGoals.forEach(goal => {
        console.log(goal.goal, goal.id);
    });
    goalList.innerHTML = allGoals.map((goal) => `
    <option value="${goal.id}" ${goal.id == curr_goal_id?"selected":""}>${goal.goal}</option> 
	`).join("");
};

window.onload = getGoals;
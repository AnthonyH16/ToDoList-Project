class Task {
    constructor(title, description, dueDate, priority, completedDate, project, id) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.completedDate = completedDate
        this.project = project
        this.id = id
    }
}

class Project {
    taskList = [];
    constructor(projectName, taskList) {
        this.projectName = projectName;
        this.taskList = taskList;
    }
}
let allTasks = [];
let completedArray = [];
let projectNames = [];

// let allTasks = [new Task("test 1", "testing1", "2024-02-12", "high", "none", "No Project", '1'),
// new Task("test 2", "testing 2", "2024-04-29", "medium", "none", "No Project", 2),
// new Task("test 3", "testing 3", "2024-04-30", "low", "none", "No Project", 3),
// new Task("test 6", "testing 6", "2024-05-08", "low", "none", "No Project", 4),
// new Task("test 7", "testing 7", "2024-05-02", "low", "none", "No Project", 5),
// new Task("test 8", "testing 8", "2024-05-06", "low", "none", "No Project", 6)
// ];
let todayArray = [];
let sevenDayArray = [];
// let completedArray = [new Task("test 4", "testing 4", "2024-02-28", "low", "Fri Mar 01 2024"),
// new Task("test 5", "testing 5", "2024-03-02", "medium", "Tue Mar 05 2024")];
let projectsArray = [];
let activeView = Object.freeze({
    all: 0,
    today: 1,
    seven: 2,
    completed: 3
});

// renderTasks(allTasks);

function sortArray(array) { //added
    array.sort(function (a, b) {
        let d1 = new Date(a.dueDate);
        let d2 = new Date(b.dueDate);
        if (d1 > d2) {
            return 1
        }
        else if (d1 < d2) {
            return -1
        }
    });
}

function filterToday() { //added
    todayArray = [];
    for (i = 0; i < allTasks.length; i++) {
        if (new Date(allTasks[i].dueDate) == new Date() ||
            new Date(allTasks[i].dueDate) < new Date()) {
            todayArray.push(allTasks[i]);
            // if (new Date(allTasks[i].dueDate).toDateString() == new Date().toDateString()) {
            //     todayArray.push(allTasks[i]);

        }
    }
}

function filterSevenDays() { //added
    sevenDayArray = [];
    // allTasks.filter(function (task) {
    //     let dateToday = new Date();
    //     let weekFromToday = new Date(dateToday.setDate(dateToday.getDate() + 7));
    //     dateToday = dateToday.toDateString();
    //     weekFromToday = weekFromToday.toDateString();
    //     if (new Date(task.dueDate).toDateString() == dateToday ||
    //         new Date(task.dueDate).toDateString() <= weekFromToday) {
    //         sevenDayArray.push(task);
    //     }
    // });
    //----------
    let dateToday = new Date();
    let weekFromToday = new Date(dateToday.setDate(dateToday.getDate() + 7));
    // dateToday = dateToday.toDateString();
    // weekFromToday = weekFromToday.toDateString();
    for (index in allTasks) {
        const task = allTasks[index];
        console.log(task.dueDate);
        if (new Date(task.dueDate) == dateToday ||
            new Date(task.dueDate) <= weekFromToday) {
            console.log('yes');
            sevenDayArray.push(task);

        }
    }
}

const newTaskDialog = document.querySelector('.newTaskDialog');//added
const newTask = document.querySelector('.newTask');
newTask.addEventListener('click', () => {
    newTaskDialog.showModal();
});


function addTask() { //added
    const title = document.querySelector('#taskName').value;
    const description = document.querySelector('#description').value;
    const date = document.querySelector('#date').value; //added space here
    const priority = document.querySelector('#priority').value;
    const select = document.querySelector('#project');
    const project = select.options[select.selectedIndex].text;
    const id = allTasks[allTasks.length - 1].id + 1;
    const newTask = new Task(title, description, date, priority, "none", project, id);
    allTasks.push(newTask);
    sortArray(allTasks);
    // renderTasks(allTasks);
    // changeTaskHeader("All Tasks");
    //need to check the active view, then render tasks that have the same project name as the active view
    // if(activeView==0){
    //     renderTasks(allTasks)
    // }
    // else if(activeView==1){
    //     renderTasks(todayArray)
    // }
    // else if(activeView==2){
    //     renderTasks(sevenDayArray)
    // }
    // else if(activeView==3){
    //     renderTasks(completedArray)
    // }
    whatToRender();
    setStorage();
}

function whatToRender() {
    sortArray(allTasks);
    if (activeView == 0) {
        renderTasks(allTasks);
    }
    else if (activeView == 1) {
        renderTasks(todayArray);
    }
    else if (activeView == 2) {
        renderTasks(sevenDayArray);
    }
    else if (activeView == 3) {
        renderTasks(completedArray);
    }
}


function addToProjectList() { //added
    const projectName = document.querySelector('#projectName').value;
    
    projectNames.push(projectName);
    const dropdownOptions = document.querySelector('#project');
    const sidebarDropdown = document.querySelector('#sidebarProjectDropdown');
    while (sidebarDropdown.firstChild) {
        sidebarDropdown.firstChild.remove();
    }
    while (dropdownOptions.firstChild) {
        dropdownOptions.firstChild.remove();
    }

    const noProject = document.createElement('option');
    noProject.innerHTML = `No Project`
    dropdownOptions.appendChild(noProject);
    const selectProject = document.createElement('option');
    selectProject.innerHTML = `Select Project`;
    sidebarDropdown.appendChild(selectProject);
    
    setStorage();

    populateProjectSelections();
}

function populateProjectSelections(){
    const dropdownOptions = document.querySelector('#project');
    const sidebarDropdown = document.querySelector('#sidebarProjectDropdown');
    for (projectIndex in projectNames) {
        const projectTitle = projectNames[projectIndex];
        const newOptionTasks = document.createElement('option');
        const newOptionSidebar = document.createElement('option');
        newOptionTasks.innerHTML = `${projectTitle}`;
        newOptionSidebar.innerHTML = `${projectTitle}`;
        dropdownOptions.appendChild(newOptionTasks);
        sidebarDropdown.appendChild(newOptionSidebar);
    }
}

const modalAddProject = document.querySelector('.modalAddProject');//added
modalAddProject.addEventListener('click', () => {
    addToProjectList();
    closeModal('projectModal');
});

function renderProject() { //added
    const projectArray = [];
    const select = document.querySelector('#sidebarProjectDropdown');
    const project = select.options[select.selectedIndex].text;
    for (index in allTasks) {
        const task = allTasks[index]
        if (task.project == project) {
            projectArray.push(task);

            //         document.querySelector('#tasks').innerHTML = '';            
            //         document.querySelector('#tasks').innerHTML +=
            //             `<li><button type='button' class='${task.priority}' id='taskDoneButton' onclick='addToCompleted(${taskIndex})'></button>
            //    <div class = 'taskInfo'> <p class = 'taskTitle'>${task.title}</p>
            //     <p class = 'taskDesc'>${task.description}</p>
            //     <p class = 'taskDD'>${task.dueDate}</p>
            //     </div>
            //     </li>`;
        }
    }
    renderTasks(projectArray);
    changeTaskHeader(`${project}`);
}

document.querySelector('#sidebarProjectDropdown').addEventListener("change", () => { //added
    const select = document.querySelector('#sidebarProjectDropdown');
    const project = select.options[select.selectedIndex].text;
    if (project == "Select Project") {
        renderTasks(allTasks);
        changeTaskHeader("All Tasks")
    }
    else {
        renderProject();
    }
});

const closeButton = document.querySelector('#close');//added
closeButton.addEventListener("click", () => {
    document.querySelector('#taskName').value = '';
    document.querySelector('#description').value = '';
    // document.querySelector('#date').value = '';
    // document.querySelector('#priority').value = '';
    newTaskDialog.close();
});



let isSidebarOpen = false;

function openSidebar() {//added
    // document.querySelector('.sidebar').style.display = 'grid';    
    document.querySelector('.sidebar').style.width = '250px';
    isSidebarOpen = true;
    document.querySelector('.addProject').style.display = 'inline';
    document.querySelector('.allImage').style.display = 'inline';
    document.querySelector('.todayImage').style.display = 'inline'
    document.querySelector('.sevenImage').style.display = 'inline'
    document.querySelector('.completedImage').style.display = 'inline'
    document.querySelector('#sidebarProjectDropdown').style.display = 'inline';
    document.querySelector('.newTask').style.display = 'flex';
    document.querySelector('.taskDisplay').style.marginLeft = '0px';



}

function closeSidebar() { //added
    // document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.sidebar').style.width = '0px';
    isSidebarOpen = false;
    document.querySelector('.addProject').style.display = 'none';
    document.querySelector('.allImage').style.display = 'none';
    document.querySelector('.todayImage').style.display = 'none';
    document.querySelector('.sevenImage').style.display = 'none';
    document.querySelector('.completedImage').style.display = 'none';
    document.querySelector('#sidebarProjectDropdown').style.display = 'none';
    document.querySelector('.newTask').style.display = 'none';
    document.querySelector('.taskDisplay').style.marginLeft = '-250px';
}

const sidebarButton = document.querySelector('.sidebarButton'); //added
sidebarButton.addEventListener('click', () => {
    //const sidebar = document.querySelector('.sidebar');
    if (isSidebarOpen == true) {
        closeSidebar();
    }
    else {
        openSidebar();
    }
});

function renderTasks(array) { //added
    document.querySelector('#tasks').innerHTML = '';
    for (const taskIndex in array) {        
        const task = array[taskIndex];
        // if (task.project == "No Project"){
        const listItem = document.createElement('li');
        const taskDoneButton = document.createElement('button');
        taskDoneButton.classList.add(task.priority);
        taskDoneButton.setAttribute("id", "taskDoneButton")
        taskDoneButton.setAttribute("title", "Complete Task")
        taskDoneButton.addEventListener("click", () => {
            addToCompleted(taskIndex);
            console.log("hello");
        });
        listItem.appendChild(taskDoneButton);
        const taskInfoDiv = document.createElement('div');
        taskInfoDiv.classList.add('taskInfo');
        taskInfoDiv.setAttribute("title", "Edit Task")
        taskInfoDiv.innerHTML += `<p class = 'taskTitle'>${task.title}</p>
        <p class = 'taskDesc'>${task.description}</p>
        <p class = 'taskDD'><input type="image" src="/home/bofadeeze/repos/ToDoList-Project/src/calendar.png" name="calendar"
        class="calendar" id="calendar" />${task.dueDate}</p>
        <hr class ='taskDivider'>`

        listItem.appendChild(taskInfoDiv);

        // listItem.innerHTML +=
        //     // `<button type='button' class='${task.priority}' id='taskDoneButton' onclick='addToCompleted(${taskIndex})'></button>
        // `<div class = 'taskInfo'> <p class = 'taskTitle'>${task.title}</p>
        //  <p class = 'taskDesc'>${task.description}</p>
        //  <p class = 'taskDD'><input type="image" src="/home/bofadeeze/repos/ToDoList-Project/src/calendar.png" name="calendar"
        //  class="calendar" id="calendar" />${task.dueDate}</p>
        //  </div>`;

        //  const taskInfo = document.querySelector('.taskInfo');
        taskInfoDiv.addEventListener("click", () => {
            editTask(task);
        });

        // const button = document.createElement('button');
        // button.textContent = "Edit Task";        
        // button.addEventListener("click", () => {
        //     editTask(task);
        // });
        // listItem.appendChild(button);


        document.querySelector('#tasks').appendChild(listItem);
    }

    //code goes here for other way of rendering
// }
}

let buttonEvent;//added
function editTask(task) {
    document.querySelector('#editModal #taskTitle').value = task.title;
    document.querySelector('#editModal #taskDesc').value = task.description;
    document.querySelector('#editModal #taskDD').value = task.dueDate;
    document.querySelector('#editModal #priority').value = task.priority;
    document.querySelector('#editModal').classList.remove("hidden");
    document.querySelector('.overlay').classList.remove("hidden");
    buttonEvent = () => {
        updateTask(task.id);
        sortArray(allTasks);
    whatToRender();
    }
    document.querySelector('.modalEditButton').addEventListener('click', buttonEvent);
    
    
    // let deleteTaskButton = document.querySelector('.deleteTaskImage');
    // deleteTaskButton.addEventListener

    
}

function updateTask(taskID) {//added
    const title = document.querySelector('#editModal #taskTitle').value;
    const description = document.querySelector('#editModal #taskDesc').value;
    const dueDate = document.querySelector('#editModal #taskDD').value;
    const priority = document.querySelector('#editModal #priority').value;
    for (const task of allTasks) {
        if (task.id == taskID) {
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            task.priority = priority;
            break
        }
    }
    renderTasks(allTasks);
    document.querySelector('#editModal').classList.add("hidden");
    document.querySelector('.overlay').classList.add("hidden");
    document.querySelector('.modalEditButton').removeEventListener('click', buttonEvent);

}

function deleteTask(){

}

function renderCompleted() { //added
    //put array in reverse order by completed date      
    completedArray.sort(function (a, b) {
        let d1 = new Date(a.completedDate);
        let d2 = new Date(b.completedDate);
        if (d1 > d2) {
            return -1
        }
        else if (d1 < d2) {
            return 1
        }
    });

    // sortArray(completedArray);
    // completedArray.reverse();
    const groupByCompletedDate = Object.groupBy(completedArray, date => {
        return date.completedDate;
    });
    console.log(groupByCompletedDate);
    for (const dateIndex in groupByCompletedDate) {
        const eachDateArray = groupByCompletedDate[dateIndex];
        console.log(eachDateArray);
        let tasks = document.querySelector('#tasks');
        let eachCompletedDate = document.createElement('div');
        eachCompletedDate.classList.add('eachCompletedDate');
        tasks.appendChild(eachCompletedDate);
        let dateHeader = document.createElement('div');
        dateHeader.classList.add('dateHeader');
        dateHeader.innerHTML = `${eachDateArray[0].completedDate}`;
        let hr = document.createElement('hr');
        hr.classList.add('taskDivider');
        eachCompletedDate.appendChild(hr)
        eachCompletedDate.appendChild(dateHeader);
        for (i = 0; i < eachDateArray.length; i++) {
            eachCompletedDate.innerHTML += `<div class = "completedTask"> 
            <input type="image" src="/home/bofadeeze/repos/ToDoList-Project/src/done.png" name="doneImage"
                class="doneImage" id="doneImage" />
            <p class='prefix'>You completed task:</p>
            <p class= 'suffix'>${eachDateArray[i].title}</div>`
        }
    }
}

document.querySelector('#newTaskForm').addEventListener('submit', function (event) {//added
    event.preventDefault();
    addTask();
    document.querySelector('#taskName').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#date').value = '';
    // document.querySelector('#priority').value = '';
    document.querySelector('#project').value = 'No Project';
    newTaskDialog.close();
});

function clear() { //added
    const parent = document.querySelector('#tasks');
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

const allTasksButton = document.querySelector('.allTasksButton')//added
allTasksButton.addEventListener('click', () => {
    clear();
    // renderTasks(allTasks);
    activeView = 0;
    whatToRender();
    changeTaskHeader("All Tasks")
});

const todayButton = document.querySelector('.todayButton');//added
todayButton.addEventListener('click', () => {
    clear();
    filterToday();
    activeView = 1;
    whatToRender();
    // renderTasks(todayArray);
    changeTaskHeader("Today");
});

const sevenDayButton = document.querySelector('.sevenDayButton');//added
sevenDayButton.addEventListener('click', () => {
    clear();
    filterSevenDays();
    // console.log(sevenDayArray);
    // renderTasks(sevenDayArray);
    activeView = 2;
    whatToRender();
    changeTaskHeader("Seven Day View")
});

const completedButton = document.querySelector('.completedButton');//added
completedButton.addEventListener('click', () => {
    clear();
    //sortArray(completedArray);
    // renderTasks(completedArray);
    renderCompleted();
    changeTaskHeader("Completed Tasks")
});

// const projectsButton = document.querySelector('.projectsButton');//added
// projectsButton.addEventListener('click', () => {
//     modal.classList.remove("hidden");
//     overlay.classList.remove("hidden")

// });


// const modal = document.querySelector('.projectModal');
// const overlay = document.querySelector(".overlay");
// const addProject = document.querySelector('.addProject');
// addProject.addEventListener('click', () => {
//     modal.classList.remove("hidden");
//     overlay.classList.remove("hidden");

// });


function openModal(projectModal) {//added
    document.querySelector('#projectName').value = '';
    const modal = document.querySelector(`#${projectModal}`);
    const overlay = document.querySelector(".overlay");
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

}

function closeModal(projectModal) {//added
    const modal = document.querySelector(`#${projectModal}`);
    const overlay = document.querySelector(".overlay");
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.querySelector('.modalEditButton').removeEventListener('click', buttonEvent);
};

// const closeProjectButton = document.querySelector('.closeProjectForm');
// closeProjectButton.addEventListener('click', () => {
//     closeModal();
// });

// document.addEventListener("keydown", function (e) {
//     if (e.key === "Escape" && !modal.classList.contains("hidden")) {
//         closeModal();
//     }
// });





// function addToCompleted(index){
//    let removedTask = allTasks.splice(index,1);  
//    removedTask.forEach(task => {
//     task['completedDate'] = new Date().toDateString();
//    });
//     completedArray.push(removedTask[0]);
//      renderTasks(allTasks);

// } this code above works, trying something else below


function addToCompleted(index) { //added
    let removedTask = allTasks.splice(index, 1);
    removedTask.forEach(task => {
        task.completedDate = new Date().toDateString();
    });
    completedArray.push(removedTask[0]);
    // renderTasks(allTasks);
    whatToRender();
    setStorage();

}

function changeTaskHeader(view) { //added
    const taskHeader = document.querySelector('.currentView');
    taskHeader.innerHTML = `${view}`;
}


//localStorage stuff down here
function setStorage() {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    localStorage.setItem('todayArray', JSON.stringify(todayArray));
    localStorage.setItem('sevenDayArray', JSON.stringify(sevenDayArray));
    localStorage.setItem('completedArray', JSON.stringify(completedArray));
    localStorage.setItem('projectNames', JSON.stringify(projectNames));
}
function updateVariablesFromStorage() {
    allTasks = JSON.parse(localStorage.getItem('allTasks'));
    todayArray = JSON.parse(localStorage.getItem('todayArray'));
    sevenDayArray = JSON.parse(localStorage.getItem('sevenDayArray'));
    completedArray = JSON.parse(localStorage.getItem('completedArray'))
    projectNames = JSON.parse(localStorage.getItem('projectNames'));
}
function checkIfHereBefore() {
    if (!localStorage.getItem('allTasks')) {
        setStorage();
    }
    else {
        updateVariablesFromStorage();
    }
}
checkIfHereBefore();

renderTasks(allTasks);
activeView = 0;
populateProjectSelections();
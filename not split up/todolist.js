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
let deletedTasks = [];

let todayArray = [];
let sevenDayArray = [];
let projectsArray = [];
let activeView = Object.freeze({
    all: 0,
    today: 1,
    seven: 2,
    completed: 3
});

function sortArray(array) { 
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

function filterToday() { 
    todayArray = [];
    for (i = 0; i < allTasks.length; i++) {
        if (new Date(allTasks[i].dueDate) == new Date() ||
            new Date(allTasks[i].dueDate) < new Date()) {
            todayArray.push(allTasks[i]);           
        }
    }
}

function filterSevenDays() { 
    sevenDayArray = []; 
    let dateToday = new Date();
    let weekFromToday = new Date(dateToday.setDate(dateToday.getDate() + 7));   
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

const newTaskDialog = document.querySelector('.newTaskDialog');
const newTask = document.querySelector('.newTask');
newTask.addEventListener('click', () => {
    newTaskDialog.showModal();
});

function addTask() { 
    const title = document.querySelector('#taskName').value;
    const description = document.querySelector('#description').value;
    const date = document.querySelector('#date').value; //added space here
    const priority = document.querySelector('#priority').value;
    const select = document.querySelector('#project');
    const project = select.options[select.selectedIndex].text;    
    const id = parseInt(allTasks.length + completedArray.length +
        deletedTasks.length) + 1;
    const newTask = new Task(title, description, date, priority, "none", project, id);
    allTasks.push(newTask);
    sortArray(allTasks);    
    whatToRender();
    setStorage();
}

function whatToRender() {
    sortArray(allTasks);
    if (activeView == 0) {
        renderTasks(allTasks);
    }
    else if (activeView == 1) {
        filterToday();
        renderTasks(todayArray);
    }
    else if (activeView == 2) {
        filterSevenDays();
        renderTasks(sevenDayArray);
    }
    else if (activeView == 3) {
        renderTasks(completedArray);
    }
}


function addToProjectList() { 
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

function populateProjectSelections() {
    const dropdownOptions = document.querySelector('#project');
    const sidebarDropdown = document.querySelector('#sidebarProjectDropdown');
    const editDropdown = document.querySelector('#editProject');
    for (projectIndex in projectNames) {
        const projectTitle = projectNames[projectIndex];
        const newOptionTasks = document.createElement('option');
        const newOptionSidebar = document.createElement('option');
        const optionsEdit = document.createElement('option');
        newOptionTasks.innerHTML = `${projectTitle}`;
        newOptionSidebar.innerHTML = `${projectTitle}`;
        optionsEdit.innerHTML = `${projectTitle}`;
        dropdownOptions.appendChild(newOptionTasks);
        sidebarDropdown.appendChild(newOptionSidebar);
        editDropdown.appendChild(optionsEdit);
    }
}

const modalAddProject = document.querySelector('.modalAddProject');
modalAddProject.addEventListener('click', () => {
    addToProjectList();
    closeModal('projectModal');
});

function renderProject() { 
    const projectArray = [];
    const select = document.querySelector('#sidebarProjectDropdown');
    const project = select.options[select.selectedIndex].text;
    for (index in allTasks) {
        const task = allTasks[index]
        if (task.project == project) {
            projectArray.push(task);
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

const closeButton = document.querySelector('#close');
closeButton.addEventListener("click", () => {
    document.querySelector('#taskName').value = '';
    document.querySelector('#description').value = '';
    // document.querySelector('#date').value = '';
    // document.querySelector('#priority').value = '';
    newTaskDialog.close();
});



let isSidebarOpen = false;

function openSidebar() {
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
    document.querySelector('.recycleBinImage').style.display = 'inline'


}

function closeSidebar() {
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
    document.querySelector('.recycleBinImage').style.display = 'none'
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

function renderTasks(array) {
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
            whatToRender();
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
        document.querySelector('#tasks').appendChild(listItem);
    }

    //code goes here for other way of rendering
    // }
}

let buttonEvent;
let deleteTaskButtonEvent;
function editTask(task) {
    document.querySelector('#editModal #taskTitle').value = task.title;
    document.querySelector('#editModal #taskDesc').value = task.description;
    document.querySelector('#editModal #taskDD').value = task.dueDate;
    document.querySelector('#editModal #priority').value = task.priority;
    document.querySelector('#editModal #editProject').value = task.project;
    document.querySelector('#editModal').classList.remove("hidden");
    document.querySelector('.overlay').classList.remove("hidden");
    buttonEvent = () => {
        updateTask(task.id);
        sortArray(allTasks);
        whatToRender();
    }
    document.querySelector('.modalEditButton').addEventListener('click', buttonEvent);

    deleteTaskButtonEvent = () => {
        deleteTask(task.id);
        setStorage();
    }
    let deleteTaskButton = document.querySelector('.deleteTaskImage');
    deleteTaskButton.addEventListener('click', deleteTaskButtonEvent);

}

function updateTask(taskID) {
    const title = document.querySelector('#editModal #taskTitle').value;
    const description = document.querySelector('#editModal #taskDesc').value;
    const dueDate = document.querySelector('#editModal #taskDD').value;
    const priority = document.querySelector('#editModal #priority').value;
    const project = document.querySelector('#editModal #editProject').value;
    for (const task of allTasks) {
        if (task.id == taskID) {
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            task.priority = priority;
            task.project = project;
            break
        }
    }
    renderTasks(allTasks);
    changeTaskHeader("All Tasks");
    document.querySelector('#editModal').classList.add("hidden");
    document.querySelector('.overlay').classList.add("hidden");
    document.querySelector('.modalEditButton').removeEventListener('click', buttonEvent);
    setStorage();
}

function deleteTask(taskID) {
    for (const index in allTasks) {
        let taskToBeDeleted = allTasks[index];
        if (taskToBeDeleted.id == taskID) {
            allTasks.splice(index, 1);
            deletedTasks.push(taskToBeDeleted);
        }
    }
    whatToRender();
    closeModal('editModal');
}

function renderCompleted() {
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

        eachCompletedDate.appendChild(dateHeader);
        for (i = 0; i < eachDateArray.length; i++) {
            eachCompletedDate.innerHTML += `<div class = "completedTask"> 
            <input type="image" src="/home/bofadeeze/repos/ToDoList-Project/src/done.png" name="doneImage"
                class="doneImage" id="doneImage" />
            <p class='prefix'>You completed task:</p>
            <p class= 'suffix'>${eachDateArray[i].title}</div>`
        }
        let hr = document.createElement('hr');
        hr.classList.add('taskDivider');
        eachCompletedDate.appendChild(hr)
    }
}


function renderRecycleBin() {
    for (let i = 0; i < deletedTasks.length; i++) {
        let tasks = document.querySelector('#tasks');
        let delTask = document.createElement('div');
        delTask.classList.add('deletedTask');
        delTask.innerHTML = ` <p class='prefix' id='delTitle'>${deletedTasks[i].title}</p>
        <p class='suffix' id='wasDeleted'>was deleted</p>
        <input title='Undo Delete' type="image" src="/home/bofadeeze/repos/ToDoList-Project/src/undodelete.png" name="undoImage"
                class="undoImage" id="undoImage${i}" />`
        tasks.appendChild(delTask);
        let hr = document.createElement('hr');
        hr.classList.add('taskDivider');
        tasks.appendChild(hr);

        let undo = document.querySelector(`#undoImage${i}`)
        undo.addEventListener('click', () => {
            restoreTask(i);
            console.log(i);
        });
    }
}

function restoreTask(i) {
    let taskToBeRestored = deletedTasks[i];
    console.log(taskToBeRestored);
    allTasks.push(taskToBeRestored);
    deletedTasks.splice(i, 1);
    clear();
    renderRecycleBin();
    setStorage();
}

document.querySelector('#newTaskForm').addEventListener('submit', function (event) {//added
    event.preventDefault();
    addTask();
    document.querySelector('#taskName').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#project').value = 'No Project';
    newTaskDialog.close();
});

function clear() {
    const parent = document.querySelector('#tasks');
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

const allTasksButton = document.querySelector('.allTasksButton')
allTasksButton.addEventListener('click', () => {
    clear();
    activeView = 0;
    whatToRender();
    changeTaskHeader("All Tasks")
});

const todayButton = document.querySelector('.todayButton');
todayButton.addEventListener('click', () => {
    clear();    
    activeView = 1;
    whatToRender();
    changeTaskHeader("Today");
});

const sevenDayButton = document.querySelector('.sevenDayButton');
sevenDayButton.addEventListener('click', () => {
    clear();
    activeView = 2;
    whatToRender();
    changeTaskHeader("Seven Day View");
});

const completedButton = document.querySelector('.completedButton');
completedButton.addEventListener('click', () => {
    clear();
    renderCompleted();
    changeTaskHeader("Completed Tasks");
});

const recycleBinButton = document.querySelector('.recycleBinButton');
recycleBinButton.addEventListener('click', () => {
    clear();
    renderRecycleBin();
    changeTaskHeader("Recycle Bin");
})

function openModal(projectModal) {
    document.querySelector('#projectName').value = '';
    const modal = document.querySelector(`#${projectModal}`);
    const overlay = document.querySelector(".overlay");
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

}

function closeModal(projectModal) {
    const modal = document.querySelector(`#${projectModal}`);
    const overlay = document.querySelector(".overlay");
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.querySelector('.modalEditButton').removeEventListener('click', buttonEvent);
};

function addToCompleted(index) { 
    let removedTask = allTasks.splice(index, 1);
    removedTask.forEach(task => {
        task.completedDate = new Date().toDateString();
    });
    completedArray.push(removedTask[0]);
    whatToRender();
    setStorage();

}

function changeTaskHeader(view) { 
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
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}
function updateVariablesFromStorage() {
    allTasks = JSON.parse(localStorage.getItem('allTasks'));
    todayArray = JSON.parse(localStorage.getItem('todayArray'));
    sevenDayArray = JSON.parse(localStorage.getItem('sevenDayArray'));
    completedArray = JSON.parse(localStorage.getItem('completedArray'));
    projectNames = JSON.parse(localStorage.getItem('projectNames'));
    deletedTasks = JSON.parse(localStorage.getItem('deletedTasks'));
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
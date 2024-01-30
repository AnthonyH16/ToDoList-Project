const allTasks = [];

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }
}


const dialog = document.querySelector('dialog');

const newTask = document.querySelector('.newTask');
newTask.addEventListener('click', () => {
    dialog.showModal();    
});

function addTask(){
    const title = document.querySelector('#taskName').value;
    const description = document.querySelector('#description').value;
    const date = document.querySelector('#date').value;
    const priority = document.querySelector('#priority').value;
    const newTask = new Task(title, description, date, priority) ;
    allTasks.push(newTask);
    renderTasks();
}

const closeButton = document.querySelector('#close');
closeButton.addEventListener("click", () => {   
    document.querySelector('#taskName').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#priority').value = '';
    dialog.close();
  });

let isSidebarOpen ;

function openSidebar(){
    document.querySelector('.sidebar').style.width= '250px';    
    isSidebarOpen = true;
}

function closeSidebar(){
    document.querySelector('.sidebar').style.width= '0';
    isSidebarOpen = false;
}


function renderTasks(){
    document.querySelector('#tasks').innerHTML = '';    
    for (const task of allTasks){
        document.querySelector('#tasks').innerHTML += 
        `<li><button type='button' id=taskDoneButton></button>
        <div class = 'taskInfo'> <p class = 'taskTitle'>${task.title}</p>
        <p>${task.description}</p>
        <p>${task.dueDate}
        </div>
        </li>`;
    }
    

}
const sidebarButton = document.querySelector('.sidebarButton');
sidebarButton.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    if(isSidebarOpen == true){
    closeSidebar();}
    else {
        openSidebar();
    }
    
//     if (sidebar.firstChild) {
//         while (sidebar.firstChild) {
//             sidebar.firstChild.remove();
//         }
//     }
//     else { populateSidebar(); }
});

renderTasks();

document.querySelector('#newTaskForm').addEventListener('submit', function(event){
    event.preventDefault();
    addTask();      
    document.querySelector('#taskName').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#priority').value = '';
    dialog.close();
  });
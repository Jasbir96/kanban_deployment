// Modal Pop up and Modal pop Down

const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const taskArea = document.querySelector(".textArea-cont");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const toolBoxPriorityColors = document.querySelectorAll(".color");


const colors = ["lightpink", "lightgreen", "lightblue", "black"];

const lockClass = "fa-lock";
const unlockClass = "fa-lock-open";
// representing all the tickets
const ticketArr = [];

// Flags
let addBtnFlag = false;
let modalPriorityColor = "lightpink";


// ui -> load -> check the local storage -> data -> show those ticket

function init() {

  // 1. check the local storage ->data -> 
  const data = localStorage.getItem("ticketsArr");
  if (data) {
    const jsonData = JSON.parse(data);
    // console.log("tasks in last load",data)
    // 2. show those ticket-> create 
    for (let i = 0; i < jsonData.length; i++) {
      const ticketData = jsonData[i];
      createTicket(ticketData.task, ticketData.id, ticketData.color)
    }
  }


}
init();




addBtn.addEventListener("click", function () {
  addBtnFlag = !addBtnFlag;
  if (addBtnFlag === true) {
    // Open the Modal
    modalCont.style.display = "flex";
  } else {
    // close the Modal
    modalCont.style.display = "none";
  }
});


// -> ticket = {id, color, description }
// 
// Modal Event to get the task and createTicket
modalCont.addEventListener("keydown", function (e) {
  if (e.key == "Shift") {
    let id = shortid();
    // console.log(id);
    let task = taskArea.value;

    createTicket(task, id, modalPriorityColor);
    taskArea.value = "";
    modalCont.style.display = "none";
    addBtnFlag = false;
  }
});

// Create Ticket Function
function createTicket(ticketTask, ticketID, ticketColor) {
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");

  ticketCont.innerHTML = `
    <div class="ticket-color" style="background-color: ${ticketColor};" ></div>
             <div class="ticket-id">${ticketID}</div>
             <div class="task-area">${ticketTask}</div>
              <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i> 
            
                
              </div>
    `;

  mainCont.appendChild(ticketCont, ticketID);
  // update text
  handleLock(ticketCont,ticketID);
  // update color
  handleColor(ticketCont,ticketID);
  const ticketData = {
    id: ticketID,
    task: ticketTask,
    color: ticketColor
  }
  // adding the ticket data in your  ticket array
  ticketArr.push(ticketData);
  // console.log(ticketArr);
  updateLocalStorage();
}

// moving the active class on priority color boxes

allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    allPriorityColors.forEach(function (priorityColor) {
      priorityColor.classList.remove("active");
    });

    colorElem.classList.add("active");
    modalPriorityColor = colorElem.classList[0];
  });
});

// locking Mechanism
function handleLock(ticket, ticketID) {
  let ticketLockCont = ticket.querySelector(".ticket-lock");
  let ticketLockIcon = ticketLockCont.children[0];
  let ticketTaskArea = ticket.querySelector(".task-area");

  ticketLockIcon.addEventListener("click", function () {
    if (ticketLockIcon.classList.contains(lockClass)) {
      ticketLockIcon.classList.remove(lockClass);
      ticketLockIcon.classList.add(unlockClass);

      // when the lock is open allow to edit task
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockIcon.classList.remove(unlockClass);
      ticketLockIcon.classList.add(lockClass);
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
    // fetch the content
    const updatedTask = ticketTaskArea.textContent;
    //  serach through the tikcets -> update the content
    for (let i = 0; i < ticketArr.length; i++) {
      const obj = ticketArr[i];
      // required ticket -> update it's task
      if(obj.id==ticketID){
        obj.task=updatedTask;
      }
    }

    // update the modified array
    updateLocalStorage();
    //  search the ticket  -> content
    // console.log("textcontent",textContent);
    // console.log("ticket",ticket);
    // console.log(ticketArr);
    // console.log("```````````````````````````````````") 
    // console.log(ticketLockIcon);
  });
}

// Chaning the color band of tickets
function handleColor(ticket,ticketID) {
  let ticketColorBand = ticket.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", function () {
    let currColor = ticketColorBand.style.backgroundColor; // lightgreen

    let currColorIndex = colors.findIndex(function (color) {
      return color === currColor;
    });

    currColorIndex++;

    let newColorIndex = currColorIndex % colors.length;
    let newColor = colors[newColorIndex];

    ticketColorBand.style.backgroundColor = newColor;
// search the ticket
    for (let i = 0; i < ticketArr.length; i++) {
      const obj = ticketArr[i];
      // required ticket -> update it's color
      if (obj.id == ticketID) {

        obj.color=newColor
      }
    }
    // save to local storage 
    updateLocalStorage();
  });
}

toolBoxPriorityColors.forEach(function (color) {
  color.addEventListener("click", function () {
    // console.log(color)
    let allTickets = document.querySelectorAll(".ticket-cont");

    // console.log(allTickets);

    let selectedColor = color.classList[0];
    allTickets.forEach(function (ticket) {
      let ticketColorBand = ticket.querySelector('.ticket-color')
      if (ticketColorBand.style.backgroundColor === selectedColor) {
        ticket.style.display = "block";
      } else {
        ticket.style.display = "none";
      }
    });
  });
});


function updateLocalStorage() {
  localStorage.setItem("ticketsArr", JSON.stringify(ticketArr));
}
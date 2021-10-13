var uid=new ShortUniqueId();
let input=document.querySelector(".task_input");
let mainContainer=document.querySelector(".main-container");
addTask();



function createTask(id,task,defaultColor){
    let taskContainer=document.createElement("div");
    taskContainer.setAttribute("class","task_container");
    mainContainer.appendChild(taskContainer);
    // let defaultColor="black";
    let colors=["pink","blue","green","black"];
    taskContainer.innerHTML =`<div class="task_header ${defaultColor}"></div>
    <div class="task_main-container">
        <h3 class="task_id">#${id}</h3>
        <div class="text" contenteditable="true">${task}</div>
    </div>`
    colourChanger(taskContainer,colors);
    filter();
    lockUnlock(taskContainer);
    removeTask(taskContainer);
    // cross.style.backgroundColor="rgb(104, 95, 95)";
}

function colourChanger(taskContainer,colors)
{
    let taskHeader=taskContainer.querySelector(".task_header");
    taskHeader.addEventListener("click",function(){
        let cColor=taskHeader.classList[1];
        let idx=colors.indexOf(cColor);
        let nextIdx=(idx+1)%colors.length;
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(colors[nextIdx]);

    })
}

function filter(){
    let colorContainer=document.querySelector(".colour-container");
    let tasks=document.querySelectorAll(".task_header");
    let taskContainers=document.querySelectorAll(".task_container");
    let previousColor="";
    colorContainer.addEventListener("click",function(e){
    // console.log(e.target);
        if(e.target!=colorContainer)
        {   
            let color=e.target.classList[1];
                if(previousColor==color)
            {
                for(let i=0;i<tasks.length;i++)
                {
                    taskContainers[i].style.display="block";
                } 
                previousColor=""; 
            }else{
                for(let i=0;i<tasks.length;i++)
                {
                    let taskColor=tasks[i].classList[1];
                    if(taskColor!=color)
                    {
                        taskContainers[i].style.display="none";
                    }else{
                        taskContainers[i].style.display="block";
                    }
                }
                previousColor=color;
            }
        } 
    })
}

function lockUnlock(taskContainer){
    let lock=document.querySelector(".lock");
    let unlock=document.querySelector(".unlock");
    let textinput=taskContainer.querySelector(".text");
    lock.addEventListener("click",function(){
        textinput.contentEditable="false";
        unlock.style.backgroundColor="rgb(104, 95, 95)";
        lock.style.backgroundColor="grey";
    })
    unlock.addEventListener("click",function(){
        textinput.contentEditable="true";
        lock.style.backgroundColor="rgb(104, 95, 95)";
        unlock.style.backgroundColor="grey";
    })
}

function removeTask(taskContainer)
{
    let cross=document.querySelector(".cross");
    let previous="add";
    cross.addEventListener("click",function(e){
        // console.log("clicked",previous);
        if(previous=="cross")
        {
            cross.classList.remove("active");
            // console.log("if",previous);
            previous="add";
        }
        else{   
                // console.log("else",previous);
                cross.classList.add("active");
                taskContainer.addEventListener("click",function(){
                    if(cross.classList.length==3)
                    {
                        taskContainer.remove();
                        if(mainContainer.childElementCount==0)
                        {
                            cross.classList.remove("active");
                        }
                    }
                })
                previous="cross";
            }
    })
}

function addTask(){
    
    let addButton=document.querySelector(".add");
    let addnew=false;
    let modal=document.querySelector(".input-modal");
    let colorArea=document.querySelector(".color-area");
    let defaultColor="blue";
    let selectedColor=document.querySelector(".selected");

    addButton.addEventListener("click",function(){

        if(addnew==false)
        {
            addButton.classList.add("active");
            modal.style.display="flex";
            addnew=true;
        }else{
            addButton.classList.remove("active");
            modal.style.display="none";
            addnew=false;
        }    
    })

    colorArea.addEventListener("click",function(e){
        if(e.target!=colorArea)
        {   
            let color=e.target.classList[1];
            defaultColor=color;
            selectedColor.classList.remove("selected");
            selectedColor=e.target;
            selectedColor.classList.add("selected");

        }
    })

    input.addEventListener("keydown",function(e){
        if(e.code=="Enter" && input.value)
        {
            let id=uid();
            createTask(id,input.value,defaultColor);
            input.value="";
            modal.style.display="none";
            addButton.classList.remove("active");
            addnew=false;
        }
    })


}
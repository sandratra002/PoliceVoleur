let positions = [];

for (let i = 0; i < 21; i++) {
    let position = document.getElementById(`position_${i}`);
    positions.push(position);
}

let polices = document.querySelectorAll(".entity.police");
let thief = document.querySelector(".entity.thief");


const move = (element, destination)=> {
    let board = document.getElementById("board");
    let boardRect = board.getBoundingClientRect();
    let elementRect = element.getBoundingClientRect();
    let rect = destination.getBoundingClientRect();
    console.log(elementRect);
    element.style.top =  (rect.top - boardRect.top - (elementRect.width/3)) + "px";
    element.style.left =  (rect.left - boardRect.left - (elementRect.width/3)) + "px";
}

window.onload = () =>{
    move(thief, positions[0]);
    move(polices[0], positions[1]);
    move(polices[1], positions[3]);
    move(polices[2], positions[4]);
}
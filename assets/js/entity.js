let positions = [];

let polices = document.querySelectorAll(".entity.police");
let thiefNode = document.querySelector(".entity.thief");

let entitiesNode = [];
entitiesNode.push(thiefNode);
entitiesNode.push(polices[0]);
entitiesNode.push(polices[1]);
entitiesNode.push(polices[2]);

const move = (element, destination)=> {
    let board = document.getElementById("board");
    let boardRect = board.getBoundingClientRect();
    let elementRect = element.getBoundingClientRect();
    let rect = destination.getBoundingClientRect();
    element.style.top =  (rect.top - boardRect.top - (elementRect.width/3)) + "px";
    element.style.left =  (rect.left - boardRect.left - (elementRect.width/3)) + "px";
}

document.addEventListener("DOMContentLoaded", () =>{
    for (let i = 0; i < 21; i++) {
        let position = document.getElementById(`position_${i}`);
        // position.innerHTML = i;
        positions.push(position);
    }
    move(thiefNode, positions[0]);
    move(polices[0], positions[1]);
    move(polices[1], positions[3]);
    move(polices[2], positions[4]);
})
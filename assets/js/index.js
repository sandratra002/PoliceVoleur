class Position {
  //Get all possible way from this position
  getPossibleWays(graph) {
    return this.neighbors.filter((i) => {
      return graph[i].element == null;
    });
  }

  //
  activatePossibleWay(state) {
    for (const position of state.positions) {
      position.desactivate();
    }
    let possibleWays = this.getPossibleWays(state.positions);
    console.log("Possible way");
    console.log(possibleWays);
    possibleWays.forEach((id) => {
      let temp = state.positions[id];
      temp.activate();

      positions[id].addEventListener(
        "click",
        () => {
          this.moveElement(id, state);
        },
        { once: true }
      );

    });
  }

  moveElement(id, state) {
    this.desactivate();
    this.element.moveTo(this.id, id, state);
    state.updateUI();
  }

  activate() {
    positions[this.id].classList.add("active");
  }

  desactivate() {
    positions[this.id].classList.remove("active");
    removeElementListeners(positions[this.id], positions,this.id);
    // positions[this.id].removeEventListener("click", this.moveElement);
  }

  constructor(id, neighbors = [], element = null) {
    this.id = id;
    this.element = element;
    this.neighbors = neighbors;
  }
}

class Entity {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }

  static policeListener(state) {
    for (let i = 0; i < state.entities.length; i++) {
      if (state.entities[i] == "p") {
        let policeNode = entitiesNode[i];
        console.log(policeNode);
        policeNode.addEventListener("click", () => {
          Entity.disableEntities(state);
          
          state.entities[i].activate(state);
        });
      }
    }
    // }
  }

  static disableEntities (state) {
    state.entities.forEach((entity) => {entity.desactivate();});
  }

  moveTo(actualPosition, finalPosition, state) {
    let finalPositionObj = state.positions[finalPosition];

    let actualPositioObj = state.positions[actualPosition];

    actualPositioObj.element = null;
    finalPositionObj.element = this;
    state.updateEntity(this);
  }

  getPosition (state) {
    let result = new Position();
    for (const position of state.positions) {
      if (position.element != null && position.element.id == this.id) {
        result = position;
        break;
      }
    }
    return result;
  }

  activate(state) {
    let currentPosition = this.getPosition(state);
    state.positions.forEach((position) => {
      position.desactivate();
    });
    currentPosition.activatePossibleWay(state);
    entitiesNode[this.id].classList.add("active");
    entitiesNode[this.id].click();
  }

  desactivate() {
    entitiesNode[this.id].classList.remove("active");
    removeElementListeners(entitiesNode[this.id], entitiesNode,this.id);
  }
}

class State {
  constructor(entities = [new Entity()], positions = [new Position()]) {
    this.entities = entities;
    this.positions = positions;
    this.currentPlayer = null;
  }

  updateEntity(entity) {
    if (entity.type == "t") {
      this.currentPlayer = this.entities[1];
      Entity.policeListener(this);
    } else {
      Entity.disableEntities(this);
      this.currentPlayer = this.entities[0];
    }
    this.currentPlayer.activate(this);
  }

  updateUI() {
    for (const position of this.positions) {
      if (position.element != null) {
        let element = position.element;
        let finalPositionNode = positions[position.id];

        move(entitiesNode[element.id], finalPositionNode);
      }
    }
    let player_type = document.querySelector(".player_type");
    player_type.textContent = this.currentPlayer.type == "t" ? "Thief" : "Police";
  }
}

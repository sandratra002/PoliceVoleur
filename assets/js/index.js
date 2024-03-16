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
      positions[position.id].classList.remove("active");
    }
    let possibleWays = this.getPossibleWays(state.positions);
    possibleWays.forEach((id) => {
      let temp = state.positions[id];
      temp.activate();
      positions[id].addEventListener(
        "click",
        () => {
          this.element.moveTo(this.id, id, state);
          state.updateUI();
        },
        { once: true }
      );
    });
  }

  activate() {
    positions[this.id].classList.add("active");
  }

  desactivate() {
    positions[this.id].classList.remove("active");
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

  policeListener (state) {
    for (const police of polices) {
      police.addEventListener("click", () => {

      })
    }
  }

  moveTo(actualPosition, finalPosition, state) {
    let finalPositionObj = state.positions[finalPosition];

    let actualPositioObj = state.positions[actualPosition];

    actualPositioObj.element = null;
    finalPositionObj.element = this;
    state.updateEntity(this);
  }

  activate() {
    entitiesNode[this.id].classList.add("active");
  }

  desactivate() {
    entitiesNode[this.id].classList.remove("active");
  }
}

class State {
  constructor(entities, positions) {
    this.entities = entities;
    this.positions = positions;
    this.currentPlayer = null;
  }

  updateEntity (entity) {
    if (entity.type == "t") {
      this.currentPlayer = null;
    } else {
      this.currentPlayer = entity;
    }
  }

  updateUI() {
    for (const position of this.positions) {
      if (position.element != null) {
        let element = position.element;
        let finalPositionNode = positions[position.id];

        move(entitiesNode[element.id], finalPositionNode);
        element.desactivate();
      }
      position.desactivate();
    }
  }
}

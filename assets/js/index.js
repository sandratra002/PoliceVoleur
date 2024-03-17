class Position {
  //AI Algo
  //TODO: getWaysTo(Destinatio) : Done, getShortestWayTo(destination)
  getShortestPathTo(targetId, graph) {
    let allPaths = this.getPathsTo(targetId, graph);
    let pathLengths = allPaths.map((path) => path.length);
    let result = allPaths[pathLengths.indexOf(Math.min(...pathLengths))];
    if (result) {
      return result;
    } else {
      return [];
    }
  }

  getPathsTo(targetId, graph) {
    let queue = [[this.id]];
    let allPaths = [];
    let visited = [];

    while (queue.length > 0) {
      let currentPath = queue.shift();
      let lastElement = currentPath[currentPath.length - 1];

      if (lastElement == targetId) {
        allPaths.push(currentPath);
      } else {
        if (
          !visited.includes(lastElement) &&
          graph[lastElement].element == null
        ) {
          visited.push(lastElement);
          for (const neighbor of graph[lastElement].neighbors) {
            let path = currentPath.concat(neighbor);
            queue.push(path);
          }
        }
      }
    }

    return allPaths;
  }

  //Done

  static disablePositions(state) {
    state.positions.forEach((position) => {
      position.desactivate();
    });
  }
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
    removeElementListeners(positions[this.id], positions, this.id);
    // positions[this.id].removeEventListener("click", this.moveElement);
  }

  constructor(id, neighbors = [-1], element = null) {
    this.id = id;
    this.element = element;
    this.neighbors = neighbors;
  }
}

class Entity {
  constructor(id = -1, type = "t") {
    this.id = id;
    this.type = type;
  }

  static policeListener(state) {
    for (let i = 0; i < state.entities.length; i++) {
      if (state.entities[i].type == "p") {
        let policeNode = entitiesNode[i];
        policeNode.addEventListener("click", () => {
          // Entity.disableEntities(state);
          state.entities.forEach((entity, index) => {
            entitiesNode[index].classList.remove("active");
          });

          state.entities[i].activate(state);
        });
      }
    }
  }

  static disableEntities(state) {
    state.entities.forEach((entity) => {
      entity.desactivate();
    });
  }

  moveTo(actualPosition, finalPosition, state, needUpdate = true) {
    let finalPositionObj = state.positions[finalPosition];

    let actualPositioObj = state.positions[actualPosition];

    actualPositioObj.element = null;
    finalPositionObj.element = this;
    // console.log("Is Winning :" + this.isWinning(state));
    // if (this.isWinning(state)) {

    // } else {
      if (needUpdate){
        state.updateEntity(this);
      }
    // }
  }

  getPosition(state) {
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
    Position.disablePositions(state);
    currentPosition.activatePossibleWay(state);
    entitiesNode[this.id].classList.add("active");
    entitiesNode[this.id].click();
  }

  desactivate() {
    entitiesNode[this.id].classList.remove("active");
    removeElementListeners(entitiesNode[this.id], entitiesNode, this.id);
  }

  isWinning(state) {
    if (this.type == "t") {
      let position = this.getPosition(state);
      if (thiefWinningConditions.includes(position.id)) {
        return true;
      } else {
        return false;
      }
    } else {
      let isWinning = false;
      for (const conditionId of policeWinningConditions) {
        let position = state.positions[conditionId];
        let possibleWays = position.getPossibleWays(state.positions);
        if (
          possibleWays.length == 0 &&
          position.element != null &&
          position.element.type == "t"
        ) {
          isWinning = true;
          break;
        }
      }
      return isWinning;
    }
  }
}

class State {
  constructor(entities = [new Entity()], positions = [new Position()]) {
    this.entities = entities;
    this.positions = positions;
    this.currentPlayer = null;
    this.mouvement = 0;
  }

  getThief () {
    return this.entities[0];
  }

  getPolices () {
    return this.entities.filter((entity) => entity.type == "p");
  }

  //TODO: calculating current point for police and thief(method)
  calculateThiefPoint () {
    if (this.currentPlayer.isWinning(this)) {
      return -20;
    }
    let position = this.currentPlayer.getPosition(this);
    let shortestPath = position.getShortestPathTo(0, this.positions);
    if (shortestPath.length > 0){
      if (shortestPath.length > 5) return -5;
      else if (shortestPath.length < 5 && shortestPath.length > 2) return -10;
      else return -15;
    } else {
      if (firstLayer.includes(position.id)) return -15;
      else if (secondLayer.includes(position.id)) return -10;
      else return -5;
    }
  }
  
  calculatePolicePoint () {
    if (this.currentPlayer.isWinning(this)) {
      return 20;
    }
    let thief = this.getThief();
    let position = thief.getPosition(this);
    let shortestPath = position.getShortestPathTo(0, this.positions);
    if (shortestPath.length > 0){
      if (shortestPath.length > 5) return 15;
      else if (shortestPath.length < 5 && shortestPath.length > 2) return 10;
      else return 5;
    } else {
      if (firstLayer.includes(position.id)) return 5;
      else if (secondLayer.includes(position.id)) return 10;
      else return 15;
    }
  }

  calculatePoint() {
    if (this.currentPlayer.type == "t") {
      return this.calculateThiefPoint();
    } else {
      return this.calculatePolicePoint();
    }
  }

  checkWinning(entity) {
    if (entity.isWinning(this)) {
      let message = "Thief wins";
      if (entity.type != "t") message = "Polices win";
      let winnerStatus = document.querySelector(".winner_status");
      winnerStatus.innerHTML = message;
      return true;
    }
    return false;
  }

  updateEntity(entity) {
    if (this.mouvement > 1) {
      let bool = this.checkWinning(entity);
      if (bool) {
        Entity.disableEntities(this);
        Position.disablePositions(this);
        return;
      }
    }
    if (entity.type == "t") {
      // let bestMove = getBestMove(this, 10, true);
      // let police = this.getPolices()[bestMove.entityId];
      // police.moveTo(police.getPosition(this).id, bestMove.positionId, this);

      //Without AI
      this.currentPlayer = this.entities[1];
      Entity.policeListener(this);
      this.currentPlayer.activate(this);
    } else {
      Entity.disableEntities(this);
      // this.currentPlayer.desactivate();
      this.currentPlayer = this.entities[0];
    }
    this.mouvement++;
  }

  updateUI() {
    for (const position of this.positions) {
      if (position.element != null) {
        let element = position.element;
        let finalPositionNode = positions[position.id];

        move(entitiesNode[element.id], finalPositionNode);
        position.desactivate();
      }
    }
    let player_type = document.querySelector(".player_type");
    player_type.textContent =
      this.currentPlayer.type == "t" ? "Thief" : "Police";
  }
}

const getBestMove = (state = new State(),depth = 0, isMaximizing = true, visitedCase = []) => {
  let point = state.calculatePoint();
  if (point == 20 || point == -20 || depth == 0) {
    return point;
  }

  let bestPoint = 0;
  let bestMove = {};

  if (isMaximizing) {
    bestPoint = -Infinity;
    for (const police of state.getPolices()) {
      let position = police.getPosition(state);
      let moves = position.getPossibleWays(state.positions);
      for (const move of moves) {
        let newState = cloneObject(state);
        newState.currentPlayer = police;
        police.moveTo(position.id, move, newState, false);
        // console.log(newState);
        if (!contains(visitedCase, newState)) {
          visitedCase.push(newState);
          let tempPoint = getBestMove(newState, depth - 1, false, visitedCase);
          if (tempPoint > bestPoint) {
            bestPoint = tempPoint;
            bestMove = {
              entityId : police.id,
              positionId : move
            };
          }
        }
      }
    }
  } else {
    bestPoint = Infinity;
    let thief = state.getThief();
    let position = thief.getPosition(state);
    let possiblePath = position.getPossibleWays(state.positions);
    for (const path of possiblePath){
      let newState = cloneObject(state);
      newState.currentPlayer = thief;
      thief.moveTo(position.id, path, state, false);
      if (!contains(visitedCase, newState)) {
        visitedCase.push(newState);
        let tempPoint = getBestMove(newState, depth - 1, true, visitedCase);
        if (tempPoint < bestPoint) {
          bestPoint = tempPoint;
          bestMove = {
            entityId : thief.id,
            positionId : path
          }
        }
      }
    }
  }

  return isMaximizing ? bestMove : bestPoint;
};
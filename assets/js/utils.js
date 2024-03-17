function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function deepEqual(obj1, obj2) {
    // Base cases: primitive types, null, undefined
    if (obj1 === obj2) return true; // Identical references
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false; // Not both objects
    }
  
    // Check for array length equality
    if (Array.isArray(obj1) && Array.isArray(obj2) && obj1.length !== obj2.length) {
      return false;
    }
  
    // Create a set of keys for each object
    const keys1 = new Set(Object.keys(obj1));
    const keys2 = new Set(Object.keys(obj2));
  
    // Check if keys have the same length
    if (keys1.size !== keys2.size) return false;
  
    // Iterate over keys and compare values recursively
    for (const key of keys1) {
      if (!keys2.has(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }
  
  const contains = (arr, obj) => {
    for (const i of arr) {
      if (deepEqual(obj, i)) {
        return true;
      }
    }
    return false;
  }

  const cloneObject = (obj) => {
    if (obj === null || typeof obj !== "object") {
        return obj;
      }
    
      // Check if the object is of type State
      if (obj instanceof State) {
        const entities = cloneObject(obj.entities);
        const graph = obj.positions.map(position => cloneObject(position));
        return new State(entities, graph);
      }
       let newObj;
      if (obj instanceof Entity){
        newObj = new Entity();
      } else if (obj instanceof Position) {
        newObj = new Position();
      } else {
        newObj = [];    
      }
    
      for (const key in obj) {
        newObj[key] = cloneObject(obj[key]);
      }
    
      return newObj;
}
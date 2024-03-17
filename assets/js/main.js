window.onload = () => {
    let thief = new Entity(0, "t");
    let police1 = new Entity(1, "p");
    let police2 = new Entity(2, "p");
    let police3 = new Entity(3, "p");
    let entities = [thief, police1, police2, police3];

    let graph = [
        new Position(0, [1, 2, 3, 4], thief),
        new Position(1, [0, 3, 4, 6], police1),
        new Position(2, [0, 3, 4, 9]),
        new Position(3, [0, 1, 2, 16], police2),
        new Position(4, [0, 1, 2, 19], police3),
        // new Position(0, [1, 2, 3, 4]),
        // new Position(1, [0, 3, 4, 6]),
        // new Position(2, [0, 3, 4, 9]),
        // new Position(3, [0, 1, 2, 16]),
        // new Position(4, [0, 1, 2, 19]),

        new Position(5, [7, 6, 8]),
        new Position(6, [7, 5, 8, 1]),
        new Position(7, [5, 6, 13]),
        new Position(8, [5, 6, 17]),

        new Position(9, [2, 10, 11, 12]),
        new Position(10, [11, 12, 9]),
        new Position(11, [9, 10, 14]),
        new Position(12, [9, 10, 18]),

        new Position(13, [16, 15, 7]),
        new Position(14, [11, 15, 16]),
        new Position(15, [13, 14, 16]),
        new Position(16, [3, 13, 14, 15]),

        new Position(17, [8, 19, 20]),
        new Position(18, [12, 19, 20]),
        new Position(19, [4, 17, 18, 20]),
        new Position(20, [17, 18, 19]),
    ];

    let state = new State(entities, graph);
    thief.activate(state);
    // console.log(graph[10].getShortestPathTo(0, state.positions));
    // Entity.policeListener(state);
};

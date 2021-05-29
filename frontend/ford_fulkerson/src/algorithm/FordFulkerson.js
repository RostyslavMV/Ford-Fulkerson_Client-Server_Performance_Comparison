function bfs(rGraph, s, t, parent) {
    const visited = [];
    const queue = [];
    const V = rGraph.length;
    for (let i = 0; i < V; i++) {
        visited[i] = false;
    }
    queue.push(s);
    visited[s] = true;
    parent[s] = -1;

    while (queue.length !== 0) {
        const u = queue.shift();
        for (let v = 0; v < V; v++) {
            if (visited[v] === false && rGraph[u][v] > 0) {
                if (v === t) {
                    parent[v] = u;
                    return true;
                }

                queue.push(v);
                parent[v] = u;
                visited[v] = true;
            }
        }
    }
    return (visited[t] === true);
}

export function fordFulkersonJS(graph, s, t) {
    let v;
    let u;
    const rGraph = [];
    for (u = 0; u < graph.length; u++) {
        const temp = [];
        for (v = 0; v < graph.length; v++) {
            temp.push(graph[u][v]);
        }
        rGraph.push(temp);
    }
    const parent = [];
    let maxFlow = 0;

    while (bfs(rGraph, s, t, parent)) {
        let pathFlow = Number.MAX_VALUE;
        for (v = t; v !== s; v = parent[v]) {
            u = parent[v];
            pathFlow = Math.min(pathFlow, rGraph[u][v]);
        }
        for (v = t; v !== s; v = parent[v]) {
            u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;
        }
        maxFlow += pathFlow;
    }

    return maxFlow;
}
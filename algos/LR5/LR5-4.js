function hasCycleUndirected(graph) {
    const visited = new Set();

    function dfs(node, parent) {
        visited.add(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor, node)) return true;
            } else if (neighbor !== parent) {
                return true;
            }
        }
        return false;
    }

    for (const node in graph) {
        if (!visited.has(node) && dfs(node, null)) {
            return true;
        }
    }
    return false;
}

const undirectedGraph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A'],
    'D': ['B']
};
console.log(hasCycleUndirected(undirectedGraph));

const cyclicUndirectedGraph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
};
console.log(hasCycleUndirected(cyclicUndirectedGraph));

// Время: O(V + E)
// Память: O(V)
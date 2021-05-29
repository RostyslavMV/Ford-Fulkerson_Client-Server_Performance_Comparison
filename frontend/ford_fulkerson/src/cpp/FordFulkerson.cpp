#include <iostream>
#include <limits.h>
#include <queue>
#include <string.h>

extern "C" {

bool bfs(int** rGraph, int s, int t, int parent[], int size)
{
    bool visited[size];
    memset(visited, 0, sizeof(visited));
    std::queue<int> q;
    q.push(s);
    visited[s] = true;
    parent[s] = -1;

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v = 0; v < size; v++) {
            if (visited[v] == false && rGraph[u][v] > 0) {
                if (v == t) {
                    parent[v] = u;
                    return true;
                }
                q.push(v);
                parent[v] = u;
                visited[v] = true;
            }
        }
    }

    return false;
}

int fordFulkerson(int* graph, int s, int t, int size)
{
    int u, v;
    int** rGraph = new int*[size];
    for (u = 0; u < size; u++){
        rGraph[u] = new int[size];
        for (v = 0; v < size; v++)
            rGraph[u][v] = graph[u*size + v];
    }


    int parent[size];

    int max_flow = 0;
    while (bfs(rGraph, s, t, parent, size)) {
        int path_flow = INT_MAX;
        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            path_flow = std::min(path_flow, rGraph[u][v]);
        }
        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            rGraph[u][v] -= path_flow;
            rGraph[v][u] += path_flow;
        }
        max_flow += path_flow;
    }
    for( int i = 0 ; i < size ; i++ )
         {
             delete[] rGraph[i];
         }
    delete[] rGraph;
    return max_flow;
}
}
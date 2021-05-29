package com.rmv.service;

import org.springframework.stereotype.Service;

import java.util.LinkedList;

@Service
public class FordFulkersonMaxFlowService {

    boolean bfs(int[][] rGraph, int s, int t, int[] parent)
    {
        boolean[] visited = new boolean[rGraph.length];
        for (int i = 0; i < rGraph.length; ++i)
            visited[i] = false;
        LinkedList<Integer> queue
                = new LinkedList<>();
        queue.add(s);
        visited[s] = true;
        parent[s] = -1;

        while (queue.size() != 0) {
            int u = queue.poll();

            for (int v = 0; v < rGraph.length; v++) {
                if (!visited[v]
                        && rGraph[u][v] > 0) {
                    if (v == t) {
                        parent[v] = u;
                        return true;
                    }
                    queue.add(v);
                    parent[v] = u;
                    visited[v] = true;
                }
            }
        }

        return false;
    }

    public int fordFulkerson(int[][] graph, int s, int t)
    {
        int u, v;

        int[][] rGraph = new int[graph.length][graph.length];

        for (u = 0; u < graph.length; u++)
            for (v = 0; v < graph.length; v++)
                rGraph[u][v] = graph[u][v];


        int[] parent = new int[graph.length];

        int maxFlow = 0;

        while (bfs(rGraph, s, t, parent)) {
            int pathFlow = Integer.MAX_VALUE;
            for (v = t; v != s; v = parent[v]) {
                u = parent[v];
                pathFlow
                        = Math.min(pathFlow, rGraph[u][v]);
            }

            for (v = t; v != s; v = parent[v]) {
                u = parent[v];
                rGraph[u][v] -= pathFlow;
                rGraph[v][u] += pathFlow;
            }

            maxFlow += pathFlow;
        }

        return maxFlow;
    }
}

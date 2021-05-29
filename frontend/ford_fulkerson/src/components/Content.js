import {BrowserRouter} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {fordFulkersonJS} from "../algorithm/FordFulkerson";
import axios from "axios";
import Graph from "react-graph-vis";
import {uuid} from 'uuidv4';

import FordFulkerson from '../FordFulkerson.js';
import FordFulkersonWASM from '../FordFulkerson.wasm';

function Content() {
    const graphVisMaxSize = 20;
    const fordFulkerson = FordFulkerson({
        locateFile: () => {
            return FordFulkersonWASM;
        },
    });
    let [graphKey] = useState(uuid())
    const [graph, setGraph] = useState([]);
    const [graphVis, setGraphVis] = useState({nodes: [], edges: []});
    const [size, setSize] = useState(50);
    const [timeResults, setTimeResults] = useState([["", "", "", "", ""]])
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (graph.length !== 0) {
            console.log(graph);
            updateGraphViz();
        }
    }, [graph]);

    useEffect(() => {
        console.log(disable);
    }, [disable]);

    const getGraph = () => {
        axios.get('http://localhost:8180/matrix', {params: {size: size}}).then(resp => {
            setGraph(resp.data)
            setDisable(false);
            setTimeResults([["", "", "", "", ""]]);
        }).catch(error => console.log(error))
    }

    const updateGraphViz = () => {
        const newGraphVis = {
            nodes: [],
            edges: []
        };
        for (let i = 0; i < graph.length; i++) {
            newGraphVis.nodes.push({id: i, label: "Node " + i, title: "node " + i + " tootip text"});
            for (let j = 0; j < graph.length; j++) {
                if (graph[i][j] !== 0) {
                    newGraphVis.edges.push({
                        id: (graph.length + 1) * i + j,
                        from: i,
                        to: j,
                        label: graph[i][j].toString()
                    });
                }
            }
        }
        let i = 0;
        newGraphVis.nodes[i] = {
            id: i,
            label: "Node " + i,
            title: "node " + i + " tootip text",
            color: "rgba(50,250,50,0.2)"
        }
        i = graph.length - 1;
        newGraphVis.nodes[i] = {
            id: i,
            label: "Node " + i,
            title: "node " + i + " tootip text",
            color: "rgba(250,50,50,0.2)"
        }
        setGraphVis(newGraphVis);
    }

    const options = {
        layout: {
            improvedLayout: true,
            hierarchical: false
        },
        edges: {
            color: "rgba(0,0,0,0.4)"
        },
        nodes: {
            physics: true,
            color: "rgba(50,50,250,0.2)",
        },
        physics: {
            barnesHut: {
                springConstant: 0,
                avoidOverlap: 0.2
            }
        },
        height: "1500px"
    };

    const events = {
        select: function (event) {
            const {nodes, edges} = event;
        }
    };

    const onJsClick = () => {
        if (graph.length !== 0) {
            let newTimeResults = [...timeResults];
            const start = performance.now();
            let flow = fordFulkersonJS(graph, 0, graph.length - 1)
            const finish = performance.now();
            let updated = false;
            for (let i = 0; i < timeResults.length; i++) {
                if (newTimeResults[i][0] === "") {
                    updated = true;
                    newTimeResults[i][0] = (finish - start).toString()
                    newTimeResults[i][4] += " JS: " + flow.toString()
                    break;
                }
            }
            if (!updated) {
                newTimeResults.push([(finish - start).toString(), "", "", "", "JS: " + flow.toString()])
            }
            setTimeResults(newTimeResults);
        }
    }

    const onWebAssemblyClick = () => {
        if (graph.length !== 0) {
            fordFulkerson.then((Module) => {
                const arr = [].concat.apply([], graph);
                const input_array = new Int32Array(arr);
                const len = input_array.length;
                const bytes_per_element = input_array.BYTES_PER_ELEMENT;
                const input_ptr = Module._malloc(len * bytes_per_element);
                Module.HEAP32.set(input_array, input_ptr / bytes_per_element);
                const start = performance.now();
                const flow = Module.ccall('fordFulkerson', 'number', ['number', 'number', 'number', 'number'], [input_ptr, 0, size - 1, size]);
                const finish = performance.now();
                Module._free(input_ptr);
                let newTimeResults = [...timeResults];
                let updated = false;
                for (let i = 0; i < timeResults.length; i++) {
                    if (newTimeResults[i][1] === "") {
                        updated = true;
                        newTimeResults[i][1] = (finish - start).toString()
                        newTimeResults[i][4] += " WASM: " + flow.toString()
                        break;
                    }
                }
                if (!updated) {
                    newTimeResults.push(["", (finish - start).toString(), "", "", " WASM: " + flow.toString()])
                }
                setTimeResults(newTimeResults);

            });
        }
    }

    const onJavaClick = () => {
        const start = performance.now();
        axios.get('http://localhost:8180/time/java').then(resp => {
            const flow = resp.data.flow;
            const timeMs = resp.data.timeMs;
            console.log(performance.now() - start)
            let newTimeResults = [...timeResults];
            let updated = false;
            for (let i = 0; i < timeResults.length; i++) {
                if (newTimeResults[i][2] === "") {
                    updated = true;
                    newTimeResults[i][2] = timeMs.toString()
                    newTimeResults[i][4] += " Java: " + flow.toString()
                    break;
                }
            }
            if (!updated) {
                newTimeResults.push(["", "", timeMs.toString(), "", " Java: " + flow.toString()])
            }
            setTimeResults(newTimeResults);
        }).catch(error => console.log(error))
    }

    const onJniClick = () => {
        axios.get('http://localhost:8180/time/jni').then(resp => {
            const flow = resp.data.flow;
            const timeMs = resp.data.timeMs;
            let newTimeResults = [...timeResults];
            let updated = false;
            for (let i = 0; i < timeResults.length; i++) {
                if (newTimeResults[i][3] === "") {
                    updated = true;
                    newTimeResults[i][3] = timeMs.toString()
                    newTimeResults[i][4] += " JNI: " + flow.toString()
                    break;
                }
            }
            if (!updated) {
                newTimeResults.push(["", "", "", timeMs.toString(), " JNI: " + flow.toString()])
            }
            setTimeResults(newTimeResults);
        }).catch(error => console.log(error))
    }

    return (
        <div>
            <BrowserRouter>
                {graph.length !== 0 ? graph.length <= graphVisMaxSize ?
                    <div style={{height: "450px", overflowY: "scroll"}} className={"container"}>
                        <Graph
                            key={graphKey}
                            graph={graphVis}
                            options={options}
                            events={events}
                        />
                    </div>
                    :
                    <h2 style={{lineHeight: "200px", textAlign: "center"}} className={"container"}>Graph visualization
                        is not available for graph with more than {graphVisMaxSize} nodes</h2>
                    :
                    <h2 style={{lineHeight: "200px", textAlign: "center"}} className={"container"}>Graph is empty</h2>
                }
                <div className={"container"}>
                    <div style={{width: "400px"}}>
                        <form autoComplete={"off"}>
                            <div className="form-row row">
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <div style={{height: "50px"}} className="input-group-text">Nodes count</div>
                                    </div>
                                    <input type="text" name={"name"} value={size} maxLength={4}
                                           onChange={event => setSize(event.target.value.replace(/\D/, ''))}
                                           className="form-control" id="inlineFormInput"
                                           placeholder="Nodes count"/>
                                    <button style={{marginLeft: "20px", marginTop: "5px"}}
                                            className={"btn btn-primary mb-2"} type="button" onClick={() => {
                                        setDisable(true)
                                        getGraph()
                                        setDisable(false)
                                    }}>Generate
                                        graph
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <button style={{marginRight: "10px"}} type="button"
                            className={"btn btn-primary"}
                            onClick={() => {
                                setDisable(true)
                                onJsClick()
                                setDisable(false)
                            }} disabled={disable}>JavaScript
                    </button>
                    <button disabled={disable} style={{marginRight: "10px"}} type="button"
                            className={"btn btn-primary"}
                            onClick={() => {
                                setDisable(true)
                                onWebAssemblyClick()
                                setDisable(false)
                            }}>WebAssembly
                    </button>
                    <button disabled={disable} style={{marginRight: "10px"}} type="button"
                            className={"btn btn-primary"}
                            onClick={() => {
                                setDisable(true)
                                onJavaClick()
                                setDisable(false)
                            }}>Java
                    </button>
                    <button disabled={disable} style={{marginRight: "10px"}} type="button"
                            className={"btn btn-primary"}
                            onClick={() => {
                                setDisable(true)
                                onJniClick()
                                setDisable(false)
                            }}>JNI
                    </button>

                    <div style={{marginTop: "50px"}}>
                        <h2>Calculation time, ms</h2>
                        <table className={"table"}>
                            <thead>
                            <tr>
                                <th style={{width: "22%"}} scope="col">JavaScript</th>
                                <th style={{width: "22%"}} scope="col">WebAssembly</th>
                                <th style={{width: "22%"}} scope="col">Java</th>
                                <th style={{width: "22%"}} scope="col">JNI</th>
                                <th style={{width: "12%"}} scope="col">Max flow</th>
                            </tr>
                            </thead>
                            <tbody>
                            {timeResults.map((resultRow, index) => (
                                <tr key={index}>
                                    {resultRow.map(result =>
                                        <td>
                                            {result}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Content;
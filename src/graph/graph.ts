import { forEach } from '@/src/core';

export type GraphAdjMatrix = Map<string, Map<string, string>>;

export type GraphEdge<ED = unknown> = [string, string, ED];

export type GraphNode<ND = unknown> = [string, ND | undefined];

export const EDGE_DELIMETER = '$';

export class Graph<ND = unknown, ED = unknown> {
  _adjMatrix: GraphAdjMatrix;
  _edgeData: Map<string, ED>;
  _nodeData: Map<string, ND | undefined>;

  static create<ND, ED>(nodes: GraphNode<ND>[], edges: GraphEdge<ED>[]) {
    const graph = new Graph<ND, ED>();

    nodes.forEach((node) => {
      graph.addNode(node);
    });

    edges.forEach((edge) => {
      graph.addEdge(edge);
    });

    return graph;
  }

  constructor() {
    this._adjMatrix = new Map();
    this._edgeData = new Map();
    this._nodeData = new Map();
  }

  get nodeSize() {
    return this._adjMatrix.size;
  }

  get edgeSize() {
    return this._edgeData.size;
  }

  getNode(u: string): GraphNode<ND> {
    return [u, this._nodeData.get(u)];
  }

  addNode(node: GraphNode<ND>) {
    if (!this._adjMatrix.has(node[0])) {
      this._adjMatrix.set(node[0], new Map());
    }
    this._nodeData.set(node[0], node[1]);
  }

  removeNode(u: string) {
    this._nodeData.delete(u);
    this._adjMatrix.delete(u);
    forEach(this._adjMatrix.keys(), (v) => {
      this.removeEdge(v, u);
    });
  }

  getEdge(u: string, v: string): GraphEdge<ED> | undefined {
    const edgeId = this._adjMatrix.get(u)?.get(v);
    if (!edgeId) return undefined;
    return [u, v, this._edgeData.get(edgeId) as ED];
  }

  addEdge(edge: GraphEdge<ED>) {
    if (!this._adjMatrix.has(edge[1])) {
      this._adjMatrix.set(edge[1], new Map());
    }

    let edgesMap = this._adjMatrix.get(edge[0]);
    if (!edgesMap) {
      edgesMap = new Map();
      this._adjMatrix.set(edge[0], edgesMap);
    }

    const edgeId = this._makeEdgeId(edge[0], edge[1]);
    edgesMap.set(edge[1], edgeId);
    this._edgeData.set(edgeId, edge[2]);
  }

  removeEdge(u: string, v: string) {
    const edgeId = this._makeEdgeId(u, v);
    this._edgeData.delete(edgeId);
    this._adjMatrix.get(u)?.delete(v);
  }

  getEdgesFrom(u: string): IterableIterator<GraphEdge<ED>> {
    const that = this;
    const edgeIterator = that._adjMatrix.get(u)?.entries();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (!edgeIterator)
          return {
            done: true,
            value: undefined,
          };

        const edgeLink = edgeIterator.next();

        if (edgeLink.done)
          return {
            done: true,
            value: undefined,
          };

        return {
          done: false,
          value: [u, edgeLink.value[0], that._edgeData.get(edgeLink.value[1]) as ED],
        };
      },
    };
  }

  getAllEdges(): IterableIterator<GraphEdge<ED>> {
    const that = this;
    const nodesIterator = this.getAllNodes();
    let edgesIterator: Iterator<GraphEdge<ED>> | undefined;
    let node: string | undefined;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (node === undefined) {
          const { value, done } = nodesIterator.next();
          if (done)
            return {
              done: true,
              value: undefined,
            };
          node = value[0];
        }

        if (edgesIterator === undefined) {
          edgesIterator = that.getEdgesFrom(node);
        }

        const { done, value: edge } = edgesIterator.next();

        if (done) {
          node = undefined;
          edgesIterator = undefined;
          return this.next();
        }

        return {
          done: false,
          value: edge,
        };
      },
    };
  }

  getAllNodes(): IterableIterator<GraphNode<ND>> {
    const that = this;
    const nodeIterator = this._adjMatrix.keys();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        const node = nodeIterator.next();
        if (node.done)
          return {
            done: true,
            value: undefined,
          };

        return {
          done: false,
          value: [node.value, that._nodeData.get(node.value)],
        };
      },
    };
  }

  clear() {
    this._adjMatrix.clear();
    this._edgeData.clear();
    this._nodeData.clear();
  }

  _makeEdgeId(u: string, v: string) {
    return `${u}${EDGE_DELIMETER}${v}`;
  }
}

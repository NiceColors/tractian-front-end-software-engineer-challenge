import {
  AssetIcon,
  BoltIcon,
  ChevronDown,
  ChevronRight,
  ComponentIcon,
  LocationIcon,
} from "@/components/icons";
import { TreeNode, TreeProps } from "@/types/tree";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";

type FlattenedNode = TreeNode & {
  depth: number;
  isLastChild: boolean;
  isFirstChild: boolean;
  parentLastChildren: boolean[];
};

export default function Tree({ data, filters, onSelectNode }: TreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [flattenedData, setFlattenedData] = useState<FlattenedNode[]>([]);
  const listRef = useRef<List>(null);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  useEffect(() => {
    if (filters.search || filters.status) {
      const allNodeIds = new Set<string>();
      const addNodeIds = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          allNodeIds.add(node.id);
          if ("children" in node && node.children) {
            addNodeIds(node.children);
          }
        });
      };
      addNodeIds(data);
      setExpandedNodes(allNodeIds);
    } else {
      setExpandedNodes(new Set());
    }
  }, [filters, data]);

  useEffect(() => {
    const filteredData = filterTree(data);
    const flattened = flattenTree(filteredData);
    setFlattenedData(flattened);
  }, [data, filters, expandedNodes]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const nodeMatchesFilters = (node: TreeNode): boolean => {
    const nameMatch = node.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const energyMatch =
      filters.status !== "energy" ||
      ("sensorType" in node && node.sensorType === "energy");
    const criticalMatch =
      filters.status !== "alert" ||
      ("status" in node && node.status === "alert");
    return nameMatch && energyMatch && criticalMatch;
  };

  const hasMatchingDescendant = (node: TreeNode): boolean => {
    if (nodeMatchesFilters(node)) return true;
    if ("children" in node) {
      return node.children.some((child) => hasMatchingDescendant(child));
    }
    return false;
  };

  const filterTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce<TreeNode[]>((acc, node) => {
      if (hasMatchingDescendant(node)) {
        const filteredNode = {
          ...node,
          children: "children" in node ? filterTree(node.children) : [],
        };
        acc.push(filteredNode);
      }
      return acc;
    }, []);
  };

  const flattenTree = (
    nodes: TreeNode[],
    depth = 0,
    parentLastChildren: boolean[] = []
  ): FlattenedNode[] => {
    return nodes.reduce<FlattenedNode[]>((acc, node, index) => {
      const isLast = index === nodes.length - 1;
      const isFirst = index === 0;

      const flatNode: FlattenedNode = {
        ...node,
        depth,
        isLastChild: isLast,
        isFirstChild: isFirst,
        parentLastChildren: [...parentLastChildren, isLast],
      };

      acc.push(flatNode);

      if ("children" in node && node.children && expandedNodes.has(node.id)) {
        acc.push(
          ...flattenTree(node.children, depth + 1, [
            ...parentLastChildren,
            isLast,
          ])
        );
      }

      return acc;
    }, []);
  };

  const getNodeType = (node: FlattenedNode) => {
    switch (node.type) {
      case "location":
        return <LocationIcon aria-label="Localização" />;
      default:
        return <AssetIcon aria-label="Ativo" />;
    }
  };

  const renderRow = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const node = flattenedData[index];
    const hasChildren = "children" in node && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const baseIndent = 20;
    const pl = node.depth * baseIndent;
    const isAssetWithSensorType = "sensorType" in node && node.sensorType;

    return (
      <div
        style={{
          ...style,
          paddingLeft: pl + "px",
          height: "28px",
        }}
        key={node.id}
        id={`tree-node-${node.id}`}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={node.depth + 1}
        aria-setsize={flattenedData.length}
        aria-posinset={index + 1}
      >
        {node.depth > 0 &&
          Array.from({ length: node.depth }).map((_, i) => {
            if (!(i === node.depth - 1)) {
              return null;
            }

            if (node.type !== "location") {
              return (
                <div
                  key={i}
                  className={"absolute w-[1px] bg-gray-200"}
                  style={{
                    left: `${i * baseIndent + 26}px`,
                    top: "-4px",
                    bottom: 0,
                    height: node.isLastChild
                      ? hasChildren
                        ? "30%"
                        : "20px"
                      : "100%",
                  }}
                />
              );
            }
          })}

        {node.depth > 0 && isAssetWithSensorType && (
          <div
            className="absolute h-[1px] bg-gray-200"
            style={{
              left: `${(node.depth - 1) * baseIndent + 26}px`,
              width: "10px",
              top: "14px",
            }}
          />
        )}

        <div className="flex items-center gap-0">
          {hasChildren ? (
            <>
              <button
                onClick={() => toggleNode(node.id)}
                className="z-20 w-4 h-4 flex items-center justify-center hover:bg-gray-100 rounded"
                aria-label={isExpanded ? "Recolher" : "Expandir"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleNode(node.id);
                  }
                }}
              >
                {isExpanded ? (
                  <ChevronDown aria-hidden="true" />
                ) : (
                  <ChevronRight aria-hidden="true" />
                )}
              </button>
            </>
          ) : (
            <span className="ml-4" aria-hidden="true" />
          )}
          <span
            className={clsx("flex items-center justify-start w-full", {
              "group cursor-pointer rounded-sm":
                isAssetWithSensorType,
              "bg-blue-500 text-white cursor-pointer rounded-sm stroke-white relative right-1":
                selectedNode?.id === node.id && isAssetWithSensorType,
            })}
            onClick={() => {
              onSelectNode && onSelectNode(node);
              setSelectedNode(prev => prev?.id === node.id ? null : node)
            }}
          >
            {isAssetWithSensorType ? (
              <ComponentIcon
                className={clsx({
                  "stroke-white ml-1": selectedNode?.id === node.id,
                })}
              />
            ) : (
              getNodeType(node)
            )}
            <span className="ml-1 truncate">{node.name}</span>
            {"status" in node && node.status === "alert" && (
              <div
                className="ml-2 bg-red-500 h-2 w-2 rounded-full"
                aria-label="Status crítico"
              />
            )}
            {isAssetWithSensorType === "energy" && (
              <BoltIcon className="ml-2" aria-label="Sensor de energia" />
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div role="tree" aria-label="Árvore de ativos">
      <List
        ref={listRef}
        height={700}
        itemCount={flattenedData.length}
        itemSize={28}
        width="100%"
        className="overflow-x-hidden "
      >
        {renderRow}
      </List>
    </div>
  );
}

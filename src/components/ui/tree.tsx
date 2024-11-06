import { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { TreeNode, TreeProps } from '../../types/tree';
import { AssetIcon, BoltIcon, ChevronDown, ChevronRight, ComponentIcon, LocationIcon } from '../icons/icons';

type FlattenedNode = TreeNode & {
  depth: number;
  isLastChild: boolean;
  isFirstChild: boolean;
  parentLastChildren: boolean[];
}

export default function Tree({ data, filters }: TreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [flattenedData, setFlattenedData] = useState<FlattenedNode[]>([]);
  const listRef = useRef<List>(null);

  useEffect(() => {
    if (filters.search || filters.status) {
      const allNodeIds = new Set<string>();
      const addNodeIds = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          allNodeIds.add(node.id);
          if ('children' in node && node.children) {
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
    const nameMatch = node.name.toLowerCase().includes(filters.search.toLowerCase());
    const energyMatch = filters.status !== 'energy' || ('sensorType' in node && node.sensorType === 'energy');
    const criticalMatch = filters.status !== 'alert' || ('status' in node && node.status === 'alert');
    return nameMatch && energyMatch && criticalMatch;
  };

  const hasMatchingDescendant = (node: TreeNode): boolean => {
    if (nodeMatchesFilters(node)) return true;
    if ('children' in node) {
      return node.children.some(child => hasMatchingDescendant(child));
    }
    return false;
  };

  const filterTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce<TreeNode[]>((acc, node) => {
      if (hasMatchingDescendant(node)) {
        const filteredNode = {
          ...node,
          children: 'children' in node ? filterTree(node.children) : []
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
        parentLastChildren: [...parentLastChildren, isLast]
      };

      acc.push(flatNode);

      if ('children' in node && node.children && expandedNodes.has(node.id)) {
        acc.push(...flattenTree(
          node.children,
          depth + 1,
          [...parentLastChildren, isLast]
        ));
      }

      return acc;
    }, []);
  };

  const getNodeIcon = (node: FlattenedNode) => {
    if ('sensorType' in node && node.sensorType)
      return <ComponentIcon />;

    switch (node.type) {
      case 'location':
        return <LocationIcon />;
      default:
        return <AssetIcon />;
    }
  };

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const node = flattenedData[index];
    const hasChildren = 'children' in node && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const baseIndent = 20;
    const leftPadding = node.depth * baseIndent;

    return (
      <div
        style={{
          ...style,
          paddingLeft: leftPadding + 'px',
          height: '28px',
        }}
        className="flex items-center "
      >
        {node.depth > 0 && Array.from({ length: node.depth }).map((_, i) => {

          if (!(i === node.depth - 1)) {
            return null;
          }

            if ('sensorType' in node && node.sensorType) {
            return (
              <div
              key={i}
              className="absolute w-[1px] bg-gray-200"
              style={{
                left: `${i * baseIndent + 26}px`,
                top: '-4px',
                bottom: 0,
                height: node.isLastChild ? '18px' : '100%',
              }}
              />
            );
            }
          })}

          {node.depth > 0 && 'sensorType' in node && node.sensorType && (
            <div
            className="absolute h-[1px] bg-gray-200"
            style={{
              left: `${(node.depth - 1) * baseIndent + 26}px`,
              width: '12px',
              top: '14px',
            }}
            />
          )}

        <div className="flex items-center gap-0">
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="overflow-hidden z-20 w-4 h-4 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown />
              ) : (
                <ChevronRight />
              )}
            </button>
          ) : (
            (<span className="w-4" />)
          )}
          <span className="flex items-center justify-center relative">
            {getNodeIcon(node)}
          </span>
          <span className="ml-1">{node.name}</span>
          {'status' in node && node.status === 'alert' && (
            <div className="ml-2 bg-red-500 h-2 w-2 rounded-full" />
          )}
          {'sensorType' in node && node.sensorType === 'energy' && (
            <BoltIcon className="ml-2" />
          )}
        </div>
      </div>
    );
  };

  return (
    <List
      ref={listRef}
      height={720}
      itemCount={flattenedData.length}
      itemSize={28}
      width="100%"
      className="overflow-x-hidden"
    >
      {renderRow}
    </List>
  );
}
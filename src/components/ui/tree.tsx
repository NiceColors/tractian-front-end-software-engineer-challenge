import React, { useState } from 'react';
import { AssetNode, TreeNode, TreeProps } from '../../types/tree';
import { AssetIcon, ChevronDown, ChevronRight, ComponentIcon, CriticalIcon, LocationIcon } from '../icons/icons';

export const Tree: React.FC<TreeProps> = ({ data, filters }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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
    const energyMatch = !filters.energy || (
      node.type === 'component' &&
      node.sensorType === 'energy'
    );
    const criticalMatch = !filters.critical || (
      node.type === 'component' &&
      node.status === 'alert'
    );

    return nameMatch && energyMatch && criticalMatch;
  };

  const hasMatchingDescendant = (node: TreeNode): boolean => {
    if (nodeMatchesFilters(node)) return true;
    return node.children.some(child => hasMatchingDescendant(child));
  };

  const filterTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce<TreeNode[]>((acc, node) => {
      if (hasMatchingDescendant(node)) {
        const filteredNode = {
          ...node,
          children: filterTree(node.children)
        };
        acc.push(filteredNode);
      }
      return acc;
    }, []);
  };

  const getNodeIcon = (node: (TreeNode | AssetNode)) => {


    if ('sensorType' in node && !!node.sensorType)
      return <ComponentIcon />;

    switch ((node as TreeNode).type) {
      case 'location':
        return <LocationIcon />;
      default:
        return <AssetIcon />;

    }
  };

  const renderNode = (node: TreeNode) => {

    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="ml-4">
        <div className="flex items-center py-1">
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="mr-2 hover:bg-gray-100 rounded p-0.5"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (<div className="w-7" />)}

          <span className="mr-2 w-6">{getNodeIcon(node)}</span>
          <span className="text-sm">{node.name}</span>
          {node.type === 'component' && node.status === 'alert' && (
            <CriticalIcon className="ml-2 text-red-500 h-4 w-4" />
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const filteredData = filterTree(data);

  return (
    <div className="min-h-0 overflow-auto">
      {filteredData.map(node => renderNode(node))}
    </div>
  );
};
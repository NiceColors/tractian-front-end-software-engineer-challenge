export type SensorType = 'energy' | 'vibration' | null
export type Status = 'operating' | 'alert' | 'critical' | null;

export type BaseNode = {
    id: string;
    name: string;
    parentId?: string | null;
    children: TreeNode[];
}

export type LocationNode = BaseNode & {
    type: 'location';
}

export type AssetNode = BaseNode & {
    type: 'asset';
    locationId?: string;
}

export type ComponentNode = BaseNode & {
    type: 'component';
    sensorId: string;
    sensorType: SensorType;
    status: Status;
    gatewayId: string;
    locationId?: string;
    parentId?: string;
}

export type TreeNode = LocationNode | AssetNode | ComponentNode;

export type TreeProps = {
    data: TreeNode[];
    filters: {
        search: string;
        status: Status | SensorType;
    };
    onSelectNode?: (node: TreeNode) => void;
}

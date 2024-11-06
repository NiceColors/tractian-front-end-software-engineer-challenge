

import { useEffect, useState } from 'react';
import { useCompany } from "../../contexts/company-context";
import { api } from "../../data/api";
import { AssetNode, LocationNode, TreeNode } from '../../types/tree';
import { CriticalIcon, EnergyIcon } from '../icons/icons';
import { Button } from "../ui/buttons";
import Tree from '../ui/tree';

export default function HomePage() {
    const { company } = useCompany();
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [filteredData, setFilteredData] = useState<TreeNode[]>([]);
    const [filterStatus, setFilterStatus] = useState<'energy' | 'alert' | null>(null);
    const [searchTerms, setSearchTerms] = useState<string>('');



    const resetStates = () => {
        setFilterStatus(null);
        setSearchTerms('');
    };

    const fetchData = async () => {
        const locationsMap = new Map<string, LocationNode>();
        const assetsMap = new Map<string, AssetNode>();

        if (company) {
            try {
                const assetsResponse = await api(`/companies/${company.id}/assets`);
                const locationsResponse = await api(`/companies/${company.id}/locations`);

                const assetsData = await assetsResponse.json();
                const locationsData = await locationsResponse.json();

                for (const location of locationsData) {
                    locationsMap.set(location.id, { ...location, type: 'location', children: [] });
                }

                for (const asset of assetsData) {
                    assetsMap.set(asset.id, { ...asset, type: 'asset', children: [] });
                }

                const root: (LocationNode | AssetNode)[] = [];

                for (const [id, item] of locationsMap) {
                    const currentItem = locationsMap.get(id);
                    if (!currentItem) continue;
                    if (item.parentId) {
                        const parent = locationsMap.get(item.parentId);
                        if (parent) parent.children.push(currentItem);
                        continue;
                    }
                    root.push(currentItem);
                }

                for (const [id, item] of assetsMap) {
                    const currentItem = assetsMap.get(id);
                    if (!currentItem) continue;
                    if (!item.locationId && !item.parentId) {
                        root.push(currentItem);
                    }
                    if (item.locationId) {
                        const parent = locationsMap.get(item.locationId);
                        if (parent) parent.children.push(currentItem);
                    }
                    if (item.parentId) {
                        const parent = assetsMap.get(item.parentId);
                        if (parent) parent.children.push(currentItem);
                    }
                }

                setTreeData(root);
                setFilteredData(root);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        if (!filterStatus) {
            setFilteredData(treeData);
            return
        }

        const filteredNodes = applyFilters(treeData);
        setFilteredData(filteredNodes);
    }, [filterStatus, searchTerms, treeData]);

    const applyFilters = (nodes: TreeNode[]): TreeNode[] => {
        const nodeMatchesFilters = (node: TreeNode) => {
            const nameMatch = node.name.toLowerCase().includes(searchTerms.toLowerCase());
            const energyMatch = filterStatus !== 'energy' || ('sensorType' in node && node.sensorType === 'energy');
            const criticalMatch = filterStatus !== 'alert' || ('status' in node && node.status === 'alert');
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

        return filterTree(nodes);
    };

    useEffect(() => {
        fetchData();
        resetStates();
    }, [company]);


    if (!company)
        return (
            <div className="flex justify-center items-center h-full bg-gray-100 border-2 border-dashed border-slate-400 rounded-md">
                <h1 className="text-2xl font-thin mb-4 text-center">Selecione uma empresa</h1>
            </div>
        );

    return (
        <div className="border border-gray-500 rounded-md h-full p-4 bg-white flex flex-col">
            <nav className="flex items-center justify-between py-0.5 mb-4">
                <div className="flex gap-2 items-center text-sm text-neutral-400">
                    <a href="#" className="text-black text-xl font-semibold">Ativos</a>
                    <span>/</span>
                    <span>{company?.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                        icon={<EnergyIcon {...(filterStatus === 'energy') && { fill: "#fff" }} />}
                        size={'lg'}
                        onClick={() => setFilterStatus(prev => prev === 'energy' ? null : 'energy')}
                        active={filterStatus === 'energy'}
                    >
                        Sensor de Energia
                    </Button>
                    <Button
                        variant="outline"
                        icon={<CriticalIcon {...(filterStatus === 'alert') && { fill: "#fff" }} />}
                        size={'lg'}
                        onClick={() => setFilterStatus(prev => prev === 'alert' ? null : 'alert')}
                        active={filterStatus === 'alert'}
                    >
                        Crítico
                    </Button>
                </div>
            </nav>
            <div className="flex space-x-4 flex-1 min-h-0 max-h-[760px]">
                <div className="border border-gray-500 rounded-md h-full p-4 bg-white lg:min-w-[480px]">
                    <Tree
                        data={filteredData}
                        filters={{
                            status: filterStatus,
                            search: searchTerms
                        }}
                    />
                </div>
                <div className="border border-gray-500 rounded-md h-full p-4 bg-white w-full">
                    <div className="p-6">
                        <div className="grid lg:grid-cols-[auto,1fr] gap-6">
                            <div className="flex justify-center border border-gray-300 rounded-lg p-4 ">
                                <img
                                    src="/motor.png"
                                    alt="Electric Motor"
                                    className="w-72 h-72 object-contain"

                                />
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">Tipo de Equipamento</h3>
                                    <p className="text-lg text-gray-600">Motor Elétrico (Trifásico)</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">Responsáveis</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-100 text-blue-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
                                            E
                                        </div>
                                        <span>Elétrica</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">Sensor</h3>
                                        <p className="text-lg">TFV655</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">Receptor</h3>
                                        <p className="text-lg">YTF265</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

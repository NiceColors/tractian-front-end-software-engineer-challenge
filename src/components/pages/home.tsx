import { useEffect, useState } from 'react';
import { useCompany } from "../../contexts/company-context";
import { api } from '../../data/api';
import { AssetNode, LocationNode, TreeNode } from '../../types/tree';
import AssetDetails from '../assets-details';
import FilterBar from '../filter-bar';
import Tree from '../ui/tree';

export default function HomePage() {
    const { company } = useCompany();
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [filteredData, setFilteredData] = useState<TreeNode[]>([]);
    const [filterStatus, setFilterStatus] = useState<'energy' | 'alert' | null>(null);
    const [searchTerms, setSearchTerms] = useState<string>('');


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {

        // talvez seja interessante criar um debounce para melhorar a performance caso o filtro seja feito pelo backend

        const value = event.target.value ?? ''

        setSearchTerms(value);

    }

    useEffect(() => {
        if (company) {
            fetchCompanyData(company.id).then(data => {
                setTreeData(data);
                setFilteredData(data);
            }).catch(console.error);
        }
    }, [company]);

    useEffect(() => {
        if (!filterStatus && !searchTerms) {
            setFilteredData(treeData);
        } else {
            const filteredNodes = applyFilters(treeData);
            setFilteredData(filteredNodes);
        }
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

        return nodes.reduce<TreeNode[]>((acc, node) => {
            if (hasMatchingDescendant(node)) {
                const filteredNode = {
                    ...node,
                    children: 'children' in node ? applyFilters(node.children) : []
                };
                acc.push(filteredNode);
            }
            return acc;
        }, []);
    };

    if (!company) {
        return (
            <div className="flex justify-center items-center h-full bg-gray-100 border-2 border-dashed border-slate-400 rounded-md">
                <h1 className="text-2xl font-thin mb-4 text-center">Selecione uma empresa</h1>
            </div>
        );
    }

    return (
        <div className="border border-gray-500 rounded-md h-full p-4 bg-white flex flex-col">
            <FilterBar
                companyName={company.name}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />
            <div className="flex space-x-4 flex-1 min-h-0 max-h-[760px]">
                <div className="border border-gray-500 rounded-md h-ful bg-white lg:max-w-[480px] w-full">

                    <div className='border-b bg-transparent border-gray-300'>
                        <input className='bg-transparent p-2 w-full ' type='text' placeholder='Buscar Ativo ou Local' onChange={handleSearch} />
                    </div>
                    <div className="p-4">
                        <Tree
                            data={filteredData}
                            filters={{
                                status: filterStatus,
                                search: searchTerms
                            }}
                        />
                    </div>

                </div>
                <div className="border border-gray-500 rounded-md h-full p-4 bg-white w-full">
                    <AssetDetails />
                </div>
            </div>
        </div>
    );
}



async function fetchCompanyData(companyId: string): Promise<TreeNode[]> {
    try {
        const [assetsResponse, locationsResponse] = await Promise.all([
            api(`/companies/${companyId}/assets`),
            api(`/companies/${companyId}/locations`)
        ]);

        if (!assetsResponse.ok || !locationsResponse.ok) {
            throw new Error('Failed to fetch company data');
        }

        const [assetsData, locationsData] = await Promise.all([
            assetsResponse.json(),
            locationsResponse.json()
        ]);

        const locationsMap = new Map<string, LocationNode>();
        const assetsMap = new Map<string, AssetNode>();

        for (const location of locationsData) {
            locationsMap.set(location.id, { ...location, type: 'location', children: [] });
        }

        for (const asset of assetsData) {
            assetsMap.set(asset.id, { ...asset, type: 'asset', children: [] });
        }

        const root: TreeNode[] = [];

        for (const [_, item] of locationsMap) {
            if (item.parentId) {
                const parent = locationsMap.get(item.parentId);
                if (parent) parent.children.push(item);
            } else {
                root.push(item);
            }
        }

        for (const [_, item] of assetsMap) {
            if (!item.locationId && !item.parentId) {
                root.push(item);
            } else if (item.locationId) {
                const parent = locationsMap.get(item.locationId);
                if (parent) parent.children.push(item);
            } else if (item.parentId) {
                const parent = assetsMap.get(item.parentId);
                if (parent) parent.children.push(item);
            }
        }

        return root;
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    }
}
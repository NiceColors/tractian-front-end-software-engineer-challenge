import { useCompany } from "@/contexts/company-context";
import { api } from '@/data/api';
import { AssetNode, LocationNode, TreeNode } from '@/types/tree';
import { debounce } from 'lodash';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import AssetDetails from '../assets-details';
import { CriticalIcon, EnergyIcon } from '../icons';
import { Button } from '../ui/buttons';
import { LoadingPage } from '../ui/loading';
const Tree = lazy(() => import('@/components/ui/tree'));

export default function HomePage() {

    const { company } = useCompany();
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [filteredData, setFilteredData] = useState<TreeNode[]>([]);
    const [filterStatus, setFilterStatus] = useState<'energy' | 'alert' | null>(null);
    const [searchTerms, setSearchTerms] = useState<string>('');

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSearchTerms(value);
        }, 300),
        []
    );

    const fetchCompanyData = useCallback(async (companyId: string): Promise<TreeNode[]> => {
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

            locationsData.forEach((location: any) => {
                locationsMap.set(location.id, { ...location, type: 'location', children: [] });
            });

            assetsData.forEach((asset: any) => {
                assetsMap.set(asset.id, { ...asset, type: 'asset', children: [] });
            });

            const root: TreeNode[] = [];

            locationsMap.forEach((item) => {
                if (item.parentId) {
                    const parent = locationsMap.get(item.parentId);
                    if (parent) parent.children.push(item);
                } else {
                    root.push(item);
                }
            });

            assetsMap.forEach((item) => {
                if (!item.locationId && !item.parentId) {
                    root.push(item);
                } else if (item.locationId) {
                    const parent = locationsMap.get(item.locationId);
                    if (parent) parent.children.push(item);
                } else if (item.parentId) {
                    const parent = assetsMap.get(item.parentId);
                    if (parent) parent.children.push(item);
                }
            });

            return root;
        } catch (error) {
            console.error('Error fetching company data:', error);
            throw error;
        }
    }, []);

    useEffect(() => {
        if (company) {
            fetchCompanyData(company.id).then(data => {
                setTreeData(data);
                setFilteredData(data);
            }).catch(console.error);
        }
    }, [company, fetchCompanyData]);

    const applyFilters = useCallback((nodes: TreeNode[]): TreeNode[] => {
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
    }, [filterStatus, searchTerms]);

    useEffect(() => {
        if (!filterStatus && !searchTerms) {
            setFilteredData(treeData);
        } else {
            const filteredNodes = applyFilters(treeData);
            setFilteredData(filteredNodes);
        }
    }, [filterStatus, searchTerms, treeData, applyFilters]);

    const memoizedTree = useMemo(() => (
        <Tree
            data={filteredData}
            filters={{
                status: filterStatus,
                search: searchTerms
            }}
        />
    ), [filteredData, filterStatus, searchTerms]);

    if (!company) {
        return (
            <div className="flex justify-center items-center h-full bg-gray-100 border-2 border-dashed border-slate-400 rounded-md">
                <h1 className="text-2xl font-thin mb-4 text-center">Selecione uma empresa</h1>
            </div>
        );
    }

    return (
        <div className="border border-gray-500 rounded-md h-full p-4 bg-white flex flex-col">
            <nav className="flex items-center justify-between py-0.5 mb-4" aria-label="Filtros e navegação">
                <div className="flex gap-2 items-center text-sm text-neutral-400">
                    <a href="#" className="text-black text-xl font-semibold">Ativos</a>
                    <span aria-hidden="true">/</span>
                    <span>{company.name}</span>
                </div>
                <div className="flex gap-2 items-center" role="group" aria-label="Filtros de ativos">
                    <Button
                        variant="outline"
                        icon={<EnergyIcon {...(filterStatus === 'energy' && { fill: "#fff" })} />}
                        size={'lg'}
                        onClick={() => setFilterStatus(filterStatus === 'energy' ? null : 'energy')}
                        active={filterStatus === 'energy'}
                        aria-pressed={filterStatus === 'energy'}
                        aria-label="Filtrar por sensor de energia"
                    >
                        Sensor de Energia
                    </Button>
                    <Button
                        variant="outline"
                        icon={<CriticalIcon {...(filterStatus === 'alert' && { fill: "#fff" })} />}
                        size={'lg'}
                        onClick={() => setFilterStatus(filterStatus === 'alert' ? null : 'alert')}
                        active={filterStatus === 'alert'}
                        aria-pressed={filterStatus === 'alert'}
                        aria-label="Filtrar por status crítico"
                    >
                        Crítico
                    </Button>
                </div>
            </nav>

            <div className="flex space-x-4 flex-1 min-h-0 max-h-[760px]">
                <div className="border border-gray-500 rounded-md h-full bg-white lg:max-w-[480px] w-full">
                    <div className='border-b bg-transparent border-gray-300'>
                        <label htmlFor="search-input" className="sr-only">Buscar Ativo ou Local</label>
                        <input
                            id="search-input"
                            className='bg-transparent p-2 w-full'
                            type='text'
                            placeholder='Buscar Ativo ou Local'
                            onChange={(e) => handleSearch(e.target.value)}
                            aria-label="Buscar Ativo ou Local"
                        />
                    </div>
                    <div className="p-4" role="tree" aria-label="Árvore de ativos">
                        <Suspense fallback={<LoadingPage />}>
                            {memoizedTree}
                        </Suspense>
                    </div>
                </div>
                <div className="border border-gray-500 rounded-md h-full p-4 bg-white w-full">
                    <AssetDetails />
                </div>
            </div>
        </div>
    );
}
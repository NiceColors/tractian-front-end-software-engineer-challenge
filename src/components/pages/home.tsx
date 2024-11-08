import AssetDetails from '@/components/assets-details';
import { CriticalIcon, EnergyIcon } from '@/components/icons';
import { Button } from '@/components/ui/buttons';
import { LoadingPage } from '@/components/ui/loading';
import { useCompany } from "@/contexts/company-context";
import useDebounce from '@/hooks/useDebounce';
import { fetchCompanyData } from "@/services/fetch-company";
import { TreeNode } from '@/types/tree';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
const Tree = lazy(() => import('@/components/ui/tree'));

export default function HomePage() {

    const { company } = useCompany();

    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [filteredData, setFilteredData] = useState<TreeNode[]>([]);
    const [filterStatus, setFilterStatus] = useState<'energy' | 'alert' | null>(null);
    const [searchTerms, setSearchTerms] = useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerms, 300);

    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

    const handleSearch = useCallback((value: string) => setSearchTerms(value), []);


    const resetStates = () => {
        setTreeData([]);
        setFilteredData([]);
        setFilterStatus(null);
        setSearchTerms('');
        setSelectedNode(null);
    }

    useEffect(() => {
        if (company) {

            resetStates();

            fetchCompanyData(company.id).then(data => {
                setTreeData(data);
                setFilteredData(data);
            }).catch(console.error);
        }
    }, [company]);

    const applyFilters = useCallback((nodes: TreeNode[]): TreeNode[] => {
        const nodeMatchesFilters = (node: TreeNode) => {
            const nameMatch = node.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
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
    }, [filterStatus, debouncedSearchTerm]);

    useEffect(() => {
        if (!filterStatus && !debouncedSearchTerm) {
            setFilteredData(treeData);
        } else {
            const filteredNodes = applyFilters(treeData);
            setFilteredData(filteredNodes);
        }
    }, [filterStatus, debouncedSearchTerm, treeData, applyFilters]);


    if (!company) {
        return (
            <div className="flex justify-center items-center h-full bg-gray-100 border-2 border-dashed border-slate-400 rounded-md">
                <h1 className="text-2xl font-thin mb-4 text-center">Selecione uma empresa</h1>
            </div>
        );
    }

    return (
        <div className="border border-gray-500 rounded-md flex flex-col md:h-full sm:p-4 p-2 bg-white ">
            <nav className="flex sm:flex-row flex-col sm:items-center justify-between py-0.5 mb-4 " aria-label="Filtros e navegação">
                <div className="flex gap-2 items-center text-sm text-neutral-400">
                    <a href="#" className="text-black text-xl font-semibold">Ativos</a>
                    <span aria-hidden="true">/</span>
                    <span>{company.name}</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Filtros de ativos">
                    <Button
                        variant="outline"
                        icon={<EnergyIcon {...(filterStatus === 'energy' && { fill: "#fff" })} />}
                        size={'lg'}
                        onClick={() => setFilterStatus(filterStatus === 'energy' ? null : 'energy')}
                        active={filterStatus === 'energy'}
                        aria-pressed={filterStatus === 'energy'}
                        aria-label="Filtrar por sensor de energia"
                        className='max-sm:w-full'
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
                        className='max-sm:w-full'
                    >
                        Crítico
                    </Button>
                </div>
            </nav>

            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-4 h-full">
                <div className="border border-gray-500 rounded-md h-full bg-white lg:max-w-[480px] w-full">
                    <div className='border-b bg-transparent border-gray-300'>
                        <label htmlFor="search-input" className="sr-only">Buscar Ativo ou Local</label>
                        <input
                            value={searchTerms}
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
                            <Tree
                                data={filteredData}
                                filters={{
                                    status: filterStatus,
                                    search: debouncedSearchTerm
                                }}
                                onSelectNode={setSelectedNode}
                            />
                        </Suspense>
                    </div>
                </div>
                <div className="border border-gray-500 rounded-md overflow-hidden min-h-0 bg-white w-full">
                    <AssetDetails node={selectedNode} />
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { useCompany } from "../../contexts/company-context";
import { api } from "../../data/api";
import { AssetNode, LocationNode, TreeNode } from '../../types/tree';

import { CriticalIcon, EnergyIcon } from '../icons/icons';
import { Button } from "../ui/buttons";



export default function HomePage() {

    const { company } = useCompany();

    const [treeData, setTreeData] = useState<TreeNode[]>([]);

    const [type, setType] = useState<'critical_status' | 'sensor' | null>(null);

    useEffect(() => {
        const fetchData = async () => {


            const locationsMap = new Map<string, LocationNode>();
            const assetsMap = new Map<string, AssetNode>();


            if (company) {
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

                        if (parent)
                            parent.children.push(currentItem);

                        continue

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
                        if (parent) {
                            parent.children.push(currentItem);
                        }
                    }

                    if (item.parentId) {
                        const parent = assetsMap.get(item.parentId);
                        if (parent) {
                            parent.children.push(currentItem);
                        }
                    }
                }

                setTreeData(root);


            }
        };

        fetchData();
    }, [company]);


    console.log(treeData);


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
                        icon={<EnergyIcon {...(type === 'sensor') && { fill: "#fff" }} />}
                        size={'lg'}
                        onClick={() => setType('sensor')}
                        active={type === 'sensor'}
                    >
                        Sensor de Energia
                    </Button>
                    <Button
                        variant="outline"
                        icon={<CriticalIcon  {...(type === 'critical_status') && { fill: "#fff" }} />}
                        size={'lg'}
                        onClick={() => setType('critical_status')}
                        active={type === 'critical_status'}
                    >
                        Crítico
                    </Button>
                </div>
            </nav>
            <div className="flex space-x-4 flex-1 min-h-0 max-h-full">
                <div className="border border-gray-500 rounded-md h-full p-4 bg-white min-w-[480px] overflow-auto">

                </div>
                <div className="border border-gray-500 rounded-md h-full p-4 bg-white w-full">

                </div>
            </div>
        </div>
    )
}
import { api } from "@/data/api";
import { AssetNode, LocationNode, TreeNode } from "@/types/tree";

export const fetchCompanyData = async (companyId: string): Promise<TreeNode[]> => {
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
}
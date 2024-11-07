import { TreeNode } from "@/types/tree";

export default function AssetDetails({ node }: { node?: TreeNode | null }) {

    if (!node) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">Por favor, selecione um componente para ver os detalhes.</p>
            </div>
        );
    }




    return (
        <div>

            <div className="border-b border-grey-300 py-4 p-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    {node?.name}
                </h2>
            </div>

            <div className="grid lg:grid-cols-[auto,1fr] gap-6 p-8">
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
                        <p className="text-lg text-gray-600">
                            Motor Elétrico (Trifásico)
                        </p>
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
    );
}
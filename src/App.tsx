import { CriticalIcon } from "./components/icons/critical";
import { EnergyIcon } from "./components/icons/energy";
import { Button } from "./components/ui/buttons";
import RootLayout from "./components/ui/layout";

export default function App() {


  return (
    <RootLayout>
      <div className="border border-gray-500 rounded-md h-full p-4 bg-white flex flex-col">
        <nav className="flex items-center justify-between py-0.5 mb-4">
          <div className="flex gap-2 items-center text-sm text-neutral-400">
            <a href="#" className="text-black text-xl font-semibold">Ativos</a>
            <span>/</span>
            <span>Apex Unit</span>
          </div>

          <div className="flex gap-2 items-center">
            <Button variant="outline" icon={<EnergyIcon />} size={'lg'}>
              Sensor de Energia
            </Button>
            <Button variant="outline" icon={<CriticalIcon />} size={'lg'}>
              Crítico
            </Button>
          </div>


        </nav>
        <div className="flex space-x-4 flex-1 min-h-0">
          <div className="border border-gray-500 rounded-md h-full p-4 bg-white min-w-[480px]">
          </div>
          <div className="border border-gray-500 rounded-md h-full p-4 bg-white w-full">
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
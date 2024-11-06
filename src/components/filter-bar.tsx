import { CriticalIcon, EnergyIcon } from './icons/icons';
import { Button } from "./ui/buttons";

type FilterBarProps = {
    companyName: string;
    filterStatus: 'energy' | 'alert' | null;
    setFilterStatus: (status: 'energy' | 'alert' | null) => void;
};

export default function FilterBar({ companyName, filterStatus, setFilterStatus }: FilterBarProps) {
    return (
        <nav className="flex items-center justify-between py-0.5 mb-4">
            <div className="flex gap-2 items-center text-sm text-neutral-400">
                <a href="#" className="text-black text-xl font-semibold">Ativos</a>
                <span>/</span>
                <span>{companyName}</span>
            </div>
            <div className="flex gap-2 items-center">
                <Button
                    variant="outline"
                    icon={<EnergyIcon {...(filterStatus === 'energy' && { fill: "#fff" })} />}
                    size={'lg'}
                    onClick={() => setFilterStatus(filterStatus === 'energy' ? null : 'energy')}
                    active={filterStatus === 'energy'}
                >
                    Sensor de Energia
                </Button>
                <Button
                    variant="outline"
                    icon={<CriticalIcon {...(filterStatus === 'alert' && { fill: "#fff" })} />}
                    size={'lg'}
                    onClick={() => setFilterStatus(filterStatus === 'alert' ? null : 'alert')}
                    active={filterStatus === 'alert'}
                >
                    Crítico
                </Button>
            </div>
        </nav>
    );
}
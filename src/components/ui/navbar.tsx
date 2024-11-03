import { useState } from "react";
import { Logo } from "../icons/logo";
import { Button } from "./buttons";
import { GoldIcon } from "../icons/gold";

export default function Navbar() {

    const [activeUnit, setActiveUnit] = useState("Apex Unit")

    const unities = ["Apex Unit", "Tobias Unit", "Jaguar Unit"]

    const handleUnitChange = (unit: string) => setActiveUnit(unit)

    return (
        <nav className="bg-blue-dark text-white">
            <div className="max-w-screen-2xl mx-auto w-full flex justify-between h-12 p-4 items-center">
                <div className="logo">
                    <Logo />
                </div>
                <div className="flex space-x-3">
                    {unities.map((unit, index) => (
                        <Button key={index} active={unit === activeUnit} onClick={() => handleUnitChange(unit)} icon={<GoldIcon/>}>
                            {unit}
                        </Button>
                    ))}
                </div>
            </div>
        </nav>

    )
}

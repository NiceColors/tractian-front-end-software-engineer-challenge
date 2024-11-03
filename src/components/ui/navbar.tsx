import { useState } from "react";
import { Logo } from "../icons/logo";
import { UnitButton } from "./buttons";

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
                        <UnitButton key={index} active={unit === activeUnit} onClick={() => handleUnitChange(unit)}>
                            {unit}
                        </UnitButton>
                    ))}
                </div>
            </div>
        </nav>

    )
}

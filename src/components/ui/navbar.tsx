import { GoldIcon, Logo } from "@/components/icons";
import { useCompany } from "@/contexts/company-context";
import { Button } from "./buttons";

export default function Navbar() {
    const { companies, changeCompany, company: activeCompany } = useCompany()


    return (
        <nav className="bg-blue-dark text-white">
            <div className="max-w-screen-2xl mx-auto w-full flex flex-col sm:flex-row justify-between md:h-12 p-4 sm:items-center gap-4">
                <div className="logo">
                    <Logo />
                </div>
                <div className="flex space-x-3">
                    {companies.map((company, index) => (
                        <Button key={index}  {...activeCompany && { active: company.id === activeCompany.id }} onClick={() => changeCompany(company)} icon={<GoldIcon />}>
                            {company.name}
                        </Button>
                    ))}
                </div>
            </div>
        </nav>

    )
}

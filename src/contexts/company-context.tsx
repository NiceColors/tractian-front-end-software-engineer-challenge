import { api } from "@/data/api";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface Company {
    id: string
    name: string
}


interface CompanyContextType {
    company: Company | null
    changeCompany: (company: Company) => void
    companies: Company[]
    loading: boolean
}

const CompanyContext = createContext({} as CompanyContextType)

export function CompanyProvider({ children }: { children: ReactNode }) {


    const [loading, setLoading] = useState(false)

    const [company, setCompany] = useState<Company | null>(null)
    const [companies, setCompanies] = useState<Company[]>([])

    const changeCompany = (company: Company) => setCompany(company)

    const getCompanies = async () => {
        setLoading(true)
        try {
            const response = await api('/companies')
            const data = await response.json()
            setCompanies(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCompanies()
    }, [])

    return (
        <CompanyContext.Provider
            value={{
                company,
                changeCompany,
                companies,
                loading
            }}
        >
            {children}
        </CompanyContext.Provider>
    )
}

export const useCompany = () => useContext(CompanyContext)
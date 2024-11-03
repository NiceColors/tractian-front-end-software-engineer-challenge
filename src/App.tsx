import HomePage from "./components/pages/home";
import RootLayout from "./components/ui/layout";
import { CompanyProvider } from "./contexts/company-context";

export default function App() {


  return (
    <CompanyProvider>
      <RootLayout>
        <HomePage />
      </RootLayout>
    </CompanyProvider>
  )
}
import clsx from "clsx"
import { GoldIcon } from "../icons/gold"



interface UnitButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children: React.ReactNode
    active?: boolean
}

export const UnitButton = ({ children, active = false, type = "button", ...props }: UnitButtonProps) => {

    const style = clsx(
        "flex items-center justify-center gap-2 px-4 py-1.5 rounded-md",
        "text-xs font-semibold",
        "hover:bg-blue-light transition-colors duration-200",
        active ? "bg-blue-500 text-white" : "bg-blue-900 text-slate-50"
    )

    return (
        <button className={style} {...props} >
            <GoldIcon />
            {children}
        </button>
    )
}
import clsx from "clsx";

interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'> {
    children?: React.ReactNode;
    active?: boolean;
    icon?: React.ReactNode;
    variant?: "outline" | "solid";
    size?: "sm" | "md" | "lg";
    type?: "button" | "submit" | "reset" | undefined;
}

export const Button = ({
    children,
    icon,
    active = false,
    type = "button",
    size = "sm",
    variant = 'solid',
    className,
    ...props
}: ButtonProps) => {
    const buttonClasses = clsx(
        "flex items-center justify-center gap-2 px-4 rounded-md font-semibold",
        "hover:bg-blue-light transition-colors duration-100",
        {
            "border border-gray-500 bg-transparent text-gray-600": variant === "outline" && !active,
            " border": variant === "outline",
            "text-slate-50": variant === "solid",
            "bg-blue-500 text-white": active,
            "bg-blue-900": !active,
            "text-xs py-1.5": size === "sm",
            "text-sm py-1.5": size === "md",
            "text-md py-1": size === "lg"
        },
        className
    );

    return (
        <button type={type} className={buttonClasses} {...props}>
            {icon}
            {children}
        </button>
    );
};

interface InputProps extends React.HTMLProps<HTMLInputElement> {
    children?: React.ReactNode;
}


export const Input = ({ ...props }: InputProps) => {
    return (
        <input className='border border-gray-300 rounded-md p-2' {...props} />
    )
}
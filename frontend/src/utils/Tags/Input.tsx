export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            {...props}
            required
            className={`rounded text-gray-400 p-1 text-base w-72 input-border ${props.className}`}
        />
    );
};

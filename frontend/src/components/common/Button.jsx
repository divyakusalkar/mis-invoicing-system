const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
        secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 focus:ring-red-500 shadow-lg shadow-red-500/25',
        ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700/50',
        success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

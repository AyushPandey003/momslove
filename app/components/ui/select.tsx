type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = '', ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none transition ${className}`}
    />
  );
}

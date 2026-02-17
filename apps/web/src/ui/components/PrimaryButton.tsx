export default function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const { className = "", loading, children, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={props.disabled || loading}
      className={
        "w-full rounded-2xl bg-sun-500 hover:bg-sun-400 active:bg-sun-600 transition text-neutral-900 font-black py-3 shadow-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 " +
        className
      }
    >
      {loading ? (
        <span className="animate-spin h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full" />
      ) : null}
      {children}
    </button>
  );
}


export default function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={
        "w-full rounded-2xl bg-sun-500 hover:bg-sun-400 active:bg-sun-600 transition text-neutral-900 font-black py-3 shadow-card " +
        className
      }
    />
  );
}


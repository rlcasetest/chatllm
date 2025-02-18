type Props = {
  errorMessage?: string;
};

export function ErrorMessage({ errorMessage }: Props) {
  if (!errorMessage) return <></>;

  return <p className="text-sm font-bold text-red-400">{errorMessage}</p>;
}

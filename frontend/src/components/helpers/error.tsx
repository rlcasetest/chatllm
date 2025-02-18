import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Center } from "./center";

type Props = {
  title?: string;
  message?: string;
};

export function Error({
  title = "ERROR",
  message = "An error occurred!",
}: Props) {
  const navigate = useNavigate();

  return (
    <Center className="absolute top-0 left-0 bg-white">
      <div className="flex flex-col justify-between items-center gap-2 border border-red-100 bg-red-50 rounded-sm p-4 text-foreground min-w-[300px]">
        <h3 className="self-center text-xl font-bold">{title}</h3>

        <p className="">{message}</p>

        <Button
          variant="ghost"
          className="mt-8 underline hover:bg-transparent hover:font-bold"
          onClick={() => navigate("/")}
        >
          Return
        </Button>
      </div>
    </Center>
  );
}

import { Loader } from "lucide-react";
import { Center } from "./center";

export function Loading() {
  return (
    <Center>
      <div className="flex gap-2 border border-gray-100 rounded-sm p-4 animate-pulse text-foreground">
        <p>Loading...</p>
        <Loader className="animate-spin" />
      </div>
    </Center>
  );
}

import { useLogout } from "@/hooks/auth/useLogout";
import { Button } from "../ui/button";
import { Loading } from "../helpers/loading";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function LogoutButton() {
  const { mutateAsync, isPending } = useLogout();

  if (isPending) <Loading />;

  return (
    <TooltipProvider>
      <Tooltip>
        <div className="absolute top-2 right-2">
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="hover:text-red-400 hover:bg-transparent font-bold"
              onClick={() => mutateAsync()}
              size="icon"
            >
              <LogOut />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Log out</p>
          </TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}

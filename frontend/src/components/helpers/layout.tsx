import { ReactNode } from "react";
import { LogoutButton } from "../auth/logout-button";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className="flex justify-center items-center h-dvh w-dvw">
      <LogoutButton />
      {children}
    </div>
  );
}

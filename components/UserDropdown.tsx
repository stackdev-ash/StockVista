"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const UserDropdown = ({
  user
}: {
  user: User;
}) => {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/sign-in",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
      flex items-center gap-2
      rounded-xl

      border border-slate-700
      bg-[#172033]

      px-2 py-4.5

      text-slate-300

      hover:bg-[#212e4a]
      hover:border-cyan-500/20
      hover:text-cyan-400

      data-[state=open]:bg-[#212e4a]
      data-[state=open]:border-cyan-500/30
      data-[state=open]:text-cyan-400

      focus-visible:ring-0
      focus-visible:outline-none

      transition-all duration-200
    "
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png" />
            <AvatarFallback className="bg-cyan-500/20 text-cyan-400">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-bold text-slate-200">
              {user.name ?? "User"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="
    w-72
    rounded-xl
    border border-cyan-500/10
    bg-gradient-to-b
    from-[#0f172a]
    to-[#111827]
    text-slate-300
    shadow-2xl
    shadow-cyan-900/20
    overflow-hidden
  "
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-3">
            <Avatar className="h-12 w-12 border border-cyan-100/20">
              <AvatarImage src="https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png" />
              <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-sm font-bold">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">
                {user.name ?? "User"}
              </span>
              <span className="text-xs text-slate-400">
                {user.email ?? "Email"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="
  text-red-400
  focus:text-red-300
  focus:bg-red-500/10
  font-medium
  cursor-pointer
"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserDropdown;

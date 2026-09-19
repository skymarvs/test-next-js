"use client";

import signoutUser from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { Roles } from "@/lib/enums/roles";
import { UserMetadata } from "@supabase/supabase-js";
import { cn } from "cn";
import { Menu, MoveRight, SquareArrowRightExit, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderPageProps {
  user: UserMetadata | undefined;
}

export default function HeaderPage({ user }: HeaderPageProps) {
  const router = useRouter();

  const getInitials = (name: string) => {
    const words = name?.trim().split(/\s+/) || [];
    return words.length
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : "";
  };

  const handleSignOutBtnClick = () => {
    toast.promise(signoutUser(), {
      loading: "Logging out.",
      success: () => {
        router.refresh();
        return "User logged out.";
      },
      error: (err) => `Failed: ${err.message}`,
    });
  };

  return (
    <>
      <div className="p-5 text-lg flex items-center justify-between sticky top-0 z-50 bg-white container mx-auto">
        <div className="flex items-center gap-4">
          <Ticket className="text-primary" />
          <p className="text-primary">Test Logo</p>
          <div className="hidden md:block lg:block">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => router.push("/events")}
            >
              Events
            </Button>
            {user?.user_role === Roles.Admin && (
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => router.push("/users")}
              >
                Users
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center hidden md:block lg:block">
          {user == null ? (
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
            >
              Sign-in
              <MoveRight />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton={false}
                render={
                  <div
                    className={cn(
                      "flex gap-6 cursor-pointer p-8 w-max",
                      buttonVariants({ variant: "ghost" })
                    )}
                  >
                    <Avatar size="lg">
                      <AvatarImage src={user?.picture}></AvatarImage>
                      <AvatarFallback>
                        {getInitials(user?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{user?.full_name}</span>
                      <br />
                      <span className="text-xs text-foreground/50">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                }
              >
                Open
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Action</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={handleSignOutBtnClick}
                      className="justify-between w-full"
                    >
                      Sign-out
                      <SquareArrowRightExit />
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className=" md:hidden lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Select one to navigate to</SheetDescription>
              </SheetHeader>
              <Separator />
              <div className="mx-4 my-4 grid gap-2">
                <SheetClose
                  nativeButton={false}
                  render={(props) => (
                    <div {...props}>
                      <Button
                        variant="link"
                        className="text-sm w-full justify-start"
                        onClick={() => router.push("/events")}
                      >
                        Events
                      </Button>
                      {user?.user_role === Roles.Admin && (
                        <Button
                          variant="link"
                          className="text-sm w-full justify-start"
                          onClick={() => router.push("/users")}
                        >
                          Users
                        </Button>
                      )}
                    </div>
                  )}
                ></SheetClose>
              </div>
              <SheetFooter>
                {user == null ? (
                  <SheetClose
                    render={
                      <Button onClick={() => router.push("/login")}>
                        Sign-in
                        <MoveRight />
                      </Button>
                    }
                  ></SheetClose>
                ) : (
                  <>
                    <div className="flex gap-2 m-0 cursor-pointer w-max">
                      <Avatar size="lg">
                        <AvatarImage src={user?.picture}></AvatarImage>
                        <AvatarFallback>
                          {getInitials(user?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span>{user?.full_name}</span>
                        <br />
                        <span className="text-xs text-foreground/50">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <SheetClose
                      render={
                        <Button onClick={handleSignOutBtnClick}>
                          Sign-out
                          <SquareArrowRightExit />
                        </Button>
                      }
                    ></SheetClose>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Separator />
    </>
  );
}

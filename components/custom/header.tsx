"use client"

import { ChevronsDownUp, MoveRight, SquareArrowRightExit, Ticket } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserMetadata } from "@supabase/supabase-js";
import { toast } from "@/components/ui/toast";
import signoutUser from "@/app/actions/auth";
import { Roles } from "@/lib/enums/roles";

interface HeaderPageProps {
    user : UserMetadata | undefined
}

export default function HeaderPage( { user } : HeaderPageProps){
    const authTabs = ['/login-page', '/signup-page'];
    const router = useRouter();
    const pathName = usePathname();

    if(authTabs.includes(pathName)){
        return;
    }

    const getInitials = (name: String) => {
        const words = name?.trim().split(/\s+/) || [];
        return words.length ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : "";
    };

    const handleSignOutBtnClick = () => {
        toast.promise(signoutUser(), {
            loading: "Logging out.",
            success: () => {
                router.refresh();
                return "User logged out.";
            },
            error: (err) => `Failed: ${err.message}`
        }); 
    }

    return(<>
        <div className="p-5 text-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Ticket className="text-primary"/>
                <p className="text-primary">Test Logo</p>
                <Separator orientation="vertical"/>
                <div>
                    <Button variant="ghost" className="text-sm" onClick={() => router.push("/events-page")}>Events</Button>
                    {user?.user_role === Roles.Admin && (
                        <Button variant="ghost" className="text-sm" onClick={() => router.push("/users-page")}>Users</Button>
                    )}
                </div>
            </div>
            <div className="flex gap-4 items-center">
                { user == null 
                    ? (
                        <Button variant="outline" onClick={() => router.push("/login-page")}>
                            Sign-in
                            <MoveRight />
                        </Button>
                    )
                    : (
                        <Popover>
                            <PopoverTrigger className="" nativeButton={false} render={
                                <div className={cn(
                                    "flex gap-6 cursor-pointer p-8 w-max",
                                    buttonVariants({variant: "ghost"})
                                )}>
                                    <Avatar size="lg">
                                        <AvatarImage src={user?.picture}></AvatarImage>
                                        <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span>{user?.full_name}</span><br/>
                                        <span className="text-xs text-foreground/50">{user?.email}</span>
                                    </div>
                                    <ChevronsDownUp />
                                </div>
                            }/>
                            <PopoverContent align="end" className="w-[var(--anchor-width)]">
                                <Button variant="ghost" onClick={handleSignOutBtnClick}>
                                    Sign-out
                                    <SquareArrowRightExit />
                                </Button>
                            </PopoverContent>
                        </Popover>
                    )
                }
            </div>
        </div>
        <Separator />
    </>);
}
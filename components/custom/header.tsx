"use client"

import { ChevronsDownUp, MoveRight, SquareArrowRightExit, Ticket } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function HeaderPage(){
    const authTabs = ['/login-page', '/signup-page']
    const router = useRouter();
    const pathName = usePathname();

    console.log(pathName)
    if(authTabs.includes(pathName)){
        return;
    }
    return(<>
        <div className="p-5 text-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Ticket className="text-primary"/>
                <p className="text-primary">Test Logo</p>
                <Separator orientation="vertical"/>
                <div>
                    <Button variant="ghost" onClick={() => router.push("/events-page")}>Events</Button>
                    <Button variant="ghost" onClick={() => router.push("/users-page")}>Users</Button>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <Button variant="outline" onClick={() => router.push("/login-page")}>
                    Sign-in
                    <MoveRight />
                </Button>
                <Popover>
                    <PopoverTrigger nativeButton={false} render={
                        <div className={cn(
                            "flex gap-6 items-center cursor-pointer p-6 w-60",
                            buttonVariants({variant: "ghost"})
                        )}>
                            <Avatar size="lg">
                                <AvatarImage src=""></AvatarImage>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <span>John Doe</span><br/>
                                <span className="text-xs text-foreground/50">johnDoe@gmail.com</span>
                            </div>
                            <ChevronsDownUp />
                        </div>
                    }/>
                    <PopoverContent align="end" className="w-60">
                        <Button variant="ghost">
                            Sign-out
                            <SquareArrowRightExit />
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <Separator />
    </>);
}
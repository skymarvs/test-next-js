import { Separator } from "@/components/ui/separator";
import OAuthLogin from "./oauth-login";
import ManualLogin from "./manual-login";

export default function SignInPage(){
    return (<>
        <div className="flex justify-center align-items-center items-center min-h-screen">
            <div className="grid gap-1 w-100">
                <ManualLogin />
                <Separator className="my-4"/>
                <OAuthLogin />
            </div>
        </div>
    </>);
}
import { Separator } from "@/components/ui/separator";
import OAuthLogin from "./oauth-login";
import ManualLogin from "./manual-login";
import { Marker, MarkerContent } from "@/components/ui/marker";

export default function SignInPage(){
    return (<>
        <div className="flex justify-center align-items-center items-center min-h-screen">
            <div className="grid gap-1 w-100">
                <ManualLogin />
                <Marker variant="separator" className="my-2">
                    <MarkerContent>or continue with</MarkerContent>
                </Marker>
                <OAuthLogin />
            </div>
        </div>
    </>);
}
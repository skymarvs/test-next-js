import { Marker, MarkerContent } from "@/components/ui/marker";
import { reactNodeSchemaType } from "@/lib/schema";
import OAuthLogin from "@/app/(auth)/common/oauth-login";

export default function AuthLayout({children} : reactNodeSchemaType){
    return (<>
        <div className="flex justify-center align-items-center items-center min-h-screen">
            <div className="grid gap-1 w-100">
                {children}
                <Marker variant="separator" className="my-2">
                    <MarkerContent>or continue with</MarkerContent>
                </Marker>
                <OAuthLogin />
            </div>
        </div>
    </>)
}
"use client"

import { Button } from "@/components/ui/button";
import createClient from "@/lib/supabase/client";

export default function OAuthLogin(){

    const signInWithGoogle = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            "provider": "google",
            "options": {
                redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/callback?next=/events-page`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'          
                }
            }
        })
    }

    return (<>
        <Button size={"lg"} variant="outline" onClick={signInWithGoogle}>
            <i className="devicon-google-plain text-lg"></i>
            Sign In with Google
        </Button>
        <Button size={"lg"} variant="outline">
            <i className="devicon-github-original text-lg"></i>
            Sign In with Github
        </Button>
    </>);
}
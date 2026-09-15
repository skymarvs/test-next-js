"use client"

import { Button } from "@/components/ui/button";
import createClient from "@/lib/supabase/client";

export default function OAuthLogin(){
    function signInWithGoogle(){
        const supabase = createClient();
        supabase.auth.signInWithOAuth({
            "provider": "google",
            "options": {
                redirectTo: `${window.location.origin}/api/auth/callback`,
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
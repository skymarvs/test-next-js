"use client";

import { Button } from "@/components/ui/button";
import createClient from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";

export default function OAuthLogin() {
  const signInOAuth = async (provider: Provider) => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/callback?next=/events-page`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return (
    <>
      <Button
        size={"lg"}
        variant="outline"
        onClick={() => signInOAuth("google")}
      >
        <i className="devicon-google-plain text-lg"></i>
        Sign In with Google
      </Button>
      <Button
        size={"lg"}
        variant="outline"
        onClick={() => signInOAuth("github")}
      >
        <i className="devicon-github-original text-lg"></i>
        Sign In with Github
      </Button>
    </>
  );
}

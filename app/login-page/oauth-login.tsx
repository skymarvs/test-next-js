import { Button } from "@/components/ui/button";

export default function OAuthLogin(){
    return (<>
        <Button size={"lg"} variant="outline">
            <i className="devicon-google-plain text-lg"></i>
            Sign In with Google
        </Button>
        <Button size={"lg"} variant="outline">
            <i className="devicon-github-original text-lg"></i>
            Sign In with Github
        </Button>
    </>);
}
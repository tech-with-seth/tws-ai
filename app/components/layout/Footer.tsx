import { ExternalLink } from "../ExternalLink";

export function Footer() {
    return (
        <footer className="mb-4 p-4">
            <div className="rounded-xl bg-zinc-300 p-4 dark:bg-zinc-800">
                Built by{" "}
                <ExternalLink href="https://bsky.app/profile/sethdavis.tech">
                    @sethdavis.tech
                </ExternalLink>
            </div>
        </footer>
    );
}

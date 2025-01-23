import { Heading } from "~/components/Heading";

export default function AdminIndexRoute() {
    return (
        <div className="p-4">
            <Heading as="h1" className="mb-8 text-6xl font-bold">
                Admin
            </Heading>
            <p>Howdy 🤠 Choose from nav above 👆🏻</p>
        </div>
    );
}

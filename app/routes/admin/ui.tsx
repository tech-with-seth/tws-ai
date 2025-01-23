import { TrashIcon } from "lucide-react";
import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Skeleton } from "~/components/Skeleton";

export default function UserInterfaceRoute() {
    return (
        <div className="p-4">
            <Heading as="h1" className="mb-8 text-6xl font-bold">
                User Interface
            </Heading>
            <div className="mb-8 flex gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Button>Alfa</Button>
                        <Button color="secondary">Alfa</Button>
                        <Button color="success">Alfa</Button>
                        <Button color="warning">Alfa</Button>
                        <Button color="danger">Alfa</Button>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="soft">Beta</Button>
                        <Button color="secondary" variant="soft">
                            Beta
                        </Button>
                        <Button color="success" variant="soft">
                            Beta
                        </Button>
                        <Button color="warning" variant="soft">
                            Beta
                        </Button>
                        <Button color="danger" variant="soft">
                            Beta
                        </Button>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline">Charlie</Button>
                        <Button color="secondary" variant="outline">
                            Charlie
                        </Button>
                        <Button color="success" variant="outline">
                            Charlie
                        </Button>
                        <Button color="warning" variant="outline">
                            Charlie
                        </Button>
                        <Button color="danger" variant="outline">
                            Charlie
                        </Button>
                    </div>
                    <div className="flex items-start gap-4">
                        <Button size="sm">Delta</Button>
                        <Button>Delta</Button>
                        <Button size="lg">Delta</Button>
                    </div>
                    <div className="flex items-start gap-4">
                        <Button iconBefore={<TrashIcon />}>Echo</Button>
                        <Button iconBefore={<TrashIcon />}>Echo</Button>
                        <Button
                            iconBefore={<TrashIcon />}
                            iconAfter={<TrashIcon />}
                        >
                            Echo
                        </Button>
                    </div>
                </div>
                <div>
                    <div className="flex flex-wrap items-start gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton variant="square" />
                            <Skeleton variant="square" />
                            <Skeleton variant="square" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton variant="block" />
                            <Skeleton variant="block" />
                            <Skeleton variant="block" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

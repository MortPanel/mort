export type Egg = {
    id: number;
    uuid: string;
    name: string;
    nest: number;
    author: string;
    description: string;
    docker_image: string;
    docker_images: Record<string, string>;
    config: {
        files: Record<string, {
            parser: string;
            find: Record<string, string>;
        }>;
        startup: {
            done: string;
        };
        stop: string;
        logs: any[];
        file_denylist: any[];
        extends: any;
    };
    startup: string;
    script: {
        privileged: boolean;
        install: string;
        entry: string;
        container: string;
        extends: any;
    };
    relationships: {
        variables?: { data: Variable[] };
    };
    created_at: string;
    updated_at: string;
}
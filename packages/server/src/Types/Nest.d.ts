import { Egg } from "./Egg";

export type Nest = {
    id: number;
    uuid: string;
    author: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    relationships: {
        eggs: {
            object: string;
            data: { object: Egg[] };
        };
    };
}
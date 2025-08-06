import { Server } from "../../../Types/Server";
import { User } from "../../../Types/User";
import APIRequest from "../APIRequest";

export default function CreateServer(
    name: string,
    user: number,
    egg: number,
    dockerImage: string,
    startup: string,
    environment: Record<string, string>,
    limits: {
        memory: number,
        disk: number,
        cpu: number,
        swap: number,
        io: number,
        oom_disabled: boolean | null,
    },
    featureLimits: {
        databases: number,
        allocations: number,
        backups: number,
    },
    allocation: {
        default: number,
    }
) {
    return APIRequest<{
        attributes?: Server;
    }>(
        "/application/servers",
        "POST",
        {
            name,
            user: user,
            egg: egg,
            docker_image: dockerImage,
            startup,
            environment,
            limits: {
                memory: limits.memory,
                disk: limits.disk,
                cpu: limits.cpu,
                swap: limits.swap,
                io: limits.io,
                oom_disabled: limits.oom_disabled ?? false,
            },
            feature_limits: {
                databases: featureLimits.databases,
                allocations: featureLimits.allocations,
                backups: featureLimits.backups,
            },
            allocation
        }
    );
}
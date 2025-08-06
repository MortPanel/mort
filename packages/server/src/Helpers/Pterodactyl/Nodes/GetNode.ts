import { Node } from "../../../Types/Node";
import APIRequest from "../APIRequest";

export default function GetNode(
    nodeId: number,
    include: string[] = ["location", "allocations"],
) {
    return APIRequest<{
        attributes?: Node;
    }>(
        "/application/nodes/" + nodeId + "?" + new URLSearchParams({
            include: include.join(","),
        }),
        "GET"
    );
}
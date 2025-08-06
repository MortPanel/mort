import { Node } from "../../../Types/Node";
import APIRequest from "../APIRequest";

export default function GetNodes(
    page: number = 1,
    perPage: number = 50,
    sort: string = "id",
    include: string[] = [],
) {
    return APIRequest<{
        data?: { object: "node", attributes: Node }[];
        meta?: {
            pagination: {
                total: number;
                count: number;
                per_page: number;
                current_page: number;
                total_pages: number;
            };
        };
    }>(
        "/application/nodes?" + new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
            sort,
            include: include.join(","),
        }),
        "GET"
    );
}
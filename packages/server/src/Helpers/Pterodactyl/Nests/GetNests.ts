import { Nest } from "../../../Types/Nest";
import APIRequest from "../APIRequest";

export default function GetNests(
    page: number = 1,
    perPage: number = 50,
    include: string[] = ["eggs", "variables"],
) {
    return APIRequest<{
        data?: { object: "nest", attributes: Nest }[];
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
        "/application/nests?" + new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
            include: include.join(","),
        }),
        "GET"
    );
}
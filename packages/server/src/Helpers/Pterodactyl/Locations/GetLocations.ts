import { LocationAttributes } from "../../../Types/Location";
import APIRequest from "../APIRequest";

export default function GetLocations(
    page: number = 1,
    perPage: number = 50,
    sort: string = "id",
    include: string[] = [],
) {
    return APIRequest<{
        data?: { object: "location", attributes: LocationAttributes }[];
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
        "/application/locations?" + new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
            sort,
            include: include.join(","),
        }),
        "GET"
    );
}
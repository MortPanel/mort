import { Egg } from "../../../../Types/Egg";
import APIRequest from "../../APIRequest";

export default function GetNestEggs(
    nestId: number,
    page: number = 1,
    perPage: number = 50,
    include: string[] = ["nest", "variables"],
) {
    return APIRequest<{
        data?: { object: "nest", attributes: Egg }[];
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
        "/application/nests/" + nestId + "/eggs?" + new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
            include: include.join(","),
        }),
        "GET"
    );
}
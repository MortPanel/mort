import APIRequest from "../APIRequest";

export default function UpdateServer(
    serverId: number,
    name: string,
    description: string,
    user: number
) {
    return APIRequest<void>(
        "/application/servers/"+serverId+"/details",
        "PATCH",
        {
            name,
            description,
            user
        }
    );
}
import APIRequest from "../APIRequest";

export default function DeleteServer(
    serverId: number
) {
    return APIRequest<void>(
        "/application/servers/"+serverId,
        "DELETE"
    );
}
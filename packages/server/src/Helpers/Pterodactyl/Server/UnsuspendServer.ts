import APIRequest from "../APIRequest";

export default function UnsuspendServer(
    serverId: number
) {
    return APIRequest<void>(
        "/application/servers/"+serverId+"/unsuspend",
        "POST"
    );
}
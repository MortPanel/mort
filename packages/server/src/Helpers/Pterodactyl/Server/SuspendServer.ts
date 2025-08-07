import APIRequest from "../APIRequest";

export default function SuspendServer(
    serverId: number
) {
    return APIRequest<void>(
        "/application/servers/"+serverId+"/suspend",
        "POST"
    );
}
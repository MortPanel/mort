import { User } from "../../../Types/User";
import APIRequest from "../APIRequest";

export default function UpdateUser(
    userId: number,
    email: string,
    username: string,
    password?: string,
) {
    return APIRequest<{
        attributes?: User;
    }>(
        "/application/users/" + userId,
        "PATCH",
        {
            email,
            username,
            first_name: username,
            last_name: username,
            password,
        }
    );
}
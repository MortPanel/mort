import { User } from "../../../Types/User";
import APIRequest from "../APIRequest";

export default function CreateUser(
    email: string,
    username: string,
    password: string,
) {
    return APIRequest<{
        attributes?: User;
    }>(
        "/application/users",
        "POST",
        {
            email,
            username,
            first_name: username,
            last_name: username,
            password,
        }
    );
}
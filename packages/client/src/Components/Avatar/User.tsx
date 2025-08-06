import md5 from "md5";
export default function UserAvatar({ email, ...props }: { email?: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
    if(!email) return null;
    return (
        <img
            src={`https://www.gravatar.com/avatar/${md5(email)}`}
            draggable="false"
            {...props}
        />
    );
}

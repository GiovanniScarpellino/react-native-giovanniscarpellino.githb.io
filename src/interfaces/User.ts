import Message from "./Message";

interface User {
    id: string;
    email?: string;
    active?: boolean;
    messages: { [key: string]: Message }[];
}

export default User;
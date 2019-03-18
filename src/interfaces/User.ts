import Message from "./Message";

interface User {
    id: string;
    email?: string;
    messages: { [key: string]: Message }[];
}

export default User;
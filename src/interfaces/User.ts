import Message from "./Message";

interface User {
    id: string;
    messages: { [key: string]: Message }[];
}

export default User;
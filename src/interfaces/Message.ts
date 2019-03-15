interface Message {
    content: string;
    position: 'left' | 'right';
    createdAt: number;
}

export default Message;
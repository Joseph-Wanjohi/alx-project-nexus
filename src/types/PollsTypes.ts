// src/types/PollsTypes.ts
export interface Option {
    id: number;
    text: string;
    votes: number; // Now required due to serializer
    percentage: number; // Now required due to serializer
}

export interface Poll {
    id: number;
    question: string;
    creator: string; // StringRelatedField from serializer
    category: string;
    created_at: string;
    expiry_date: string | null;
    options: Option[];
    user_vote?: Option | null; // From get_user_vote serializer method
}

export interface PollCreateData {
    question: string;
    category: string;
    expiry_date?: string | null;
    options: string[];
}

export interface VoteData {
    option: number; // Option ID
}

export interface PollResult {
    id: number;
    question: string;
    options: { id: number; text: string; votes: number; percentage: number }[];
}
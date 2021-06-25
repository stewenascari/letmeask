import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    auth: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    auth: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authId: string;
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                const likesAsArray = Object.values(value.likes ?? {});

                return {
                    id: key,
                    content: value.content,
                    auth: value.auth,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: likesAsArray.length,
                    likeId: Object.entries(value.likes ?? {}).find(([ key, { authId } ]) => authId === user?.id),
                }
            });

            setTitle(databaseRoom.title);
            // @ts-ignore
            setQuestions(parsedQuestions);
            return () => {
                roomRef.off('value');
            };
        })
    }, [roomId, user?.id]);
    
    return { questions, title };
}

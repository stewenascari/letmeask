import  logoImg from '../assets/images/logo.svg'
import {Button} from "../components/Button";

import '../styles/room.scss'
import {RoomCode} from "../components/RoomCode";
import { useParams } from 'react-router-dom';
import {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {database} from "../services/firebase";
import { Question } from '../components/Question';
import {useRoom} from "../hooks/useRoom";

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const { title, questions } = useRoom(params.id);

    return (
        <div id={"page-room"}>
            <header>
                <div className={"content"}>
                    <img src={logoImg} alt={"Letmeask"}/>
                    <div>
                        <RoomCode code={params.id}/>
                        <Button isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className={"room-title"}>
                    <h1>Sala - {title}</h1>
                    { questions.length > 0 &&
                    <span>{questions.length} pergunta(s)</span>
                    }
                </div>

                <div className={"question-list"}>
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.auth}
                            />
                        );
                    })}

                </div>
            </main>
        </div>
    );
}

import  logoImg from '../assets/images/logo.svg';
import removeImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answeImg from '../assets/images/answer.svg'
import {Button} from "../components/Button";

import '../styles/room.scss'
import {RoomCode} from "../components/RoomCode";
import {useHistory, useParams} from 'react-router-dom';
import {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {database} from "../services/firebase";
import { Question } from '../components/Question';
import {useRoom} from "../hooks/useRoom";

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const { title, questions } = useRoom(params.id);

    async function handleEndRoom() {
        if(window.confirm("Tem certeza que deseja encerrar essa sala?")) {
            await database.ref(`rooms/${params.id}`).update({
                endedAt: new Date(),
            })

            history.push('/')
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${params.id}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }
    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${params.id}/questions/${questionId}`).update({
            isHighLighted: true,
        })

    }
    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
            await database.ref(`rooms/${params.id}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id={"page-room"}>
            <header>
                <div className={"content"}>
                    <img src={logoImg} alt={"Letmeask"}/>
                    <div>
                        <RoomCode code={params.id}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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
                                isAnswered={question.isAnswered }
                                isHighLighted={question.isHighLighted }
                            >
                                { !question.isAnswered && (
                                    <>
                                        <button
                                            type={"button"}
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}

                                        >
                                            <img src={checkImg} alt={"Marcar pergunta como respondida"} />
                                        </button>
                                        <button
                                            type={"button"}
                                            onClick={() => handleHighLightQuestion(question.id)}

                                        >
                                            <img src={answeImg} alt={"Dar destaque a pergunta"}/>
                                        </button>
                                    </>
                                )}
                                <button
                                    type={"button"}
                                    onClick={() => handleDeleteQuestion(question.id)}

                                >
                                    <img src={removeImg} alt={"Remover pergunta"}/>
                                </button>
                            </Question>
                        );
                    })}

                </div>
            </main>
        </div>
    );
}

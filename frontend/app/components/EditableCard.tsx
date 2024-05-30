'use client'

import { faCheck, faPenToSquare, faXmark, faTrash } from "@/node_modules/@fortawesome/free-solid-svg-icons/index"
import { FontAwesomeIcon } from "@/node_modules/@fortawesome/react-fontawesome/index"
import { useState } from "react"
import axios from '../axios';
import { Card } from "../types/types";
import Dialog from "./Dialog";

type Props = {
    card: Card,
    onChange: () => void,
    handleDelete: (card: Card) => void
}

export default function EditableCard({card, onChange, handleDelete}: Props) {
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = () => {
        setNewQuestion(card.question);
        setNewAnswer(card.answer);
        setIsEditing(true);
    }

    const handleClose = () => {
        setIsEditing(false);
    }

    const handleApply = () => {
        handleClose();
        axios.put(`/api/flashcards/${card.id}/`, {
            'question': newQuestion,
            'answer': newAnswer
        }).then((res:any) => {
            onChange();
        })
    }


    return isEditing ? (
        <div className="deck-card">
            <textarea onChange={(e) => setNewQuestion(e.target.value)} spellCheck='false'>{newQuestion}</textarea >
            <textarea onChange={(e) => setNewAnswer(e.target.value)} spellCheck='false'>{newAnswer}</textarea>
            <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={handleApply}/>
            <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={handleClose}/>
        </div>
    ) : (
        <div className="deck-card">
            <div>{card.question}</div>
            <div>{card.answer}</div>
            <FontAwesomeIcon className="edit-btn btn" icon={faPenToSquare} onClick={handleEdit}/>
            <FontAwesomeIcon className="delete-btn btn" icon={faTrash} onClick={() => handleDelete(card)}/>
        </div>
    )
}
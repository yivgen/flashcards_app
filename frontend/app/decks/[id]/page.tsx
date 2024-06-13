'use client'
import { useParams } from '@/node_modules/next/navigation';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome/index';
import { faPlus, faCheck, faXmark, faPlay } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';
import EditableHeader from '@/app/components/EditableHeader';
import EditableCard from '@/app/components/EditableCard';
import Link from '@/node_modules/next/link';
import { Card } from '@/app/types/types';
import Dialog from '@/app/components/Dialog';

export default function Page() {
    const params = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [isDeletingCard, setIsDeletingCard] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<null | Card>(null);

    const updateDeck = () => {
        axios.get(`/api/decks/${params.id}/`).then(
            (res: any) => {
                setName(res?.data?.name);
                setFlashcards(res?.data?.flashcards);
            }
        );
    }

    const changeDeckName = (name: string) => {
        axios.put(`/api/decks/${params.id}/`, {
            'name': name
        }).then(
            (res: any) => {
                setName(res?.data?.name);
            }
        );
    }

    const closeAddCard = () => {
        setIsAddingCard(false);
        setNewQuestion('');
        setNewAnswer('');
    }

    const addCard = () => {
        closeAddCard();
        axios.post(`/api/decks/${params.id}/add_flashcard/`, {
            'question': newQuestion,
            'answer': newAnswer,
        }).then(
            (res: any) => {
                updateDeck();
            }
        );
    }

    useEffect(() => {
        updateDeck();
    }, []);

    const deleteCard = () => {
        if (cardToDelete) {
            axios.delete(`/api/flashcards/${cardToDelete.id}/`).finally(
                () => {
                    setIsDeletingCard(false);
                    setCardToDelete(null);
                    updateDeck();
                }
            )
        } else {
            throw TypeError('cardToDelete is undefined')
        }
        
    }

    const handleDeleteCard = (card: Card) => {
        setIsDeletingCard(true);
        setCardToDelete(card);
    }

    return (
        <div>
            <div className='deck-header'>
                <EditableHeader onChange={changeDeckName} value={name} maxLength={150} />
                {flashcards.length
                    ? (
                        <Link className="learn-btn btn" href={`/decks/${params.id}/learn/`}>
                            Learn
                            &nbsp;
                            <FontAwesomeIcon icon={faPlay}/>
                        </Link>
                    ) : null}
            </div>
            <div className='deck-cards'>
                <div className="deck-card">
                    <h3>Question</h3>
                    <h3>Answer</h3>
                    <div></div>
                    <FontAwesomeIcon className="btn" icon={faPlus} onClick={() => setIsAddingCard(true)} />
                </div>
                {isAddingCard
                    ? (
                        <div className="deck-card">
                            <textarea placeholder='How to say "hello" in Spanish?' onChange={(e) => setNewQuestion(e.target.value)} spellCheck='false'>{newQuestion}</textarea >
                            <textarea placeholder='Hola' onChange={(e) => setNewAnswer(e.target.value)} spellCheck='false'>{newAnswer}</textarea>
                            <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={addCard} />
                            <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={closeAddCard} />
                        </div>
                    ) : null
                }
                {flashcards.length
                    ? flashcards.map((card: Card) => (
                        <EditableCard key={card.id} card={card} onChange={updateDeck} handleDelete={handleDeleteCard} />
                    )) : isAddingCard
                        ? null
                        : <div className="deck-card">No flashcards yet.</div>}
                {isDeletingCard && cardToDelete
                    ? <Dialog 
                        prompt='Do you want to delete this card?' 
                        onClose={() => setIsDeletingCard(false)}
                        onOk={deleteCard}
                      />
                    : null}
            </div>
        </div>
    )
}
'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome';
import { faPlus, faCheck, faXmark, faPlay } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';
import EditableHeader from '@/app/components/EditableHeader';
import EditableCard from '@/app/components/EditableCard';
import Link from '@/node_modules/next/link';


type Card = {
    id: number,
    question: string,
    answer: string
}

export default function Page() {
    const params = useParams<{ deckID: string }>();
    const [name, setName] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const updateDeck = () => {
        axios.get(`/api/decks/${params.deckID}/`).then(
            (res: any) => {
                setName(res?.data?.name);
                setFlashcards(res?.data?.flashcards);
            }
        );
    }

    const changeDeckName = (name: string) => {
        axios.put(`/api/decks/${params.deckID}/`, {
            'name': name
        }).then(
            (res: any) => {
                setName(res?.data?.name);
            }
        );
    }

    const closeAddCard = () => {
        setIsAddingCard(false);
    }

    const addCard = () => {
        closeAddCard();
        axios.post(`/api/decks/${params.deckID}/add_flashcard/`, {
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

    return (
        <div>
            <div className='deck-header'>
                <EditableHeader onChange={changeDeckName} value={name} />
                {flashcards.length
                    ? (
                        <Link className="learn-btn" href={`/decks/${params.deckID}/learn/`}>
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
                            <textarea placeholder='How to say "hello" in Spanish?' onChange={(e) => setNewQuestion(e.target.value)}>{newQuestion}</textarea >
                            <textarea placeholder='Hola' onChange={(e) => setNewAnswer(e.target.value)}>{newAnswer}</textarea>
                            <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={addCard} />
                            <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={closeAddCard} />
                        </div>
                    ) : null
                }
                {flashcards.length
                    ? flashcards.map((card: Card) => (
                        <EditableCard key={card.id} card={card} onChange={updateDeck} />
                    )) : isAddingCard
                        ? null
                        : <div className="deck-card">No flashcards yet.</div>}
            </div>
        </div>
    )
}
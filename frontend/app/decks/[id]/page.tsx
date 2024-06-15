'use client'
import { useParams } from '@/node_modules/next/navigation';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome/index';
import { faPlus, faCheck, faXmark, faPlay, faMagnifyingGlass } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';
import EditableHeader from '@/app/components/EditableHeader';
import EditableCard from '@/app/components/EditableCard';
import Link from '@/node_modules/next/link';
import { Card } from '@/app/types/types';
import Dialog from '@/app/components/Dialog';
import CardPreviewDialog from '@/app/components/CardPreviewDialog';

export default function Page() {
    const params = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [totalFlashcardsNumber, setTotalFlashcards] = useState(0);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [isDeletingCard, setIsDeletingCard] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<null | Card>(null);
    const [isPreviewingCard, setIsPreviewingCard] = useState(false);
    const [cardToPreview, setCardToPreview] = useState<null | Card>(null);
    const [searchCardsPrompt, setSearchCardsPrompt] = useState("");

    const updateDeck = () => {
        axios.get(`/api/decks/${params.id}/`).then(
            (res: any) => {
                setName(res?.data?.name);
                setFlashcards(res?.data?.flashcards);
                setTotalFlashcards(res?.data?.flashcards?.length);
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

    const handlePreviewCard = (card: Card) => {
        setIsPreviewingCard(true);
        setCardToPreview(card);
    }

    const searchCards = (prompt: string) => {
        if (prompt) {
            axios.get(`/api/decks/${params.id}/search_cards/?q=${searchCardsPrompt}`).then(
                (res: any) => {
                    setFlashcards(res?.data);
                }
            );
        } else {
            updateDeck();
        }
    }


    useEffect(() => {
        searchCards(searchCardsPrompt);
    }, [searchCardsPrompt]);

    return (
        <div>
            <div className='deck-header'>
                <EditableHeader onChange={changeDeckName} value={name} maxLength={150} />
                {totalFlashcardsNumber
                    ? (
                        <Link className="learn-btn btn" href={`/decks/${params.id}/learn/`}>
                            Learn
                            &nbsp;
                            <FontAwesomeIcon icon={faPlay}/>
                        </Link>
                    ) : null}
                {totalFlashcardsNumber
                    ? (
                        <div id='deck-search-bar'>
                            <input 
                                type="text"
                                spellCheck='false' 
                                onChange={(e) => setSearchCardsPrompt(e.target.value)}
                            />
                            <button onClick={() => searchCards(searchCardsPrompt)}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>
                    ) : null}
            </div>
            <div className='deck-cards'>
                <div className="deck-card">
                    <h3>Question</h3>
                    <h3>Answer</h3>
                    <div></div>
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
                        <EditableCard 
                            key={card.id} 
                            card={card} 
                            onChange={updateDeck} 
                            handleDelete={handleDeleteCard} 
                            handlePreview={handlePreviewCard}
                        />
                    )) : isAddingCard
                        ? null
                        : <div className="deck-card">No flashcards found.</div>}
                {isDeletingCard && cardToDelete
                    ? <Dialog 
                        prompt='Do you want to delete this card?' 
                        onClose={() => setIsDeletingCard(false)}
                        onOk={deleteCard}
                      />
                    : null}
                {isPreviewingCard && cardToPreview
                    ? <CardPreviewDialog 
                        card={cardToPreview}
                        onClose={() => setIsPreviewingCard(false)}
                      />
                    : null}
            </div>
        </div>
    )
}
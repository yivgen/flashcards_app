'use client'
import { useParams } from '@/node_modules/next/navigation';
import axios from '../../../axios';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome/index';
import { faLeftLong, faRightLong } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';
import CardPreview from '@/app/components/CardPreview';
import { Deck, Card } from '@/app/types/types';

function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default function Page() {
    const params = useParams<{ id: string }>();
    const [flashcards, setFlashcards] = useState<Card[]>([]);
    const [currentCardIdx, setCurrentCardIdx] = useState(0);

    const getDeck = () => {
        axios.get(`/api/subjects/${params.id}/`).then(
            (res: any) => {
                let newFlashcards = res?.data?.decks.reduce((cards: Card[], deck: Deck) => {
                    return cards.concat(deck.flashcards);
                }, []);
                shuffleArray(newFlashcards);
                setFlashcards(newFlashcards);
            }
        );
    }

    useEffect(() => {
        getDeck();
    }, []);

    const goToPreviosCard = () => {
        if (currentCardIdx > 0) {
            setCurrentCardIdx(currentCardIdx - 1);
        }
    }

    const goToNextCard = () => {
        if (currentCardIdx < flashcards.length - 1) {
            setCurrentCardIdx(currentCardIdx + 1);
        }
    }

    return (
        flashcards.length
            ? (
                <div className="card-carousel">
                    <div className="cards">
                        {flashcards.map((card, idx) => <CardPreview show={currentCardIdx === idx} key={card.id} card={card}/>)}
                    </div>
                    <div className="carousel-btns">
                        <FontAwesomeIcon 
                            onClick={goToPreviosCard} 
                            className={`carousel-btn ${currentCardIdx == 0 ? 'disabled' : ''}`}
                            icon={faLeftLong}
                        />
                        <div className="carousel-counter no-select">
                            {currentCardIdx + 1}/{flashcards.length}
                        </div>
                        <FontAwesomeIcon 
                            onClick={goToNextCard} 
                            className={`carousel-btn ${currentCardIdx == flashcards.length - 1 ? 'disabled' : ''}`}
                            icon={faRightLong}
                        />
                    </div>
                </div>
            ) : <div>This subject has no decks.</div>
    )
}
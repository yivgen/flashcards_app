'use client'
import { useState, useEffect } from 'react';
import axios from '../axios';
import Link from '@/node_modules/next/link';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome';
import { faPlus, faCheck, faXmark } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';


export default function Page() {
    const [decks, setDecks] = useState([]);
    const [isAddingDeck, setIsAddingDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');

    const updateDecks = () => {
        axios.get('/api/decks/list/').then(
            res => {
                setDecks(res?.data);
            }
        );
    }

    const cancelAddDeck = () => {
        setIsAddingDeck(false);
    }

    const addDeck = () => {
        axios.post('/api/decks/list/', {
            'name': newDeckName
        }).then(
            res => {
                setIsAddingDeck(false);
                updateDecks();
            }
        );
    }

    useEffect(() => {
        updateDecks();
    }, []);

    return (
        <div className="decks">
            {decks.map(deck =>
                <Link
                    href={`/decks/${deck.id}/`}
                    key={deck.id}
                    className="deck"
                >
                    {deck.name}
                </Link>
            )}
            {isAddingDeck
                ? (
                    <div className='add-deck-form'>
                        <div className='add-deck-input-wrapper'>
                            <input
                                placeholder='Deck name'
                                className='add-deck-input'
                                type="text"
                                maxLength={150}
                                onChange={(e) => setNewDeckName(e.target.value)}
                            />
                        </div>
                        <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={addDeck} />
                        <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={cancelAddDeck} />
                    </div>
                ) : (
                    <div onClick={() => setIsAddingDeck(true)} className="deck add-deck-btn">
                        <FontAwesomeIcon className="btn" icon={faPlus} />
                        &nbsp;
                        Add deck
                    </div>
                )
            }
        </div>
    )
}
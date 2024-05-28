'use client'
import { useParams } from '@/node_modules/next/navigation';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome/index';
import { faPlus, faCheck, faXmark, faPlay } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';
import EditableHeader from '@/app/components/EditableHeader';
import Link from '@/node_modules/next/link';
import { Deck } from '@/app/types/types';


export default function Page() {
    const params = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [decks, setDecks] = useState([]);
    const [isAddingDeck, setIsAddingDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');

    const updateSubject = () => {
        axios.get(`/api/subjects/${params.id}/`).then(
            (res: any) => {
                setName(res?.data?.name);
                setDecks(res?.data?.decks);
                console.log(res?.data?.decks)
            }
        );
    }

    const changeDeckName = (name: string) => {
        axios.put(`/api/subjects/${params.id}/`, {
            'name': name
        }).then(
            (res: any) => {
                setName(res?.data?.name);
            }
        );
    }

    const cancelAddDeck = () => {
        setIsAddingDeck(false);
    }

    const addDeck = () => {
        cancelAddDeck();
        axios.post(`/api/subjects/${params.id}/add_deck/`, {
            'name': newDeckName
        }).then(
            (res: any) => {
                updateSubject();
            }
        );
    }

    useEffect(() => {
        updateSubject();
    }, []);

    return (
        <div>
            <div className='deck-header'>
                <EditableHeader onChange={changeDeckName} value={name} maxLength={150} />
                {decks.reduce((acc:number, deck:Deck) => acc + deck.flashcards.length, 0)
                    ? (
                        <Link className="learn-btn" href={`/subjects/${params.id}/learn/`}>
                            Learn
                            &nbsp;
                            <FontAwesomeIcon icon={faPlay}/>
                        </Link>
                    ) : null}
            </div>
            <div className="decks">
                {decks.map((deck: Deck) =>
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
                                placeholder='Subject name'
                                className='add-deck-input'
                                maxLength={150}
                                spellCheck='false'
                                type="text"
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
        </div>
    )
}
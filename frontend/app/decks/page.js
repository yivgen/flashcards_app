'use client'
import { useState, useEffect } from 'react';
import axios from '../axios';
import Link from '@/node_modules/next/link';
import Dialog from '../components/Dialog';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { push } = useRouter();
    const [decks, setDecks] = useState([]);
    const [newDeckName, setNewDeckName] = useState('');

    const updateDecks = () => {
        axios.get('/api/decks/list/')
            .then(res => {
                setDecks(res?.data);
            });
    }

    useEffect(() => {
        updateDecks();
    }, []);

    useEffect(() => {
        console.log(newDeckName);
    }, [newDeckName])

    async function onClose() {
        console.log("Modal has closed");
        setNewDeckName('');
        push('/decks');
    }

    async function onOk() {
        console.log("Ok was clicked");
        axios.post('/api/decks/list/', {
            'name': newDeckName
        }).then((res) => {
            console.log(res);
            updateDecks();
        })
    }

    return (
            <div className="decks">
                {decks.map(deck => <div key={deck.id} className="deck">{deck.name}</div>)}
                <Link href="/decks?showDialog=y" className="deck add-deck">Add deck</Link>
                <Dialog title="Add a deck" onClose={onClose} onOk={onOk}>
                    <div className='dialog-input'>
                        <label>Name:</label>
                        <input 
                            type="text" 
                            onChange={e => setNewDeckName(e.target.value)} 
                            placeholder='Deck 1'
                        />
                    </div>
                </Dialog>
            </div>
    )
}
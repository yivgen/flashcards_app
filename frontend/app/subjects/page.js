'use client'
import { useState, useEffect } from 'react';
import axios from '../axios';
import Link from '@/node_modules/next/link';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome';
import { faPlus, faCheck, faXmark } from '@/node_modules/@fortawesome/free-solid-svg-icons/index';


export default function Page() {
    const [subjects, setSubjects] = useState([]);
    const [isAddingSubject, setIsAddingSubject] = useState(false);
    const [newSubjectName, setNewDeckName] = useState('');

    const updateSubjects = () => {
        axios.get('/api/subjects/list/').then(
            res => {
                setSubjects(res?.data);
            }
        );
    }

    const cancelAddSubject = () => {
        setIsAddingSubject(false);
    }

    const addSubject = () => {
        axios.post('/api/subjects/list/', {
            'name': newSubjectName
        }).then(
            res => {
                setIsAddingSubject(false);
                updateSubjects();
            }
        );
    }

    useEffect(() => {
        updateSubjects();
    }, []);

    return (
        <div className="decks">
            {subjects.map(subject =>
                <Link
                    href={`/subjects/${subject.id}/`}
                    key={subject.id}
                    className="deck"
                >
                    {subject.name}
                </Link>
            )}
            {isAddingSubject
                ? (
                    <div className='add-deck-form'>
                        <div className='add-deck-input-wrapper'>
                            <input
                                placeholder='Subject name'
                                className='add-deck-input'
                                type="text"
                                maxLength={150}
                                onChange={(e) => setNewDeckName(e.target.value)}
                            />
                        </div>
                        <FontAwesomeIcon className="apply-btn btn" icon={faCheck} onClick={addSubject} />
                        <FontAwesomeIcon className="close-btn btn" icon={faXmark} onClick={cancelAddSubject} />
                    </div>
                ) : (
                    <div onClick={() => setIsAddingSubject(true)} className="deck add-deck-btn">
                        <FontAwesomeIcon className="btn" icon={faPlus} />
                        &nbsp;
                        Add subject
                    </div>
                )
            }
        </div>
    )
}
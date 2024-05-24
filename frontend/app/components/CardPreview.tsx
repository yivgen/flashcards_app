'use client'
import { useEffect, useState } from "react"
import { Card } from "../types/Card";

type Props = {
    card: Card
}

export default function CardPreview({card}: Props) {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [card])

    return (
        <div className={`card-wrapper ${isFlipped ? 'flipped' : ''}`}>
            <div className="card" onClick={() => setIsFlipped(!isFlipped)}>
                <div className="question">
                    <h2 className='no-select'>Question</h2>
                    <p>{card.question}</p>
                </div>
                <div className="answer">
                    <h2 className='no-select'>Answer</h2>
                    <p>{card.answer}</p>
                </div>
            </div>
        </div>
    )
}
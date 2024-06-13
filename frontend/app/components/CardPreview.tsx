'use client'
import Markdown from "markdown-to-jsx";
import { useEffect, useRef, useState } from "react";
import { Card } from "../types/types";

type Props = {
    card: Card,
    show: boolean
}

export default function CardPreview({card, show}: Props) {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef(document.createElement("div"));

    useEffect(() => {
        setIsFlipped(false);
    }, [card, show])

    useEffect(() => {
        if (show)
            cardRef.current.scrollIntoView();
    })

    return (
        <div ref={cardRef} className={`card-wrapper ${isFlipped ? 'flipped' : ''}`}>
            <div className="card" onClick={() => setIsFlipped(!isFlipped)}>
                <div className="question">
                    <h2 className='no-select'>Question</h2>
                    <p>
                        <Markdown>
                            {card.question}
                        </Markdown>
                    </p>
                </div>
                <div className="answer">
                    <h2 className='no-select'>Answer</h2>
                    <p>
                        <Markdown>
                            {card.answer}
                        </Markdown>
                    </p>
                </div>
            </div>
        </div>
    )
}
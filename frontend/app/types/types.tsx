export type Card = {
    id: number,
    question: string,
    answer: string
}

export type Deck = {
    id: number,
    name: string,
    flashcards: Card[]
}

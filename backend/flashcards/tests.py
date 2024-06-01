from django.test import TestCase
from rest_framework.test import APIRequestFactory
from flashcards.views import *
from flashcards.models import Flashcard


class FlashcardsAPITests(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.question = 'This is a test question'
        cls.answer = 'This is a test answer'
        cls.updated_question = 'This is updated question'
        cls.updated_answer = 'This is updated answer'
    
    def setUp(self) -> None:
        self.factory = APIRequestFactory()

    def test_create(self):
        request = self.factory.post('/api/flashcards/list/', {
            'question': self.question,
            'answer': self.answer
        })
        response = FlashcardList.as_view()(request)
        self.assertEqual(response.status_code, 201)
        Flashcard.objects.get(
            question=self.question,
            answer=self.answer
        )

    def test_retrieve(self):
        flashcard = Flashcard.objects.create(
            question=self.question,
            answer=self.answer
        )
        request = self.factory.get('/api/flashcards/')
        response = FlashcardDetail.as_view()(request, pk=flashcard.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('question'), self.question)
        self.assertEqual(response.data.get('answer'), self.answer)

    def test_update(self):
        flashcard = Flashcard.objects.create(
            question=self.question,
            answer=self.answer
        )
        request = self.factory.put('/api/flashcards/', {
            'question': self.updated_question,
            'answer': self.updated_answer
        })
        response = FlashcardDetail.as_view()(request, pk=flashcard.pk)
        self.assertEqual(response.status_code, 200)
        Flashcard.objects.get(
            pk=flashcard.pk,
            question=self.updated_question,
            answer=self.updated_answer
        )

    def test_delete(self):
        flashcard = Flashcard.objects.create(
            question=self.question,
            answer=self.answer
        )
        request = self.factory.delete('/api/flashcards')
        response = FlashcardDetail.as_view()(request, pk=flashcard.pk)
        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Flashcard.DoesNotExist):
            Flashcard.objects.get(pk=flashcard.pk)

class DeckAPITests(TestCase):    
    def setUp(self) -> None:
        self.factory = APIRequestFactory()

    def test_create(self):
        request = self.factory.post('/api/decks/list/', {
            'name': 'Test deck'
        })
        response = DeckList.as_view()(request)
        self.assertEqual(response.status_code, 201)
        Deck.objects.get(
            name='Test deck'
        )

    def test_retrieve(self):
        deck = Deck.objects.create(name='Test deck')
        request = self.factory.get('/api/decks/')
        response = DeckDetail.as_view()(request, pk=deck.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('name'), 'Test deck')
    
    def test_update(self):
        deck = Deck.objects.create(name='Test deck')
        request = self.factory.put('/api/decks/', {
            'name':'Updated test deck'
        })
        response = DeckDetail.as_view()(request, pk=deck.pk)
        self.assertEqual(response.status_code, 200)
        Deck.objects.get(
            pk=deck.pk,
            name='Updated test deck'
        )

    def test_delete(self):
        deck = Deck.objects.create(name='Test deck')
        request = self.factory.delete('/api/decks')
        response = DeckDetail.as_view()(request, pk=deck.pk)
        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Deck.DoesNotExist):
            Deck.objects.get(pk=deck.pk)
    
    def test_add_flashcard(self):
        deck = Deck.objects.create(name='Test deck')
        request = self.factory.post(f'/api/decks/{deck.pk}/add_flashcard', {
            'question': 'This is a test question',
            'answer': 'This is a test answer'
        })
        response = CreateFlashcardForDeck.as_view()(request, pk=deck.pk)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data.get('question'), 'This is a test question')
        self.assertEqual(response.data.get('answer'), 'This is a test answer')
        deck = Deck.objects.get(pk=deck.pk)
        self.assertEqual(deck.flashcards.first().question, 'This is a test question')
        self.assertEqual(deck.flashcards.first().answer, 'This is a test answer')

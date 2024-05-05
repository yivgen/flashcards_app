from django.test import TestCase
from rest_framework.test import APIRequestFactory
from flashcards.views import FlashcardList, FlashcardDetail
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

    def test_create_api(self):
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

    def test_retrieve_api(self):
        flashcard = Flashcard.objects.create(
            question=self.question,
            answer=self.answer
        )
        request = self.factory.get('/api/flashcards/')
        response = FlashcardDetail.as_view()(request, pk=flashcard.pk)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('question'), self.question)
        self.assertEqual(response.data.get('answer'), self.answer)

    def test_update_api(self):
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

    def test_delete_api(self):
        flashcard = Flashcard.objects.create(
            question=self.question,
            answer=self.answer
        )
        request = self.factory.delete('/api/flashcards')
        response = FlashcardDetail.as_view()(request, pk=flashcard.pk)
        self.assertEqual(response.status_code, 204)
        with self.assertRaises(Flashcard.DoesNotExist):
            Flashcard.objects.get(pk=flashcard.pk)
from rest_framework import generics
from flashcards.models import Flashcard, Deck
from flashcards.serializers import FlashcardSerializer, DeckRetrieveSerializer, DeckUpdateSerializer


class FlashcardList(generics.ListCreateAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer

class FlashcardDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer

class DeckList(generics.ListCreateAPIView):
    queryset = Deck.objects.all()
    serializer_class = DeckRetrieveSerializer

class DeckDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Deck.objects.all()
    serializer_class = DeckUpdateSerializer
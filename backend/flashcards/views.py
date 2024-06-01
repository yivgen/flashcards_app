from rest_framework import generics, mixins
from flashcards.models import Flashcard, Deck
from flashcards.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.postgres.search import SearchVector


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

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DeckRetrieveSerializer
        return DeckUpdateSerializer

class CreateFlashcardForDeck(APIView):
    def post(self, request, pk, *args, **kwargs):
        try:
            deck = Deck.objects.get(pk=pk)
        except Deck.DoesNotExist:
            return Response("Deck doesn't exist", status=status.HTTP_400_BAD_REQUEST)

        serializer = FlashcardSerializer(data=request.data)
        if serializer.is_valid():
            flashcard = serializer.save()
            deck.flashcards.add(flashcard)
            deck.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SearchDeckFlashcards(APIView):
    def get(self, request, pk, *args, **kwargs):
        query = request.GET.get('q', '')
        flashcards = Flashcard.objects.annotate(
            search=SearchVector("question", "answer")
        ).filter(deck_set__id=pk, search=query)
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)
from rest_framework import generics, mixins
from flashcards.models import Flashcard, Deck
from flashcards.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from haystack.query import SearchQuerySet, SQ
from flashcards.utils import SearchQuerySetWrapper
from django.utils import timezone
from django.conf import settings

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
        flashcards = SearchQuerySet().filter(
            SQ(decks=pk),
            SQ(question_auto=query) | SQ(answer_auto=query),
        )
        serializer = FlashcardSerializer(SearchQuerySetWrapper(flashcards), many=True)
        return Response(serializer.data)

class GetCardsToLearnFromDeck(APIView):
    def get(self, request, pk, *args, **kwargs):
        flashcards = Flashcard.objects.filter(
            deck_set__id=pk,
        ).exclude(
            lastTimeRememberedAt__gte=timezone.now() - settings.FLASHCARD_REMEMBER_TIME
        )

        if not flashcards:
            flashcards = Flashcard.objects.filter(
                deck_set__id=pk,
            ).order_by('lastTimeRememberedAt')

        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)

class RememberCard(APIView):
    def post(self, request, pk, *args, **kwargs):
        try:
            flashcard = Flashcard.objects.get(id=pk)
        except Flashcard.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        flashcard.lastTimeRememberedAt = timezone.now()
        flashcard.save()
        serializer = FlashcardSerializer(flashcard)
        return Response(serializer.data)
from rest_framework import serializers
from flashcards.models import Flashcard, Deck


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = '__all__'

class DeckRetrieveSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)
    class Meta:
        model = Deck
        fields = '__all__'

class DeckUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = '__all__'
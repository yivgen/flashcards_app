from rest_framework import serializers
from flashcards.models import Flashcard, Deck, Subject


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

class SubjectRetrieveSerializer(serializers.ModelSerializer):
    decks = DeckRetrieveSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = '__all__'

class SubjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
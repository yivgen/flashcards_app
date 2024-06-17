from haystack import indexes
from flashcards.models import Flashcard


class FlashcardIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    question_auto = indexes.EdgeNgramField(model_attr='question')
    answer_auto = indexes.EdgeNgramField(model_attr='answer')
    decks = indexes.MultiValueField()

    def prepare_decks(self, obj):
        return [deck.pk for deck in obj.deck_set.all()]

    def get_model(self):
        return Flashcard

    
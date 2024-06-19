from django.urls import path
from flashcards import views

urlpatterns = [
    path('flashcards/list/', views.FlashcardList.as_view()),
    path('flashcards/<int:pk>/', views.FlashcardDetail.as_view()),
    path('flashcards/<int:pk>/remember/', views.RememberCard.as_view()),
    path('decks/list/', views.DeckList.as_view()),
    path('decks/<int:pk>/', views.DeckDetail.as_view()),
    path('decks/<int:pk>/add_flashcard/', views.CreateFlashcardForDeck.as_view()),
    path('decks/<int:pk>/search_cards/', views.SearchDeckFlashcards.as_view()),
    path('decks/<int:pk>/get_cards_to_learn/', views.GetCardsToLearnFromDeck.as_view()),
]
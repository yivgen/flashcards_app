from django.urls import path
from flashcards import views

urlpatterns = [
    path('flashcards/list/', views.FlashcardList.as_view()),
    path('flashcards/<int:pk>/', views.FlashcardDetail.as_view()),
    path('decks/list/', views.DeckList.as_view()),
    path('decks/<int:pk>/', views.DeckDetail.as_view()),
    path('decks/<int:pk>/add_flashcard/', views.CreateFlashcardForDeck.as_view()),
]
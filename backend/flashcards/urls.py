from django.urls import path
from flashcards import views

urlpatterns = [
    path('flashcards/list/', views.FlashcardList.as_view()),
    path('flashcards/<int:pk>/', views.FlashcardDetail.as_view()),
    path('decks/list/', views.DeckList.as_view()),
    path('decks/<int:pk>/', views.DeckDetail.as_view()),
    path('decks/<int:pk>/add_flashcard/', views.CreateFlashcardForDeck.as_view()),
    path('subjects/list/', views.SubjectList.as_view()),
    path('subjects/<int:pk>/', views.SubjectDetail.as_view()),
    path('subjects/<int:pk>/add_deck/', views.CreateDeckForSubject.as_view()),
]
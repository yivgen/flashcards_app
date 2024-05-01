from django.urls import path
from flashcards import views

urlpatterns = [
    path('flashcards/list/', views.FlashcardList.as_view()),
    path('flashcards/<int:pk>/', views.FlashcardDetail.as_view()),
    path('deck/list/', views.DeckList.as_view()),
    path('deck/<int:pk>/', views.DeckDetail.as_view()),
]
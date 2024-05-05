from django.db import models


class Flashcard(models.Model):
    question = models.CharField(max_length=300, blank=False, null=False)
    answer = models.TextField()

class Deck(models.Model):
    name = models.CharField(max_length=300, blank=False, null=False)
    flashcards = models.ManyToManyField(Flashcard, blank=True, related_name='deck_set')
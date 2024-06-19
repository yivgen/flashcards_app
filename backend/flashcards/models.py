from django.db import models


class Flashcard(models.Model):
    question = models.CharField(max_length=500, blank=False, null=False)
    answer = models.TextField()
    lastTimeRememberedAt = models.DateTimeField(default=None, blank=False, null=True)

class Deck(models.Model):
    name = models.CharField(max_length=150, blank=False, null=False)
    flashcards = models.ManyToManyField(Flashcard, blank=True, related_name='deck_set')

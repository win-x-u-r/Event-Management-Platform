from django.db import models
from users.models import User
from core.models import Tag

class UserEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE)  # ← string reference

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user} → {self.event}"


class Event(models.Model):
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=50)
    description = models.TextField()
    host = models.CharField(max_length=100)
    budget = models.ForeignKey("budget.Budget", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"


class EventTag(models.Model):
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('event', 'tag')

    def __str__(self):
        return f"{self.event} tagged with {self.tag}"

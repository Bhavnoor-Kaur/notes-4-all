from django.db import models
import uuid

class Notes(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4, 
        editable=False
    )
    title = models.CharField(
        default='sample class', 
        max_length=250
    )
    note_link = models.CharField(max_length=250)
    summary_link = models.CharField(max_length=250)
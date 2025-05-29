from django.db import models

class Budget(models.Model):
    item_name = models.CharField(max_length=100)
    item_quantity = models.IntegerField()
    item_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    budget_status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.item_name} - {self.total_cost}"
# Generated by Django 4.1.1 on 2022-09-17 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes4all', '0002_notes_remove_orders_customer_remove_orders_product_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notes',
            name='title',
            field=models.CharField(default='sample', max_length=250),
            preserve_default=False,
        ),
    ]
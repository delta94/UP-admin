# Generated by Django 2.0.4 on 2018-04-14 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("admin", "0022_lecture_canceled")]

    operations = [
        migrations.AlterField(
            model_name="lecture",
            name="duration",
            field=models.PositiveIntegerField(default=30),
            preserve_default=False,
        )
    ]

# Generated by Django 2.0.4 on 2018-04-07 08:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [("admin", "0020_auto_20180323_1031")]

    operations = [
        migrations.AlterModelOptions(
            name="attendance", options={"ordering": ["client__surname", "client__name"]}
        )
    ]

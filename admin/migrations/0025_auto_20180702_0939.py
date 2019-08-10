# Generated by Django 2.0.6 on 2018-07-02 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("admin", "0024_auto_20180414_2035")]

    operations = [
        migrations.AlterModelOptions(name="attendancestate", options={"ordering": ["name"]}),
        migrations.AlterModelOptions(name="client", options={"ordering": ["surname", "name"]}),
        migrations.AlterModelOptions(name="course", options={"ordering": ["name"]}),
        migrations.AlterModelOptions(name="group", options={"ordering": ["name"]}),
        migrations.AddField(
            model_name="attendancestate",
            name="default",
            field=models.NullBooleanField(default=None, unique=True),
        ),
    ]

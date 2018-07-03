# Generated by Django 2.0.6 on 2018-07-03 05:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0026_auto_20180702_1323'),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.TextField(blank=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='admin.Client')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='admin.Course')),
            ],
            options={
                'ordering': ['client__surname', 'client__name', 'course__name'],
            },
        ),
    ]
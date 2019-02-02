# Generated by Django 2.1.5 on 2019-02-02 08:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0036_auto_20190128_1144'),
    ]

    operations = [
        migrations.RunSQL('CREATE COLLATION cz (locale = "cs_CZ.utf8")'),
        migrations.RunSQL('ALTER TABLE admin_attendancestate ALTER COLUMN name TYPE VARCHAR COLLATE cz;'),
        migrations.RunSQL('ALTER TABLE admin_client ALTER COLUMN name TYPE VARCHAR COLLATE cz;'),
        migrations.RunSQL('ALTER TABLE admin_client ALTER COLUMN surname TYPE VARCHAR COLLATE cz;'),
        migrations.RunSQL('ALTER TABLE admin_course ALTER COLUMN name TYPE VARCHAR COLLATE cz;'),
        migrations.RunSQL('ALTER TABLE admin_group ALTER COLUMN name TYPE VARCHAR COLLATE cz;'),
    ]

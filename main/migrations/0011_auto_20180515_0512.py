# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-05-15 05:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_auto_20180512_0208'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='skill',
            name='cost',
        ),
        migrations.AddField(
            model_name='skill',
            name='detail',
            field=models.CharField(default='none', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='skill',
            name='learn',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='skill',
            name='need',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='skill',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]

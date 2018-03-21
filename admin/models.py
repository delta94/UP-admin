from django.db import models


class AttendanceState(models.Model):
    name = models.TextField()
    visible = models.BooleanField()


class Client(models.Model):
    name = models.TextField()
    surname = models.TextField()
    phone = models.TextField(blank=True)
    email = models.TextField(blank=True)
    note = models.TextField(blank=True)


class Course(models.Model):
    name = models.TextField()
    visible = models.BooleanField()


class Group(models.Model):
    name = models.TextField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)


class Lecture(models.Model):
    start = models.DateTimeField(null=True)
    duration = models.PositiveIntegerField(blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    group = models.ForeignKey(Group, related_name='lectures', on_delete=models.CASCADE, null=True)


class Attendance(models.Model):
    paid = models.BooleanField()
    note = models.TextField(blank=True)
    client = models.ForeignKey(Client, related_name='attendances', on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, related_name='attendances', on_delete=models.CASCADE)
    attendancestate = models.ForeignKey(AttendanceState, on_delete=models.PROTECT)

    class Meta:
        ordering = ['client__surname']


class Membership(models.Model):
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField(null=True)
    client = models.ForeignKey(Client, related_name='memberships', on_delete=models.CASCADE)
    group = models.ForeignKey(Group, related_name='memberships', on_delete=models.CASCADE)

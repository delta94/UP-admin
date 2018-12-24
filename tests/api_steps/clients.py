from behave import *
import json
from tests import helpers
from rest_framework import status
from tests.common_steps import clients
from tests.api_steps import common


@then('the client is added')
def step_impl(context):
    # vlozeni bylo uspesne
    assert context.resp.status_code == status.HTTP_201_CREATED
    # nacti udaje vlozeneho klienta
    new_client_id = json.loads(context.resp.content)['id']
    new_client_resp = context.client.get(helpers.api_url(f"/clients/{new_client_id}/"))
    assert new_client_resp.status_code == status.HTTP_200_OK
    new_client_data_json = json.loads(new_client_resp.content)
    # porovnej ziskana data se zaslanymi udaji
    assert new_client_data_json['name'] == context.name
    assert new_client_data_json['surname'] == context.surname
    assert new_client_data_json['phone'] == context.phone
    assert new_client_data_json['email'] == context.email
    assert new_client_data_json['note'] == context.note


use_step_matcher("re")


@when(
    'user adds new client "(?P<name>.*)" "(?P<surname>.*)" with phone "(?P<phone>.*)", email "(?P<email>.*)" and note "(?P<note>.*)"')
def step_impl(context, name, surname, phone, email, note):
    # nacteni dat klienta do kontextu
    context.name = name
    context.surname = surname
    context.phone = phone
    context.email = email
    context.note = note
    # vlozeni klienta
    context.resp = context.client.post(helpers.api_url("/clients/"),
                                       {'name': context.name,
                                        'surname': context.surname,
                                        'phone': context.phone,
                                        'email': context.email,
                                        'note': context.note})

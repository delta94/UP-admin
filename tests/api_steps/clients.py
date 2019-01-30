from behave import *
import json
from tests.api_steps import helpers
from tests import common_helpers
from rest_framework import status
from tests.common_steps import clients
from tests.api_steps import login_logout


def clients_cnt(api_client):
    return len(helpers.get_clients(api_client))


def find_client(context):
    all_clients = helpers.get_clients(context.api_client)
    # najdi klienta s udaji v kontextu
    for client in all_clients:
        if client_equal_to_context(client, context):
            return True
    return False


def client_equal_to_context(client, context):
    return (client['name'] == context.name and
            client['surname'] == context.surname and
            client['phone'] == common_helpers.shrink_str(context.phone) and
            client['email'] == context.email and
            client['note'] == context.note)


def find_client_with_id(context, client_id):
    # nacti klienta z endpointu podle id
    client_resp = context.api_client.get(f"{helpers.API_CLIENTS}{client_id}/")
    assert client_resp.status_code == status.HTTP_200_OK
    client = json.loads(client_resp.content)
    # porovnej ziskana data se zaslanymi udaji
    assert client_equal_to_context(client, context)


def client_dict(context):
    return {'name': context.name,
            'surname': context.surname,
            'phone': context.phone,
            'email': context.email,
            'note': context.note}


def load_data_to_context(context, name, surname, phone, email, note):
    context.name = name
    context.surname = surname
    context.phone = phone
    context.email = email
    context.note = note


def save_old_clients_cnt_to_context(context):
    context.old_clients_cnt = clients_cnt(context.api_client)


@then('the client is added')
def step_impl(context):
    # vlozeni bylo uspesne
    assert context.resp.status_code == status.HTTP_201_CREATED
    # nacti udaje vlozeneho klienta
    client_id = json.loads(context.resp.content)['id']
    # podle ID klienta over, ze souhlasi jeho data
    find_client_with_id(context, client_id)
    # najdi klienta ve vsech klientech podle dat
    assert find_client(context)
    assert clients_cnt(context.api_client) > context.old_clients_cnt


@then('the client is updated')
def step_impl(context):
    # uprava byla uspesna
    assert context.resp.status_code == status.HTTP_200_OK
    # nacti udaje upravovaneho klienta
    client_id = json.loads(context.resp.content)['id']
    # podle ID klienta over, ze souhlasi jeho data
    find_client_with_id(context, client_id)
    # najdi klienta ve vsech klientech podle dat
    assert find_client(context)
    assert clients_cnt(context.api_client) == context.old_clients_cnt


@then('the client is deleted')
def step_impl(context):
    # smazani bylo uspesne
    assert context.resp.status_code == status.HTTP_204_NO_CONTENT
    assert not helpers.find_client_with_full_name(context.api_client, context.full_name)
    assert clients_cnt(context.api_client) < context.old_clients_cnt


@when('user deletes the client "{full_name}"')
def step_impl(context, full_name):
    # nacti jmeno klienta do kontextu
    context.full_name = full_name
    # najdi klienta
    client_to_delete = helpers.find_client_with_full_name(context.api_client, context.full_name)
    assert client_to_delete
    # uloz puvodni pocet klientu
    save_old_clients_cnt_to_context(context)
    # smazani klienta
    context.resp = context.api_client.delete(f"{helpers.API_CLIENTS}{client_to_delete['id']}/")


@then('the client is not added')
def step_impl(context):
    # vlozeni bylo neuspesne
    assert context.resp.status_code == status.HTTP_400_BAD_REQUEST
    # over, ze v odpovedi skutecne neni id klienta
    client = json.loads(context.resp.content)
    assert 'id' not in client
    assert not find_client(context)
    assert clients_cnt(context.api_client) == context.old_clients_cnt


use_step_matcher("re")


@when(
    'user adds new client "(?P<name>.*)" "(?P<surname>.*)" with phone "(?P<phone>.*)", email "(?P<email>.*)" and note "(?P<note>.*)"')
def step_impl(context, name, surname, phone, email, note):
    # nacteni dat klienta do kontextu
    load_data_to_context(context, name, surname, phone, email, note)
    # uloz puvodni pocet klientu
    save_old_clients_cnt_to_context(context)
    # vlozeni klienta
    context.resp = context.api_client.post(helpers.API_CLIENTS, client_dict(context))


@when(
    'user updates the data of client "(?P<cur_full_name>.*)" to name "(?P<new_name>.*)", surname "(?P<new_surname>.*)", phone "(?P<new_phone>.*)", email "(?P<new_email>.*)" and note "(?P<new_note>.*)"')
def step_impl(context, cur_full_name, new_name, new_surname, new_phone, new_email, new_note):
    # nacteni dat klienta do kontextu
    load_data_to_context(context, new_name, new_surname, new_phone, new_email, new_note)
    # najdi klienta
    client_to_update = helpers.find_client_with_full_name(context.api_client, cur_full_name)
    assert client_to_update
    # uloz puvodni pocet klientu
    save_old_clients_cnt_to_context(context)
    # vlozeni klienta
    context.resp = context.api_client.put(f"{helpers.API_CLIENTS}{client_to_update['id']}/", client_dict(context))
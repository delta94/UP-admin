from behave import *
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from tests import common_helpers
from selenium.common.exceptions import TimeoutException
from tests.ui_steps import helpers
from tests.common_steps import clients
from tests.ui_steps import login_logout


def clients_cnt(driver):
    return len(helpers.get_clients(driver))


def open_clients(driver):
    driver.find_element_by_css_selector('[data-qa=menu_clients]').click()


def find_client(driver, full_name, **data):
    all_clients = helpers.get_clients(driver)
    # najdi klienta s udaji v parametrech
    for client in all_clients:
        found_name = client.find_element_by_css_selector('[data-qa=client_name]').text
        # srovnej identifikatory
        if found_name == full_name:
            # identifikatory sedi, otestuj pripadna dalsi zaslana data nebo rovnou vrat nalezeny prvek
            if data:
                found_phone = client.find_element_by_css_selector('[data-qa=client_phone]').text
                found_email = client.find_element_by_css_selector('[data-qa=client_email]').text
                found_note = client.find_element_by_css_selector('[data-qa=client_note]').text
                if (common_helpers.shrink_str(found_phone) == helpers.frontend_empty_str(
                        common_helpers.shrink_str(data['phone'])) and
                        found_email == helpers.frontend_empty_str(data['email']) and
                        found_note == helpers.frontend_empty_str(data['note'])):
                    return client
            else:
                return client
    return False


def find_client_with_context(context):
    full_name = common_helpers.client_full_name(context.name, context.surname)
    return find_client(context.browser, full_name, phone=context.phone, email=context.email, note=context.note)


def wait_form_visible(driver):
    WebDriverWait(driver, helpers.WAIT_TIME).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-qa=form_client]')))


def insert_to_form(context):
    # pockej az bude viditelny formular
    wait_form_visible(context.browser)
    # vloz vsechny udaje do formulare
    name_field = context.browser.find_element_by_css_selector('[data-qa=client_field_name]')
    surname_field = context.browser.find_element_by_css_selector('[data-qa=client_field_surname]')
    phone_field = context.browser.find_element_by_css_selector('[data-qa=client_field_phone]')
    email_field = context.browser.find_element_by_css_selector('[data-qa=client_field_email]')
    note_field = context.browser.find_element_by_css_selector('[data-qa=client_field_note]')
    # smaz vsechny udaje
    name_field.clear()
    surname_field.clear()
    phone_field.clear()
    email_field.clear()
    note_field.clear()
    # vloz nove udaje
    name_field.send_keys(context.name)
    surname_field.send_keys(context.surname)
    phone_field.send_keys(context.phone)
    email_field.send_keys(context.email)
    note_field.send_keys(context.note)
    # vrat posledni element
    return note_field


def load_data_to_context(context, name, surname, phone, email, note):
    context.name = name
    context.surname = surname
    context.phone = phone
    context.email = email
    context.note = note


def save_old_clients_cnt_to_context(context):
    context.old_clients_cnt = clients_cnt(context.browser)


@then('the client is added')
def step_impl(context):
    # pockej na pridani klienta
    WebDriverWait(context.browser, helpers.WAIT_TIME).until(
        lambda driver: clients_cnt(driver) > context.old_clients_cnt)
    # je klient opravdu pridany?
    assert find_client_with_context(context)


@then('the client is updated')
def step_impl(context):
    # pockej na update klientu
    helpers.wait_loading_cycle(context.browser)
    # ma klient opravdu nove udaje?
    assert find_client_with_context(context)
    assert clients_cnt(context.browser) == context.old_clients_cnt


@then('the client is deleted')
def step_impl(context):
    # pockej na smazani klienta
    WebDriverWait(context.browser, helpers.WAIT_TIME).until(
        lambda driver: clients_cnt(driver) < context.old_clients_cnt)
    # je klient opravdu smazany?
    assert not find_client(context.browser, context.full_name)


@when('user deletes the client "{full_name}"')
def step_impl(context, full_name):
    # nacti jmeno klienta do kontextu
    context.full_name = full_name
    # klikni v menu na klienty
    open_clients(context.browser)
    # pockej na nacteni
    helpers.wait_loading_ends(context.browser)
    # najdi klienta a klikni u nej na Upravit
    client_to_delete = find_client(context.browser, full_name)
    assert client_to_delete
    button_edit_client = client_to_delete.find_element_by_css_selector('[data-qa=button_edit_client]')
    button_edit_client.click()
    # uloz puvodni pocet klientu
    save_old_clients_cnt_to_context(context)
    # pockej az bude viditelny formular
    wait_form_visible(context.browser)
    # klikni na smazat
    button_delete_client = context.browser.find_element_by_css_selector('[data-qa=button_delete_client]')
    button_delete_client.click()
    # a potvrd smazani
    helpers.wait_for_alert_and_accept(context.browser)


@then('the client is not added')
def step_impl(context):
    # zjisti, zda stale sviti formular a zadny klient nepribyl
    try:
        WebDriverWait(context.browser, helpers.WAIT_TIME_SHORT).until_not(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-qa=form_client]')))
        form_client_visible = False
    except TimeoutException:
        form_client_visible = True
    assert form_client_visible
    assert clients_cnt(context.browser) == context.old_clients_cnt


use_step_matcher("re")


@when(
    'user adds new client "(?P<name>.*)" "(?P<surname>.*)" with phone "(?P<phone>.*)", email "(?P<email>.*)" and note "(?P<note>.*)"')
def step_impl(context, name, surname, phone, email, note):
    # nacti data klienta do kontextu
    load_data_to_context(context, name, surname, phone, email, note)
    # klikni v menu na klienty
    open_clients(context.browser)
    # pockej na nacteni a pak klikni na Pridat klienta
    helpers.wait_loading_ends(context.browser)
    button_add_client = context.browser.find_element_by_css_selector('[data-qa=button_add_client]')
    button_add_client.click()
    # uloz puvodni pocet klientu
    save_old_clients_cnt_to_context(context)
    # vloz vsechny udaje do formulare
    last_field = insert_to_form(context)
    # odesli formular
    last_field.submit()


@when(
    'user updates the data of client "(?P<cur_full_name>.*)" to name "(?P<new_name>.*)", surname "(?P<new_surname>.*)", phone "(?P<new_phone>.*)", email "(?P<new_email>.*)" and note "(?P<new_note>.*)"')
def step_impl(context, cur_full_name, new_name, new_surname, new_phone, new_email, new_note):
    # nacti data klienta do kontextu
    load_data_to_context(context, new_name, new_surname, new_phone, new_email, new_note)
    # klikni v menu na klienty
    open_clients(context.browser)
    # pockej na nacteni
    helpers.wait_loading_ends(context.browser)
    # najdi klienta a klikni u nej na Upravit
    client_to_update = find_client(context.browser, cur_full_name)
    assert client_to_update
    button_edit_client = client_to_update.find_element_by_css_selector('[data-qa=button_edit_client]')
    button_edit_client.click()
    # uloz puvodni pocet klientu
    save_old_clients_cnt_to_context(context)
    # vloz vsechny udaje do formulare
    last_field = insert_to_form(context)
    # odesli formular
    last_field.submit()
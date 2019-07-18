import React, {Fragment} from "react"
import {Modal} from "reactstrap"
import AddButton from "../components/buttons/AddButton"
import EditButton from "../components/buttons/EditButton"
import FormClients from "../forms/FormClients"
import useModal from "../hooks/useModal"

const ModalClients = ({currentClient = null, refresh}) => {
    const [isModal, toggleModal] = useModal()

    return (
        <Fragment>
            {Boolean(currentClient) &&
            <EditButton content="Upravit klienta" onClick={toggleModal} data-qa="button_edit_client"/>}
            {!Boolean(currentClient) && <AddButton content="Přidat klienta" onClick={toggleModal}
                                                   data-qa="button_add_client"/>}
            <Modal isOpen={isModal} toggle={toggleModal} autoFocus={false}>
                <FormClients client={Boolean(currentClient) ? currentClient : {}}
                             funcClose={toggleModal}
                             funcRefresh={refresh}/>
            </Modal>
        </Fragment>
    )
}

export default ModalClients

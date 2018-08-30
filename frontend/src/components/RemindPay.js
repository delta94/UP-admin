import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCommentDollar} from "@fortawesome/pro-solid-svg-icons"

const RemindPay = ({remind_pay}) =>
    remind_pay &&
    <span title="Příště platit">
        <FontAwesomeIcon icon={faCommentDollar} size="lg" color="#ff9800" transform="up-4"/>
    </span>

export default RemindPay

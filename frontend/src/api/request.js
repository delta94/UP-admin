import React, { Component, Fragment } from "react"
import { toast } from "react-toastify"
import Notification from "../components/Notification"
import { NOTIFY_TEXT } from "../global/constants"
import history from "../global/history"
import APP_URLS from "../urls"
import axiosRequest from "./_axios"
import { API_METHODS, API_URLS } from "./urls"

class ErrorMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errMsg: ""
        }
        this.errorResponse = props.error.response
        this.djangoError = props.error.request ? props.error.request.response : "null"
    }

    componentDidMount() {
        this.logToConsole()
        this.parseErrors()
    }

    logToConsole = () => {
        console.error("Požadavek byl NEÚSPĚŠNÝ: ", this.props.error.config)
        // request proveden, ale neprislo 2xx
        if (this.errorResponse) {
            // log do konzole
            console.error("Status: ", this.errorResponse.status, this.errorResponse.statusText)
            console.error("Data: ", this.errorResponse.data)
            console.error("Headers: ", this.errorResponse.headers)
            console.error("DJANGO/DRF CHYBA: ", this.djangoError)
            console.error("DALŠÍ INFORMACE: ", this.props.error)
            if ("x-sentry-id" in this.errorResponse.headers)
                console.info("SENTRY ID: ", this.errorResponse.headers["x-sentry-id"])
        } else {
            // stalo se neco jineho pri priprave requestu
            console.error("Při přípravě requestu nastala chyba: ", this.props.error.message)
        }
    }

    parseErrors = () => {
        let errMsg = NOTIFY_TEXT.ERROR
        // request proveden, ale neprislo 2xx
        if (this.errorResponse) {
            // uloz do errMsg neco konkretnejsiho
            if (this.errorResponse.status === 503) errMsg = NOTIFY_TEXT.ERROR_TIMEOUT
            else {
                try {
                    // rozparsuj JSON objekt
                    let json = JSON.parse(this.djangoError)
                    // pokud se pridava (neupdatuje) a chyba se vztahuje ke konkretnimu field, vraci se pole, vezmi z nej prvni chybu
                    if (Array.isArray(json)) json = json[0]
                    // obecna chyba nevztazena ke konkretnimu field || chyba muze obsahovat detailni informace (napr. metoda PUT neni povolena)
                    if ("non_field_errors" in json || "detail" in json) {
                        errMsg = json["non_field_errors"] || json["detail"]
                        // stringify, kdyz prijde objekt
                        if (Array.isArray(errMsg) && errMsg.length !== 1)
                            errMsg = JSON.stringify(errMsg)
                    }
                    // chyba vztazena ke konkretnimu field
                    else if (json[Object.keys(json)[0]]) {
                        errMsg = Object.keys(json).map((field, index) => (
                            <Fragment key={"err" + index}>
                                <span className="font-weight-bold">{field}:</span>
                                <span className="font-italic">
                                    {Array.isArray(json[field]) ? (
                                        <ul>
                                            {json[field].map((subField, index) => {
                                                let errContent
                                                if (typeof subField === "object")
                                                    errContent = (
                                                        <Fragment>
                                                            <span className="font-weight-bold">
                                                                {Object.keys(subField)[0] + ": "}
                                                            </span>
                                                            {subField[Object.keys(subField)[0]]}
                                                        </Fragment>
                                                    )
                                                else if (typeof subField === "string")
                                                    errContent = subField
                                                else errContent = JSON.stringify(subField)
                                                return <li key={"err_sub" + index}>{errContent}</li>
                                            })}
                                        </ul>
                                    ) : (
                                        <p>json[field]</p>
                                    )}
                                </span>
                            </Fragment>
                        ))
                    }
                } catch (error) {
                    // nic nedelej
                }
            }

            // pokud je logovano do Sentry, pridej o tom na konec zpravy info
            if ("x-sentry-id" in this.errorResponse.headers)
                errMsg = (
                    <Fragment>
                        {errMsg}
                        <hr />
                        Chyba byla zaznamenána v systému (
                        {this.errorResponse.headers["x-sentry-id"]}).
                    </Fragment>
                )
        } else {
            // stalo se neco jineho pri priprave requestu
            errMsg = this.props.error.message
        }
        this.setState({ errMsg: errMsg })
    }

    render() {
        return <Notification text={this.state.errMsg} type={toast.TYPE.ERROR} />
    }
}

const request = function(options, ignore_errors = false, return_data = true) {
    const onSuccess = response => {
        const responseUrl = response.request.responseURL
        console.info("%cÚspěch: " + responseUrl, "color: green", response)
        if (options.method !== API_METHODS.get)
            if (
                (responseUrl && !responseUrl.match(API_URLS.Login.url)) ||
                responseUrl === undefined
            )
                // responseURL neni definovana v IE, tedy v IE se zobrazi vice notifikaci, ale aspon bude appka fungovat
                notify(<Notification type={toast.TYPE.SUCCESS} />, toast.TYPE.SUCCESS)
        return return_data ? response.data : response
    }

    const onError = error => {
        if (!ignore_errors) {
            notify(<ErrorMessage error={error} />, toast.TYPE.ERROR)
            if (error.response) {
                if (error.response.status === 401) history.push(APP_URLS.prihlasit.url)
                else if (error.response.status === 404) history.push(APP_URLS.nenalezeno.url)
            }
            return Promise.reject(error.response || error.message)
        } else {
            return error.response
        }
    }

    const notify = (message, level) => {
        const options = {
            type: level,
            autoClose: level === toast.TYPE.ERROR ? 15000 : 4000
        }
        toast(message, options)
    }

    return axiosRequest(options)
        .then(onSuccess)
        .catch(onError)
}

export default request

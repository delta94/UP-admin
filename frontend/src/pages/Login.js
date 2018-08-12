import React, {Component, Fragment} from "react"
import {Redirect} from "react-router-dom"
import {Col, Form, FormGroup, Label, Input, Container, Row, Card} from "reactstrap"
import AuthService from "../auth/authService"
import SubmitButton from "../components/buttons/SubmitButton"
import Heading from "../components/Heading"

export default class Login extends Component {
    state = {
        redirectToReferrer: false,
        username: '',
        password: ''
    }

    login = () => {
        const {username, password} = this.state
        AuthService.authenticate(username, password, () => {
            this.setState({redirectToReferrer: true})
        })
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.id] = e.target.value
        this.setState(state)
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.login()
    }

    render() {
        const {from} = this.props.location.state || {from: {pathname: "/"}}
        const {redirectToReferrer, username, password} = this.state
        if (redirectToReferrer)
            return <Redirect to={from}/>
        const HeadingContent = () =>
            "Přihlášení"
        return (
            <Container>
                <Heading content={<HeadingContent/>}/>
                <Row className="justify-content-center">
                    <Col md="9" lg="7">
                        <Card className="p-4">
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup row>
                                    <Label for="username" sm={4}>
                                        Uživatelské jméno
                                    </Label>
                                    <Col sm={8}>
                                        <Input type="text" id="username" value={username} onChange={this.onChange}
                                               required/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="password" sm={4}>
                                        Heslo
                                    </Label>
                                    <Col sm={8}>
                                        <Input type="password" id="password" value={password} onChange={this.onChange}
                                               required/>
                                    </Col>
                                </FormGroup>
                                <SubmitButton title="Přihlásit"/>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

import React, {Component} from "react"
import axios from 'axios'
import {Col, Button, Form, FormGroup, Label, Input, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

export default class FormEditLecture extends Component {
    constructor(props) {
        super(props)
        this.isLecture = false
        const {id, attendances, start, course, duration} = props.lecture
        this.state = {
            id: id || '',
            attendances: attendances || '',
            at_state: '',
            at_paid: '',
            at_note: '',
            start: start || '',
            course: course || '',
            duration: duration || '',
            attendancestates: props.attendancestates,
            courses: []
        }
        if (props.lecture.length !== 0) {
            this.isLecture = true
            this.state.at_state = attendances[0].attendancestate.id
            this.state.at_paid = attendances[0].paid
            this.state.at_note = attendances[0].note
        }
    }

    getDataCourses = () => {
        axios.get('/api/v1/courses/')
            .then((response) => {
                this.setState({courses: response.data})
            })
            .catch((error) => {
                console.log(error)
            })
    }

    onChange = (e) => {
        const target = e.target
        const state = this.state
        state[target.name] = (target.type === 'checkbox') ? target.checked : target.value
        this.setState(state)
    }

    onSubmit = (e) => {
        e.preventDefault()
        const {id, course, start, duration, at_note, at_paid, at_state} = this.state
        let attendances = this.state.attendances
        attendances[0]["client_id"] = attendances[0].client.id
        attendances[0]["attendancestate_id"] = at_state
        attendances[0].note = at_note
        attendances[0].paid = at_paid
        console.log(attendances)
        let request
        if (this.isLecture)
            request = axios.put('/api/v1/lectures/' + id + '/', {
                id,
                attendances,
                course_id: course.id,
                start,
                duration
            })
        else
            request = axios.post('/api/v1/lectures/', {attendances, course, start, duration})
        request.then(() => {
            this.close()
            this.refresh()
        })
            .catch((error) => {
                console.log(error)
            })
    }

    close = () => {
        this.props.funcClose()
    }

    refresh = () => {
        this.props.funcRefresh()
    }

    delete = (id) => {
        axios.delete('/api/v1/lectures/' + id + '/')
            .then(() => {
                this.close()
                this.refresh()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidMount()
    {
        this.getDataCourses()
    }

    render() {
        const {id, course, start, duration, at_state, at_note, at_paid} = this.state
        return (
            <Form onSubmit={this.onSubmit}>
                <ModalHeader toggle={this.close}>{this.isLecture ? 'Úprava' : 'Přidání'} lekce klienta</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label for="start" sm={2}>start</Label>
                        <Col sm={10}>
                            <Input type="text" name="start" id="start" value={start} onChange={this.onChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="duration" sm={2}>Trvání</Label>
                        <Col sm={10}>
                            <Input type="number" name="duration" id="duration" value={duration}
                                   onChange={this.onChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="at_state" sm={2}>Stav</Label>
                        <Col sm={10}>
                            <Input type="select" bsSize="sm" name="at_state" id="at_state" value={at_state}
                                   onChange={this.onChange}>
                                {this.state.attendancestates.map(attendancestate =>
                                    <option key={attendancestate.id}
                                            value={attendancestate.id}>{attendancestate.name}</option>)
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="course" sm={2}>Kurz</Label>
                        <Col sm={10}>
                            <Input type="select" bsSize="sm" name="course" id="course" value={course.id}
                                   onChange={this.onChange}>
                                {this.state.courses.map(course =>
                                    <option key={course.id}
                                            value={course.id}>{course.name}</option>)
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="at_paid" sm={2}>Placeno</Label>
                        <Col sm={10}>
                            <Input type="checkbox" bsSize="sm" name="at_paid" id="at_paid" defaultChecked={at_paid}
                                   onClick={this.onChange}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="at_note" sm={2}>Poznámka</Label>
                        <Col sm={10}>
                            <Input type="text" name="at_note" id="at_note" value={at_note} onChange={this.onChange}/>
                        </Col>
                    </FormGroup>
                    {this.isLecture &&
                    <FormGroup row className="border-top pt-3">
                        <Label for="note" sm={2} className="text-muted">Smazání</Label>
                        <Col sm={10}>
                            <Button color="danger"
                                    onClick={() => {
                                        if (window.confirm('Opravdu chcete smazat lekci klienta ' + this.state.attendances[0].client.name + " " + this.state.attendances[0].client.surname + " v " + start + '?'))
                                            this.delete(id)}}>
                                Smazat lekci</Button>
                        </Col>
                    </FormGroup>}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.close}>Zrušit</Button>{' '}
                    <Button color="primary" type="submit">{this.isLecture ? 'Uložit' : 'Přidat'}</Button>
                </ModalFooter>
            </Form>
        )
    }
}
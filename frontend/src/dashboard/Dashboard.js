import React, {Component} from "react"
import {Container, Row, Col} from 'reactstrap';
import DashboardDay from '../dashboard/DashboardDay'

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.date = new Date()
        this.dateString = DashboardDay.toISODate(this.date)
        this.title = "Dnešní přehled"
    }

    render() {
        return (
            <div>
                <h1 className="text-center mb-4">{this.title}</h1>
                <Container>
                    <Row>
                        <Col sm="12" md={{size: 8, offset: 2}}>
                            <DashboardDay date={this.dateString}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
import React, {Component, Fragment} from "react"
import {ListGroup, ListGroupItem, ListGroupItemHeading} from "reactstrap"
import {prettyDateWithLongDayYearIfDiff, toISODate, prettyTime, isToday} from "../global/funcDateTime"
import LectureNumber from "./LectureNumber"
import LectureService from "../api/services/lecture"
import Loading from "./Loading"
import GroupName from "./GroupName"
import CourseName from "./CourseName"
import Attendances from "./Attendances"
import "./DashboardDay.css"
import {courseDuration} from "../global/utils"

export default class DashboardDay extends Component {
    state = {
        lectures: [],
        IS_LOADING: true
    }

    getDate = () => new Date(this.props.date)

    getLectures = () => {
        LectureService.getAllFromDayOrdered(toISODate(this.getDate()), true)
            .then(lectures => this.setState({
                lectures,
                IS_LOADING: false
            }))
    }

    componentDidMount() {
        this.getLectures()
    }

    componentDidUpdate(prevProps) {
        if (this.props.shouldRefresh && !prevProps.shouldRefresh)
            this.getLectures()
    }

    render() {
        const {lectures, IS_LOADING} = this.state
        const title = prettyDateWithLongDayYearIfDiff(this.getDate())
        const Lecture = ({lecture}) =>
        {
            let className = lecture.group ? "LectureGroup" : ""
            if (lecture.canceled)
                className = "lecture-canceled"
            return (
                <ListGroupItem className={className}>
                    <h4>
                        <span title={courseDuration(lecture.duration)}>
                            {prettyTime(new Date(lecture.start))}
                        </span>
                        {' '}
                        <CourseName course={lecture.course}/>
                        {' '}
                        <LectureNumber lecture={lecture}/>
                    </h4>
                    {lecture.group &&
                    <h5>
                        <GroupName group={lecture.group} title link/>
                    </h5>}
                    <Attendances lecture={lecture} funcRefresh={this.props.setRefreshState || this.getLectures}
                                 showClient/>
                </ListGroupItem>
            )
        }
        const EmptyLecture = () =>
            <ListGroupItem>
                <ListGroupItemHeading className="text-muted text-center">
                    Volno
                </ListGroupItemHeading>
            </ListGroupItem>
        const Lectures = () =>
            <Fragment>
                {Boolean(lectures.length) ?
                    lectures.map(lecture => <Lecture lecture={lecture} key={lecture.id}/>)
                    :
                    <EmptyLecture/>}
            </Fragment>
        const DayLoading = () =>
            <ListGroupItem>
                <Loading/>
            </ListGroupItem>
        return (
            <ListGroup className="pageContent">
                <ListGroupItem color={isToday(this.getDate()) ? "primary" : ''}>
                    <h4 className="text-center">{title}</h4>
                </ListGroupItem>
                {IS_LOADING ?
                    <DayLoading/>
                    :
                    <Lectures/>}
            </ListGroup>
        )
    }
}

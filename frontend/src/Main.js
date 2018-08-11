import React, {Component} from "react"
import {Route, NavLink as RouterNavLink, BrowserRouter, Switch} from "react-router-dom"
import Clients from "./pages/Clients"
import Card from "./pages/Card"
import Diary from "./pages/Diary"
import Groups from "./pages/Groups"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import Settings from "./pages/Settings"
import Applications from "./pages/Applications"
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Badge} from "reactstrap"
import Login from "./pages/Login"
import PrivateRoute from "./auth/PrivateRoute"
import Menu from "./components/Menu"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"
import APP_URLS from "./urls"
import AppVersion from "./components/AppVersion"
import {getEnvName, isEnvDevelopment, isEnvProduction, isEnvStaging} from "./global/funcEnvironments"
import "./Main.css"
import ErrorBoundary from "./components/ErrorBoundary"

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.editTitle()
    }

    state = {
        IS_MENU_OPEN: false
    }

    toggleNavbar = () => {
        this.setState({IS_MENU_OPEN: !this.state.IS_MENU_OPEN})
    }

    closeNavbar = () => {
        this.setState({IS_MENU_OPEN: false})
    }

    editTitle = () => {
        if(!isEnvProduction())
            document.title += " - " + getEnvName()
    }

    render() {
        return (
            <BrowserRouter>
                <div className={getEnvName()}>
                    <Navbar light className="border-bottom" expand="sm">
                        <NavbarBrand tag={RouterNavLink} exact to="/">
                            ÚP<sub>admin</sub>
                        </NavbarBrand>
                        {isEnvDevelopment() &&
                        <Badge color="dark">
                            Vývojová verze
                        </Badge>}
                        {isEnvStaging() &&
                        <Badge color="success">
                            Staging verze <AppVersion/>
                        </Badge>}
                        <NavbarToggler onClick={this.toggleNavbar}/>
                        <Collapse isOpen={this.state.IS_MENU_OPEN} navbar>
                            <Menu closeNavbar={this.closeNavbar}/>
                        </Collapse>
                    </Navbar>
                    <ToastContainer/>
                    <ErrorBoundary>
                        <div className="content">
                            <Switch>
                                <PrivateRoute
                                    path={APP_URLS.prehled} component={Dashboard} exact/>
                                <Route
                                    path={APP_URLS.prihlasit} component={Login}/>
                                <PrivateRoute
                                    path={APP_URLS.skupiny} component={Groups} exact/>
                                <PrivateRoute
                                    path={APP_URLS.diar + "/:year?/:month?/:day?"} component={Diary}/>
                                <PrivateRoute
                                    path={APP_URLS.klienti} component={Clients} exact/>
                                <PrivateRoute
                                    path={APP_URLS.klienti + "/:id"} component={Card}/>
                                <PrivateRoute
                                    path={APP_URLS.skupiny + "/:id"} component={Card}/>
                                <PrivateRoute
                                    path={APP_URLS.zajemci} component={Applications}/>
                                <PrivateRoute
                                    path={APP_URLS.nastaveni} component={Settings}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </ErrorBoundary>
                </div>
            </BrowserRouter>
        )
    }
}

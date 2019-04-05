import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './antd.css';
import './App.css';
import Home from './Home';
import Add from './Add';
import { BrowserRouter, Route } from 'react-router-dom'
import {Icon} from 'antd';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import './side-nav.css';


//ReactDOM.render(<Home />, document.getElementById('root'));


ReactDOM.render(
    (<BrowserRouter>
    <Route render={({ location, history }) => (
        <React.Fragment>
            <SideNav
                    onSelect={(selected) => {
                    const to = '/' + selected;
                    if (location.pathname !== to) {
                        history.push(to);
                    }
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected={
                    window.location.pathname.split("/")[1] ? window.location.pathname.split("/")[1] ==="edit" ? "add" 
                    : window.location.pathname.split("/")[1]
                    : "home"}
                >
                    <NavItem eventKey="home">
                        <NavIcon>
                            <i style={{ fontSize: '1.75em' }}> <Icon type="home" /> </i>
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="add">
                        <NavIcon>
                            <i style={{ fontSize: '1.75em' }}> <Icon type="plus" /> </i>
                        </NavIcon>
                        <NavText>
                            Add
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            <main>
                <Route path="/" exact component={props => <Home />} />
                <Route path="/home" component={props => <Home />} />
                <Route path="/add" component={props => <Add />} />
                <Route path="/edit/:id" component={props => <Add />} />
            </main>
        </React.Fragment>
    )}
    />
</BrowserRouter>  
),
document.getElementById('root'));
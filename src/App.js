import { hot } from "react-hot-loader/root";
import React from "react";
import { Layout } from "antd";
import { HashRouter, Redirect, Route } from "react-router-dom";
import { spring, AnimatedSwitch } from "react-router-transition";
import { Provider } from "react-redux";
import globalStore from "./store/store";

import "./styles/common.css";
import "antd/dist/antd.css";

import Notifications from "./pages/Notifications";
import Threads from "./pages/Threads";
import Comments from "./pages/Comment";
import Login from "./pages/Login";
import Users from "./pages/Users";
import InsightContent from "./pages/Content";
import InsightSessions from "./pages/Sessions";
import CreateUsersGroup from "./pages/CreateUsersGroup";
import SideMenu from "./containers/SideMenu";
import Footer from "./containers/Footer";

import Categories from "./pages/category";


function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

function App() {
  const { Sider, Content } = Layout;

  return (
    <Provider store={globalStore}>
      <Layout className={"container"}>
        <Sider
          trigger={null}
          collapsible
          collapsed={false}
          className="customSider"
        >
          <HashRouter>
            <SideMenu />
          </HashRouter>
        </Sider>
        <Content
          className="content"
          style={{
            padding: 42,
            minHeight: 280,
            overflowY: "auto",
            // height: "calc(100vh - 43px)",
          }}
        >
          <HashRouter>
            <Route
              render={({ location }) => {
                return (
                  <div
                    location={location}
                    // atEnter={bounceTransition.atEnter}
                    // atLeave={bounceTransition.atLeave}
                    // atActive={bounceTransition.atActive}
                    className="switch-wrapper"
                  >
                    <Route
                      exact
                      path="/"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return fbUserId ? <Redirect to="/users" /> : <Login />;
                      }}
                    />

                    <Route
                      exact
                      path="/users"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? <Redirect to="/" /> : <Users />;
                      }}
                    />

                    <Route
                      exact
                      path="/content"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <InsightContent.List />
                        );
                      }}
                    />

                    <Route
                      exact
                      path="/content/details"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <InsightContent.Details />
                        );
                      }}
                    />

                    <Route
                      exact
                      path="/sessions"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <InsightSessions />
                        );
                      }}
                    />

                    <Route
                      exact
                      path="/notifications"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <Notifications />
                        );
                      }}
                    />
                    
                    <Route
                      exact
                      path="/createUsersGroup"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <CreateUsersGroup />
                        );
                      }}
                    />

                    <Route
                      exact
                      path="/thread"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <Threads />
                        );
                      }}
                    />
                        <Route
                      exact
                      path="/comment"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <Comments />
                        );
                      }}
                    />

                    <Route
                      exact
                      path="/category"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <Categories.List />
                        );
                      }}
                    />

                      <Route
                      exact
                      path="/category/details"
                      render={() => {
                        const fbUserId = JSON.parse(
                          localStorage.getItem("imaAdmin-fbUserId")
                        );
                        return !fbUserId ? (
                          <Redirect to="/" />
                        ) : (
                          <Categories.Details />
                        );
                      }}
                    />
                  </div>
                );
              }}
            />
          </HashRouter>
          {/* <Footer /> */}
        </Content>
      </Layout>
    </Provider>
  );
}

export default hot(App);

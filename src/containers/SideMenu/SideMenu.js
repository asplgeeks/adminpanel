import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "antd";
// Actions
import actions from "@src/store/actions";

import { firebase_auth } from "../../constants";

import { MENU_ITEMS } from "../../constants";

import styles from "./SideMenu.scss";

const SideMenu = () => {
  const menuItem = useSelector((state) => state.globalStore.menuItem);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    firebase_auth
      .signOut()
      .then((resp) => {
        localStorage.setItem("imaAdmin-fbUserId", JSON.stringify(""));
        localStorage.removeItem("user_id");

        history.push('/');
      })
      .catch(function (ex) {
      });
  };

  const handleMenuClick = (item) => {
   
    const activeMenu = item.key;
    const activeMenuItem = MENU_ITEMS.filter(
      (menuItems) => menuItems.key === activeMenu
    );
    const link = activeMenuItem[0].linkTo;
    if (link) {
      history.push(link);
    }
    dispatch(actions.globalActions.setActiveMenu(item.activeKey));
    const logout = activeMenuItem[0].logout;

    if (logout) {
      handleLogout();
    }
  };

  const renderSideMenuItems = () => {
    const retData = [];

    MENU_ITEMS.forEach((item) => {
      retData.push(
        <Menu.Item
          key={`side-${item.title}`}
          onClick={handleMenuClick}
          className={`${item.bottom && styles.SideMenuItemBottom} ${
            item.top && styles.SideMenuItemTop
          } ${styles.SideMenuItem}`}
        >
          {item.icon}
          <span>{item.title}</span>
        </Menu.Item>
      );
    });

    return retData;
  };

  return (
    <Menu
      theme="dark"
      className={styles.SideMenu}
      mode="inline"
      defaultSelectedKeys={MENU_ITEMS[0].title}
    >
      {renderSideMenuItems()}
    </Menu>
  );
};

export default SideMenu;

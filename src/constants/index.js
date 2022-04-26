import React from "react";
import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import LogoutIcon from "../assets/icons/log-out-outline.svg";
import UserIcon from "../assets/icons/person-outline.svg";
import ContentIcon from "../assets/icons/reader-outline.svg";
import SessionIcon from "../assets/icons/SessionsIcon.svg";
import NotificationIcon from "../assets/icons/notifications-outline.svg";
import GroupIcon from "../assets/icons/community.svg";
import CommentIcon from "../assets/icons/comment-alt.svg";

import CategoryIcon  from "../assets/icons/add-document.svg";


import ThreadIcon from "../assets/icons/notebook.svg";

import ThreadRequestIcon from "../assets/icons/megaphone.svg";


import IMALogo from "../assets/icons/IMA-Logo.svg";

var firebaseConfig = {
  apiKey: "AIzaSyCwB63I1xIoTJIlyz1VKkqUwQiMI-xC43k",
  authDomain: "ima-india-dev.firebaseapp.com",
  projectId: "ima-india-dev",
  storageBucket: "ima-india-dev.appspot.com",
  messagingSenderId: "1097438200753",
  appId: "1:1097438200753:web:ae7d84e71819fb0ed63390",
  measurementId: "G-QNV1ER5W4G",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore_db = firebaseApp.firestore();
const firebase_auth = firebaseApp.auth();

const storage_db = firebaseApp.storage();

export const MENU_ITEMS = [
  {
    icon: <IMALogo className="sideMenuIcon" />,
    top: true,
  },
  {
    title: "Users",
    key: "side-Users",
    linkTo: "/users",
    icon: <UserIcon className="sideMenuIcon" />,
    activeKey: 'users',
  },
  {
    title: "Category",
    key: "side-Category",
    linkTo: "/category",
    // linkTo: "/users",
    icon: <CategoryIcon className="sideMenuIcon" />,
    activeKey: 'category',
  },
  {
    title: "Content",
    key: "side-Content",
    linkTo: "/content",
    icon: <ContentIcon className="sideMenuIcon" />,
    activeKey: 'content',
  }, 
  {
    title: "Sessions",
    key: "side-Sessions",
    linkTo: "/sessions",
    icon: <SessionIcon className="sideMenuIcon" />,
    activeKey: 'sessions',
  },
  {
    title: "Notifications",
    key: "side-Notifications",
    linkTo: "/notifications",
    icon: <NotificationIcon className="sideMenuIcon" />,
  },
  {
    title: "Create Group",
    key: "side-Create Group",
    linkTo: "/createUsersGroup",
    icon: <GroupIcon className="sideMenuIcon" style={{marginBottom:"5px"}} />,
    activeKey: 'createUsersGroup',
  },
  {
    title: "Thread",
    key: "side-Thread",
    linkTo: "/thread",
    icon: <ThreadIcon className="sideMenuIcon" />,
    activeKey: 'thread',
  },
  {
    title: "Thread Request",
    key: "side-Thread Request",
    linkTo: "/thread-request",
    icon: <ThreadRequestIcon className="sideMenuIcon" />,
    activeKey: 'thread-request',
  },
  {
    title: "Comment",
    key: "side-Comment",
    linkTo: "/comment",
    icon: <CommentIcon className="sideMenuIcon" />,
    activeKey: 'thread-comment',
  },
  // {
  //   title: "Comment",
  //   key: "side-Comment ",
  //   linkTo:"/comment",
  //   icon: <CommentIcon className="sideMenuIcon"/>,
  //   activeKey:'comment'
  // },
  {
    title: "Logout",
    key: "side-Logout",
    logout: true,
    icon: <LogoutIcon className="sideMenuIcon" />,
    bottom: true,
  },
];

export { firestore_db, firebase_auth, storage_db };

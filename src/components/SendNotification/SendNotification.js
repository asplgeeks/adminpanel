import React from "react";
import { Popover, Button, Checkbox, notification, Modal } from "antd";

import API from "@src/api";

import NotificationIcon from "@src/assets/icons/notifications-outline.svg";
import styles from "./SendNotification.scss";
import Notifications from "../../pages/Notifications";
const SendNotification = (props) => {
  const { forums, id, title, type,content,media,subTitle,body,isContent } = props;
  const [selectedForum, setSelectedForum] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const forumNameChange = (value) => {
    setSelectedForum(value);
  };

  const sendNotiClick = () => {
    const updatedReqData = {
      ntitle: "",
      nbody: "",
      nnotificationType: type === 'content' ? 1 : 2, // 1: Insight content, 2: Session Content, 3: Sessions, 4: Custom Notifications
      nid: id,
      nsentTo: 2,
      nids: selectedForum
    };

    setLoading(true);

    API.pushNotification(updatedReqData).then(({ success, response }) => {
      if (success && response.successCount > 0) {
        notification.success({
          message: `Notification Sent!`,
          placement: "bottomRight",
        });
        setPopoverVisible(false);
      } else {
        notification.error({
          message: `Something went wrong.`,
          placement: "bottomRight",
        });
        setPopoverVisible(true);
      }
      setLoading(false);
    });
  };

  const renderForums = () => {
    const retData = [];
    forums.forEach((item) => {
      retData.push({ label: item, value: item });
    });
    return retData;
  };

  React.useState(() => {
    setSelectedForum(forums);
  }, []);

  const handleCancel = (e) => {
    e.stopPropagation();
    setPopoverVisible(!popoverVisible)
  };

  const onModelShow = (e) => {
    e.stopPropagation();
    setPopoverVisible(!popoverVisible);
  }

  return (
    
    <>
      <Modal
        visible={popoverVisible}
        title=" "
        footer={null}
        onCancel={(e)=>handleCancel(e)}
        width={900}
       closable={true}
      >
        <Notifications isContent={isContent} content={content} handleCancel={handleCancel} onClick={(e) => {
          e.stopPropagation();
        }} />

      </Modal>
      <NotificationIcon
        className={styles.SendNotificationIcon}
       
        onClick={(e) => onModelShow(e)}
      />
    </>
  );
};

export default SendNotification;

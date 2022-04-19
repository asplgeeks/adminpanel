import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Modal, Divider, Empty, notification } from "antd";

import API from "@src/api";
import actions from "@src/store/actions";
import * as dayjs from "dayjs";

import styles from "./SessionDetails.scss";

const SessionDetails = (props) => {
  const { visible, onClose } = props;
  const emptyStateMsg = "N/A";
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const sessionsDetailsData = useSelector(
    (state) => state.globalStore.sessionDetailsData
  );
  const sessionDetailsContentList = useSelector(
    (state) => state.globalStore.sessionDetailsContentList
  );

  const [selectedContent, setSelectedContent] = React.useState([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [contentIds, setContentIds] = React.useState([]);
  const [isEnableLoad, setIsEnableLoad] = React.useState(false);
  const ignoreKeys = [
    "topic",
    "id",
    "paymentDue",
    "status",
    "sessionId",
    "ownerId",
    "final_speaker_1",
    "final_speaker_2",
    "final_speaker_3",
    "final_speaker_4",
    "briefing_session_rt",
    "imageUrl",
    "description",
    "session_chairman",
  ];

  if (sessionsDetailsData && sessionsDetailsData.id && !isEnableLoad)
    API.getSessionBasedContentBytagId(sessionsDetailsData.id).then(({ success, response }) => {
      if (success) {
        if (response && response.data.length > 0 )
          setIsEnableLoad(true);

        if (response.data[0].contentids) {
          const temp = response.data[0].contentids.split(",");
          let tempArr = [];
          temp.forEach((item=>{
            tempArr.push(parseInt(item));
          }))
          setSelectedContent(tempArr);
        }else{
          setSelectedContent([]);
        }
      }
    });

  const handleConfirmClick = () => {
    setConfirmLoading(true);

    const updatedData = {
      contentId: [...selectedContent],
      sessionId: sessionsDetailsData.id,
      primaryTag: sessionsDetailsData.briefing_session_rt,
    };

    API.updateSessionDetails(updatedData)
      .then(({ success, response }) => {
        if (success) {
          notification.success({
            message: `Session updated successfully!`,
            placement: "bottomRight",
          });

          API.getSessionContentList().then(({ success, response }) => {
            if (success) {
              dispatch(
                actions.globalActions.setSessionDetailsContentList(
                  response.data
                )
              );
            }
          });
          setSelectedContent([]);
          onClose();
          setIsEnableLoad(false);
        } else {
          notification.error({
            message: response.message,
            placement: "bottomRight",
          });
        }
        setConfirmLoading(false);
      })
      .catch((ex) => {
        setConfirmLoading(false);
        notification.error({
          message: ex,
          placement: "bottomRight",
        });
      });
  };

  const speakersCheck = (speakerData) => {
    let retData = "";
    if (speakerData) {
      const data = JSON.parse(speakerData);
      if (data !== null) {
        const firstName = data[0]?.first_name;
        const lastName = data[0]?.last_name;

        if (firstName && lastName) {
          retData = `${firstName} ${lastName}`;
        } else if (firstName && !lastName) {
          retData = `${firstName}`;
        } else if (!firstName && lastName) {
          retData = `${lastName}`;
        }
      }
    }
    return retData;
  };

  const checkIfEmpty = (value) => {
    let retValue = false;
    if (value === "") {
      retValue = true;
    }

    if (value === null) {
      retValue = true;
    }
    return retValue;
  };

  const humanizeString = (str) => {
    if (str === "dob") {
      return "DOB";
    }
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  };

  const renderDetailsTab = () => {
    const speakerData1 = speakersCheck(sessionsDetailsData.final_speaker_1);
    const speakerData2 = speakersCheck(sessionsDetailsData.final_speaker_2);
    const speakerData3 = speakersCheck(sessionsDetailsData.final_speaker_3);
    const speakerData4 = speakersCheck(sessionsDetailsData.final_speaker_4);

    const speakerString = `${speakerData1 && `${speakerData1}${speakerData2 && ","} `
      }
      ${speakerData2 && `${speakerData2}${speakerData3 && ","} `}
      ${speakerData3 && `${speakerData3}${speakerData4 && ","} `}
      ${speakerData4 && `${speakerData4}`}`;

    const chairpersonName = speakersCheck(sessionsDetailsData.session_chairman);

    const retData = [
      <div className={styles.SessionDetailsData}>
        <div className={styles.SessionDetailsDataLabel}>Description</div>
        <div className={styles.SessionDetailsDataValue}>
          {!checkIfEmpty(sessionsDetailsData.description)
            ? sessionsDetailsData.description
            : emptyStateMsg}
        </div>
      </div>,

      <div className={styles.SessionDetailsData}>
        <div className={styles.SessionDetailsDataLabel}>Speakers</div>
        <div className={styles.SessionDetailsDataValue}>
          {!checkIfEmpty(speakerString.trim()) ? speakerString : emptyStateMsg}
        </div>
      </div>,

      <div className={styles.SessionDetailsData}>
        <div className={styles.SessionDetailsDataLabel}>Session Chairman</div>
        <div className={styles.SessionDetailsDataValue}>
          {!checkIfEmpty(chairpersonName) ? chairpersonName : emptyStateMsg}
        </div>
      </div>,
    ];

    const otherData = [];
    const record = sessionsDetailsData;

    Object.keys(record).forEach((item, index) => {
      let value = record[item];

      if (item === "start_date" || item === "end_date") {
        value = dayjs(record[item]).format("MMM, DD YYYY");
      }

      if (!ignoreKeys.includes(item)) {
        otherData.push(
          <div key={`userdata${index}`} className={styles.SessionDetailsData}>
            <div className={styles.SessionDetailsDataLabel}>
              {humanizeString(item)}
            </div>
            <div className={styles.SessionDetailsDataValue}>
              {!checkIfEmpty(value) ? value : emptyStateMsg}
            </div>
          </div>
        );
      }
    });
    return [
      retData,
      <Divider />,
      <div className={styles.SessionDetailsDataContainer}>{otherData}</div>,
    ];
  };

  const handleOnCheck = (item) => {
    let currentContent = [...selectedContent];
    const checked = selectedContent.includes(item.contentId);

    if (!checked) {
      currentContent.push(item.contentId);
    } else {
      currentContent = currentContent.filter((x) => x !== item.contentId);
    }

    const updatedContent = [...new Set(currentContent)];

    setSelectedContent(updatedContent);
  };

  const renderContentTab = () => {
    const retData = [];
    // let sessionContentType = sessionsDetailsData.briefing_session_rt;

    // if (sessionContentType === "RT") {
    //   sessionContentType = "Round Table";
    // }
    // let contentDetails = await API.getSessionBasedContentBytagId(sessionsDetailsData.id);
    // if (contentDetails.length > 0 && contentDetails.response && contentDetails.response.data && contentDetails.response.data.length >0 && contentDetails.response.data[0].contentids.length > 0) {
    //   contentDetails.response.data[0].contentids.forEach((item, i) => {
    //     retData.push(
    //       <div
    //         className={styles.SessionDetailsDataCheckbox}
    //         onClick={(e) => {
    //           handleOnCheck(item);
    //         }}
    //       >
    //         <input
    //           type="checkbox"
    //           value={item.contentId}
    //           checked={isChecked}
    //           onChange={(e) => {
    //             handleOnCheck(item);
    //           }}
    //         />
    //         <label for={item.title}>{item.title}</label>
    //       </div>
    //     );
    //   });
    // }
    sessionDetailsContentList.forEach((item, i) => {
      // const subTags = item.subTagName.map((x) => x);
      // const isChecked =
      //   subTags.includes(sessionsDetailsData.id) ||
      //   selectedContent.includes(item.contentId);
      const isChecked =
      selectedContent.includes(item.contentId) ||
        selectedContent.includes(item.contentId);

      // if (item.primaryTagName.includes(sessionContentType)) {

        retData.push(
          <div
            className={styles.SessionDetailsDataCheckbox}
            onClick={(e) => {
              handleOnCheck(item);
            }}
          >
            <input
              type="checkbox"
              value={item.contentId}
              checked={isChecked}
              onChange={(e) => {
                handleOnCheck(item);
              }}
            />
            <label for={item.title}>{item.title}</label>
          </div>
        );
      // }
    });

    if (retData.length === 0) {
      retData.push(
        <Empty
          description={`No session contents available`}
        />
      );
    }

    return retData;
  };
  const closeModel = () => {
    setSelectedContent([]);
    onClose();
    setIsEnableLoad(false);
    dispatch(actions.globalActions.setSessionDetailsData([]));
  }

  return (
    <Modal
      title={sessionsDetailsData.topic}
      centered
      visible={visible}
      maskClosable={false}
      okText="Confirm"
      cancelText="Close"
      className="test"
      onOk={handleConfirmClick}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={closeModel}
    >
      {sessionsDetailsData.topic && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Content" key="1">
            {renderContentTab()}
          </TabPane>
          <TabPane tab="Details" key="2">
            {renderDetailsTab()}
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default SessionDetails;

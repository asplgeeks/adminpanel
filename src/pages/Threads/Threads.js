import React from "react";
import { useSelector, useDispatch } from "react-redux";
//style
import { notification, message, Form, Input, Button, Divider, Tabs } from "antd";


// Actions
import actions from "@src/store/actions";
import CreateGroup from "./createGroup";
import styles from "./Notifications.scss";
import NotificationsFilter from "../../components/filter/notification";
import API from "@src/api";
import Accordion from "../../components/accordion";

const { TabPane } = Tabs;


const Threads = (props) => {
  const { isContent, content, handleCancel } = props;
  const { TextArea } = Input;
  const [selectedContent, setSelectedContent] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [payload, setPayload] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userPlaceholder, setUserPlaceholder] =
    React.useState("Loading Users...");
  const [isLoading, setIsLoading] = React.useState(false);
  const userData = useSelector((state) => state.globalStore.usersData) || [];

  const fbUserId = JSON.parse(localStorage.getItem("imaAdmin-fbUserId"));
  const [sortBy, setSortBy] = React.useState("");
  const [createGroupOpen, setCreateGroupOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [forum, setForum] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [usersGroup, setUsersGroup] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState([]);
  const [selectedForum, setSelectedForum] = React.useState([]);
  const [imageUrl, setImageUrl] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(1);
  const [reloadUserList, setReloadUserList] = React.useState(true);
  const [preventReload, setPreventReload] = React.useState(false);

  if (userData.length > 0) {
    if (userList.length === 0 && reloadUserList) {
      setUserList(userData)
    }
  }
  if (isContent === "content") {
    
    if (!preventReload && content) {

      if (title === "" && content.title)
        setTitle(content.title);
      if (imageUrl === "" && content.mediaDetails && content.mediaDetails[0].url[0]) setImageUrl(content.mediaDetails[0].url[0]);
      if (desc === "" && content.subTitle) setDesc(content.subTitle);
      if (payload === "" && content.body) setPayload(content.body);
      if (selectedForum.length === 0 && content.forumName.length > 0) {
        let tempArr = [];
        content.forumName.forEach((item) => {
          tempArr.push(item);
        })
        setSelectedForum(tempArr);
      }
      setPreventReload(true);
    }
  }

  if (isContent === "session") {

    if (!preventReload && content) {
      if (title === "" && content.topic)
        setTitle(content.topic);
      if (imageUrl === "" && content.imageUrl !== null) setImageUrl(content.imageUrl);
      if (desc === "" && content.description) setDesc(content.description);
      if (payload === "" && content.webpageURL) setPayload(content.webpageURL);
      if (selectedForum.length === 0 && content.forum.length > 0) {
        let tempArr = [];
        const tempForum = content.forum.includes(";")
          ? content?.forum.split(";")
          : content.forum.includes(",") ? content?.forum.split(",")
            : [content.forum]
        tempForum.forEach((item) => {
          tempArr.push(item);
        })
        setSelectedForum(tempArr);
      }
      setPreventReload(true);
    }
  }
  const dispatch = useDispatch();
 
  const resetData = (e) => {
    setTitle("");
    setDesc("");
    setSearchTerm("");
    setSelectedContent([]);
    setIsLoading(false);
    setPayload("");
    setSelectedGroup([]);
    setSelectedForum([]);
    setImageUrl("");
    handleCancel(e);
    setPreventReload(false);
  };

  const handleNotiClick = (e) => {
    e.stopPropagation();
    const updatedReqData = {
      ntitle: title,
      nbody:  desc.substring(0, 50) + "...",
      image: imageUrl,
      payload: payload.substring(0, 100) + "...",
      nnotificationType: isContent === "content" ? "1" : isContent === "session" ? "2": isContent === "url" ?"5":"4",
      nid: isContent === "content" ? content.contentId.toString() : isContent === "session" ? content.id.toString() :"0", //
      nsentTo: activeTab === "1" || activeTab === 1 ? "0" : activeTab === "2" || activeTab === 2 ? "1" : "2",
      nids: activeTab === "1" || activeTab === 1 ? JSON.stringify(selectedContent).slice(1, -1)
        : activeTab === "2" || activeTab === 2 ? JSON.stringify(selectedGroup).slice(1, -1)
          : JSON.stringify(selectedForum).slice(1, -1).replace(/["']/g, "")

    };

    setIsLoading(true);

    API.pushNotification(updatedReqData)
      .then(({ success, response }) => {
        if (success && response.successCount > 0) {
          notification.success({
            message: "Notification Sent!",
            placement: "bottomRight",
          });
        } else {
          notification.error({
            message: "Something went wrong",
            placement: "bottomRight",
          });
        }
        setIsLoading(false);
      })
      .catch((ex) => {
        setIsLoading(false);
        notification.error({
          message: ex,
          placement: "bottomRight",
        });
      });

    resetData(e);
  };

  const handleOnCheck = (item) => {
    let currentContent = [...selectedContent];
    const checked = selectedContent.includes(item);

    if (!checked) {
      currentContent.push(item);
    } else {
      currentContent = currentContent.filter((x) => x !== item);
    }

    const updatedContent = [...new Set(currentContent)];
    setSelectedContent(updatedContent);
  };

  const renderUsers = () => {
    const retData = [];
    if (userList.length === 0) {
      retData.push(<div>No User Found !</div>);
    } else {
      userList.forEach((item, i) => {
        const name = item.user ? `${item.user.first_name} ${item.user.last_name}` : item.name && item.name;
        let _id = item.user ? item.user.id : item.id;
        const isChecked = selectedContent.includes(_id);

        if (searchTerm) {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            retData.push(
              <div
                className={styles.NotificationsDetailsCheckbox}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOnCheck(item.user ? item.user.id : item.id);
                }}
                style={{ display: "inline-flex" }}

              >
                <input
                  type="checkbox"
                  value={item.user ? item.user.id : item.id}
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleOnCheck(item.user ? item.user.id : item.id);
                  }}
                  style={{ marginTop: "5px" }}

                />
                {/* <label htmlFor={item.user ? item.user.id : item.id}>{name}</label> */}
                <div style={{ width: "270px", marginLeft: "10px", overflow: "hidden" }}>{name}</div>
                <div style={{ width: "300px", marginLeft: "10px", overflow: "hidden" }}>{item.user ? item.user.email : item.email}</div>
                <div style={{ width: "200px", marginLeft: "10px", overflow: "hidden" }}>{item.user ? item.user.companyName : item.companyName}</div>
              </div>
            );
          }
        } else {
          retData.push(
            <div
              className={styles.NotificationsDetailsCheckbox}
              onClick={(e) => {
                e.stopPropagation();
                handleOnCheck(item.user ? item.user.id : item.id);
              }}
              style={{ display: "inline-flex" }}

            >
              <input
                type="checkbox"
                value={item.user ? item.user.id : item.id}
                checked={isChecked}
                onChange={(e) => {
                  e.stopPropagation();
                  handleOnCheck(item.user ? item.user.id : item.id);
                }}
                style={{ marginTop: "5px" }}

              />
              {/* <label htmlFor={item.user ? item.user.id : item.id}>{name}</label> */}
              <div style={{ width: "270px", marginLeft: "10px", overflow: "hidden" }}>{name}</div>
              <div style={{ width: "300px", marginLeft: "10px", overflow: "hidden" }}>{item.user ? item.user.email : item.email}</div>
              <div style={{ width: "200px", marginLeft: "10px", overflow: "hidden" }}>{item.user ? item.user.companyName : item.companyName}</div>
            </div>
          );
        }
      });
    }
    return retData;
  };
  const handleOnCheckGroup = (item) => {
    let currentContent = [...selectedGroup];
    const checked = selectedGroup.includes(item);

    if (!checked) {
      currentContent.push(item);
    } else {
      currentContent = currentContent.filter((x) => x !== item);
    }

    const updatedContent = [...new Set(currentContent)];
    setSelectedGroup(updatedContent);
  };
  const renderUsersGroup = () => {
    const retData = [];
    if (usersGroup.length === 0) {
      retData.push(<div>User Group Not Found</div>);
    } else {
      usersGroup.forEach((item, i) => {
        const name = item.group_name;
        let _id = item.id;
        const isChecked = selectedGroup.includes(_id);

        if (searchTerm) {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            retData.push(

              <div>
                <div style={{ float: "left" }}>
                  <input
                    type="checkbox"
                    value={_id}
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleOnCheckGroup(_id);
                    }}
                  />
                  &nbsp; &nbsp;
                </div>
                <div>
                  <Accordion title={name} content={item.user_names} type="UserGroup" />
                </div>
              </div>
            );
          }
        } else {
          retData.push(

            <div>
              <div style={{ float: "left" }}>
                <input
                  type="checkbox"
                  value={_id}
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleOnCheckGroup(_id);
                  }}
                />
                &nbsp; &nbsp;
              </div>
              <div>
                <Accordion title={name} content={item.user_names} type="UserGroup" />
              </div>
            </div>

          );
        }
      });
    }
    return retData;
  };


  const handleOnCheckForums = (item, e) => {
    e.stopPropagation();
    let currentContent = [...selectedForum];
    const checked = selectedForum.includes(item);

    if (!checked) {
      currentContent.push(item);
    } else {
      currentContent = currentContent.filter((x) => x !== item);
    }

    const updatedContent = [...new Set(currentContent)];
    setSelectedForum(updatedContent);
  };

  const renderForums = () => {
    const retData = [];
    if (forum.length === 0) {
      retData.push(<div>Forum Not Found</div>);
    } else {
      forum.forEach((item, i) => {
        const name = item;
        const isChecked = selectedForum.includes(item);

        if (searchTerm) {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            retData.push(
              <div
                className={styles.NotificationsDetailsCheckbox}
                onClick={(e) => {
                  handleOnCheckForums(item, e);
                }}
              >
                <input
                  type="checkbox"
                  value={item}
                  checked={isChecked}
                  onChange={(e) => {
                    handleOnCheckForums(item, e);
                  }}
                  style={{ marginTop: "5px" }}

                />
                <label htmlFor={item}>{name}</label>
              </div>
            );
          }
        } else {
          retData.push(
            <div
              className={styles.NotificationsDetailsCheckbox}
              onClick={(e) => {
                handleOnCheckForums(item, e);
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={isChecked}
                onChange={(e) => {
                  handleOnCheckForums(item, e);
                }}
                style={{ marginTop: "5px" }}

              />
              <label htmlFor={item}>{name}</label>
            </div>
          );
        }
      });
    }
    return retData;
  };


  const updateUserTable = (data) => {
    const tableDataArr = [];
    const tempCity = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        tableDataArr.push({
          key: index,
          userId: item.fbuid,
          user: item,
        });
        if (item.mailing_city !== "") {
          if (tempCity.indexOf(item.mailing_city) == -1) tempCity.push(item.mailing_city);
        }
      });


      setCity(tempCity);
      dispatch(actions.globalActions.setUsersData(tableDataArr));
    }
  };

  React.useEffect(() => {
    if (userData.length === 0) {
      API.getUsersList(fbUserId)
        .then(({ success, response }) => {
          if (success) {
            updateUserTable(response.data);
          } else {
            setUserPlaceholder(
              "Something went wrong while loading users, try again."
            );
            notification.error({
              message: "Something went wrong",
              placement: "bottomRight",
            });
          }
        })
        .catch((ex) => {
          setUserPlaceholder(ex);
          notification.error({
            message: ex,
            placement: "bottomRight",
          });
        });
    }

    API.UsersGroupList().then(({ success, response }) => {

      if (success) {
        setUsersGroup(response.data);
      }
    });

    getFilterData();

  }, []);

  const getFilterData = () => {
    API.getNotificationFilterType().then(({ response }) => {

      if (response.success) {
        
        setForum(response.data.forum);
      }
    })
  }

  const createGroup = () => {
    setCreateGroupOpen(!createGroupOpen);
    if (filterOpen)
      setFilterOpen(!filterOpen);

  }

  const showFilter = () => {
    setFilterOpen(!filterOpen);
    if (createGroupOpen)
      setCreateGroupOpen(!createGroupOpen);

  }
  const handleCityChange = (val) => {
    let cityData = [...city];
    // if (event.type === "click") {
    cityData &&
      cityData.forEach((elem, index) => {
        if (elem.title === val.title) {
          elem.active = !elem.active;
        }
      });
    setCity(cityData);
    // }
  };
  const updateUser = (val) => {
    setUserList(val);
  }

  const reloadUsers = (val) => {
    setReloadUserList(val);
  }

  return (
    <div className={styles.Notifications}>
      <div className={styles.NotificationsHeader}>
        <div>
          {!isContent && <> <h2 className={styles.NotificationsHeaderTitle}>Threads</h2>
            <div className={styles.NotificationsSubHeader}>
              Send customized Threads
            </div></>}
          {isContent && <div className={styles.NotificationsSubHeader} style={{ paddingLeft: "10px", paddingTop: "10px", pointerEvent: "none" }}>
            Send customized Threads
          </div>}
        </div>
      </div>
      {!isContent && <br />}
      <div className={styles.NotificationsFormCard}>
        <div >
          <div className={styles.NotificationsInputLabel}>Title</div>
          <Input
            placeholder="Notification Title"
            value={title}
            onChange={(e) => {
              e.stopPropagation();
              const name = e.target.value;
              setTitle(name);
            }}
            disabled={isContent}
            style={isContent ?{ pointerEvent: "none" }:{}}
          />
          <br /> <br />
          <div className={styles.NotificationsInputLabel}>Image Url</div>
          <Input
            placeholder="Image Url"
            value={imageUrl}
            onChange={(e) => {
              e.stopPropagation();
              const name = e.target.value;
              setImageUrl(name);
            }}
            disabled={isContent}
            style={isContent ?{ pointerEvent: "none" }:{}}
          />
          <br /> <br />
          <div className={styles.NotificationsInputLabel}>Description</div>
          <TextArea
            placeholder="Notification Body"
            value={desc}
            onChange={(e) => {
              e.stopPropagation();
              const name = e.target.value;
              setDesc(name);
            }}
            disabled={isContent}
            style={isContent ?{ pointerEvent: "none" }:{}}
          />
          <br /> <br />
          <div className={styles.NotificationsInputLabel}>Payload</div>
          <TextArea
            placeholder="Payload..."
            value={payload}
            onChange={(e) => {
              e.stopPropagation();
              const name = e.target.value;
              setPayload(name);
            }}
            style={{ height: "15vh" }}
            disabled={isContent}
            style={isContent ?{ pointerEvent: "none" }:{}}
          />
          <br /> <br />
        </div>

        <div>

          <Tabs defaultActiveKey="1" type="card" size={"default"} onClick={(e) => e.stopPropagation()} onChange={(activeKey) => setActiveTab(activeKey)}>
            {/* {!isContent &&  */}
            <><TabPane tab="USERS" key="1">
              <div className={styles.NotificationsInputLabel}>Users</div>
              <NotificationsFilter userList={userList} sortBy={sortBy} setSortBy={setSortBy} updateUser={updateUser} reloadUsers={reloadUsers} />
              <div style={{ display: "inline-flex" }}>

                <div>
                  <Input
                    placeholder="Search Users"
                    onChange={(e) => {
                      e.stopPropagation();
                      const val = e.target.value;
                      setSearchTerm(val);
                    }}
                    value={searchTerm}
                    style={{ width: "300px" }}
                  />
                </div>

              </div>

              <div className={styles.NotificationsUsersList}>{renderUsers()}</div>

              <br />
              <Button
                type="primary"
                onClick={(e) => handleNotiClick(e)}
                loading={isLoading}
                disabled={!title || !desc || selectedContent.length === 0}
              >
                Send Notification
              </Button>
            </TabPane>
              <TabPane tab="GROUP" key="2">
                <div className={styles.NotificationsInputLabel}>User Groups</div>
                <div>
                  <Input
                    placeholder="Search Groups"
                    onChange={(e) => {
                      e.stopPropagation();
                      const val = e.target.value;
                      setSearchTerm(val);
                    }}
                    value={searchTerm}
                    style={{ width: "300px" }}
                  />
                </div>
                <div className={styles.NotificationsUsersList}>{renderUsersGroup()}</div>
                <br />
                <Button
                  type="primary"
                  onClick={(e) => handleNotiClick(e)}
                  loading={isLoading}
                  disabled={!title || !desc || selectedGroup.length === 0}
                >
                  Send Notification
                </Button>
              </TabPane> </>
              {/* } */}
            <TabPane tab="FORUM" key="3">
              <div className={styles.NotificationsInputLabel}>Forums</div>
              <div>
                <Input
                  placeholder="Search Forums"
                  onChange={(e) => {
                    e.stopPropagation();
                    const val = e.target.value;
                    setSearchTerm(val);
                  }}
                  value={searchTerm}
                  style={{ width: "300px" }}
                />
              </div>
              <div className={styles.NotificationsUsersList}>{renderForums()}</div>
              <br />
              <Button
                type="primary"
                onClick={(e) => handleNotiClick(e)}
                loading={isLoading}
                disabled={!title || !desc || selectedForum.length === 0}
              >
                Send Thread
              </Button>
            </TabPane>

          </Tabs>
        </div>
        {/* ---------------------- */}



        {/* ---------- */}
      </div>
      
    </div>
  );
};

export default Threads;

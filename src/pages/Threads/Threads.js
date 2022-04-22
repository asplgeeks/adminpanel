import React from "react";
import { useSelector, useDispatch } from "react-redux";
//style
import { notification, message, Form, Input, Button, Divider, Tabs, Table } from "antd";


// Actions
import actions from "@src/store/actions";
import CreateGroup from "./createGroup";
import styles from "./Notifications.scss";
// import styles from "./Content.scss";
import NotificationsFilter from "../../components/filter/notification";
import API from "@src/api";
import Accordion from "../../components/accordion";
import ArticleIcon from "./assets/Article.svg";
const { TabPane } = Tabs;


const Threads = (props) => {
  const { isContent, content, handleCancel } = props;
  const { TextArea } = Input;
  const [selectedContent, setSelectedContent] = React.useState([]);
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
  const [updatedDetail, setUpdatedDetail] = React.useState({})
  const [createThread, setCreateThread] = React.useState(false)
  const [title, setTitle] = React.useState();
  const [desc, setDesc] = React.useState();
  const [payload, setPayload] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState( "" ||  updatedDetail && updatedDetail.created_user_name);
  // const dispatch = useDispatch();
  const contentData = useSelector((state) => state.globalStore.contentData);
  const currentPage = useSelector((state) => state.globalStore.contentPage);

  // console.log(updatedDetail && updatedDetail.display_desc)
  const contentUpdated = useSelector(
    (state) => state.globalStore.contentUpdated
  );
  const updateContentTable = (data) => {
    const tableDataArr = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        tableDataArr.push({
          key: index,
          // userId: item.fbuid,
          content: item,
        });
      });
      dispatch(actions.globalActions.setContentUpdated(false));
      dispatch(actions.globalActions.setContentData(tableDataArr));
    }
    setTableLoading(false);
  };

React.useEffect(() => {
  API.getThredList()
  .then(response => response)
  .then(result => updateContentTable(result && result.data))
  .catch((ex) => {
      // setTableLoading(false);
      notification.error({
          message: ex,
          placement: "bottomRight",
      });
  });
}, [createThread])

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
    // handleCancel(e);
    setPreventReload(false);
  };

  const handleNotiClick = (e) => {
    e.stopPropagation();
    const updatedReqData = {
      ntitle: title ? title : updatedDetail && updatedDetail.display_name,
      nbody:  desc ? desc : updatedDetail && updatedDetail.display_desc,
      // image: imageUrl,
      // payload: payload.substring(0, 100) + "...",
      nnotificationType: isContent === "content" ? "1" : isContent === "session" ? "2": isContent === "url" ?"5":"4",
      nid: isContent === "content" ? content.contentId.toString() : isContent === "session" ? content.id.toString() :"0", //
      nsentTo: activeTab === "1" || activeTab === 1 ? "0" : activeTab === "2" || activeTab === 2 ? "1" : "2",
      nids: activeTab === "1" || activeTab === 1 ? JSON.stringify(selectedContent).slice(1, -1)
        : activeTab === "2" || activeTab === 2 ? JSON.stringify(selectedGroup).slice(1, -1)
          : JSON.stringify(selectedForum).slice(1, -1).replace(/["']/g, "")

    };

    const selectionData = {
      threadid: "",
      selection_type: activeTab === "1" || activeTab === 1 ? "0" : activeTab === "2" || activeTab === 2 ? "1" : "2",
      selected_ids: activeTab === "1" || activeTab === 1 ? JSON.stringify(selectedContent).slice(1, -1)
      : activeTab === "2" || activeTab === 2 ? JSON.stringify(selectedGroup).slice(1, -1)
        : JSON.stringify(selectedForum).slice(1, -1).replace(/["']/g, "") 
  }

    setIsLoading(true);
    API.addupdatethreaduserdetail(selectionData)
    console.log("updatedReqData", updatedReqData)
    API.ADD_THREADS(updatedReqData)
      .then(({ success, response }) => {
        if (success === 1) {
          notification.success({
            message: "thread created successfully!",
            placement: "bottomRight",
          });
          setCreateThread(!createThread)
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

  const handleUpdateClick = (e) => {
    e.stopPropagation();
    const updatedReqData = {
      ntitle: title ? title : updatedDetail && updatedDetail.display_name,
      nbody:  desc ? desc : updatedDetail && updatedDetail.display_desc.substring(0, 100) + "...",
      // image: imageUrl,
      // payload: payload.substring(0, 100) + "...",
      threadcategory_id: updatedDetail && updatedDetail.threadcategory_id,
      nnotificationType: updatedDetail && updatedDetail.send_notification,
      nid: updatedDetail && updatedDetail.id, //
      nsentTo: activeTab === "1" || activeTab === 1 ? "0" : activeTab === "2" || activeTab === 2 ? "1" : "2",
      nids: activeTab === "1" || activeTab === 1 ? JSON.stringify(selectedContent).slice(1, -1)
        : activeTab === "2" || activeTab === 2 ? JSON.stringify(selectedGroup).slice(1, -1)
          : JSON.stringify(selectedForum).slice(1, -1).replace(/["']/g, "")

    };

    const updatedData = {
      threadid: updatedDetail && updatedDetail.id,
      selection_type: activeTab === "1" || activeTab === 1 ? "0" : activeTab === "2" || activeTab === 2 ? "1" : "2",
      selected_ids: activeTab === "1" || activeTab === 1 ? JSON.stringify(selectedContent).slice(1, -1)
      : activeTab === "2" || activeTab === 2 ? JSON.stringify(selectedGroup).slice(1, -1)
        : JSON.stringify(selectedForum).slice(1, -1).replace(/["']/g, "") 
  }

    setIsLoading(true);
    API.addupdatethreaduserdetail(updatedData)

    API.UPDATE_THREADS(updatedReqData)
      .then(({ success, response }) => {
        if (success === 1) {
          notification.success({
            message: "thread created successfully!",
            placement: "bottomRight",
          });
           setCreateThread(!createThread)
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

// table detail 
  const getColumnSearchProps = (dataIndex) => ({

    render: (record) => {
      return (
        <div className={styles.ContentInfo}>
          <div className={styles.ContentInfoTitle}>
            <span>{record?.display_name} </span>
            {/* {record?.forumName && (
              <SendNotification
                forums={record?.forumName}
                title={record.title}
                id={record.contentId}
                type="content"
                content={record}
                media={record.mediaDetails}
                subTitle={record.subTitle}
                body={record.body}
                isContent="content"
              />
            )} */}
          </div>
          {record?.display_desc?.length > 0 && (
            <div className={styles.ContentInfoExtraCategories}>
              {record?.display_desc?.toString().replaceAll(",", ", ")}
            </div>
          )}
        </div>
      );
    },
  });

  const renderUsers = () => {
    const retData = [];
    if (userList.length === 0) {
      retData.push(<div>No User Found !</div>);
    } else {
      userList.forEach((item, i) => {
        const name = item.user ? `${item.user.first_name} ${item.user.last_name}` : item.name && item.name;
        let _id = item.user ? item.user.id : item.id;
        const isChecked = (selectedContent.includes(_id)) || (updatedDetail && updatedDetail.userid === _id);

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
                  value={item.user ? item.user.id : item.id || updatedDetail && updatedDetail.userid}
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
          userId: item.id,
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

  const onEdit = (detail) => {
    console.log(detail)
    setUpdatedDetail(detail)
    setCreateThread(!createThread)
  }

  const columns = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      // align: "center",
      ...getColumnSearchProps("content"),
    },
    {
      title: "Action",
      dataIndex: "content",
      key: "content",
      width: 80,
      align: "center",
      render: () => {
              let typeIcon = <ArticleIcon  onClick={() => {
                onEdit()
              }}/>
              return typeIcon;
            },
    },
  ];

  return (
    // <div className={styles.Notifications}>
      <div className={styles.Content}>
      <div className={styles.ContentHeader}>
        <div>
          <h2 className={styles.ContentHeaderTitle}>Threads</h2>
          <div className={styles.ContentSubHeader}>Update Insight Threads</div>
        </div>
        <Button
          type="primary"
          onClick={() => {
            // dispatch(actions.globalActions.setContentDetailsData({}));
            // history.push("/content/details");
            setCreateThread(!createThread)
          }}
        >
          Create
        </Button>
      </div>

      {createThread  === true ?
      <div className={styles.NotificationsFormCard}>
        <div >
          <div className={styles.NotificationsInputLabel}>Title</div>
          <Input
            placeholder="Notification Title"
            value={title || updatedDetail && updatedDetail.display_name}
            onChange={(e) => {
              e.stopPropagation();
              const name = e.target.value;
              setTitle(name);
            }}
            disabled={isContent}
            style={isContent ?{ pointerEvent: "none" }:{}}
          />
          <div className={styles.NotificationsInputLabel}>Description</div>
          <TextArea
            placeholder="Notification Body"
            value={desc || updatedDetail.display_desc}
            onChange={(e) => {
              e.stopPropagation();
              const name = e.target.value;
              setDesc(name);
            }}
            disabled={isContent}
            style={isContent ?{ pointerEvent: "none" }:{}}
          />

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
                    value={searchTerm}
                    placeholder="Search Users"
                    onChange={(e) => {
                      e.stopPropagation();
                      const val = e.target.value;
                      setSearchTerm(val);
                    }}
                    
                    style={{ width: "300px" }}
                  />
                </div>

              </div>

              <div className={styles.NotificationsUsersList}>{renderUsers()}</div>

              <br />
             {updatedDetail && updatedDetail.display_name ? <Button
                type="primary"
                onClick={(e) => handleUpdateClick(e)}
                loading={isLoading}
                // disabled={!title || !desc || selectedContent.length === 0}
              >
                Send Notification
              </Button>
              :
              <Button
                type="primary"
                onClick={(e) => handleNotiClick(e)}
                loading={isLoading}
                disabled={!title || !desc || selectedContent.length === 0}
              >
                Send Notification
              </Button> }
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
                {updatedDetail && updatedDetail.display_name ? <Button
                type="primary"
                onClick={(e) => handleUpdateClick(e)}
                loading={isLoading}
                // disabled={!title || !desc || selectedContent.length === 0}
              >
                Send Notification
              </Button>
              :
              <Button
                type="primary"
                onClick={(e) => handleNotiClick(e)}
                loading={isLoading}
                disabled={!title || !desc || selectedGroup.length === 0}
              >
                Send Notification
              </Button> }
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
              {updatedDetail && updatedDetail.display_name ? <Button
                type="primary"
                onClick={(e) => handleUpdateClick(e)}
                loading={isLoading}
                // disabled={!title || !desc || selectedContent.length === 0}
              >
                Send Notification
              </Button>
              :
              <Button
                type="primary"
                onClick={(e) => handleNotiClick(e)}
                loading={isLoading}
                disabled={!title || !desc || selectedForum.length === 0}
              >
                Send Notification
              </Button> }
            </TabPane>

          </Tabs>
        </div>
        {/* ---------------------- */}



        {/* ---------- */}
      </div> : ""}
      
      {createThread  === false ? <Table 
       size="middle"
      //  className="contentTable"
       rowClassName="contentTableRow"
       dataSource={contentData}
      columns={columns}
      pagination={{
        pageSize: 5,
        position: ["bottomRight"],
        current: currentPage,
        onChange: (page) => {
          dispatch(actions.globalActions.setContentPage(page));
        },
      }}
      fixed={"right"}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            // dispatch(
            //   actions.globalActions.setContentDetailsData(record.content)
            // );
            // history.push("/content/details");
            onEdit(record.content)
          },
        };
      }}
      /> : ''}
    </div>
    // </div>
  );
};

export default Threads;

import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImgCrop from "antd-img-crop";
import {
  Tag,
  Table,
  Button,
  notification,
  Input,
  Space,
  Alert,
  Upload,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SendNotification from "@src/components/SendNotification/SendNotification";

import SessionDetails from "./Details/SessionDetails";

import API from "@src/api";

// Actions
import actions from "@src/store/actions";

// Assets
import DefaultImg from "@src/assets/images/DefaultSessions.jpg";

import styles from "./Sessions.scss";

const Sessions = () => {
  let searchInput = "";
  const dispatch = useDispatch();
  const sessionsData = useSelector((state) => state.globalStore.sessionsData);
  const currentPage = useSelector((state) => state.globalStore.sessionsPage);
  const sessionsUpdated = useSelector(
    (state) => state.globalStore.sessionsUpdated
  );
  const history = useHistory();

  const [tableLoading, setTableLoading] = React.useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = React.useState(false);

  const [searchText, setSearchText] = React.useState();
  const [searchedColumn, setSearchedColumn] = React.useState();
  const fbUserId = JSON.parse(localStorage.getItem("imaAdmin-fbUserId"));

  const contentExtraTags = (forum) => {
    const retData = [];

    const renderColor = (item) => {
      let retColor;
      if (item === "CEO") {
        retColor = "green";
      }
      if (item === "CFO") {
        retColor = "geekblue";
      }
      if (item === "CHRO") {
        retColor = "magenta";
      }
      if (item === "CMO") {
        retColor = "orange";
      }

      return retColor;
    };

    const forumData = forum.includes(";") ? forum.split(";") : forum.split(",");
    forumData.forEach((item) => {
      retData.push(<Tag color={renderColor(item.trim())}>{item.trim()}</Tag>);
    });
    return retData;
  };

  // #region Search

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Alert message="Search by Topic" type="info" showIcon />
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilter: (value, record) => {
      let recordFound;

      const params = [record[dataIndex].topic.toString().toLowerCase()];

      params.forEach((item) => {
        if (item.includes(value.toLowerCase())) {
          recordFound = true;
        }
      });

      return recordFound || false;
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },

    render: (record) => {
      return (
        <div className={styles.ContentInfo} key={record.sessionId}>
          <div className={styles.ContentInfoTitle}>
            <span>{record?.topic} </span>
            {record?.forum && (
              <SendNotification
                id={record.sessionId}
                title={record.topic}
                type="session-content"
                forums={
                  record?.forum.includes(";")
                    ? record?.forum.split(";")
                    : record?.forum.split(",")
                }
                content={record}
                isContent="session"
              />
            )}
          </div>

          <div className={styles.ContentInfoExtraContent}>
            {record?.briefing_session_rt}
          </div>

          {record?.forum?.length > 0 && (
            <div className={styles.ContentInfoExtraTags}>
              {contentExtraTags(record.forum)}
            </div>
          )}

          {record?.session_type?.length > 0 && (
            <div className={styles.ContentInfoExtraTags}>
              <Tag
                color={
                  record.session_type.toLowerCase() === "webinar"
                    ? "#87d068"
                    : "#2db7f5"
                }
              >
                {record.session_type}
              </Tag>
            </div>
          )}
        </div>
      );
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  //#endregion

  const onImageChange = (data, record) => {
    if (data.file.status === "error") {
      const formdata = new FormData();
      formdata.append("image", data.file.originFileObj);
      dispatch(actions.globalActions.setUsersData([]));

      API.sessionImageUpload(record.id, formdata)
        .then(({ success, response }) => {
          if (success) {
            notification.success({
              message: `Record updated.`,
              description:
                "Image for this session has been updated successfully!",
              placement: "bottomRight",
            });
            setTableLoading(true);

            setTimeout(() => {
              API.getSessionsList(fbUserId)
                .then(({ success, response }) => {
                  if (success) {
                    updateSessionsTable(response.data);
                  } else {
                    setTableLoading(false);
                    notification.error({
                      message: "Something went wrong",
                      placement: "bottomRight",
                    });
                  }
                })
                .catch((ex) => {
                  setTableLoading(false);
                  notification.error({
                    message: ex,
                    placement: "bottomRight",
                  });
                });
            }, 1000);
          } else {
            notification.error({
              message: "Something went wrong, try again later.",
              placement: "bottomRight",
            });
          }
        })
        .catch((ex) => {
          notification.error({
            message: ex,
            placement: "bottomRight",
          });
        });
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "sessions",
      key: "sessions",
      width: 160,
      align: "center",
      render: (record) => {
        let imgUrl = record.imageUrl ? record.imageUrl : DefaultImg;
        return (
          <div
            key={record.id}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ImgCrop rotate={false} zoom={false} modalOk="Confirm">
              <Upload
                onChange={(data) => {
                  onImageChange(data, record);
                }}
                showUploadList={false}
                action="localhost"
              >
                <div
                  className={styles.ContentImage}
                  onClick={(event) => event.preventDefault()}
                >
                  <img src={imgUrl} />
                </div>
              </Upload>
            </ImgCrop>
          </div>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "sessions",
      key: "sessions",
      ...getColumnSearchProps("sessions"),
    },
  ];

  const updateSessionsTable = (data) => {
    const tableDataArr = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        tableDataArr.push({
          key: index,
          userId: item.fbuid,
          sessions: item,
        });
      });
      dispatch(actions.globalActions.setSessionsUpdated(false));
      dispatch(actions.globalActions.setSessionsData(tableDataArr));
    }
    setTableLoading(false);
  };

  React.useEffect(() => {
    document.getElementsByTagName("main")[0].scrollTo(0, 0);
    if (sessionsUpdated || sessionsData.length === 0) {
      API.getSessionsList(fbUserId)
        .then(({ success, response }) => {
          if (success) {
            updateSessionsTable(response.data);

            API.getSessionContentList().then(({ success, response }) => {
              if (success) {
                dispatch(
                  actions.globalActions.setSessionDetailsContentList(
                    response.data
                  )
                );
              }
            });
          } else {
            notification.error({
              message: "Something went wrong",
              placement: "bottomRight",
            });
          }
          setTableLoading(false);
        })
        .catch((ex) => {
          setTableLoading(false);
          notification.error({
            message: ex,
            placement: "bottomRight",
          });
        });
    } else {
      setTableLoading(false);
    }
  }, []);

  return (
    <div className={styles.Content}>
      <div className={styles.ContentHeader}>
        <div>
          <h2 className={styles.ContentHeaderTitle}>Sessions</h2>
          <div className={styles.ContentSubHeader}>
            Update Insight Sessions and its Content
          </div>
        </div>
        {/* {currentTab === "1" && (
          <Button
            type="primary"
            onClick={() => {
              // dispatch(actions.globalActions.setSessionDetailsData({}));
              // history.push("/sessions/details");
            }}
          >
            Create
          </Button>
        )} */}
      </div>

      <Table
        pagination={{
          pageSize: 100,
          position: ["bottomRight"],
          current: currentPage,
          onChange: (page) => {
            dispatch(actions.globalActions.setSessionsPage(page));
          },
        }}
        size="middle"
        className="contentTable"
        rowClassName="contentTableRow"
        columns={columns}
        fixed={"right"}
        dataSource={sessionsData}
        loading={tableLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              dispatch(
                actions.globalActions.setSessionDetailsData(record.sessions)
              );
              setDetailsModalVisible(true);
            },
          };
        }}
      />

      <SessionDetails
        visible={detailsModalVisible}
        onClose={() => {
          dispatch(actions.globalActions.setSessionDetailsData([]));
          setDetailsModalVisible(false);
        }}
      />
    </div>
  );
};

export default Sessions;

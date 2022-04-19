import React from "react";
import {
  Avatar,
  Alert,
  Table,
  Upload,
  Button,
  notification,
  Input,
  Space,
} from "antd";
import ImgCrop from "antd-img-crop";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import * as dayjs from 'dayjs'

import API from "@src/api";

// Actions
import actions from "@src/store/actions";

import styles from "./Users.scss";

const Users = () => {
  const emptyStateMsg = "N/A";
  let imgUploading = false;
  let searchInput = "";
  const [expandedKeys, setExpandedKeys] = React.useState([]);
  const [tableLoading, setTableLoading] = React.useState(true);

  const [searchText, setSearchText] = React.useState();
  const [searchedColumn, setSearchedColumn] = React.useState();
  const fbUserId = JSON.parse(localStorage.getItem("imaAdmin-fbUserId"));

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.globalStore.usersData);
  const currentPage = useSelector((state) => state.globalStore.userPage);

  const ignoreKeys = [
    "first_name",
    "last_name",
    "designation",
    "companyName",
    "email",
    "mobile",
    "emailIdToDisplay",
    "mobileToDisplay",
    "contact_id",
    "id",
    "dobToDisplay",
    "image_url",
    "spouseToDisplay",
    "fbuid",
    "createdDateTime",
    "UpdatedDateTime",

    // We'll render biography seperately
    "biography",
  ];

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

  const userExtraInfo = (desig, comp) => {
    let retString = "";
    const designation = checkIfEmpty(desig);
    const company = checkIfEmpty(comp);

    if (!designation && !company) {
      retString = `${desig}, ${comp}`;
    } else if (!designation && company) {
      retString = desig;
    } else if (designation && !company) {
      retString = comp;
    }
    return retString;
  };

  const onImageChange = (data, record) => {
    if (data.file.status === "error") {
      const formdata = new FormData();
      formdata.append("image", data.file.originFileObj);
      dispatch(actions.globalActions.setUsersData([]));
      API.userImageUpload(record.fbuid, formdata).then(
        ({ success, response }) => {
          if (success) {
            notification.success({
              message: `Record updated.`,
              description: "Image for this user has been updated successfully!",
              placement: "bottomRight",
            });
            setTableLoading(true);

            setTimeout(() => {
              API.getUsersList(fbUserId)
                .then(({ success, response }) => {
                  if (success) {
                    updateUserTable(response.data);
                    imgUploading = false;
                  } else {
                    setTableLoading(false);
                    imgUploading = false;
                    notification.error({
                      message: "Something went wrong",
                      placement: "bottomRight",
                    });
                  }
                })
                .catch((ex) => {
                  setTableLoading(false);
                  imgUploading = false;
                  notification.error({
                    message: ex,
                    placement: "bottomRight",
                  });
                });
            }, 1000);
          }
        }
      );
    }
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
        <Alert message="Search by Name or Email" type="info" showIcon />

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

      const params = [
        record[dataIndex].first_name.toString().toLowerCase(),
        record[dataIndex].last_name.toString().toLowerCase(),
        record[dataIndex].email.toString().toLowerCase(),
      ];

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
        <div className={styles.UserInfo}>
          <div
            className={styles.UserInfoName}
          >{`${record.first_name} ${record.last_name}`}</div>
          <div className={styles.UserInfoExtra}>
            {userExtraInfo(record.designation, record.companyName)}
          </div>
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

  const columns = [
    {
      title: "",
      dataIndex: "user",
      key: "user",
      render: (record) => {
        return (
          <ImgCrop rotate modalOk="Confirm">
            <Upload
              onChange={(data) => {
                imgUploading = true;
                onImageChange(data, record);
              }}
              showUploadList={false}
              action="localhost"
            >
              <div className={styles.UserImage}>
                {record.image_url ? (
                  <img src={record.image_url} alt="" />
                ) : (
                  <Avatar size={50} icon={<UserOutlined />} />
                )}
              </div>
            </Upload>
          </ImgCrop>
        );
      },
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      ...getColumnSearchProps("user"),
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "user",
      render: (record) => {
        return (
          <div className={styles.UserInfoEmail}>
            {!checkIfEmpty(record.email) ? record.email : emptyStateMsg}
          </div>
        );
      },
    },
    {
      title: "Mobile",
      dataIndex: "user",
      key: "user",
      render: (record) => {
        return (
          <div className={styles.UserInfoMobile}>
            {!checkIfEmpty(record.mobile) ? record.mobile : emptyStateMsg}
          </div>
        );
      },
    },
  ];

  const updateUserTable = (data) => {
    const tableDataArr = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        tableDataArr.push({
          key: index,
          userId: item.fbuid,
          user: item,
        });
      });
      dispatch(actions.globalActions.setUsersData(tableDataArr));
    }
    setTableLoading(false);
  };

  React.useEffect(() => {
    if (userData.length === 0) {
      API.getUsersList(fbUserId)
        .then(({ success, response }) => {
          if (success) {
            updateUserTable(response.data);
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
    } else {
      setTableLoading(false);
    }
  }, []);

  const userDataCollection = (record) => {
    const retData = [];

    Object.keys(record).forEach((item, index) => {
      let value = record[item];

      if(item === 'dob' && !checkIfEmpty(value)){
        value = dayjs(record[item]).format('MMM, DD YYYY');
      }

      if (!ignoreKeys.includes(item)) {
        retData.push(
          <div key={`userdata${index}`} className={styles.UserData}>
            <div className={styles.UserDataLabel}>{humanizeString(item)}</div>
            <div className={styles.UserDataValue}>
              {!checkIfEmpty(value) ? value : emptyStateMsg}
            </div>
          </div>
        );
      }
    });
    return retData;
  };

  return (
    <div className={styles.Users}>
      <div className={styles.UsersHeader}>
        <div>
          <h2 className={styles.UsersHeaderTitle}>Users</h2>
          <div className={styles.UsersSubHeader}>Notify the users</div>
        </div>
        <div
          className={`${styles.UsersHeaderSearchTag} ${
            searchText && styles.UsersHeaderSearchTagActive
          }`}
        >
          Search Active
        </div>
      </div>
      <Table
        pagination={{
          pageSize: 100,
          position: ["bottomRight"],
          current: currentPage,
          onChange: (page) => {
            dispatch(actions.globalActions.setUserPage(page));
          },
        }}
        size="middle"
        className="usersTable"
        rowClassName="usersTableRow"
        columns={columns}
        fixed={"right"}
        dataSource={userData}
        onRow={({ key }) =>
          expandedKeys.includes(key)
            ? { className: "rowExpanded" }
            : { className: "" }
        }
        onExpand={(expanded, { key }) => {
          const keys = [...expandedKeys];
          const expandedKeysData = expanded
            ? keys.concat(key)
            : keys.filter((k) => k !== key);

          setExpandedKeys(expandedKeysData);
        }}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <>
                <div className={styles.UserDataCollection}>
                  {userDataCollection(record.user)}
                </div>

                <div className={styles.UserDataBiography}>
                  <div className={styles.UserData}>
                    <div className={styles.UserDataLabel}>Biography</div>
                    <div className={styles.UserDataValue}>
                      {!checkIfEmpty(record.user.biography)
                        ? record.user.biography
                        : emptyStateMsg}
                    </div>
                  </div>
                </div>
              </>
            );
          },
        }}
        loading={tableLoading}
      />
    </div>
  );
};

export default Users;

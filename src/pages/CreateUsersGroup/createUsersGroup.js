import React from "react";
// External Components
import { Button, Input, Alert, notification, Spin, Tabs, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';

// Actions
import styles from "./createUsersGroup.scss";
import API from "@src/api";
import { useSelector, useDispatch } from "react-redux";
import Accordion from "../../components/accordion";
import actions from "@src/store/actions";

const CreateUsersGroup = () => {
    const [selectedContent, setSelectedContent] = React.useState([]);
    const [groupName, setGroupName] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [errorBulkMsg, setErrorBulkMsg] = React.useState("");

    const userData = useSelector((state) => state.globalStore.usersData) || [];
    const [usersGroup, setUsersGroup] = React.useState([]);
    const dispatch = useDispatch();
    const [tableLoading, setTableLoading] = React.useState(true);
    const fbUserId = JSON.parse(localStorage.getItem("imaAdmin-fbUserId"));
    const [searchTerm, setSearchTerm] = React.useState("");
    const [fileListdata, setFileListdata] = React.useState("");
    const [bulkGroupName,setBulkGroupName] = React.useState("");
    const { TabPane } = Tabs;

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
        fetchGroups();
    }, []);

    const fetchGroups =()=>{
        API.UsersGroupList().then(({ success, response }) => {

            if (success) {
              setUsersGroup(response.data);
            }
          });
    };


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


    const renderUsersGroup = () => {
        const retData = [];
        if (usersGroup.length === 0) {
            retData.push(<div>User Group Not Found</div>);
        } else {
            usersGroup.forEach((item, i) => {
                const name = item.group_name;
                let _id = item.id;
                if (searchTerm) {
                    if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        retData.push(

                            <div>

                                <div>
                                    <Accordion title={name} content={item.user_names} type="UserGroup" />
                                </div>
                            </div>
                        );
                    }
                } else {
                    retData.push(

                        <div>

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


    const renderUsers = () => {
        const retData = [];
        if (userData.length === 0) {
            retData.push(<div>{tableLoading && <Spin tip="Loading...">
                <Alert
                    message="loading Users Data ..."
                    description=""
                    type="info"
                />
            </Spin>}</div>);
        } else {
            userData.forEach((item, i) => {
                const name = `${item.user.first_name} ${item.user.last_name}`;
                const isChecked = selectedContent.includes(item.user.id);

                if (searchTerm) {
                    if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        retData.push(

                            <div key={item.user.Id}
                                className={styles.CreateGroupDetailsCheckbox}
                                onClick={(e) => {
                                    handleOnCheck(item.user.id);
                                }}
                                style={{ display: "inline-flex" }}
                            >
                                <input
                                    type="checkbox"
                                    value={item.user.Id}
                                    checked={isChecked}
                                    onChange={(e) => {
                                        handleOnCheck(item.user.id);
                                    }}
                                    style={{ marginTop: "5px" }}

                                />
                                <div style={{ width: "270px", marginLeft: "10px", overflow: "hidden" }}>{name}</div>
                                <div style={{ width: "300px", marginLeft: "10px", overflow: "hidden" }}>{item.user.email}</div>
                                <div style={{ width: "200px", marginLeft: "10px", overflow: "hidden" }}>{item.user.companyName}</div>
                            </div>
                        );
                    }
                } else {
                    retData.push(
                        <>
                            <div key={item.user.Id}
                                className={styles.CreateGroupDetailsCheckbox}
                                onClick={(e) => {
                                    handleOnCheck(item.user.id);
                                }}
                                style={{ display: "inline-flex" }}
                            >
                                <input
                                    type="checkbox"
                                    value={item.user.Id}
                                    checked={isChecked}
                                    onChange={(e) => {
                                        handleOnCheck(item.user.id);
                                    }}
                                    style={{ marginTop: "5px" }}
                                />
                                <div style={{ width: "270px", marginLeft: "10px", overflow: "hidden" }}>{name}</div>
                                <div style={{ width: "300px", marginLeft: "10px", overflow: "hidden" }}>{item.user.email}</div>
                                <div style={{ width: "200px", marginLeft: "10px", overflow: "hidden" }}>{item.user.companyName}</div>
                            </div>
                            <br />
                        </>
                    );
                }

            });
        }
        return retData;
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

    const handleClick = () => {
        if (groupName === "") { setErrorMsg("Group Name Required "); return }
        if (selectedContent.length === 0) { setErrorMsg("User Not Selected "); return }
        if (selectedContent.length > 0 && selectedContent.length < 2) { setErrorMsg("Select Atleast Two User "); return }
        setErrorMsg("");

        const data = {
            "group_name": groupName,
            "user_ids": JSON.stringify(selectedContent).slice(1, -1),
            "email_ids": "",
            "group_id": 0
        }
        API.createGroupByUserId(data).then((res) => {
            if (res.success) {
                setGroupName("");
                setSelectedContent([]);
                notification.success({
                    message: "Group Created!",
                    placement: "bottomRight",
                });
            } else {
                notification.error({
                    message: "Something went wrong",
                    placement: "bottomRight",
                });
            }
        })

    }

    function callback(key) {
    }
    const uploadCSV = (value) => {
        var reader = new FileReader();
        reader.onload = function () {
            setFileListdata(reader.result);
        };
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(value.file.originFileObj);
    }
    const createGroup = ()=>{
        if (bulkGroupName === "") { setErrorBulkMsg("Group Name Required "); return }
        if (fileListdata === "") { setErrorBulkMsg("User Not Found "); return }
        setErrorBulkMsg("");
        const data = {
            "group_name": bulkGroupName,
            "user_ids": fileListdata,
            "email_ids": "",
            "group_id": 0
        }
        // return;
        API.createGroupByUserId(data).then((res) => {
            if (res.success) {
                setBulkGroupName("");
                setFileListdata("");
                fetchGroups();
                notification.success({
                    message: "Group Created!",
                    placement: "bottomRight",
                });
            } else {
                notification.error({
                    message: "Something went wrong",
                    placement: "bottomRight",
                });
            }
        })
    }
    return (
        <div className={styles.CreateGroup}>

            <div className={styles.CreateGroupHeader}>
                <div>
                    <h2 className={styles.CreateGroupHeaderTitle}>Create Group</h2>
                    <div className={styles.CreateGroupSubHeader}>
                        create users customized groups
                    </div>
                </div>
            </div>
            <br />
            <div className={styles.CreateGroupFormCard}>
                <Tabs onChange={callback} type="card">
                    <TabPane tab="Users" key="1">
                        <div className={styles.CreateGroupInputLabel}>Users</div>

                        <div>
                            <Input
                                placeholder="Search Users"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchTerm(val);
                                }}
                                value={searchTerm}
                                style={{ width: "300px" }}
                            />
                        </div>
                        <div className={styles.CreateGroupUsersGroupList}>

                            {renderUsers()}

                        </div>
                        <div style={{ display: "inline-flex", marginTop: "10px" }}>
                            <div style={{ marginLeft: "10px", marginTop: "3px" }}>
                                <Input
                                    placeholder="Enter Group Name"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div style={{ marginLeft: "10px", marginTop: "3px" }}>
                                <Button
                                    type="primary"
                                    onClick={handleClick}
                                >
                                    Create
                                </Button>
                            </div>
                            {errorMsg !== "" && <div style={{ marginLeft: "10px" }}>
                                <Alert message={`Error : ${errorMsg} !`} type="error" showIcon closable
                                    onClose={() => setErrorMsg("")} />
                            </div>}
                        </div>
                    </TabPane>
                    <TabPane tab="Bulk" key="2">
                        <div className={styles.CreateGroupInputLabel}>Users</div>
                        <div style={{display:"inline-flex"}}>
                            <Input
                                placeholder="Enter Group Name"
                                value={bulkGroupName}
                                onChange={(e) => setBulkGroupName(e.target.value)}
                            />
                            &nbsp; &nbsp;
                            <Upload maxCount={1}
                                onChange={uploadCSV} multiple={false} >
                                <Button style={{height:"44px"}} icon={<UploadOutlined />}>Upload CSV File</Button>
                            </Upload>
                            &nbsp; &nbsp;
                            <Button
                                type="primary"
                                onClick={createGroup}
                                style={{height:"44px"}}
                            >
                            Create
                            </Button>
                            
                        </div>
                        {errorBulkMsg !== "" && <div style={{ marginLeft: "10px" }}>
                                <Alert message={`Error : ${errorBulkMsg} !`} type="error" showIcon closable
                                    onClose={() => setErrorBulkMsg("")} />
                            </div>}
                        <p>{fileListdata}</p>
                        <div className={styles.CreateGroupUsersGroupList}>{renderUsersGroup()}</div>
                    </TabPane>

                </Tabs>




            </div>

        </div>
    );
};

export default CreateUsersGroup;

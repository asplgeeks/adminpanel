import React from "react";
// External Components
import { Button, Input, Alert, Spin } from "antd";

// Actions
import styles from "./Notifications.scss";

const CreateGroup = () => {
    const [selectedContent, setSelectedContent] = React.useState([]);
    const [groupName, setGroupName] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
   


    

    const renderUsers = () => {
        const retData = [];
        if (userData.length === 0) {
            retData.push(<div>{userPlaceholder}</div>);
        } else {
            userData.forEach((item, i) => {
                const name = `${item.user.first_name} ${item.user.last_name}`;
                const isChecked = selectedContent.includes(item.user.id);


                retData.push(
                    <div key={item.user.Id}
                        className={styles.NotificationsDetailsCheckbox}
                        onClick={(e) => {
                            handleOnCheck(item.user.id);
                        }}
                    >
                        <input
                            type="checkbox"
                            value={item.user.Id}
                            checked={isChecked}
                            onChange={(e) => {
                                handleOnCheck(item.user.id);
                            }}
                        />
                        <label htmlFor={item.user.email}>{name}</label>
                    </div>
                );

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
       

    }
    return (
        <div>
            
            <div>
                <div className={styles.NotificationsUsersGroupList}>

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



            </div>

        </div>
    );
};

export default CreateGroup;

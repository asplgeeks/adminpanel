import React, { useEffect } from "react";

// Actions
import { Button, Menu, Dropdown, } from "antd";
import { DownOutlined } from '@ant-design/icons';

import styles from "./Notifications.scss";
import API from "@src/api";


const NotificationsFilter = (props) => {
    const { userList, sortBy, setSortBy, updateUser, reloadUsers } = props;
    const [selectedContent, setSelectedContent] = React.useState([]);
    const [selectedCity, setSelectedCity] = React.useState([]);
    const [cityList, setCityList] = React.useState([]);
    const [forumList, setForumList] = React.useState([]);
    const [selectedForum, setSelectedForum] = React.useState([]);
    const [opportunity_flagList, setOpportunity_flagList] = React.useState([]);
    const [selectedOpportunity_flag, setSelectedOpportunity_flag] = React.useState([]);
    const [contact_flag, setContact_flag] = React.useState([]);
    const [selectedContact, setSelectedContact] = React.useState([]);
    const [individualIDStatus, setIndividualIDStatus] = React.useState([]);
    const [selectedIndividualIDStatus, setSelectedIndividualIDStatus] = React.useState([]);


    
    useEffect(() => {
        getFilterData();
    }, []);


    const handleClick = () => {
        const data = {
            "firstname": "",
            "lastname": "",
            "companyName": "",
            "email": "",
            "designation": "",
            "group_ids": "",
            "cities": selectedCity.length > 0 ? JSON.stringify(selectedCity).slice(1, -1).replace(/("|')/g, "") : "",
            "forum": selectedForum.length > 0 ? JSON.stringify(selectedForum).slice(1, -1).replace(/("|')/g, "") : "",
            "opportunity_flag": selectedOpportunity_flag.length > 0 ? JSON.stringify(selectedOpportunity_flag).slice(1, -1).replace(/("|')/g, "") : "",
            "contact_flag": selectedContact.length > 0 ? JSON.stringify(selectedContact).slice(1, -1).replace(/("|')/g, "") : "",
            "individualidstatus": selectedIndividualIDStatus.length > 0 ? JSON.stringify(selectedIndividualIDStatus).slice(1, -1).replace(/("|')/g, "") : ""
        }

        API.searchUser(data).then(({ response, success }) => {
            if (success) {
                if (!response.data) {
                    reloadUsers(false);

                    updateUser([]);
                }
                else {
                    reloadUsers(true);

                    updateUser(response.data);
                }
            }
        })

    }

    const handleOnCheckCity = (val) => {
        let currentContent = [...selectedCity];
        const checked = selectedCity.includes(val.title);

        if (!checked) {
            currentContent.push(val.title);
        } else {
            currentContent = currentContent.filter((x) => x !== val.title);
        }

        const updatedContent = [...new Set(currentContent)];
        setSelectedCity(updatedContent);
    }


    const renderCity = () => {
        const retData = [];
        if (cityList.length > 0) {
            cityList.forEach((item, i) => {
                const isChecked = selectedCity.includes(item.title);
                if (item.title.length > 0) {
                    retData.push(

                        <Menu.Item>
                            <div
                                key={item.title}
                                className={styles.NotificationsDetailsCheckbox}
                                onClick={(e) => {
                                    handleOnCheckCity(item);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={isChecked}
                                    onChange={(e) => {
                                        handleOnCheckCity(item);
                                    }}
                                />{"   "}
                                <label htmlFor={item}>{item.title}</label>
                            </div>
                        </Menu.Item>

                    )
                }
            })
        }

        return retData;

    }

    const handleOnCheckForum = (val) => {
        let currentContent = [...selectedForum];
        const checked = selectedForum.includes(val.title);

        if (!checked) {
            currentContent.push(val.title);
        } else {
            currentContent = currentContent.filter((x) => x !== val.title);
        }

        const updatedContent = [...new Set(currentContent)];
        setSelectedForum(updatedContent);
    }

    const renderForum = () => {
        const retData = [];
        if (forumList.length > 0) {
            forumList.forEach((item, i) => {
                const isChecked = selectedForum.includes(item.title);

                retData.push(
                    <Menu.Item>

                        <div
                            key={item.title}
                            className={styles.NotificationsDetailsCheckbox}
                            onClick={(e) => {
                                handleOnCheckForum(item);
                            }}
                        >
                            <input
                                type="checkbox"
                                value={item}
                                checked={isChecked}
                                onChange={(e) => {
                                    handleOnCheckForum(item);
                                }}
                            />{"   "}
                            <label htmlFor={item}>{item.title}</label>
                        </div>
                    </Menu.Item>
                )
            })
        }

        return retData;
    }
    const handleOnOpportunity = (val) => {
        let currentContent = [...selectedOpportunity_flag];
        const checked = selectedOpportunity_flag.includes(val.title);

        if (!checked) {
            currentContent.push(val.title);
        } else {
            currentContent = currentContent.filter((x) => x !== val.title);
        }

        const updatedContent = [...new Set(currentContent)];
        setSelectedOpportunity_flag(updatedContent);
    }

    const renderOpportunity = () => {
        const retData = [];
        if (opportunity_flagList.length > 0) {
            opportunity_flagList.forEach((item, i) => {
                const isChecked = selectedOpportunity_flag.includes(item.title);

                retData.push(
                    <Menu.Item>
                        <div
                            key={item.title}
                            className={styles.NotificationsDetailsCheckbox}
                            onClick={(e) => {
                                handleOnOpportunity(item);
                            }}
                        >
                            <input
                                type="checkbox"
                                value={item}
                                checked={isChecked}
                                onChange={(e) => {
                                    handleOnOpportunity(item);
                                }}
                            />{"   "}
                            <label htmlFor={item}>{item.title}</label>
                        </div>
                    </Menu.Item>
                )
            })
        } else {
            retData.push(
                <Menu.Item>
                    <div
                        key={"one"}
                        className={styles.NotificationsDetailsCheckbox}
                    >
                        <label >No data </label>
                    </div>
                </Menu.Item>
            )
        }

        return retData;
    }

    const handleOnContactFlag = (val) => {
        let currentContent = [...selectedContact];
        const checked = selectedContact.includes(val.title);

        if (!checked) {
            currentContent.push(val.title);
        } else {
            currentContent = currentContent.filter((x) => x !== val.title);
        }

        const updatedContent = [...new Set(currentContent)];
        setSelectedContact(updatedContent);
    }

    const renderContactFlag = () => {
        const retData = [];
        if (contact_flag.length > 0) {
            contact_flag.forEach((item, i) => {
                const isChecked = selectedContact.includes(item.title);

                retData.push(
                    <Menu.Item>
                        <div
                            key={item.title}
                            className={styles.NotificationsDetailsCheckbox}
                            onClick={(e) => {
                                handleOnContactFlag(item);
                            }}
                        >
                            <input
                                type="checkbox"
                                value={item}
                                checked={isChecked}
                                onChange={(e) => {
                                    handleOnContactFlag(item);
                                }}
                            />{"   "}
                            <label htmlFor={item}>{item.title}</label>
                        </div>
                    </Menu.Item>
                )
            })
        }

        return retData;
    }

    const handleOnIndividualID = (val) => {
        let currentContent = [...selectedIndividualIDStatus];
        const checked = selectedIndividualIDStatus.includes(val.title);

        if (!checked) {
            currentContent.push(val.title);
        } else {
            currentContent = currentContent.filter((x) => x !== val.title);
        }

        const updatedContent = [...new Set(currentContent)];
        setSelectedIndividualIDStatus(updatedContent);
    }
    const renderIndividual = () => {
        const retData = [];
        if (individualIDStatus.length > 0) {
            individualIDStatus.forEach((item, i) => {
                const isChecked = selectedIndividualIDStatus.includes(item.title);

                retData.push(
                    <Menu.Item>
                        <div
                            key={item.title}
                            className={styles.NotificationsDetailsCheckbox}
                            onClick={(e) => {
                                handleOnIndividualID(item);
                            }}
                        >
                            <input
                                type="checkbox"
                                value={item}
                                checked={isChecked}
                                onChange={(e) => {
                                    handleOnIndividualID(item);
                                }}
                            />{"   "}
                            <label htmlFor={item}>{item.title}</label>
                        </div>
                    </Menu.Item>
                )
            })
        }

        return retData;
    }


    const getFilterData = () => {
        API.getNotificationFilterType().then(({ response }) => {

            if (response.success) {
                let cityTemp = [];
                let forumTemp = [];
                let contact_flagTemp = [];
                let individualIDStatusTemp = [];
                let opportunity_flagTemp = [];
                if (response.data.city && response.data.city.length > 0) {
                    response.data.city.forEach((item, i) => {
                        cityTemp.push({ title: item, active: false })
                    });
                    setCityList(cityTemp);
                }


                if (response.data.forum && response.data.forum.length > 0) {
                    response.data.forum.forEach((item, i) => {
                        forumTemp.push({ title: item, active: false })
                    });
                    setForumList(forumTemp);
                }

                if (response.data.contact_flag && response.data.contact_flag.length > 0) {
                    response.data.contact_flag.forEach((item, i) => {
                        contact_flagTemp.push({ title: item, active: false })
                    });
                    setContact_flag(contact_flagTemp);
                }

                if (response.data.individualIDStatus && response.data.individualIDStatus.length > 0) {
                    response.data.individualIDStatus.forEach((item, i) => {
                        individualIDStatusTemp.push({ title: item, active: false })
                    });
                    setIndividualIDStatus(individualIDStatusTemp);
                }

                if (response.data.opportunity_flag && response.data.opportunity_flag.length > 0) {
                    response.data.opportunity_flag.forEach((item, i) => {
                        opportunity_flagTemp.push({ title: item, active: false })
                    });
                    setOpportunity_flagList(opportunity_flagTemp);
                }
            }
        })
    }

    const reSet = () => {
        setSortBy("");
        setSelectedCity([]);
        setSelectedForum([]);
        setSelectedOpportunity_flag([]);
        setSelectedContact([]);
        setSelectedIndividualIDStatus([]);
        reloadUsers(true);
    }



    return (

        <div className={`${styles.MultiBoxHolder}`}>
            <div className="">Filter By:</div>
            <div style={{ display: "inline-flex" }}>
                <ul style={{paddingLeft:"0"}}>
                    
                    <li key="city"
                        onClick={() => setSortBy("city")}
                        className={sortBy === "city" || selectedCity.length > 0 ?
                            styles.MultiBoxHolderActive : ""
                        }
                    >
                        <Dropdown overlay={<Menu>
                            {renderCity()}</Menu>}>
                            <a className="ant-dropdown-link" style={{ color: "#474747" }} onClick={e => e.preventDefault()}>
                                CITY <DownOutlined />
                            </a>
                        </Dropdown>
                    </li>
                    <li key="forum"
                        onClick={() => setSortBy("forum")}
                        className={sortBy === "forum" || selectedForum.length > 0 ? styles.MultiBoxHolderActive : ""
                        }
                    >
                        <Dropdown overlay={<Menu>
                            {renderForum()}</Menu>}>
                            <a className="ant-dropdown-link" style={{ color: "#474747" }} onClick={e => e.preventDefault()}>
                                FORUM <DownOutlined />
                            </a>
                        </Dropdown>
                    </li>
                    <li key="opportunity"
                        onClick={() => setSortBy("opportunity")}
                        className={sortBy === "opportunity" || selectedOpportunity_flag.length > 0 ? styles.MultiBoxHolderActive : ""
                        }
                    >

                        <Dropdown overlay={<Menu>
                            {renderOpportunity()}</Menu>}>
                            <a className="ant-dropdown-link" style={{ color: "#474747" }} onClick={e => e.preventDefault()}>
                                Opportunity Flag <DownOutlined />
                            </a>
                        </Dropdown>
                    </li>
                    <li key="contact"
                        onClick={() => setSortBy("contact")}
                        className={sortBy === "contact" || selectedContact.length > 0 ? styles.MultiBoxHolderActive : ""
                        }
                    >

                        <Dropdown overlay={<Menu>
                            {renderContactFlag()}</Menu>}>
                            <a className="ant-dropdown-link" style={{ color: "#474747" }} onClick={e => e.preventDefault()}>
                                Contact Flag <DownOutlined />
                            </a>
                        </Dropdown>
                    </li>
                    <li key="Individual"
                        onClick={() => setSortBy("Individual")}
                        className={sortBy === "Individual" || selectedIndividualIDStatus.length > 0 ? styles.MultiBoxHolderActive : ""
                        }
                    >

                        <Dropdown overlay={<Menu>
                            {renderIndividual()}</Menu>}>
                            <a className="ant-dropdown-link" style={{ color: "#474747" }} onClick={e => e.preventDefault()}>
                                Individual ID Status <DownOutlined />
                            </a>
                        </Dropdown>
                    </li>
                </ul>
                <div>
                    <Button
                        type="primary"
                        onClick={handleClick}
                        style={{ marginLeft: "55px" }}
                        danger
                    >
                        Apply
                    </Button>
                </div>
                <div>
                    {(selectedCity.length > 0 || selectedForum.length > 0 || selectedOpportunity_flag.length > 0 || selectedContact.length > 0 || selectedIndividualIDStatus.length > 0) ? <p
                        onClick={reSet}
                        className={styles.NotificationsReset}
                    >
                        RESET
                    </p> : <></>}
                </div>
            </div>
            
        </div>
    );
};

export default NotificationsFilter;

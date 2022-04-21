import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Tag,
  Table,
  Button,
  notification,
  Input,
  Space,
  Alert,
  Switch,
  Divider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import SendNotification from "@src/components/SendNotification/SendNotification";

import API from "@src/api";

// Actions
import actions from "@src/store/actions";

// Assets
import ArticleIcon from "./assets/Article.svg";
import VideoIcon from "./assets/Video.svg";
import LinkIcon from "./assets/Link.svg";
import PodcastIcon from "./assets/Podcast.svg";

import styles from "./Content.scss";

const Content = () => {
  let searchInput = "";
  const dispatch = useDispatch();
  const contentData = useSelector((state) => state.globalStore.contentData);
  const currentPage = useSelector((state) => state.globalStore.contentPage);
  const contentUpdated = useSelector(
    (state) => state.globalStore.contentUpdated
  );
  const history = useHistory();

  const [tableLoading, setTableLoading] = React.useState(true);
  const [reload_table, setReload] = React.useState(true);

  
  const [searchText, setSearchText] = React.useState();
  const [searchedColumn, setSearchedColumn] = React.useState();
  const fbUserId = JSON.parse(localStorage.getItem("imaAdmin-fbUserId"));

 

  // #region Search

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Alert
          message="Search by  Category Name"
          type="info"
          showIcon
        />
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
        record.cat_name.toString().toLowerCase(),
        // record[dataIndex].cat_description.toString().toLowerCase(),
        // record[dataIndex].forumName.toString().toLowerCase(),
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

    // render: (record) => {
    //   console.log("record", record)
    //   return (
    //     <div className={styles.ContentInfo}>
    //       <div className={styles.ContentInfoTitle}>
    //         <span>{record?.cat_name} </span>
           
    //           <div
    //             // forums={record?.forumName}
    //             // title={record.title}
    //             // id={record.contentId}
    //             type="content"
    //             // content={record}
    //             // media={record.mediaDetails}
    //             // subTitle={record.subTitle}
    //             // body={record.body}
    //             isContent="content"
    //           />
    //       </div>
    //       <span>{record?.cat_description} </span>
        
    //       <Divider />
    //       <div className={styles.ContentInfoStatus}>
    //         Status:{" "}
    //         <div
    //           className={`${styles.ContentInfoStatusPill}
    //            ${record && styles.ContentInfoStatusPillPublished
    //           }`}
    //         />
    //       </div>
    //     </div>
    //   );
    // },
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
  const updateData= (record) => {
    // console.log("update data", record)
    dispatch(
      actions.globalActions.setContentDetailsData(record)
    );
    history.push("/category/details");
  }

  const ChangeStatus =(record)=>{
 let active=record.is_active === 1 ? 0 : 1
let data={cat_id:record.id,is_active:active}
    API.UpdateCategoryStatus(data)
    .then((response) => {
      if (response.success === 1) {
        notification.success({
          message:response.message,
          placement: "bottomRight",
        });
        setReload(!reload_table)
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
  }
  //#endregion

  const columns = [
    {
      title: "Name",
      dataIndex: "cat_name",
       align: "left",
      width: "30%",
      key: "cat_name",
      ...getColumnSearchProps("cat_name"),
    },
    {
      title: "Description",
      dataIndex: "cat_description",
      key: "cat_description",
      width: "30%",
      // ...getColumnSearchProps(record),
    },
    {
      title: "Status",
      align: "center",
      width: "20%",
      render: (record) => {
        return(  record.is_active === 1 ?  <Switch defaultChecked  onClick={() => ChangeStatus(record)} /> : <Switch  onClick={() => ChangeStatus(record)}/> )

        //     // <ArticleIcon  style={{align:"center"}}  onClick={() => updateData(record)} />
        // ) 
    }
   },
    {
      title: "Action",
      align: "center",
      width: "20%",
      render: (record) => {
        return (
            <ArticleIcon  style={{align:"center"}}  onClick={() => updateData(record)} />
        ) 
    }

    }
  ];

  const updateContentTable = (data) => {
    const tableDataArr = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => 
    {
      console.log("attr", item)
        tableDataArr.push(item);
      });
      dispatch(actions.globalActions.setContentUpdated(false));
      dispatch(actions.globalActions.setContentData(tableDataArr));
    }
    setTableLoading(false);
  };

  React.useEffect(() => {
    document.getElementsByTagName("main")[0].scrollTo(0, 0);

    // if (contentUpdated || contentData.length === 0) {
    //   API.getContentMetadata().then(({ success, response }) => {
    //     if (success) {
    //       dispatch(actions.globalActions.setContentMetadata(response.data));
    //     }
    //   });

      API.getCategoryList()
        .then((response) => {
          // console.log("success", success)
          if (response.success === 1) {
            updateContentTable(response.data);
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
    // } else {
    //   setTableLoading(false);
    // }
  }, [reload_table]);

  return (
    <div className={styles.Content}>
      <div className={styles.ContentHeader}>
        <div>
          <h2 className={styles.ContentHeaderTitle}>Categories</h2>
          <div className={styles.ContentSubHeader}>List Categories</div>
        </div>
        <Button
          type="primary"
          onClick={() => {
            dispatch(actions.globalActions.setContentDetailsData({}));
            history.push("/category/details");
          }}
        >
          Create
        </Button>
      </div>
 {console.log("current data", contentData)}
      <Table
        pagination={{
          pageSize: 100,
          position: ["bottomRight"],
          current: currentPage,
          onChange: (page) => {
            dispatch(actions.globalActions.setContentPage(page));
          },
        }}
        size="middle"
        className="contentTable"
        rowClassName="contentTableRow"
        columns={columns}
        fixed={"right"}
        dataSource={contentData}
        loading={tableLoading}
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => {
        //       dispatch(
        //         actions.globalActions.setContentDetailsData(record)
        //       );
        //       history.push("/category/details");
        //     },
        //   };
        // }}
      />
    </div>
  );
};

export default Content;

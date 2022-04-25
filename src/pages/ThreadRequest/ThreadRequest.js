import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Tag,
  Table,
  Button,
  notification,
  message,
  Input,
  Space,
  Form,
  Select,
  Alert,
  Switch,
  Modal,
  Divider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import API from "@src/api";

// Actions
import actions from "@src/store/actions";

// Assets
import ArticleIcon from "./assets/Article.svg";
import VideoIcon from "./assets/Video.svg";
import LinkIcon from "./assets/Link.svg";
import PodcastIcon from "./assets/Podcast.svg";

import styles from "./ThreadRequest.scss";

const Content = () => {
  let searchInput = "";
  const dispatch = useDispatch();
  const contentData = useSelector((state) => state.globalStore.contentData);
  const contentUpdated = useSelector((state) => state.globalStore.contentUpdated);
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(false);

  const [tableLoading, setTableLoading] = React.useState(true);
  const [reload_table, setReload] = React.useState(true);
  const [RequestDetailsData, seRequestDetailsData] = React.useState({});

  const [currentPage, setCurrentPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(1);
  // const  = useSelector(1);


  
  const [searchText, setSearchText] = React.useState();
  const [searchedColumn, setSearchedColumn] = React.useState();
  const fbUserId = JSON.parse(localStorage.getItem("imaAdmin-fbUserId"));
  const user_id =localStorage.getItem("user_id");

  
  const [isModalVisible, setIsModalVisible] = React.useState(false);
        const [form] = Form.useForm();
        const formRef = React.createRef();
        const { Option } = Select;
// console.log("fuid", fbUserId)
 

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
    }
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
    seRequestDetailsData(record)
    setIsModalVisible(true)
    const comment=record.admin_comment !== undefined ? record.admin_comment : ""
    const status=record.status !== undefined ? record.status : ""
    form.setFieldsValue({
       admin_comment: comment, status:status
   });
  }

//   const ChangeStatus =(record)=>{
//  let active=record.is_active === 1 ? 0 : 1
// let data={cat_id:record.id,is_active:active}
//     API.UpdateCategoryStatus(data)
//     .then((response) => {
//       if (response.success === 1) {
//         notification.success({
//           message:response.message,
//           placement: "bottomRight",
//         });
//         setReload(!reload_table)
//       } else {
//         notification.error({
//           message: "Something went wrong",
//           placement: "bottomRight",
//         });
//       }
//       setTableLoading(false);
//     })
//     .catch((ex) => {
//       setTableLoading(false);
//       notification.error({
//         message: ex,
//         placement: "bottomRight",
//       });
//     });
//   }
  //#endregion

  const columns = [
    {
      title: "Name",
      dataIndex: "thread_name",
       align: "left",
      width: "30%",
      key: "thread_name",
      // ...getColumnSearchProps("thread_name"),
    },
    {
      title: "Description",
      dataIndex: "thread_desc",
      key: "thread_desc",
      width: "30%",
    },
    {
      title: "Comment",
      dataIndex: "admin_comment",
      key: "admin_comment",
      width: "30%",
    },
    {
      title: "Status",
      align: "center",
      width: "20%",
      render: (record) => {
         if (record.status === "Open") {
          return (<span style={{color:"#269814"}}> Open </span>)
         } else 
         if (record.status === "Publish") {
          return (<span style={{color:"#0fb0d7"}}>Publish</span>)
         } else {

          return (<span style={{color:"#ee3224"}}>Close</span>)
         } 
      }
   },
    {
      title: "Action",
      align: "center",
      width: "20%",
      render: (record) => {
        if (record.status === "Open") {
         return(<ArticleIcon  style={{align:"center"}}  onClick={() => updateData(record)} />)
         } else {
          return ""
         }
       
    }

    }
  ];

  const updateContentTable = (data) => {
    const tableDataArr = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => 
    {
      // console.log("attr", item)
        tableDataArr.push(item);
      });
      dispatch(actions.globalActions.setContentUpdated(false));
      dispatch(actions.globalActions.setContentData(tableDataArr));
    }
    setTableLoading(false);
  };

  React.useEffect(() => {
    document.getElementsByTagName("main")[0].scrollTo(0, 0);
     const data={
      page_no:currentPage,
      page_limit:10,
      sort_by:"created_datetime",
      search_by:""
    }
      API.ThreadRequestList(data)
        .then((response) => {
          if (response.success === 1) {
            // console.log("success", response.count)

            updateContentTable(response.data);
            setTotalPages(response.count);

            // currentPage

            // totalPages
            // count
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
  }, [reload_table , currentPage]);



  const handleCancel = () => {
    setIsModalVisible(false);
    // form.resetFields();
    // seRequestDetailsData({})

  };

  const handleConfirm = () => {
    formRef.current.validateFields().then((values) => {
      setIsLoading(true);
      values.request_id=RequestDetailsData.request_id !== undefined ? RequestDetailsData.request_id :"" 
      values.updated_by=user_id
      API.UpdateThreadRequest(values)
        .then((response) => {
          if (response.success === 1) {
            notification.success({
              message: response.message,
              placement: "bottomRight",
            });
            setIsModalVisible(false)
            setReload(!reload_table)
            seRequestDetailsData({})
            // form.resetFields();
          } else {
            notification.error({
              message: response.message,
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
    });
  };
  return (<>
     {/* onCancel={() => handleCancel()} */}
    <Modal
     title="Update Thread Request"  
      visible={isModalVisible} 
      footer={null}
      >
        <Form
        className={styles.ContentDetailsForm}
        name="basic"
        layout={"vertical"}
        form={form}
        ref={formRef}
        onFinishFailed={() => {
          message.error("Some required fields are missing.");
        }}
      >
        <div className={styles.ContentDetailsFormCardContainer}>
          <div className={styles.ContentDetailsFormCard}>
            {console.log("admin comment data", RequestDetailsData)}
            <Form.Item label="comment" 
            name="admin_comment"
            
              rules={[{ required: true, message: "Please enter comment." }
            ]}>
              <Input.TextArea
                placeholder="Enter comment"
                // value={RequestDetailsData.admin_comment !== undefined ? RequestDetailsData.admin_comment : ""}
                autoSize={{ minRows: 2, maxRows: 8 }}
              />
            </Form.Item>
          </div>

          <div className={styles.ContentDetailsFormCard}>
            <Form.Item
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
              // value={RequestDetailsData?.status}
              name="status" >
              <Select showArrow>
                <Option value="Open"> Open </Option>
                <Option value="Publish">Publish </Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            onClick={() => handleConfirm()}
            className={styles.ContentDetailsSubmit}
          >
            Submit
          </Button>
          <Button
            type=""
            htmlType="button"
            onClick={() => handleCancel()}
            className={styles.ContentDetailsSubmit}
            style={{marginLeft:"20px"}}>
            Cancel
          </Button>
        </Form.Item>
      </Form>

    </Modal>
   
    <div className={styles.Content}>
      <div className={styles.ContentHeader}>
        <div>
          <h2 className={styles.ContentHeaderTitle}>Thread Request</h2>
          <div className={styles.ContentSubHeader}>List Thread Request</div>
          {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
        </div>
      </div>
  {/* {console.log("total    000000000000Page", totalPages)} */}
      <Table
        pagination={{ pageSize: 10, position: ["bottomRight"],  current: currentPage, total:totalPages,
       
          onChange: (page) => {
            setCurrentPage(page)
          },
        }}
        size="middle"
        className="contentTable"
        rowClassName="contentTableRow"
        columns={columns}
        fixed={"right"}
        dataSource={contentData}
        loading={tableLoading}
      />
    </div>
    </>
  );
};

export default Content;

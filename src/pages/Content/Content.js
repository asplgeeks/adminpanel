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
  
  console.log(contentData)
  const contentUpdated = useSelector(
    (state) => state.globalStore.contentUpdated
  );
  const history = useHistory();

  const [tableLoading, setTableLoading] = React.useState(true);

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

    forum.forEach((item) => {
      retData.push(<Tag color={renderColor(item)}>{item}</Tag>);
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
        <Alert
          message="Search by Title, Category Name or Forum"
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
        record[dataIndex].title.toString().toLowerCase(),
        record[dataIndex].categoryName.toString().toLowerCase(),
        record[dataIndex].forumName.toString().toLowerCase(),
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
        <div className={styles.ContentInfo}>
          <div className={styles.ContentInfoTitle}>
            <span>{record?.title} </span>
            {record?.forumName && (
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
            )}
          </div>

          {record?.categoryName?.length > 0 && (
            <div className={styles.ContentInfoExtraCategories}>
              {record?.categoryName?.toString().replaceAll(",", ", ")}
            </div>
          )}

          {record?.primaryTagName?.length > 0 && (
            <div className={styles.ContentInfoExtraContent}>
              {record?.primaryTagName?.toString().replaceAll(",", ", ")}
            </div>
          )}

          {record?.forumName?.length > 0 && (
            <div className={styles.ContentInfoExtraTags}>
              {contentExtraTags(record.forumName)}
            </div>
          )}
          <Divider />
          <div className={styles.ContentInfoStatus}>
            Publish Status:{" "}
            <div
              className={`${styles.ContentInfoStatusPill} ${
                record.isVisible.data[0] &&
                styles.ContentInfoStatusPillPublished
              }`}
            />
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
      title: "Type",
      dataIndex: "content",
      key: "content",
      width: 80,
      align: "center",
      filters: [
        {
          text: "Video",
          value: "video",
        },
        {
          text: "Podcast",
          value: "podcast",
        },
        {
          text: "Article",
          value: "article",
        },
      ],
      onFilter: (value, record) => {
        return record.content.type.toLowerCase() === value;
      },
      render: (record) => {
        let typeIcon = <ArticleIcon />;
        if (record.type.toLowerCase() === "video") {
          typeIcon = <VideoIcon />;
        }

        if (record.type.toLowerCase() === "podcast") {
          typeIcon = <PodcastIcon />;
        }
        return typeIcon;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ...getColumnSearchProps("content"),
    },
  ];

  const updateContentTable = (data) => {
    const tableDataArr = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        tableDataArr.push({
          key: index,
          userId: item.fbuid,
          content: item,
        });
      });
      dispatch(actions.globalActions.setContentUpdated(false));
      dispatch(actions.globalActions.setContentData(tableDataArr));
    }
    setTableLoading(false);
  };

  React.useEffect(() => {
    document.getElementsByTagName("main")[0].scrollTo(0, 0);

    if (contentUpdated || contentData.length === 0) {
      API.getContentMetadata().then(({ success, response }) => {
        if (success) {
          dispatch(actions.globalActions.setContentMetadata(response.data));
        }
      });

      API.getContentList(fbUserId)
        .then(({ success, response }) => {
          if (success) {
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
    } else {
      setTableLoading(false);
    }
  }, []);

  return (
    <div className={styles.Content}>
      <div className={styles.ContentHeader}>
        <div>
          <h2 className={styles.ContentHeaderTitle}>Content</h2>
          <div className={styles.ContentSubHeader}>Update Insight content</div>
        </div>
        <Button
          type="primary"
          onClick={() => {
            dispatch(actions.globalActions.setContentDetailsData({}));
            history.push("/content/details");
          }}
        >
          Create
        </Button>
      </div>

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
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              dispatch(
                actions.globalActions.setContentDetailsData(record.content)
              );
              history.push("/content/details");
            },
          };
        }}
      />
    </div>
  );
};

export default Content;

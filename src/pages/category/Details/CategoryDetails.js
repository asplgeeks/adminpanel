import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useHistory } from "react-router-dom";

import {
  notification,
  DatePicker,
  message,
  Form,
  Input,
  Button,
  Select,
  Divider,
  Space,
  Switch,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import API from "@src/api";

// Actions
import actions from "@src/store/actions";

import { TAG_DATA } from "./config";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./CategoryDetails.scss";

const CategoryDetails = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const history = useHistory();

  const contentDetailsData = useSelector(
    (state) => state.globalStore.contentDetailsData || []
  );
  const contentMetaData = useSelector(
    (state) => state.globalStore.contentMetaData
  );
  const { Option } = Select;
  const formRef = React.createRef();
  const [isLoading, setIsLoading] = React.useState(false);
  const [body, setBody] = React.useState("");
  const [rawBody, setRawBody] = React.useState("");

  const [typeSelected, setTypeSelected] = React.useState();
  const [primaryTagSelected, setPrimaryTagSelected] = React.useState([]);
  const [primaryTagRemoved, setPrimaryTagRemoved] = React.useState("");
  const [dateVal, setDateVal] = React.useState("");
  const [moduleName, setModuleName] = React.useState("Insight");

  React.useEffect(() => {
    document.getElementsByTagName("main")[0].scrollTo(0, 0);
    if (!body && contentDetailsData.body) {
      const blocksFromHtml = htmlToDraft(contentDetailsData.body);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setBody(editorState);
    }

    if (contentDetailsData?.primaryTagName?.length > 0) {
      let TempTag = [];
      contentDetailsData.primaryTagName.forEach((item) => {
        TempTag.push(item);
      })
      setPrimaryTagSelected(TempTag);
    }

    if (!dateVal && contentDetailsData.date) {
      setDateVal(contentDetailsData.date);
    } else {
      setDateVal(new Date());
    }
  }, []);

  React.useEffect(() => {
    if (contentDetailsData?.primaryTagName?.length > 0) {
      if (
        contentDetailsData?.primaryTagName.includes("Round Table") ||
        contentDetailsData?.primaryTagName.includes("Briefing Session")
      ) {
        setModuleName("Session");
      }
    }
  }, [contentDetailsData?.primaryTagName]);

  const handleConfirm = () => {
    formRef.current.validateFields().then((values) => {
      console.log("values", values)
      setIsLoading(true);
     
      values.cat_id=contentDetailsData.id !== undefined ? contentDetailsData.id :"" 
      console.log("values", values)
      API.AddUpdateCategory(values)
        .then((response) => {
          console.log("response", response)
          // console.log("success", success)

          if (response.success === 1) {
            // console.log("success1", success)
            notification.success({
              message: response.message,
              placement: "bottomRight",
            });

            history.push("/category");

          } else {
   console.log("error")
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



  return (
    <div className={styles.ContentDetails}>
      <div className={styles.ContentDetailsHeader}>
        <div>
          <h2 className={styles.ContentDetailsHeaderTitle}>{contentDetailsData.id !== undefined ? "Update":"Add"} Category</h2>
          <div className={styles.CContentDetailsSubHeader}>
          {contentDetailsData.id !== undefined ? "Update":"Add"} New Category
          </div>
        </div>
      </div>

      <br />

      <Form
        className={styles.ContentDetailsForm}
        name="basic"
        layout={"vertical"}
        form={form}
        ref={formRef}
        initialValues={{
          remember: true,
          ...contentDetailsData
                }}
        onFinishFailed={() => {
          message.error("Some required fields are missing.");
        }}
      >
        <div className={styles.ContentDetailsFormCardContainer}>
          <div className={styles.ContentDetailsFormCard}>
         
              {/* <Input
              name="cat_name"
              type="hidden"
                value={contentDetailsData?.id}
              /> */}
        

            <Form.Item
              label="Name"
              name="cat_name"
              rules={[
                {
                  required: true,
                  message: "Please enter category name.",
                },
              ]}
            >
              <Input
                placeholder="Content Title"
                value={contentDetailsData?.title}
              />
            </Form.Item>

            <Form.Item label="Description" name="cat_description"
            rules={[
              {
                required: true,
                message: "Please enter category description .",
              },
            ]}
            >
              <Input.TextArea
                placeholder="Content Subtitle"
                autoSize={{ minRows: 2, maxRows: 8 }}
              />
            </Form.Item>
            <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            onClick={handleConfirm}
            className={styles.ContentDetailsSubmit}
          >
           {contentDetailsData.id !== undefined ? "Update" :"Submit"} 
          </Button>
        </Form.Item>
          </div> 
        </div>
      </Form>
    </div>
  );
};

export default CategoryDetails;

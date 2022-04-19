import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

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
import styles from "./ContentDetails.scss";

const ContentDetails = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

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
      setIsLoading(true);
      const mediaDetailsData = [];

      const imgUrlData = [];
      values?.imageURLs?.forEach((item) => {
        imgUrlData.push(item.img);
      });

      const imgData = imgUrlData.length > 0 && {
        type: "image",
        url: imgUrlData,
      };

      const videoData = values.videoURL && {
        type: "video",
        url: values.videoURL,
      };

      const audioData = values.audioURL && {
        type: "audio",
        url: values.audioURL,
      };

      if (imgData) {
        mediaDetailsData.push({ ...imgData });
      }

      if (videoData) {
        mediaDetailsData.push({ ...videoData });
      }

      if (audioData) {
        mediaDetailsData.push({ ...audioData });
      }

      const updatedData = { ...values, mediaDetails: [...mediaDetailsData] };

      delete updatedData.videoURL;
      delete updatedData.audioURL;
      delete updatedData.imageURLs;
      delete updatedData.moduleName;
      updatedData.body = rawBody || contentDetailsData.body;

      updatedData.date = moment(dateVal).format("YYYY-MM-DD") || new Date();
      updatedData.contentDateTime = contentDetailsData.contentDateTime || "";
      updatedData.contentId = contentDetailsData.contentId || 0;
      if (updatedData.isPublic === false || updatedData.isPublic === 0) updatedData.isPublic = 0;
      else updatedData.isPublic = 1;

      if (updatedData.isVisible === true || updatedData.isVisible === 1) updatedData.isVisible = 1;
      else updatedData.isVisible = 0;
      updatedData.isSession = moduleName === "Session";
      if (moduleName === "Session") {
        updatedData.primaryTagName = [updatedData.primaryTagName];
        updatedData.subTagName = [];
      }

      API.updateContent(updatedData)
        .then(({ success, response }) => {
          if (success) {
            dispatch(actions.globalActions.setContentUpdated(true));

            API.getSessionContentList().then(({ success, response }) => {
              if (success) {
                dispatch(
                  actions.globalActions.setSessionDetailsContentList(
                    response.data
                  )
                );
              }
            });

            notification.success({
              message: `Content updated successfully!`,
              placement: "bottomRight",
            });
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

  const getMediaDetails = () => {
    const retData = {};
    const mediaDetails = contentDetailsData?.mediaDetails || [];

    retData.imageURLs = [];
    if (mediaDetails.length > 0) {
      mediaDetails.forEach((item) => {
        if (item.type === "video") {
          retData.videoURL = item.url;
        }
        if (item.type === "audio") {
          retData.audioURL = item.url;
        }

        if (item.type === "image") {
          item.url.forEach((imgItem) => {
            retData.imageURLs.push({ img: imgItem });
          });
        }
      });
    }

    if (moduleName === "Insight") {
      const currSubTags = form?.getFieldsValue()?.subTagName;
      if (primaryTagRemoved && currSubTags && currSubTags.length > 0) {
        const filterData = currSubTags.filter(
          (r) => !TAG_DATA[primaryTagRemoved].includes(r)
        );

        form.setFieldsValue({
          subTagName: filterData,
        });
      }
    }

    retData.isVisible = contentDetailsData?.isVisible?.data[0];
    retData.moduleName = moduleName;

    form.setFieldsValue({
      moduleName,
    });
    return retData;
  };

  const renderOptions = (item) => {
    const retData = [];
    const subTagArr = [];
    const allTags = Object.keys(TAG_DATA);
    contentMetaData && contentMetaData[item].forEach((innerItem) => {
      if (item === "primaryTag") {
        if (allTags.includes(innerItem)) {
          retData.push(
            <Option value={innerItem} style={{ textTransform: "capitalize" }}>
              {innerItem}
            </Option>
          );
        }
      } else if (item === "subTag") {

        if (primaryTagSelected.length > 0) {

          primaryTagSelected.forEach((primaryTagItem) => {

            // subTagArr.push(...TAG_DATA[primaryTagItem]);
            const seprateTag = primaryTagItem.split(",");
            seprateTag.forEach((item, i) => {
              if (TAG_DATA[item])
                subTagArr.push(...TAG_DATA[item]);
            })

          });
        }
      } else {
        retData.push(
          <Option value={innerItem} style={{ textTransform: "capitalize" }}>
            {innerItem}
          </Option>
        );
      }
    });

    if (subTagArr.length > 0) {
      const subTagArrSet = new Set(subTagArr);
      subTagArrSet.forEach((innerItem) => {
        if (contentMetaData["subTag"].includes(innerItem)) {
          retData.push(
            <Option value={innerItem} style={{ textTransform: "capitalize" }}>
              {innerItem}
            </Option>
          );
        }
      });
    }

    return retData;
  };

  return (
    <div className={styles.ContentDetails}>
      <div className={styles.ContentDetailsHeader}>
        <div>
          <h2 className={styles.ContentDetailsHeaderTitle}>Content Details</h2>
          <div className={styles.CContentDetailsSubHeader}>
            Update Insight content details
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
          ...contentDetailsData,
          ...getMediaDetails(),
        }}
        onFinishFailed={() => {
          message.error("Some required fields are missing.");
        }}
      >
        <div className={styles.ContentDetailsFormCardContainer}>
          <div className={styles.ContentDetailsFormCard}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter title for the content.",
                },
              ]}
            >
              <Input
                placeholder="Content Title"
                value={contentDetailsData?.title}
              />
            </Form.Item>

            <Form.Item label="Subtitle" name="subTitle">
              <Input.TextArea
                placeholder="Content Subtitle"
                autoSize={{ minRows: 2, maxRows: 8 }}
              />
            </Form.Item>

            <div className={styles.ContentDetailsInline}>
              <div style={{ marginTop: "-18px" }}>
                <div className={styles.ContentDetailsLabel}>Date</div>
                <DatePicker
                  format="DD/MM/YYYY"
                  allowClear={false}
                  value={moment(dateVal) || ""}
                  onChange={(date) => {
                    setDateVal(date);
                  }}
                />
              </div>

              <Form.Item label="Publish Status" name="isVisible">
                <Switch
                  defaultChecked={contentDetailsData?.isVisible?.data[0]}
                  valuePropName="checked"
                />
              </Form.Item>

              <Form.Item label="IsPublic" name="isPublic">
                <Switch
                  defaultChecked={contentDetailsData?.isPublic === 1}
                  valuePropName="checked"
                />
              </Form.Item>
            </div>

            <div className={styles.ContentDetailsInline}>
              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please select a type" }]}
              >
                <Select
                  allowClear
                  placeholder="Please select a Type"
                  onChange={(data) => {
                    setTypeSelected(data);
                  }}
                >
                  {renderOptions("type")}
                </Select>
              </Form.Item>

              <Form.Item
                label="Forums"
                name="forumName"
                rules={[
                  {
                    required: true,
                    message: "Please select atleast one Forum",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showArrow
                  placeholder="Please select Forums"
                >
                  {renderOptions("forum")}
                </Select>
              </Form.Item>
            </div>

            <Form.Item label="Categories" name="categoryName">
              <Select
                mode="multiple"
                allowClear
                showArrow
                placeholder="Please select Categories"
              >
                {renderOptions("category")}
              </Select>
            </Form.Item>
          </div>

          <div className={styles.ContentDetailsFormCard}>
            <Form.Item
              label="Module"
              rules={[{ required: true, message: "Please select a module" }]}
              name="moduleName"
              style={{ width: "50%" }}
            >
              <Select
                showArrow
                onChange={(data) => {
                  setModuleName(data);
                  setPrimaryTagSelected([]);
                  form.setFieldsValue({
                    primaryTagName: [],
                    subTagName: [],
                  });
                }}
              >
                <Option value="Insight" style={{ textTransform: "capitalize" }}>
                  Insight
                </Option>
                <Option value="Session" style={{ textTransform: "capitalize" }}>
                  Session
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Please select Primary Tag${moduleName === "Insight" ? "s" : ""
                    }`,
                },
              ]}
              label={`Primary Tag${moduleName === "Insight" ? "s" : ""}`}
              name="primaryTagName"
            >
              <Select
                mode={moduleName === "Insight" ? "multiple" : ""}
                allowClear
                showArrow
                placeholder={`Please select Primary Tag${moduleName === "Insight" ? "s" : ""
                  }`}
                onChange={(data) => {
                  setPrimaryTagSelected(data);
                }}
                onDeselect={(data) => {
                  setPrimaryTagRemoved(data);
                }}
              >
                {moduleName === "Insight" ? (
                  renderOptions("primaryTag")
                ) : (
                  <>
                    <Option
                      value="Briefing Session"
                      style={{ textTransform: "capitalize" }}
                    >
                      Briefing Session
                    </Option>
                    <Option
                      value="Round Table"
                      style={{ textTransform: "capitalize" }}
                    >
                      Round Table
                    </Option>
                  </>
                )}
              </Select>
            </Form.Item>

            {moduleName === "Insight" && (
              <Form.Item
                label="Sub Tags"
                name="subTagName"
                rules={[
                  {
                    required: true,
                    message: "Please select Sub Tags",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showArrow
                  placeholder="Please select Sub Tags"
                  disabled={primaryTagSelected.length === 0}
                >
                  {renderOptions("subTag")}
                </Select>
              </Form.Item>
            )}
          </div>

          <div className={styles.ContentDetailsFormCard}>
            <Form.Item
              label="Main URL"
              name="mainURL"
              rules={[
                {
                  type: "url",
                  message: "This field must be a valid URL.",
                },
              ]}
            >
              <Input placeholder="Main URL" />
            </Form.Item>

            <Form.Item
              label="Public URL"
              name="publicURL"
              rules={[
                {
                  type: "url",
                  message: "This field must be a valid URL.",
                },
              ]}
            >
              <Input placeholder="Public URL" />
            </Form.Item>

            <Form.Item
              label="Highlight File URL"
              name="highlightFileURL"
              rules={[
                {
                  type: "url",
                  message: "This field must be a valid URL.",
                },
              ]}
            >
              <Input placeholder="Highlight File URL" />
            </Form.Item>

            <Form.Item
              label="Index File URL"
              name="indexFileURL"
              rules={[
                {
                  type: "url",
                  message: "This field must be a valid URL.",
                },
              ]}
            >
              <Input placeholder="Index File URL" />
            </Form.Item>
          </div>

          <div className={styles.ContentDetailsFormCard}>
            <Form.Item label="Body" name="body">
              <Editor
                editorState={body}
                placeholder="Body of the content..."
                toolbarClassName={styles.ContentDetailsEditorToolbar}
                wrapperClassName={styles.ContentDetailsEditorWrapper}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "list",
                    "textAlign",
                    "history",
                    "link",
                  ],
                }}
                onEditorStateChange={(data) => {
                  setBody(data);
                  body &&
                    setRawBody(
                      draftToHtml(convertToRaw(body.getCurrentContent()))
                    );
                }}
              />
            </Form.Item>
          </div>

          <Divider orientation="left">Media Details</Divider>
          <div className={styles.ContentDetailsFormCard}>
            <Form.Item
              label="Video URL"
              name="videoURL"
              rules={[
                {
                  required: typeSelected === "video",
                  message: "Please add a Video link.",
                },
                {
                  type: "url",
                  message: "This field must be a valid URL.",
                },
              ]}
            >
              <Input placeholder="Video URL" />
            </Form.Item>

            <Form.Item
              label="Audio URL"
              name="audioURL"
              rules={[
                {
                  type: "url",
                  message: "This field must be a valid URL.",
                },
              ]}
            >
              <Input placeholder="Audio URL" />
            </Form.Item>

            <Form.List label="Image URLs" name="imageURLs">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 4,
                      }}
                      align="center"
                    >
                      <Form.Item
                        {...restField}
                        label="Image URL"
                        name={[name, "img"]}
                        rules={[
                          {
                            type: "url",
                            message: "This field must be a valid URL.",
                          },
                        ]}
                      >
                        <Input placeholder="Image URL" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Image Link
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            onClick={handleConfirm}
            className={styles.ContentDetailsSubmit}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContentDetails;

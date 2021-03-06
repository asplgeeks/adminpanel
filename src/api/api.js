import * as ENDPOINTS from "./endpoints";

import { ApiRequest, ApiRequest1 } from "./utils";

const userID = localStorage.getItem("user_id")
console.log(userID)
/**
 * Get all articles
 */
export const getArticles = (pageNo) => {
  const url = ENDPOINTS.articles.GET.ARTICLE_LIST.replace(":num", pageNo);
  return ApiRequest(url, "GET");
};

/**
 * Get all users
 */
export const getUsersList = (fbUserId) => {
  const url = ENDPOINTS.users.GET.USERS_LIST;
  return ApiRequest(url, "GET");
};

/**
 * Get all content
 */
 export const getContentList = (fbUserId) => {
  const url = ENDPOINTS.content.GET.CONTENT_LIST;
  return ApiRequest(url, "GET");
};

/**
 * Update content
 */
 export const updateContent = (data) => {
  const url = ENDPOINTS.content.PUT.CONTENT;
  return ApiRequest(url, "PUT", data);
};

/**
 * Get all content metadata
 */
 export const getContentMetadata = () => {
  const url = ENDPOINTS.content.GET.METADATA;
  return ApiRequest(url, "GET");
};

/**
 * User Image Upload
 */
export const userImageUpload = (fbUserId, imageData) => {
  const url = ENDPOINTS.users.PUT.USER_IMAGE.replace(":fbuid", fbUserId);
  return ApiRequest(url, "PUT", imageData, true);
};

/**
 * Push Notifications
 */
export const pushNotification = (data) => {
  const url = ENDPOINTS.notifications.POST.PUSH_NOTIFICATIONS;
  return ApiRequest(url, "POST", data);
};

/**
 * Get all sessions
 */
 export const getSessionsList = (fbUserId) => {
  const url = ENDPOINTS.sessions.GET.SESSIONS_LIST;
  return ApiRequest(url, "GET");
};

/**
 * Get all session content
 */
 export const getSessionContentList = (fbUserId) => {
  // const url = ENDPOINTS.sessions.GET.SESSION_CONTENT_LIST;
  const url = ENDPOINTS.sessions.GET.SESSION_BASED_CONTENT_TITLE;
  return ApiRequest(url, "GET");
};

/**
 * Get sessions content list display within sessions details modal 
 */
 export const getContentListDisplay = (fbUserId) => {
  const url = ENDPOINTS.sessions.GET.CONTENT_LIST;
  return ApiRequest(url, "GET");
};

/**
 * Session Image Upload
 */
 export const sessionImageUpload = (sessionId, imageData) => {
  const url = ENDPOINTS.sessions.POST.SESSION_IMAGE.replace(":sessionId", sessionId);
  return ApiRequest(url, "POST", imageData, true);
};

/**
 * Update session details
 */
 export const updateSessionDetails = (data) => {
  const url = ENDPOINTS.sessions.PUT.SESSION_DETAILS;
  return ApiRequest(url, "PUT", data);
};

/**
 * Get sessions content by session based tag id
 */
 export const getSessionBasedContentBytagId = (sessionId) => {
  const url = ENDPOINTS.sessions.GET.SESSION_BASED_CONTENT;
  return ApiRequest(url, "GET", { sessionId: JSON.parse(sessionId) });
};

/**
 * create group by user id
 */
export const createGroupByUserId = (data)=>{
  const url = ENDPOINTS.notifications.PUT.CREATE_GROUP;
  return ApiRequest(url,"PUT",data);
}

/**
 * get all notification fiter data
 */

export const getNotificationFilterType = ()=>{
  const url = ENDPOINTS.notifications.GET.USER_FILTER_TYPE;
  return ApiRequest(url,"GET");
}

/**
 * search by city,forum,group,individual id status,contact flag, opportunity flag
 */
export const searchUser = (data)=>{
  const url = ENDPOINTS.notifications.PUT.SEARCH_USERS;
  return ApiRequest(url,"PUT",data);
}

/**
 * listing Users Groups
 */
 export const UsersGroupList = (data)=>{
  const url = ENDPOINTS.notifications.GET.LIST_USER_GROUP;
  return ApiRequest(url,"GET");
}

/**
 * Get sessions content by session based tag listing 
 */
 export const getSessionBasedContentTagList = (sessionId) => {
  const url = ENDPOINTS.sessions.GET.SESSION_BASED_CONTENT_TITLE;
  return ApiRequest(url, "GET");
};

/**
 * Push Notifications
 */
//  export const postCommetData = (data) => {
//   const url = ENDPOINTS.content.POST.COMMENT;
//   return ApiRequest1(url, "POST", JSON.stringify({
//     comment_id:0,
//     thread_id:1,
//     page_no:1,
//     page_limit:10,
//     sort_by:13,
//     search_by:"",
//     filter_by:{
//         file_type:"",
//         from_date:"",
//         to_date:"",
//         created_by:""

//     }
// }));
// };

export const  getThredList = async(data) => {
  // let base64 = require('base-64')
  const url = ENDPOINTS.thread.POST.THREAD;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify({
    userid:userID,
    status:"",
    page_no:0,
    page_limit:10,
    sort_by:"",
    search_by:"",
    thread_categoryid:""
}),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}

export const  postCommetData = async(data, row, page) => {
  // let base64 = require('base-64')
  console.log(data)
  const url = ENDPOINTS.content.POST.COMMENT;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify({
    comment_id:"",
    thread_id:data.id,
    page_no:page,
    page_limit:row,
    sort_by:"",
    search_by:"",
    filter_by:{
        file_type:"",
        from_date:"",
        to_date:"",
        created_by:""

    }
}),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}

export const  deleteComment = async(data, id, threadid) => {
  // let base64 = require('base-64')
  console.log(id)
  const url = ENDPOINTS.comment.POST.COMMENT;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify({
    comment_id:id,
    userid:userID,
    thread_id:threadid,
    delete_reason:data.reason
}),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}


export const  AddUpdateCategory = async(data) => {
  // let base64 = require('base-64')
  console.log("data info", data)
  const url = ENDPOINTS.category.POST.CreateUpdate;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify(data),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}

export const  getCategoryList = async() => {
  // let base64 = require('base-64')
  const url = ENDPOINTS.category.POST.CategoryList;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  // body: JSON.stringify(data),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}

 
export const  UpdateCategoryStatus = async(data) => {
  // let base64 = require('base-64')
  console.log("data info", data)
  const url = ENDPOINTS.category.POST.UpdateStatus;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify(data),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}

export const  ADD_THREADS = async(data, id) => {
  // let base64 = require('base-64')
  console.log(id)
  const url = ENDPOINTS.THREADLIST.POST.THREAD;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify({
    userid:data.nids,
    threadcategory_id:"1",
    admin_note:"note",
    display_name:data.ntitle,
    display_desc:data.nbody,
    moderator_ids:"40"
}),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
}

export const addupdatethreaduserdetail = (data) => {
  const url = ENDPOINTS.SELECT_THREAD_USER_CATEGORY.POST.THREADUSERLIST;
  return ApiRequest(url, "POST", data);
};

export const  UPDATE_THREADS = async(data, id) => {
  // let base64 = require('base-64')
  console.log(id)
  const url = ENDPOINTS.GETTHREAD.POST.UPDATETHREAD;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify({
    threadid:data.nid,
    threadcategory_id:data.threadcategory_id,
    admin_note:"note",
    display_name:data.ntitle,
    display_desc:data.nbody,
    moderator_ids:"40",
    send_notification:data.nnotificationType
}),
  redirect: 'follow'
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
};

export const ThreadRequestList = async(data) => {
  // const url = ENDPOINTS.sessions.GET.SESSION_CONTENT_LIST;
  const url = ENDPOINTS.ThreadRequest.POST.List;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify(data),
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
};


export const UpdateThreadRequest = async(data) => {
  // const url = ENDPOINTS.sessions.GET.SESSION_CONTENT_LIST;
  const url = ENDPOINTS.ThreadRequest.POST.UpdateStatus;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: JSON.stringify(data),
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
};



export const get_user_login_details = async(data) => {
  // const url = ENDPOINTS.sessions.GET.SESSION_CONTENT_LIST;
  const url = ENDPOINTS.Login.PUT.user;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YXN1V29ya3M6ZXJnYmhqd2Z2Ymhqa2VndmZ2a2diaGpiaGprc2ZkZ3ZzZGpmdmhua2xobmprbGhqa1NKS0hoamtCSEpLYmhqa2hqa2tqQkhKdkhKS0JISks=");
  myHeaders.append("Content-Type", "application/json");
  
var requestOptions = {
  method: 'PUT',
  headers: myHeaders,
  body: JSON.stringify(data),
};
  const req = await fetch(url, requestOptions);
  const response = await req.json();
  return response;
};



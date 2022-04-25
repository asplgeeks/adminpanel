import React from "react";
import { useHistory } from "react-router-dom";
import { Input, Button, notification,
  message } from "antd";

import { firebase_auth } from "../../constants";

import IMALogo from "@src/assets/icons/IMA-Logo.svg";
import HozapLogo from "@src/assets/icons/hozapLogo.svg";
import API from "@src/api";

import styles from "./Login.scss";

const Login = (props) => {
  const [inputData, setInputData] = React.useState({});
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const history = useHistory();

  const handleChange = (key, value) => {
    const data = { ...inputData, [key]: value };
    setInputData(data);
  };

  const handleSign = () => {
    setButtonLoading(true);

    try {
      firebase_auth
        .signInWithEmailAndPassword(inputData.email, inputData.pass)
        .then((data) => {
//  console.log("user data", data)

 API.get_user_login_details({email:inputData.email})
 .then((response) => {
  // console.log("success", response)

   if (response.success === 1) {
localStorage.setItem(
            "imaAdmin-fbUserId",
            JSON.stringify(response.user.fbuid)
          );
          localStorage.setItem( "user_id",JSON.stringify(response.user.id));

          history.push("/users");
          setButtonLoading(false);

   } else {
     notification.error({
       message: "Something went wrong",
       placement: "bottomRight",
     });
   }
 })
 .catch((ex) => {
   notification.error({
     message: ex,
     placement: "bottomRight",
   });
 });
        })
        .catch((ex) => {
          message.error(ex.message);
          setButtonLoading(false);
        });
    } catch (ex) {
      message.error(ex.message || "Unable to login");
      setButtonLoading(false);
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.LoginLogo}>
        <IMALogo />
      </div>

      <div className={styles.LoginContent}>
        <div className={styles.LoginInput}>
          <div className={styles.LoginInputLabel}>Email</div>
          <Input
            placeholder="Enter Email"
            onChange={(e) => handleChange("email", e.target.value)}
            className={styles.LoginInputText}
          />
        </div>

        <div className={styles.LoginInput}>
          <div className={styles.LoginInputLabel}>Password</div>
          <Input.Password
            placeholder="Enter Password"
            onChange={(e) => handleChange("pass", e.target.value)}
            className={styles.LoginInputText}
          />
        </div>
      </div>

      <Button type="primary" onClick={handleSign} loading={buttonLoading}>
        Login
      </Button>

      <div className={styles.LoginFooter}>
        © 2021 
        <a href="https://www.hozap.com/" target="_blank">
          <HozapLogo />
        </a>
      </div>
    </div>
  );
};

export default Login;

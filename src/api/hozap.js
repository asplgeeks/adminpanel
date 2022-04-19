const BASE_URL = "http://localhost:3038/";

/**
 * Hozap APIs
 */
class HozapAPI {
  /**
   * Gets users data
   */
  async getUserData() {
    const endpoint = "userData";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }

  /**
   * Gets Location data
   */
  async getLocationData() {
    const endpoint = "locationData";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }

  /**
   * Gets Device Info
   */
  async getDeviceInfo() {
    const endpoint = "deviceInfo";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }

  /**
   * Gets Local Data
   */
  async getLocalData() {
    const endpoint = "someData";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }

  /**
   * Sets Local Data
   * @param localData data which will be set locally
   */
  async setLocalData(localData) {
    const endpoint = "someData";
    const url = BASE_URL + endpoint;
    const req = await fetch(url, "POST", localData);
    const response = await req.json();
    return response;
  }

  /**
   * Logout
   */
  async logout() {
    const endpoint = "logout";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }

  /**
   * Share
   */
  async share(content) {
    const endpoint = "share";
    const url = BASE_URL + endpoint;
    const req = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        content: content,
      }),
    });
    const response = await req.json();
    return response;
  }

  /**
   * subscribeToNotification
   */
  async subscribeToNotification(channel) {
    const endpoint = "notificationTopicSubscribe";
    const url = BASE_URL + endpoint;
    const req = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ topic: channel }),
    });
    const response = await req.json();
    return response;
  }

  async refreshToken() {
    const endpoint = "refreshToken";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.text();
    return response;
  }

  /**
   * fullScreenAPI
   */
  async fullScreenAd() {
    const endpoint = "fullScreenAdd";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }

  /**
   * bannerAdd
   */
  async bannerAd() {
    const endpoint = "bannerAdd";
    const url = BASE_URL + endpoint;
    const req = await fetch(url);
    const response = await req.json();
    return response;
  }
}

export default HozapAPI;

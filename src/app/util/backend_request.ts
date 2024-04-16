import { sendRequest } from "./http_request";
import { RequestMethod } from "./request_method";
import { requestRoutes } from "./request_routes";

var requestMethod = new RequestMethod();
var routes = new requestRoutes();

export async function isUserLoginValid(username: string, password: string): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlAccountService}${routes.userLoginApi}`;

  var body = {
    username: username,
    password: password
  }

  await sendRequest(requestMethod.post, url, JSON.stringify(body), false).then((value) => {
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}

export async function getAppVersion(): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlAccountService}${routes.appVersionApi}`;
  url = `${url}/Consumer`;

  await sendRequest(requestMethod.get, url, "", false).then((value) => {
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}

export async function getCategories(): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlAccountService}${routes.categoriesApi}`;

  await sendRequest(requestMethod.get, url, "", false).then((value) => {
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}

export async function getConsumerList(): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlAccountService}${routes.consumerListApi}`;
  url = url + "/0/0/50?status=0";

  await sendRequest(requestMethod.get, url, "", true).then((value) => {
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}

export async function getItemGroup(): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlGSO}${routes.itemGroupApi}`;

  await sendRequest(requestMethod.get, url, "", true).then((value) => {
    console.log(value);
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}

export async function getItemType(): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlGSO}${routes.itemTypeApi}`;

  await sendRequest(requestMethod.get, url, "", true).then((value) => {
    console.log(value);
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}

export async function getBookingList(): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;
  var dateFrom = '2022-04-01';
  var dateTo = '2022-04-07';
  var status = '0';
  var minResult = '0';
  var maxResult = '50';
  var clientId = '0';
  var merchantId = '0';

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  var url: string = `${routes.baseUrlBookingService}${routes.bookingListApi}`;
  url = `${url}/${dateFrom}/${dateTo}/${status}/${maxResult}/${minResult}/${clientId}/${merchantId}`;

  await sendRequest(requestMethod.get, url, "", true).then((value) => {
    if (value.get("resultEnum") == "Success") {
      resolveRef(value.get("resultObject"));
    } else {
      resolveRef(value.get("resultMessage"));
    }
  });
  return dataPromise;
}
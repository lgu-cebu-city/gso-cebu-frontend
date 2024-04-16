const axios = require('axios');
var token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOGQ5NDFhYy00MGM3LTQ0MTAtOWEzNC02MzJiYjBkMTBiMzciLCJzdWIiOiI2MzkxOTgyODY2MTciLCJlbWFpbCI6Impob25jZWUyMDE4QGdtYWlsLmNvbSIsImlkIjoiZDhkOTQxYWMtNDBjNy00NDEwLTlhMzQtNjMyYmIwZDEwYjM3IiwidXNlck5hbWUiOiIiLCJyb2xlZGVzY3JpcHRpb24iOiIiLCJuYmYiOjE2NDQwMTIxMTgsImV4cCI6MTY3NTExNjExOCwiaWF0IjoxNjQ0MDEyMTE4LCJpc3MiOiJodHRwczovL3Bhc3NhZm9vZC5jbyIsImF1ZCI6IjVzam1ocWpnNzRpMjZtdGtiODhiYWFvbDdzIn0.1KFQz_Un-HrZct366G-WNXJBWaNeiPN9sSWDuZPDeQU";

export async function sendRequest(_method: string, _url: string, body: any = "", isTokenRequired: boolean = true) : Promise<any> {
  var retVal: Map<string, any>;
  var accessToken: string;
  accessToken = "";
  // bool _isTokenValid = false;
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  if (isTokenRequired) {
    accessToken = token;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': accessToken
  }

  if (body != "") {
    body = JSON.parse(body);
  }

  await execute(_url, headers, body, _method).then((response) => {
    if (response.status == 200 || response.status == 400) {
      retVal = new Map<string, any>([
        ["resultEnum", response.data["resultEnum"]],
        ["resultMessage", response.data["resultMessage"]],
        ["resultObject", response.data["resultObject"]]
      ]);
      resolveRef(retVal);
    } else {
      retVal = new Map<string, any>([
        ["resultEnum", "Fail"],
        ["resultMessage", "Request failed."]
      ]);
      resolveRef(retVal);
    }
  });

  return dataPromise;
}

async function execute(_url: string, headers: any, body: any, _method: string): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });
  switch (_method) {
    case "Post":
      await postRequest(_url,
        headers,
        body).then((value) => {
          resolveRef(value);
        });
      break;
    case "Put":
      await putRequest(_url,
        headers,
        body).then((value) => {
          resolveRef(value);
        });
      break;
    case "Patch":
      await patchRequest(_url,
        headers,
        body).then((value) => {
          resolveRef(value);
        });
      break;
    case "Delete":
      await deleteRequest(_url,
        headers).then((value) => {
          resolveRef(value);
        });
      break;
    case "Get":
      await getRequest(_url,
        headers).then((value) => {
          resolveRef(value);
        });
      break;
  }

  return dataPromise;
}

async function getRequest(url: string, headers: any): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });
  await axios.get(
    url,
    {headers: headers}
  ).then((res: any) => {
      resolveRef(res);
    }).catch((err: any) => {
      console.error(err);
    });
  
  return dataPromise;
}

async function postRequest(url: string, headers: any, body: any): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });
  await axios.post(
    url,
    body, 
    {headers: headers}
  )
    .then((res: any) => {
      resolveRef(res);
    }).catch((err: any) => {
      console.error(err);
    });

  return dataPromise;
}

async function putRequest(url: string, headers: any, body: any): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;

  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });
  await axios.put(
    url, 
    body, 
    {headers: headers}
  )
    .then((res: any) => {
      resolveRef(res);
    }).catch((err: any) => {
      console.error(err);
    });

  return dataPromise;
}

async function patchRequest(url: string, headers: any, body: any): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;
  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  await axios.patch(
    url, 
    body, 
    {headers: headers}
  )
    .then((res: any) => {
      resolveRef(res);
    }).catch((err: any) => {
      console.error(err);
    });

  return dataPromise;
}

async function deleteRequest(url: string, headers: any): Promise<any> {
  let resolveRef: any;
  let rejectRef: any;
  let dataPromise: Promise<void> = new Promise((resolve, reject) => {
    resolveRef = resolve;
    rejectRef = reject;
  });

  await axios.delete(
    url,
    {headers: headers}
  )
    .then((res: any) => {
      resolveRef(res);
    }).catch((err: any) => {
      console.error(err);
    });

  return dataPromise;
}
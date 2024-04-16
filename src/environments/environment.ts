// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "localhost",
  serverApiUrl: "localhost",
  budgetApiPort: "3005",
  hrApiPort: "3007",
  apiPort: "3000",
  apiVersion: "v1",
  systemName: "Procurement System",

  budgetAPIKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInJvbGUiOjIsImlhdCI6MTY3NjI0MjM3NiwiZXhwIjoxNjkxNzk0Mzc2fQ.5qY33r_iwCLBAs8iXbWp79d9WL2wyV4RFhtmn1tWhpE",

  province: "Cebu",
  lgu: "Cebu City",

  firstLoad: "List", // "Entry/List"
  paramAmount: 5000,

  gsoDeptId: 'id6',

  cityMayorPositionId: "f939ee9c-e0aa-4be2-8662-c3a87adf8a57",
  cityTreasurerPositionId: "bca2eb39-d215-4096-8c28-dc93ac272746",
  cityAccountantPositionId: "3c51e711-85fc-448c-8667-fe826bb37512",
  cityBudgetPositionId: "b1434028-2ff7-4f4d-b540-5cf85e5c06dd",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

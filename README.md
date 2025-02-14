# Billing and Staff Management Web App


[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=medaminecheikh_front_administrationv2)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=medaminecheikh_front_administrationv2&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=medaminecheikh_front_administrationv2)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=medaminecheikh_front_administrationv2&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=medaminecheikh_front_administrationv2)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=medaminecheikh_front_administrationv2&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=medaminecheikh_front_administrationv2)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=medaminecheikh_front_administrationv2&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=medaminecheikh_front_administrationv2)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=medaminecheikh_front_administrationv2&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=medaminecheikh_front_administrationv2)


## About

The **Billing Web App** is designed to streamline billing operations and manage staff effectively. It features two primary user roles:
1. **Manager:** Oversee accounts, assign access, and manage staff.
2. **Employee:** Handle billing tasks efficiently through a dedicated dashboard.

---

## Features

### Manager Dashboard
- **Account Management:** Create, update, or delete user accounts.
- **Access Control:** Grant permissions to other accounts.
- **Activity Monitoring:** Track staff activities and billing performance.

### Employee Dashboard
- **Billing Management:** Manage bills by adding, updating, or tracking their status.
- **Task View:** View assigned tasks and completed billing history.

---

## Tech Stack
- **Frontend:** Angular
- **Backend:** Spring Boot (Microservices Architecture)
- **Authentication:** JWT (JSON Web Token)
- **Database:** PostgreSQL

---

## Interfaces

### Login Page
![Login](src/assets/realisation/loginError.png)


### Billing Management
![Billing Management](src/assets/realisation/creeFacture.png)
![Billing Management](src/assets/realisation/fairePaiement.png)
![Billing Management](src/assets/realisation/infoRechecheEnc.png)

### Manager Dashboard
![Manager Dashboard](src/assets/realisation/dashadmin.png)

### Employee Dashboard
![Employee Dashboard](src/assets/realisation/dashemp.png)

### Account Management
![Account Management](src/assets/realisation/CreeUserError.png)
![Account Management](src/assets/realisation/CreeProfil.png)
![Account Management](src/assets/realisation/searchupdateUser.png)

### Activities Logs
![Management](src/assets/realisation/TraceEncais.png)
![Management](src/assets/realisation/TraceFacture.png)



---


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

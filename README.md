# Project Management App

## Table of contents

-   [About this project](#about)
-   [Background](#background)
-   [Used framewoks and libraries](#frameworks-libraries)
    -   [Frontend](#frontend)
    -   [Backend](#backend)
-   [How to run project locally](#install)
-   [Deployment](#deployment)
-   [Future code development](#future-dev)
-   [Authors](#authors)

## About this project<a name="about"></a>

Fullstack project management application with multiuser features such as rich text editor, kanban board and calendar.

<div align="center">
    <img src="/frontend/src/assets/screenshots/ProjectManagerApp.png" width="600px"</img>
</div>

## Background<a name="background"></a>

This project was made as group project that was part of Buutti Trainee Academy's program. The purpose of this project is to familiarize ourselves with the learned consepts and showcase our skills.

## Used frameworks and libraries<a name="frameworks-libraries"></a>

### Frontend:<a name="frontend"></a>
[Vite](https://vitejs.dev/), TypeScript [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), [Redux Persist](https://www.npmjs.com/package/redux-persist), [React Router](https://reactrouter.com/en/main), [React Hook Form](https://react-hook-form.com/), [yup](https://www.npmjs.com/package/yup), [Yjs](https://yjs.dev/), [React Calendar](https://www.npmjs.com/package/react-calendar), [date-fns](https://date-fns.org/), [Tiptap](https://tiptap.dev/), [dnd-kit](https://dndkit.com/), [Feather icons](https://feathericons.com/), [ESLint](https://eslint.org/), [Docker](https://www.docker.com/)

### Backend:<a name="frontend"></a>
TypeScript, [Node](https://nodejs.org/en), [tsx](https://www.npmjs.com/package/tsx), [Express](https://www.npmjs.com/package/express), [express-session](https://www.npmjs.com/package/express-session), [argon2](https://www.npmjs.com/package/argon2), [PostgreSQL](https://www.npmjs.com/package/postgresql), [Prisma](https://www.npmjs.com/package/prisma), [yup](https://www.npmjs.com/package/yup), [redis](https://www.npmjs.com/package/redis), hocuspocus, [ESLint](https://eslint.org/), [Docker](https://www.docker.com/), [supertest](https://www.npmjs.com/package/supertest), [vitest](https://www.npmjs.com/package/vitest)

## How to run project locally<a name="install"></a>

To run only database in docker run following command:

````
copy .env.example to .env
docker-compose up --build
````

and start backend on ./backend by following command:

````
npm install
npm run dev
````

## Deployment<a name="deployment"></a>

Project Manager App is deployed to Microsoft Azure: Cloud Computing Services.

Link to project: https://projektimanageri.azurewebsites.net/

## Future code development <a name= "future-dev"></a>

The source code can be developed over time to handle new features. The following is a list of potential feature enhancements:

-   Password recovery and email authentication.
-   Chat
-   Ability to share projects to guests
-   Dark theme

## Authors<a name="authors"></a>

- [Harri Nieminen](https://github.com/Moiman)
- [Jani Myllymaa](https://github.com/Jambo258)
- [Katariina Ruotsalainen](https://github.com/bkruotsalainen)
- [Suvi Sulonen](https://github.com/susulone)
- [Tommi Tyni](https://github.com/TTyni)

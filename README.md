``````
                              \\\\\\\
                            \\\\\\\\\\\\
                          \\\\\\\\\\\\\\\         ** README **
  -----------,-|           |C>   // )\\\\|
           ,','|          /    || ,'/////|
---------,','  |         (,    ||   /////
         ||    |          \\  ||||//''''|
         ||    |           |||||||     _|
         ||    |______      `````\____/ \
         ||    |     ,|         _/_____/ \
         ||  ,'    ,' |        /          |
         ||,'    ,'   |       |         \  |
_________|/    ,'     |      /           | |
_____________,'      ,',_____|      |    | |
             |     ,','      |      |    | |
             |   ,','    ____|_____/    /  |
             | ,','  __/ |             /   |
_____________|','   ///_/-------------/   |
              |===========,'
``````

## Docker Services:

| Container | Purpose                                                           |
| --------- | ----------------------------------------------------------------- |
| `app`     | The Next.js app, both front-end and back-end.                     |
| `db`      | Postgresql database.                                              |
| `minio`   | [Minio](https://min.io/), for storing image files, simulating s3. |
| `studio`  | DB admin tool that works with Prisma.                             |

## Build & Run

Make sure [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) are installed. Note that environment variables are defined in `.env`. **You should set these vars, like `PROJECT_NAME`, to appropriate values before running.** To run, just do...

```sh
docker-compose up
# or `docker-compose up -d` to run in the background.
```

When all services are up, you can visit the URLS below. **Use an incognito window to avoid conflicts with browser extensions.**

| URL                                              | Service                       |
| ------------------------------------------------ | ----------------------------- |
| [`http://localhost:3000`](http://localhost:3000) | The app                       |
| [`http://localhost:5555`](http://localhost:5555) | Prisma Studio (DB management) |

## Database Management

The database is managed by [Prisma](https://www.prisma.io/). Tables, relationships, etc. are defined in `schema.prisma`. Prisma auto-generates the typescript client and database migrations from this file. _Note: the typescript client and database schema is auto-migrated when restarting the_ `nextjs` _Docker container via_ `docker restart nextjs`.

### DB-related Yarn Commands:

Note: Yarn commands must be run from inside the `app` container.

| Command                    | Function                                                |
| -------------------------- | ------------------------------------------------------- |
| `yarn run prisma:generate` | Generate prisma typescript client from `schema.prisma`. |
| `yarn run prisma:reset`    | Clear and rebuild database from `schema.prisma`.        |
| `yarn run prisma:push`     | Update existing database from `schema.prisma`.          |

## Developing in Next.js

Next.js contains both front-end and back-end logic. To understand the layout of a Next.js project, please refer to the [_Getting Started_ guide](https://nextjs.org/docs/getting-started) on their website.

### Middleware

Middleware is defined in `lib/middleware.ts`. Here's an example showing how to use middleware in an endpoint:

```typescript
export default nc<Request, Response<Data>>()
  .use(withSession)   // <-- middleware
  .use(withPrisma)    // <-- middleware
  .get(async (req: Request, res: Response<Data>) => {
    const userId = req.query.id;
    if (userId && (req.session!.user?.id === userId)) {
      const user = req.prisma!.getUserById(userId);
      res.status(200).json(user);
    } else {
      res.status(404).end("user not found")
    }
  }
```

#### Available Middlewares

| Middleware           | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `withMinio`          | Sets Minio client on request as `req.minio?`.              |
| `withPrisma`         | Sets Prisma client on request as `req.prisma?`.            |
| `withSession`        | Sets NextAuth session on request as `req.session?`.        |
| `withBodyValidation` | Specifies JSON schema to use when validating request body. |

### Authentication & Authorization

Auth endpoints are served from and configured in `pages/api/auth/[...nextauth].ts`, using [NextAuth](https://next-auth.js.org/). To log in using the built-in "password-less" login, naviate to `/api/auth/signin`.

#### Password-less Login

In order to use password-less login, you must set the following two secret environment variables, which allow the system to send emails via [Mailgun](https://www.mailgun.com/):

- `MAILGUN_API_KEY`
- `MAILGUN_API_DOMAIN`.

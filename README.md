# Backend Assignment -- Pxlhut

This is a ReST API demonstrating user authentication and PGW integration.

## Setup

```bash
sudo chmod u+x ./tasks/*.sh
```

## Start

```bash
./tasks/0.start.sh
```

Now, send requests as shown in all the `.http` files inside the [`tasks`](./tasks) directory. Make sure to replace `access_token`s and `refresh_token`s wherever necessary.

<!-- > If you wanna look into the application container and see what's happening in there, run `docker container attach pxlhut`. -->

## Stop

```bash
./tasks/9.stop.sh
```

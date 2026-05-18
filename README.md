# Build-A-Bearville Rewritten - Register Page Gateway

Gateway for the registration page of Build-A-Bearville Rewritten.

<details>
    <summary>
        <strong>Table of contents</strong>
        (click to open)
    </summary>

- [Requirements](#requirements)
    - [Plugins for development](#plugins-for-development)
- [Installation](#installation)
    - [Using Node.js](#using-nodejs)
        - [For development](#for-development)
</details>

## Requirements

- **[Node.js](https://nodejs.org/en/) -** Version 24.11.1 or higher
- **[PNPM](https://pnpm.io/) -** Version 11.1.3 or higher
- **Environment variables**

    - **Backend**

        | Variable                 | Type    | Description                                      | Required | Default       | Example       |
        |--------------------------|---------|--------------------------------------------------|----------|---------------|---------------|
        | `ALLOWED_REDIRECT_HOSTS` | String  | A comma-separated list of allowed redirect hosts | No       | `localhost`   | `example.com` |
        | `PORT`                   | String  | The port where the server will run on            | No       | `3000`        | `443`         |
        | `SHOULD_ENFORCE_HTTPS`   | Boolean | Whether to enforce HTTPS for redirect endpoints  | No       | `false`       | `true`        |

### Plugins for development

- **[EditorConfig](https://editorconfig.org/)**
- **[ESLint](https://eslint.org/)**
- **[Prettier](https://prettier.io/)**

## Installation

Before installing, it's highly recommended to execute the commands
in this guide from the root directory of the repository.

### Using Node.js

#### For development

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. Since this project uses workspaces,
   you can run scripts from the root directory using the command
   `pnpm run --filter babvr-registration-page-<package-name> <script>`.

    In this order of ideas, you can run the following commands:

    - `pnpm run --filter babvr-registration-page-frontend dev`
      to start the client
    - `pnpm run --filter babvr-registration-page-backend dev`
      to start the server

If you prefer, you can start the backend and frontend separately.
To do so, you can run the following commands:

- `pnpm run --filter babvr-registration-page-frontend dev`
  to start the client
- `pnpm run --filter babvr-registration-page-backend start`
  to start the server

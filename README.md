<p align="center">
  <picture>
    <source srcset="https://public-files.gumroad.com/logo/gumroad-dark.svg" media="(prefers-color-scheme: dark)">
    <source srcset="https://public-files.gumroad.com/logo/gumroad.svg" media="(prefers-color-scheme: light)">
    <img src="https://public-files.gumroad.com/logo/gumroad.svg" height="100" alt="Gumroad logo">
  </picture>
</p>

<p align="center">
  <strong>Sell your stuff. See what sticks.</strong>
</p>

<p align="center">
  <a href="https://gumroad.com">Gumroad</a> is an e-commerce platform that enables creators to sell products directly to consumers. This repository contains the source code for the Gumroad web application.
</p>

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Development](#development)
  - [Logging in](#logging-in)
  - [Resetting Elasticsearch indices](#resetting-elasticsearch-indices)
  - [Push Notifications](#push-notifications)
  - [Common Development Tasks](#common-development-tasks)
  - [Linting](#linting)

## Getting Started

### Prerequisites

---

## For Windows: Enable Long Paths in Git

Before cloning the repository, run this in **Powershell (Admin)** to avoid long file path errors:

```bash
git config --system core.longpaths true
````

## Install WSL and Ubuntu

1. Open **PowerShell as Administrator** and run:

```bash
wsl --install
```

2. Reboot your system if prompted.

3. After restart, set up **Ubuntu** by choosing a username (not `root`) and password.

4. Once installed, always launch **Ubuntu (not PowerShell or CMD)** for all development work.

5. Switch into your non-root user:

```bash
su - your_username


---


Before you begin, ensure you have the following installed:

#### Ruby

- https://www.ruby-lang.org/en/documentation/installation/
- Install the version listed in [the .ruby-version file](./.ruby-version)
- For Windows:
Install the version specified in `.ruby-version` (e.g. 3.4.3). Recommended: use a version manager like `rbenv`.

```bash
sudo apt install rbenv ruby-build
rbenv install 3.4.3
rbenv global 3.4.3
```

#### Node.js

- https://nodejs.org/en/download
- Install the version listed in [the .node-version file](./.node-version)

#### Docker

We use Docker to setup the services for development environment.

- For MacOS: Download the Docker app from the [Docker website](https://www.docker.com/products/docker-desktop)
- For Linux:

```bash
sudo wget -qO- https://get.docker.com/ | sh
sudo usermod -aG docker $(whoami)
```
- For Windows:
1. Download and install Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

2. Open Docker → Click ⚙️ (Settings) → **Resources > WSL Integration**

3. Enable integration for your Ubuntu distribution.

4. Ensure Docker Desktop is running and shows **"Engine running"** at the bottom left.

#### MySQL & Percona Toolkit

Install a local version of MySQL 8.0.x to match the version running in production.

The local version of MySQL is a dependency of the Ruby `mysql2` gem. You do not need to start an instance of the MySQL service locally. The app will connect to a MySQL instance running in the Docker container.

- For MacOS:

```bash
brew install mysql@8.0 percona-toolkit
brew link --force mysql@8.0

# to use Homebrew's `openssl`:
brew install openssl
bundle config --global build.mysql2 --with-opt-dir="$(brew --prefix openssl)"

# ensure MySQL is not running as a service
brew services stop mysql@8.0
```

- For Linux:
  - MySQL:
    - https://dev.mysql.com/doc/refman/8.0/en/linux-installation.html
    - `sudo apt install libmysqlclient-dev`
  - Percona Toolkit: https://www.percona.com/doc/percona-toolkit/LATEST/installation.html

- For Windows(Run in Ubuntu Terminal)
  - MySQL: 
    - https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html
    - `sudo apt install libmysqlclient-dev mysql-client`
  - Percona Toolkit: https://www.percona.com/doc/percona-toolkit/LATEST/installation.html

#### Image Processing Libraries
- For Windows:
Run the following in your Ubuntu terminal:

```bash
sudo apt update && sudo apt install build-essential libxslt-dev libxml2-dev imagemagick libvips-dev ffmpeg pdftk
```

This will install all the below libraries needed for image processing and PDF stamping
##### ImageMagick

We use `imagemagick` for preview editing.

- For MacOS: `brew install imagemagick`
- For Linux: `sudo apt-get install imagemagick`

##### libvips

For newer image formats we use `libvips` for image processing with ActiveStorage.

- For MacOS: `brew install libvips`
- For Linux: `sudo apt-get install libvips-dev`

#### FFmpeg

We use `ffprobe` that comes with `FFmpeg` package to fetch metadata from video files.

- For MacOS: `brew install ffmpeg`
- For Linux: `sudo apt-get install ffmpeg`

#### PDFtk

We use [pdftk](https://www.pdflabs.com/tools/pdftk-server/) to stamp PDF files with the Gumroad logo and the buyers' emails.

- For MacOS: Download from [here](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg)
  - **Note:** pdftk may be blocked by Apple's firewall. If this happens, go to Settings > Privacy & Security and click "Open Anyways" to allow the installation.
- For Linux: `sudo apt-get install pdftk`

### Installation

#### Bundler and gems

We use Bundler to install Ruby gems.

```shell
gem install bundler
```

Configure Bundler to install gems without production or staging dependencies by default:

```shell
bundle config --local without production staging
```

Install gems:

```shell
bundle install
```

Also make sure to install `dotenv` as it is required for some console commands:

```shell
gem install dotenv
```

#### npm and Node.js dependencies

Make sure the correct version of `npm` is enabled:

```shell
corepack enable
```

Install dependencies:

```shell
npm install
```

### Configuration

#### Set up Custom credentials

App can be booted without any custom credentials. But if you would like to use services that require custom credentials (e.g. S3, Stripe, Resend, etc.), you can copy the `.env.example` file to `.env` and fill in the values.

#### Local SSL Certificates

1. Install mkcert on macOS:

```shell
brew install mkcert
```

For other operating systems, see [mkcert installation instructions](https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation).

2. Generate certificates by running:

```shell
bin/generate_ssl_certificates
```

- For Windows:
1. Run this in the Ubuntu terminal-
```shell
sudo apt install libnss3-tools
```
Then run -
```shell
mkcert -install
```

2. Then generate certificates by running-
```shell
bin/generate_ssl_certificates
```

### Running Locally

## For Windows:

1. Start Docker (ensure it's showing **Engine Running**)

2. Open Ubuntu terminal as your non-root user.

3. Start services in detached mode:

```bash
LOCAL_DETACHED=true make local
```

4. In a **new terminal**:

```bash
sudo apt install libxslt-dev libxml2-dev
bin/rails db:prepare
bin/dev
```

## For MAC and Linux:
#### Start Docker services

If you installed Docker Desktop (on a Mac or Windows machine), you can run the following command to start the Docker services:

```shell
make local
```

If you are on Linux, or installed Docker via a package manager on a mac, you may have to manually give docker superuser access to open ports 80 and 443. To do that, use `sudo make local` instead.

This command will not terminate. You run this in one tab and start the application in another tab.
If you want to run Docker services in the background, use `LOCAL_DETACHED=true make local` instead.

#### Set up the database

```shell
bin/rails db:prepare
```

For Linux (Debian / Ubuntu) you might need the following:

- `apt install libxslt-dev libxml2-dev`

#### Start the application

```shell
bin/dev
```

This starts the Rails server, the JavaScript build system, and a Sidekiq worker.

You can now access the application at `https://gumroad.dev`.

## Development

### Logging in

You can log in with the username `seller@gumroad.com` and the password `password`. The two-factor authentication code is `000000`.

Read more about logging in as a user with a different team role at [Users & authentication](docs/users.md).

### Resetting Elasticsearch indices

You will need to explicitly reindex Elasticsearch to populate the indices after setup, otherwise you will see `index_not_found_exception` errors when you visit the dev application. You can reset them using:

```ruby
# Run this in a rails console:
DevTools.delete_all_indices_and_reindex_all
```

### Push Notifications

To send push notifications:

```shell
INITIALIZE_RPUSH_APPS=true bundle exec rpush start -e development -f
```

### Common Development Tasks

#### Rails console:

```shell
bin/rails c
```

#### Rake tasks:

```shell
bin/rake task_name
```

### Linting

We use ESLint for JS, and Rubocop for Ruby. Your editor should support displaying and fixing issues reported by these inline, and CI will automatically check and fix (if possible) these.

If you'd like, you can run `git config --local core.hooksPath .githooks` to check for these locally when committing.

## Important Tips For Windows :

*  **Don't use PowerShell, CMD, or Git Bash** for development. Use **WSL Ubuntu only**.
*  Use `Ruby 3.4.3` as specified in the `.ruby-version` file.
*  If `bin/dev` fails due to port `:8080` being occupied (usually by anycable), kill the process:

```bash
sudo lsof -i :8080
kill -9 <PID>
```

* 🌐 Visit the app at [https://app.gumroad.dev](https://app.gumroad.dev)

---

## 🛑 Dealing with HTTPS/Privacy Issues

* Chrome might block access with **"Your connection is not private"**:

  * Click anywhere on the page and type: `thisisunsafe`

* If Chrome auto-forces `https` and breaks dev, clear HSTS:

  * Go to `chrome://net-internals/#hsts`
  * Under **Delete domain security policies**, enter `gumroad.dev` and click **Delete**.

---

## 🧭 /etc/hosts Setup

Make sure this is in your `/etc/hosts`:

```bash
127.0.0.1 gumroad.dev
```

Use:

```bash
sudo nano /etc/hosts
```

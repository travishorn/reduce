# Reduce

Simple reddit viewer.

## Installation

Clone the Git repository.

```
git clone http://github.com/travishorn/reduce.git
```

Install the dependencies.

```
cd reduce
npm install
```

Sign up for a reddit API key

1. Visit https://www.reddit.com/prefs/apps
2. Click the **create an app...** button
3. Enter a name (such as "Reduce")
4. Make sure **web app** is selected
5. Under **redirect uri**, enter `http://127.0.0.1:3000/reddit-auth-callback`

Create a `.env` file in the project's root directory with the following
contents.

```
PORT=3000
REDDIT_CLIENT_ID=[your reddit app's client ID]
REDDIT_SECRET=[your reddit app's secret]
```

## Usage

```
node index
```

Local server will be listening on port 3000. Visit http://127.0.0.1:3000. If
you haven't authorized the app with reddit yet, you'll be redirected to reddit's
authorization page for this app.

## Linting

Any files with extension `.js` can be linted against ESLint and Prettier
recommended rules.

```
npm run lint
```

You can automatically fix some problems.

```
npm run lint:fix
```

## License

Copyright 2019 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

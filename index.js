require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const session = require("cookie-session");
const request = require("request");
const pkg = require("./package.json");

const userAgent = `${pkg.name}/${pkg.version}`;

const app = express();

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(
  session({
    name: "session",
    keys: ["hello"],
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
);

const getHome = (req, res) => {
  if (!req.session.redditAccessToken) {
    req.session.redditState = crypto.randomBytes(8).toString("hex");

    res.redirect(
      `https://www.reddit.com/api/v1/authorize?client_id=${
        process.env.REDDIT_CLIENT_ID
      }&response_type=code&state=${
        req.session.redditState
      }&redirect_uri=http://localhost:3000/reddit-auth-callback&duration=permanent&scope=read`
    );
  } else {
    request.get(
      "https://oauth.reddit.com/",
      {
        headers: {
          "User-Agent": userAgent
        },
        auth: {
          bearer: req.session.redditAccessToken
        }
      },
      (err, redditHomepageResponse) => {
        const parsedBody = JSON.parse(redditHomepageResponse.body);
        const parsedData = parsedBody.data;

        if (parsedBody.error && parsedBody.error === 401) {
          request.post(
            "https://www.reddit.com/api/v1/access_token",
            {
              form: {
                grant_type: "refresh_token",
                refresh_token: req.session.redditRefreshToken
              }
            },
            (err, redditRefreshResponse) => {
              const { access_token, refresh_token } = JSON.parse(
                redditRefreshResponse.body
              );

              req.session.redditAccessToken = access_token;
              req.session.redditRefreshToken = refresh_token;
              getHome(req, res);
            }
          );
        } else {
          const listing = parsedData.children.map(post => {
            const p = post.data;

            return {
              url: p.url,
              title: p.title,
              permalink: p.permalink,
              num_comments: p.num_comments,
              subreddit: p.subreddit,
              domain: p.domain,
              preview: p.preview,
              selftext: p.selftext
            };
          });

          res.render("home", {
            listing,
            after: parsedData.after
          });
        }
      }
    );
  }
};

app.get("/", getHome);

app.get("/reddit-auth-callback", (req, res) => {
  if (req.query.state !== req.session.redditState) {
    res.status("400");
    res.send("Mismatched state");
  } else {
    request.post(
      "https://www.reddit.com/api/v1/access_token",
      {
        auth: {
          user: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_SECRET
        },
        form: {
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: "http://localhost:3000/reddit-auth-callback"
        }
      },
      (err, redditAccessTokenResponse) => {
        const { access_token, refresh_token } = JSON.parse(
          redditAccessTokenResponse.body
        );

        req.session.redditAccessToken = access_token;
        req.session.redditRefreshToken = refresh_token;

        res.redirect("/");
      }
    );
  }
});

app.listen(process.env.PORT, () => {
  process.stdout.write(
    `Reduce server listening on port ${process.env.PORT}.\n`
  );
});

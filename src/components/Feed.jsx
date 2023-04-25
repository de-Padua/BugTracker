import React, { useState, useEffect } from "react";
import { UserAuth } from "../global-context/firebase-context";
import NoIssuesFound from "./issues-components/NoIssuesFound";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const { getFeed } = UserAuth();
  const { getTeamIssuesDB } = UserAuth();
  const { getClosedIssues } = UserAuth();

  const [feed, setFeed] = useState([]);
  const [issue, setIssue] = useState({});
  const [teamIssuesFeed, setTeamIssuesFeed] = useState([]);
  const [closedIssue, setClosedIssues] = useState([]);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  const getFeedF = async () => {
    getFeed().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      console.log(data);
      setFeed(data);
      setLoad(true);
    });
  };
  const getTeamISSUES2 = async () => {
    getTeamIssuesDB().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setTeamIssuesFeed(data);
    });
  };
  const getClosedIssuesF = async () => {
    getClosedIssues().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setClosedIssues(data);
    });
  };

  useEffect(() => {
    getFeedF();
    getTeamISSUES2();
    getClosedIssuesF();
  }, []);
  const LoadContainer = load ? (
    <NoIssuesFound />
  ) : (
    <div className="skeleton-animation bd-txt-1 issue-body">
      <div className="skeleton-name-issue bug-name-issue ">
        <p className="skeleton-name"></p>
        <p className="skeleton-name-2"></p>
      </div>
      <div>
        <p className="skeleton-name"></p>{" "}
      </div>
      <div>
        <p className="skeleton-name-2"></p>{" "}
      </div>
      <div className="priority-issue">
        <p className="skeleton-name-1"></p>{" "}
      </div>
      <div className="todo-issue">
        <p className="skeleton-name-1"></p>{" "}
      </div>
    </div>
  );

  const getItemFromFeed = (id, action) => {
    if (action === "Created a new issue") {
      const found = teamIssuesFeed.find((item) => {
        return item.issue.id === id;
      });

      if (found === undefined) {
        alert("Issue not found");
      } else {
        setToLocalStorage(found);
        setTimeout(() => {
          navigate("/home/issue-detail");
        }, 1000);
      }
    }
    if (action === "Closed a issue") {
      const found = closedIssue.find((item) => {
        return item.issue.id === id;
      });
      setToLocalStorage(found);
      setTimeout(() => {
        navigate("/home/issue-detail-closed");
      }, 1000);
    }
  };
  const setToLocalStorage = (item) => {
    setIssue(item.issue);
  };
  useEffect(() => {
    localStorage.setItem("issue", JSON.stringify(issue));
  }, [issue]);

  return (
    <div className="feed-container">
      <h1>Feed</h1>
      {feed.length > 0
        ? feed.map((item) => {
            return (
              <div className="">
                <div
                  className={
                    item.obj.action === "Created a new issue"
                      ? "feed-item feed-item-create"
                      : item.obj.action === "Commented at a post"
                      ? "feed-item feed-item-comment"
                      : item.obj.action === "Closed a issue"
                      ? "feed-item feed-item-closed"
                      : ""
                  }
                  onClick={() => {
                    getItemFromFeed(item.obj.id, item.obj.action);
                  }}
                >
                  <div>
                    <p className="parg">
                      {item.obj.user} {item.obj.action.toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p>{item.obj.date}</p>
                  </div>
                </div>
              </div>
            );
          })
        : LoadContainer}
    </div>
  );
}

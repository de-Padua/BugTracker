import React, { useState } from "react";
import Usericon from "./icons8-user-default-64.png";
export default function IssueClosed() {
  const [issue, setIssue] = useState(
    JSON.parse(localStorage.getItem("issue")) || []
  );
  return (
    <>
      <div className="new-issue-container">
        <h1 className="closed-issue-text">This issue is closed.</h1>

        <div className="container-issue-style top-div-issue-container">
          <h1>Issue</h1>
        </div>

        <div className="top-div-new-issue">
          <div>
            <h2>ID</h2>
            <p>{issue.id}</p>
          </div>
          <div>
            <h2>Reporter</h2>
            <p>{issue.user}</p>
          </div>
          <div>
            <h2>Submission date</h2>
            <p>{issue.date}</p>
          </div>
          <div>
            <h2>Priority</h2>
            <p className={issue.priority}>{issue.priority}</p>
          </div>
          <div>
            <h2>Status</h2>
            <p>Closed</p>
          </div>
        </div>

        <div>
          <h4>Description</h4>
          {issue.description}
        </div>

        <br />

        <div>
          <h2>Comments</h2>
          {issue.coments.length > 0 ? (
            issue.coments.map((item) => {
              return (
                <div className="comment-body">
                  <div className="coment-block">
                    <div className="user-description">
                      <div className="user-picture">
                        <img src={Usericon} />
                      </div>
                      <div>
                        <p className="user-name">{item.user}</p>
                      </div>
                      <div>
                        <p>{item.date}</p>
                      </div>
                      <div></div>
                    </div>
                    <div>
                      <p className="coment">{item.comment}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h5>No comments found.</h5>
          )}
        </div>
      </div>
    </>
  );
}

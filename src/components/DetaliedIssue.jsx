import React, { useState, useEffect, useRef } from "react";
import { UserAuth } from "../global-context/firebase-context";
import uuid from "react-uuid";
import Usericon from "./icons8-user-default-64.png";
import { useNavigate } from "react-router-dom";

export default function DetaliedIssue() {
  const [issue, setIssue] = useState(
    JSON.parse(localStorage.getItem("issue")) || []
  );

  const [isEdditing, setEdditing] = useState(false);

  //current user info
  const user = UserAuth();
  const userId = user.loggedUser.uid;

  const isUserIssue =
    issue.userId === userId ? (
      <div>
        <h3>New status</h3>
        <select id="status">
          <option value="To-do">To-do</option>
          <option value="Stuck">Stuck</option>
          <option value="opel">Almost done</option>
          <option value="audi">Complete</option>
        </select>
      </div>
    ) : (
      ""
    );

  const editIssue = isEdditing ? (
    <div>{isUserIssue}</div>
  ) : (
    <div>
      <h2>Status</h2>
      <p>{issue.status}</p>
    </div>
  );

  const button =
    issue.userId === userId ? (
      <button
        className="button-svg-inside"
        onClick={() => {
          setEdditing(true);
        }}
      >
        Edit issue
      </button>
    ) : (
      ""
    );

  const button_save = isEdditing ? (
    <button
      className="button-svg-inside"
      onClick={() => {
        setEdditing(false);
      }}
    >
      Save changes
    </button>
  ) : (
    ""
  );

  const issueTitle = useRef();

  const changeName = isEdditing ? (
    <div>
      <h2>Bug name</h2>
      <input
        type="text"
        className="text-type"
        ref={issueTitle}
        defaultValue={issue.title}
      />
    </div>
  ) : (
    <div>
      <h2>Bug name</h2>
      <p>{issue.title}</p>
    </div>
  );

  const issueDescription = useRef();

  const changeIssueDescription = isEdditing ? (
    <div className="down-div-issues">
      <h2>Describe the issue</h2>
      <textarea
        className="text-area-test"
        ref={issueDescription}
        defaultValue={issue.description}
      />
    </div>
  ) : (
    <div className="down-div-issues">
      <h2>Issue description</h2>

      <p>{issue.description}</p>
    </div>
  );

  //comments logic
  const x = Date.now();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getUTCMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const complete_date = `${day}-0${month + 1}-${year} - ${hour}H-${minutes}M`;
  const userName = user.loggedUser.displayName;
  const postData = useRef();
  const currentIssueID = issue.id;
  const navigate = useNavigate();

  const { getUserDataDB } = UserAuth();
  const { updateUserDoc } = UserAuth();
  const { getTeamIssuesDB } = UserAuth();
  const { teamIssues } = UserAuth();
  const { deletComentsOnTeamIssue } = UserAuth();
  const { closeIssues } = UserAuth();
  const { deleteFromIssuesTeam } = UserAuth();

  function getNewPostData() {
    const newPostObject = {
      comment: postData.current.value,
      date: date.toLocaleString(),
      user: userName,
      userID: user.loggedUser.uid,
      id: uuid(),
    };

    if (postData.current.value === "") {
      alert("Please enter a post");
    } else {
      getUserDataDB().then((data) => {
        const found = data.find((issue) => {
          return issue.id === currentIssueID;
        });
        found.coments.unshift(newPostObject);

        getUserDataDB().then((data2) => {
          const filderedIssue = data2.filter((item) => {
            return item.id !== issue.id;
          });
          const newArr = [...filderedIssue, found];
          updateUserDoc(newArr);
          updateForm(
            user.loggedUser.displayName,
            "Commented at a post",
            date.toLocaleString(),
            issue.id,
            x.toString()
          );
          getPosts();
        });
      });

      updateOnTeamsComent(newPostObject, issue.id);
    }
  }

  const updateOnTeamsComent = (obj, id) => {
    getTeamIssuesDB().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      const found = data.find((x) => {
        return x.issue.id === id;
      });
      found.issue.coments.unshift(obj);
      setComents(found.issue.coments);
      teamIssues(found.issue, id);
      getPosts();
    });
  };

  const [comments, setComents] = useState([]);
  const [load, setLoad] = useState(false);

  const getPosts = () => {
    getTeamIssuesDB()
      .then((data) => {
        const x = data.find((item) => {
          return item.id === currentIssueID;
        });
        x.toLocaleString();
        setComents(x.coments);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //delete my coments

  const issue2 = (
    title,
    date,
    user,
    userID,
    id,
    priority,
    description,
    status,
    coments
  ) => {
    return {
      title: title,
      date: date,
      user: user,
      userId: userID,
      id: id,
      priority: priority,
      description: description,
      status: status,
      coments: coments,
    };
  };

  const deleteComment = (id) => {
    const newArr = comments.filter((item) => {
      return item.id !== id;
    });
    issue.coments = newArr;
    ////////////////////////////////
    getUserDataDB().then((data) => {
      const filderedIssue = data.filter((item) => {
        return item.id !== issue.id;
      });
      const arr2 = [...filderedIssue, issue];

      getPosts();
    });
    getTeamIssuesDB().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      const found = data.find((x) => {
        return x.issue.id === issue.id;
      });
      const filtered_arr = found.issue.coments.filter((cmt) => {
        return cmt.id !== id;
      });

      let newissue = issue2(
        found.issue.title,
        found.issue.date,
        found.issue.user,
        found.issue.userId,
        found.issue.id,
        found.issue.priority,
        found.issue.description,
        found.issue.status,
        filtered_arr
      );
      deletComentsOnTeamIssue(newissue, issue.id);
      setComents(filtered_arr);
      getPosts();
    });
  };

  useEffect(() => {
    setComents(issue.coments);
    getPosts();
  }, []);

  //close post
  const { updateForm } = UserAuth();

  const [myIssues, setMyIssues] = useState([]);
  const [closedIssue, setClosedIssue] = useState(false);
  const getMyIssues = async () => {
    getUserDataDB()
      .then((data) => {
        if (data.length > 0 || data !== undefined) {
          setLoad(true);
          setMyIssues(data);
        } else {
          setMyIssues([]);
          setLoad(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  getMyIssues();

  const closeIssueF = (issue) => {
    const filteredArray = myIssues.filter((issues) => {
      return issues.id !== issue.id;
    });

    setTimeout(() => {
      navigate("/home/issues");
    }, 1000);

    updateForm(
      user.loggedUser.displayName,
      "Closed a issue",
      date.toLocaleString(),
      issue.id,
      x.toString()
    );
    setMyIssues(filteredArray);
    updateUserDoc(filteredArray);
    closeIssues(issue, issue.id);
    deleteFromIssuesTeam(issue.id).then(getTeamIssues());
  };
  useEffect(() => {}, []);
  return (
    <>
      <div className="new-issue-container">
        <div className="container-issue-style top-div-issue-container">
          <h1>Issue</h1>
          <div className="buttons-div-issue"></div>
          {issue.userId === userId ? (
            <button
              className="button-svg-inside"
              onClick={() => {
                closeIssueF(issue);
              }}
            >
              Close issue
            </button>
          ) : (
            ""
          )}
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

          {editIssue}
        </div>
        <div>{changeIssueDescription}</div>
        <br />
        {button_save}

        <div>
          <h2>Comments</h2>
          {comments.length > 0 ? (
            comments.map((item) => {
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
                      <div>
                        {item.userID === user.loggedUser.uid ? (
                          <button
                            className="button-teste"
                            onClick={() => {
                              deleteComment(item.id);
                            }}
                          >
                            X
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="coment">{item.comment}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h5>No comments yet</h5>
          )}
          <hr />
          <h2>Add a comment</h2>
          <div className="coment-block">
            <div className="user-description">
              <div className="user-picture">
                <img src={Usericon} />
              </div>

              <div>
                <p className="user-name">{user.loggedUser.displayName}</p>
              </div>
            </div>
            <div>
              <textarea className="block-of-coment" ref={postData}></textarea>
            </div>
            <div>
              <button
                className="comment-button button-svg-inside"
                onClick={() => {
                  getNewPostData();
                  getPosts();
                  postData.current.value = "";
                }}
              >
                Post comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

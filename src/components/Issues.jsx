import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../global-context/firebase-context";
import NoIssuesFound from "./issues-components/NoIssuesFound";
8;
export default function Issues() {
  const navigate = useNavigate();
  const { getUserDataDB } = UserAuth();
  const { updateUserDoc } = UserAuth();
  const { getTeamIssuesDB } = UserAuth();
  const { deleteFromIssuesTeam } = UserAuth();
  const { getClosedIssues } = UserAuth();
  const user = UserAuth();

  //current user logged issues

  const [issue, setIssue] = useState({});

  useEffect(() => {
    localStorage.setItem("issue", JSON.stringify(issue));
  }, [issue]);
  const [myIssues, setMyIssues] = useState([]);
  const [load, setLoad] = useState(false);
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

  //onclick go to issue selected on new page
  const getSelectedIssue = (issue_id) => {
    const find = myIssues.find((issue) => {
      return issue.id === issue_id;
    });
    if (find) {
      setIssue(find);
      setTimeout(() => {
        navigate("/home/issue-detail");
      }, 500);
    }
  };

  const deleteMyIssues = (id) => {
    const filteredArray = myIssues.filter((issues) => {
      return issues.id !== id;
    });
    setMyIssues(filteredArray);
    updateUserDoc(filteredArray);
    deleteFromIssuesTeam(id).then(getTeamIssues());

    //delete from team issues
  };

  getMyIssues();

  //team issues

  const [teamIssues, setTeamIssues] = useState([]);

  const getTeamIssues = async () => {
    getTeamIssuesDB().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setTeamIssues(data);
      setLoad(true);
    });
  };

  const getTEAMISSUES = (issue_id) => {
    const find = teamIssues.find((issue) => issue.issue.id === issue_id);
    if (find) {
      setIssue(find.issue);
      setTimeout(() => {
        navigate("/home/issue-detail");
      }, 500);
    }
  };

  useEffect(() => {
    getTeamIssues();
  }, []);

  //get all closed issues

  const [closedIssues, setClosedIssues] = useState([]);

  const getClosedIssuesF = async () => {
    getClosedIssues().then((response) => {
      const data = response.docs.map((doc) => doc.data());
      setClosedIssues(data);
      setLoad(true);
    });
  };
  getClosedIssuesF();

  const findClosedIssueSelcted = (id) => {
    const found = closedIssues.find((item) => {
      return item.issue.id === id;
    });
    setIssue(found.issue);
    setTimeout(() => {
      navigate("/home/issue-detail-closed");
    }, 1000);
  };

  return (
    <div className="issues">
      <h2>{user.loggedUser.displayName}</h2>
      <div className="container-issue-style top-div-issue-container">
        <h2>My issues</h2>
        <button
          className="button-svg-inside"
          onClick={() => {
            navigate("/home/new-issue");
          }}
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g fill="none" fillRule="evenodd">
                {" "}
                <circle cx="32" cy="32" r="30" fill="#ECECEC"></circle>{" "}
                <circle cx="54" cy="10" r="10" fill="#80D25B"></circle>{" "}
                <path
                  stroke="#0A3586"
                  strokeLinecap="square"
                  strokeWidth="2"
                  d="M54,16 L54,4"
                ></path>{" "}
                <path
                  fill="#22BA8E"
                  d="M36.148845,20.5123815 C34.8685407,19.7534477 33.4678454,19.3352603 32,19.3352603 C30.5321546,19.3352603 29.1314593,19.7534477 27.851155,20.5123815 L24.7012793,15.8762361 C24.0805331,14.9625907 22.8366629,14.725149 21.9230175,15.3458952 C21.0093721,15.9666414 20.7719303,17.2105115 21.3926765,18.1241569 L24.836431,23.1928477 C23.8970659,24.3664335 23.0954267,25.7666751 22.4716059,27.3352558 L17,27.3352603 C15.8954305,27.3352603 15,28.2306908 15,29.3352603 C15,30.4398298 15.8954305,31.3352603 17,31.3352603 L21.3465481,31.3352603 C21.2312595,31.986791 21.1434756,32.6543827 21.0851039,33.3352603 L17,33.3352603 C15.8954305,33.3352603 15,34.2306908 15,35.3352603 C15,36.4398298 15.8954305,37.3352603 17,37.3352603 L21.0851039,37.3352603 C21.1434756,38.0161379 21.2312595,38.6837295 21.3465481,39.3352603 L17,39.3352603 C15.8954305,39.3352603 15,40.2306908 15,41.3352603 C15,42.4398298 15.8954305,43.3352603 17,43.3352603 L22.4716009,43.3352603 C24.373556,48.1176712 27.928447,51.3352603 32,51.3352603 C36.071553,51.3352603 39.626444,48.1176712 41.5283959,43.3352603 L47,43.3352603 C48.1045695,43.3352603 49,42.4398298 49,41.3352603 C49,40.2306908 48.1045695,39.3352603 47,39.3352603 L42.6534519,39.3352603 C42.7687405,38.6837295 42.8565244,38.0161379 42.9148961,37.3352603 L47,37.3352603 C48.1045695,37.3352603 49,36.4398298 49,35.3352603 C49,34.2306908 48.1045695,33.3352603 47,33.3352603 L42.9148961,33.3352603 C42.8565244,32.6543827 42.7687405,31.986791 42.6534519,31.3352603 L47,31.3352603 C48.1045695,31.3352603 49,30.4398298 49,29.3352603 C49,28.2306908 48.1045695,27.3352603 47,27.3352603 L41.5283959,27.3352603 C40.9045733,25.7666751 40.1029341,24.3664335 39.163569,23.1928477 L42.6073235,18.1241569 C43.2280697,17.2105115 42.9906279,15.9666414 42.0769825,15.3458952 C41.1633371,14.725149 39.9194669,14.9625907 39.2987207,15.8762361 L36.148845,20.5123815 Z"
                ></path>{" "}
                <path
                  stroke="#0A3586"
                  strokeLinecap="square"
                  strokeWidth="2"
                  d="M48,10 L60,10"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
          Submit bug
        </button>
      </div>
      <div>
        <div>
          <div className=" issue-body">
            <div className="bug-name-issue">
              <h3>Title</h3>
            </div>
            <div>
              <h3>Reporter</h3>
            </div>
            <div>
              <h3>Date</h3>
            </div>
            <div className="priority-issue">
              <h3>Priority</h3>
            </div>
            <div className="todo-issue">
              <h3>Status</h3>
            </div>
          </div>
        </div>
        <div>
          {myIssues.length > 0
            ? myIssues.map((item) => {
                return (
                  <div className="tst">
                    <div
                      className="bd-txt-1 issue-body"
                      onClick={() => {
                        getTEAMISSUES(item.id);
                      }}
                    >
                      <div className="bug-name-issue">
                        <p>{item.title}</p>
                      </div>
                      <div>
                        <p>{item.user}</p>
                      </div>
                      <div>
                        <p>{item.date}</p>
                      </div>
                      <div className="priority-issue">
                        <p className={item.priority}>{item.priority}</p>
                      </div>
                      <div className="todo-issue">
                        <p>To-do</p>
                      </div>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        deleteMyIssues(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            : LoadContainer}
        </div>
      </div>
      <div className="container-issue-style">
        <h2>Active team issues</h2>
      </div>
      <div>
        <div className=" issue-body">
          <div className="bug-name-issue">
            <h3>Title</h3>
          </div>
          <div>
            <h3>Reporter</h3>
          </div>
          <div>
            <h3>Date</h3>
          </div>
          <div className="priority-issue">
            <h3>Priority</h3>
          </div>
          <div className="todo-issue">
            <h3>Status</h3>
          </div>
        </div>
      </div>
      <div>
        {teamIssues.length > 0
          ? teamIssues.map((item) => {
              return (
                <div
                  className="bd-txt-1 issue-body"
                  onClick={() => {
                    getTEAMISSUES(item.issue.id);
                  }}
                >
                  <div className="bug-name-issue">
                    <p>{item.issue.title}</p>
                  </div>
                  <div>
                    <p>{item.issue.user}</p>
                  </div>
                  <div>
                    <p>{item.issue.date}</p>
                  </div>
                  <div className="priority-issue">
                    <p className={item.issue.priority}>{item.issue.priority}</p>
                  </div>
                  <div className="todo-issue">
                    <p>To-do</p>
                  </div>
                </div>
              );
            })
          : LoadContainer}
      </div>
      <div className="container-issue-style">
        <h2>Closed issues</h2>
      </div>
      <div>
        <div className=" issue-body">
          <div className="bug-name-issue">
            <h3>Title</h3>
          </div>
          <div>
            <h3>Reporter</h3>
          </div>
          <div>
            <h3>Date</h3>
          </div>
          <div className="priority-issue">
            <h3>Priority</h3>
          </div>
          <div className="todo-issue">
            <h3>Status</h3>
          </div>
        </div>
        <div>
          {closedIssues.length > 0
            ? closedIssues.map((item) => {
                return (
                  <div
                    className="bd-txt-1 issue-body"
                    onClick={() => {
                      findClosedIssueSelcted(item.issue.id);
                    }}
                  >
                    <div className="bug-name-issue">
                      <p>{item.issue.title}</p>
                    </div>
                    <div>
                      <p>{item.issue.user}</p>
                    </div>
                    <div>
                      <p>{item.issue.date}</p>
                    </div>
                    <div className="priority-issue">
                      <p className={item.issue.priority}>
                        {item.issue.priority}
                      </p>
                    </div>
                    <div className="todo-issue">
                      <p>Closed</p>
                    </div>
                  </div>
                );
              })
            : LoadContainer}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { UserAuth } from "../global-context/firebase-context";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";

export default function Newissue() {
  const navigate = useNavigate();

  const x = Date.now();
  const id = `#${x.toString()}`;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getUTCMonth();
  const day = date.getDate();
  const NewissueDate = `${day}-0${month + 1}-${year}`;

  //logged user
  const user = UserAuth();
  const { addNewIssue } = UserAuth();
  const { teamIssues } = UserAuth();
  const { getUserDataDB } = UserAuth();
  const { updateUserDoc } = UserAuth();
  const { updateForm } = UserAuth();

  const userName = user.loggedUser.displayName;

  const issue = (
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

  const issueTitle = useRef();
  const issueDescription = useRef();
  const [chosenPriority, setPriority] = useState(undefined);

  const createNewIssue = async () => {
    const data = await getUserDataDB();

    if (issueDescription.current.value === "") {
      alert("Please enter a description");
    } else if (chosenPriority === undefined) {
      alert("Please enter a priority");
    } else {
      let newissue = issue(
        issueTitle.current.value,
        NewissueDate,
        user.loggedUser.displayName,
        user.loggedUser.uid,
        id,
        chosenPriority,
        issueDescription.current.value,
        "To-do",
        []
      );

      if (data === undefined) {
        updateUserDoc([newissue])
          .then(() => {
            updateForm(
              user.loggedUser.displayName,
              "Created a new issue",
              date.toLocaleString(),
              id,
              x.toString()
            );
          })
          .then(alert("Issue added successfully  !"))

          .then(navigate("/home/issues"));
        teamIssues(newissue, id);
      } else {
        updateUserDoc([...data, newissue])
          .then(() => {
            updateForm(
              user.loggedUser.displayName,
              "Created a new issue",
              date.toLocaleString(),
              id,
              x.toString()
            );
          })
          .then(alert("Issue added successfully  !"))
          .then(navigate("/home/issues"));

        teamIssues(newissue, id);
      }
    }
  };

  return (
    <div className="new-issue-container">
      <div>
        <h1>New issue </h1>
      </div>
      <div className="top-div-new-issue">
        <div>
          <h2>Bug name</h2>
          <input type="text" className="text-type" ref={issueTitle} />
        </div>
        <div>
          <h2>ID</h2>
          <p>{id}</p>
        </div>
        <div>
          <h2>Reporter</h2>
          <p>{userName}</p>
        </div>
        <div>
          <h2>Submission date</h2>
          <p>{NewissueDate}</p>
        </div>
        <div>
          <h2>Priority</h2>
          <p
            className="Immediate"
            onClick={() => {
              setPriority("Immediate");
            }}
          >
            Immediate
          </p>
          <p
            className="High"
            onClick={() => {
              setPriority("High");
            }}
          >
            High
          </p>
          <p
            className="Normal"
            onClick={() => {
              setPriority("Normal");
            }}
          >
            Normal
          </p>
        </div>
      </div>
      <div>
        <div className="down-div-issues">
          <h2>Describe the issue</h2>
          <textarea className="text-area-test" ref={issueDescription} />
          <p></p>
        </div>
      </div>
      <div>
        <button
          className="button-svg-inside "
          onClick={() => {
            createNewIssue();
          }}
        >
          Submit new bug
        </button>
      </div>
    </div>
  );
}

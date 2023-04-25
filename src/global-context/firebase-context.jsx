import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase-config/firebase-config";
import { db } from "../firebase-config/firebase-config";
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const fireBaseContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const createNewUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const singInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const singOutUser = () => {
    return signOut(auth);
  };

  const updateUser = (username) => {
    return updateProfile(auth.currentUser, { displayName: username });
  };
  const addNewUserToDB = (newUser, id) => {
    return setDoc(doc(db, "users", id), JSON.parse(JSON.stringify(newUser)));
  };
  const addNewIssue = (issue) => {
    return setDoc(
      doc(db, "users", loggedUser.uid),
      { issues: { issue } },
      { merge: true }
    );
  };
  const getUserDataDB = async () => {
    const userIssues = doc(db, "users", loggedUser.uid);
    const docSnapShop = await getDoc(userIssues);
    return docSnapShop.data().issues;
  };
  const getTeamIssuesDB = async () => {
    const coletionRef = collection(db, "teamIssues");
    return getDocs(coletionRef);
  };
  const getClosedIssues = async () => {
    const coletionRef = collection(db, "close_issues");
    return getDocs(coletionRef);
  };
  const getFeed = async () => {
    const feedRef = collection(db, "feed");
    return getDocs(feedRef);
  };
  const deleteFromIssuesTeam = async (id) => {
    await deleteDoc(doc(db, "teamIssues", id));
  };
  const updateUserDoc = async (issues) => {
    return updateDoc(doc(db, "users", auth.currentUser.uid), { issues });
  };
  const updateComents = async (issues) => {
    return updateDoc(doc(db, "users", auth.currentUser.uid), { issues });
  };
  const teamIssues = (issue, id) => {
    return setDoc(doc(db, "teamIssues", id), { issue });
  };
  const deletComentsOnTeamIssue = (issue, id) => {
    return setDoc(doc(db, "teamIssues", id), { issue });
  };
  const closeIssues = (issue, id) => {
    return setDoc(doc(db, "close_issues", id), { issue });
  };

  const updateForm = (user, action, date, referenceID, id) => {
    const obj = {
      user: user,
      action: action,
      date: date,
      id: referenceID,
    };

    return setDoc(doc(db, "feed", id), { obj });
  };
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedUser(user);
      } else if (auth.currentUser === null) {
        navigate("/");
      }
    });
  }, []);

  return (
    <fireBaseContext.Provider
      value={{
        createNewUser,
        singInUser,
        loggedUser,
        singOutUser,
        updateUser,
        addNewIssue,
        teamIssues,
        addNewUserToDB,
        getUserDataDB,
        updateUserDoc,
        getTeamIssuesDB,
        deleteFromIssuesTeam,
        updateComents,
        deletComentsOnTeamIssue,
        closeIssues,
        getClosedIssues,
        updateForm,
        getFeed,
      }}
    >
      {children}
    </fireBaseContext.Provider>
  );
};
export const UserAuth = () => {
  return useContext(fireBaseContext);
};

{
  /* TODO:  */
}

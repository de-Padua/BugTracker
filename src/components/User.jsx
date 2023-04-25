import React from "react";
import { UserAuth } from "../global-context/firebase-context";
export default function User() {
  const user = UserAuth();

  const currentUser = user.loggedUser;

  const user_name = currentUser.displayName;
  const user_email = currentUser.email;
  const id_do_user = currentUser.uid;
  console.log(user_name);

  return (
    <div className="user-page">
      <h2>User</h2>
      <p>{user_name}</p>
      <h3>Email</h3>
      <p>{user_email}</p>
      <h2>ID</h2>
      <p>{id_do_user}</p>
    </div>
  );
}

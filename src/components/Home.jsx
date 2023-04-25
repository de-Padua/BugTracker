import React from "react";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router-dom";
import Issues from "./Issues";
import Feed from "./Feed";
import Discuss from "./Discuss";
import Newissue from "./Newissue";
import DetaliedIssue from "./DetaliedIssue";
import IssueClosed from "./IssueClosed";
import User from "./User";

export default function Home() {
  return (
    <div className="home-container-main">
      <Navbar />

      <div className="routes-container">
        <Routes>
          <Route path="issues" element={<Issues />} />
          <Route path="feed" element={<Feed />} />
          <Route path="discuss" element={<Discuss />} />
          <Route path="new-issue" element={<Newissue />} />
          <Route path="issue-detail" element={<DetaliedIssue />} />
          <Route path="issue-detail-closed" element={<IssueClosed />} />
          <Route path="user" element={<User />} />
        </Routes>
      </div>
    </div>
  );
}

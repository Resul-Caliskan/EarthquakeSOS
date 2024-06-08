import React, { useState } from "react";
import UserList from "./UserList";
import TeamList from "./TeamList";
import "./Team.css";
const TeamManagement = ({t}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdded, setSelecteddAdded] = useState(null);
  return (
    <div className="team-management">
      <UserList onSelectUser={setSelectedUser} selectedAdded={selectedAdded}  t={t}/>
      <TeamList
        selectedUser={selectedUser}
        onSelectedAdded={setSelecteddAdded}
        t={t}
      />
    </div>
  );
};

export default TeamManagement;

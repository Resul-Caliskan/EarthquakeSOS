import React, { useState } from "react";
import UserList from "./UserList";
import TeamList from "./TeamList";
import "./Team.css";
const TeamManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdded, setSelecteddAdded] = useState(null);
  return (
    <div className="team-management">
      <UserList onSelectUser={setSelectedUser} selectedAdded={selectedAdded} />
      <TeamList
        selectedUser={selectedUser}
        onSelectedAdded={setSelecteddAdded}
      />
    </div>
  );
};

export default TeamManagement;

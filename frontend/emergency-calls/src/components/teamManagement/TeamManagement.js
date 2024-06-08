import React, { useState } from 'react';
import UserList from './UserList';
import TeamList from './TeamList';

const TeamManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="team-management">
      <UserList onSelectUser={setSelectedUser} />
      <TeamList selectedUser={selectedUser} />
    </div>
  );
};

export default TeamManagement;

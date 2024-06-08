import React, { useEffect, useState } from 'react';
import { getUnassignedUsers } from '../../backend/teamApi';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const unassignedUsers = await getUnassignedUsers();
      setUsers(unassignedUsers);
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <h3>Unassigned Users</h3>
      {users.map(user => (
        <div key={user._id} onClick={() => onSelectUser(user)}>
          {user.fullName}
        </div>
      ))}
    </div>
  );
};

export default UserList;

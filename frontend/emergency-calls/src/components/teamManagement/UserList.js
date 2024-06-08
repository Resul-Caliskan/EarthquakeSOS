// import React, { useEffect, useState } from "react";
// import { getUnassignedUsers } from "../../backend/teamApi";
// import "./Team.css";
// const UserList = ({ onSelectUser }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const unassignedUsers = await getUnassignedUsers();
//       setUsers(unassignedUsers);
//     };
//     fetchUsers();
//   }, []);

//   return (
//     <div className="user-list">
//       <h3
//         style={{
//           flex: 1,
//           borderBottomWidth: 2,
//           marginBottom: 10,
//           borderColor: "black",
//           fontSize: 20,
//           fontWeight: "bold",
//         }}
//       >
//         Gönüllüler
//       </h3>
//       {users.map((user) => (
//         <div key={user._id} onClick={() => onSelectUser(user)}>
//           <p className="text-blue-600 underline hover:text-green-400 cursor-pointer">
//             {user.fullName}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserList;

import React, { useEffect, useState } from "react";
import { getUnassignedUsers } from "../../backend/teamApi";
import "./Team.css";

const UserList = ({ onSelectUser, selectedAdded }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const unassignedUsers = await getUnassignedUsers();
      setUsers(unassignedUsers);
    };
    fetchUsers();
  }, [selectedAdded]); // selectedUser değiştiğinde yeniden kullanıcıları al

  // Seçilen kullanıcı listeden çıkar


  return (
    <div className="user-list">
      <h3
        style={{
          flex: 1,
          borderBottomWidth: 2,
          marginBottom: 10,
          borderColor: "black",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Gönüllüler
      </h3>
      <div className="grid grid-cols-4">
      {users.map((user) => (
        <div key={user._id} onClick={() => onSelectUser(user)}>
          <p className="text-blue-600 underline hover:text-green-400 cursor-pointer">
            {user.fullName}
          </p>
        </div>
      ))}
      </div>
    </div>
  );
};

export default UserList;

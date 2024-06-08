import React, { useEffect, useState } from "react";
import { getTeams, createTeam, addUserToTeam } from "../../backend/teamApi";
import "./Team.css";
import { PlusCircleOutlined } from "@ant-design/icons";

const TeamList = ({ selectedUser ,onSelectedAdded}) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const borderColorList = [
    "#ff5733",
    "#33ff57",
    "#5733ff",
    "#33ffff",
    "#ff33ff",
  ]; // Different border colors

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const newTeam = await createTeam(newTeamName);
      setTeams([...teams, newTeam]);
      setNewTeamName("");
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleAddUserToTeam = async (teamId) => {
    try {
      await addUserToTeam(teamId, selectedUser._id);
      setTeams(
        teams.map((team) =>
          team._id === teamId
            ? { ...team, members: [...team.members, selectedUser] }
            : team
        )
      );
      onSelectedAdded(selectedUser._id);
    } catch (error) {
      console.error("Error adding user to team:", error);
    }
  };

  return (
    <div className="team-list">
      <div className="team-management-header">
        <h1
          style={{
            flex: 1,
            borderBottomWidth: 2,
            marginBottom: 10,
            borderColor: "black",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Ekipler
        </h1>
        <div className="create-team-section">
          <input
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "gray",
              padding: 3,
            }}
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Yeni Ekip Ekle"
          />
          <button
            style={{
              color: "dodgerblue",
              borderWidth: 1,
              borderColor: "dodgerblue",
              borderRadius: 10,
              marginLeft: 5,
              padding: 3,
            }}
            onClick={handleCreateTeam}
          >
            Ekip Oluştur
          </button>
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-5">
        {teams.map((team, index) => (
          <div
            key={team._id}
            className="team-card"
            style={{
              borderWidth: 2,
              // borderColor: borderColorList[index % borderColorList.length],
              borderColor: "gray",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <h3 style={{ fontWeight: "bold" }}>{team.name.toUpperCase()}</h3>
            {selectedUser && (
              <button
                className="flex flex-row  p-1 px-2 my-1 border-2 rounded-lg border-blue-500 hover:border-blue-800 text-blue-500 hover:text-blue-800"
                onClick={() => handleAddUserToTeam(team._id)}
              >
                <PlusCircleOutlined className="mt-1 mx-1" />
                {selectedUser.fullName}
              </button>
            )}
            <div>
              {team.members.map((member) => (
                <div key={member._id}>{member.fullName}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;

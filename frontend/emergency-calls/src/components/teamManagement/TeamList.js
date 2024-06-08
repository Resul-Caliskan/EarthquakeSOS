import React, { useEffect, useState } from 'react';
import { getTeams, createTeam, addUserToTeam } from '../../backend/teamApi';

const TeamList = ({ selectedUser }) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const newTeam = await createTeam(newTeamName);
      setTeams([...teams, newTeam]);
      setNewTeamName('');
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleAddUserToTeam = async (teamId) => {
    try {
      await addUserToTeam(teamId, selectedUser._id);
      setTeams(teams.map(team => 
        team._id === teamId ? { ...team, members: [...team.members, selectedUser] } : team
      ));
    } catch (error) {
      console.error('Error adding user to team:', error);
    }
  };

  return (
    <div className="team-list">
      <h3>Teams</h3>
      {teams.map(team => (
        <div key={team._id}>
          <h4>{team.name}</h4>
          <div>
            {team.members.map(member => (
              <div key={member._id}>{member.fullName}</div>
            ))}
          </div>
          {selectedUser && (
            <button onClick={() => handleAddUserToTeam(team._id)}>
              Add {selectedUser.fullName} to {team.name}
            </button>
          )}
        </div>
      ))}
      <div>
        <input 
          type="text" 
          value={newTeamName} 
          onChange={(e) => setNewTeamName(e.target.value)} 
          placeholder="New Team Name" 
        />
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>
    </div>
  );
};

export default TeamList;

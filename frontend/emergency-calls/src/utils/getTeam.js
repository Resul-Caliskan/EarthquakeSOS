import { jwtDecode } from "jwt-decode";

export const getTeamIdFromToken = (token) => {
  const tokenContext = jwtDecode(token);
  return tokenContext.team;
};

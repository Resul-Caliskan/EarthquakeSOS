import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = (token) => {
  const tokenContext = jwtDecode(token);
  return tokenContext.role;
};

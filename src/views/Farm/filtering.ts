import { FarmInfo, FarmUserInfo } from "../../store/useMasterChef";

export function filterFarms(farms: FarmInfo[], users: FarmUserInfo[], search: string, stakedOnly: boolean) {
  let farmList:FarmInfo[] = [];
  let userList:FarmUserInfo[] = [];
  farms.forEach((farm, index) => {
    if (!(stakedOnly && users[index].amount <= 0)) {
      farmList.push(farm);
      userList.push(users[index]);        
    }
  });

  if (search.length === 0) return { filteredFarms: farmList, filteredUsers: userList };

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) {
    return { filteredFarms:farmList, filteredUsers:userList };
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0);

    return lowerSearchParts.every(
      (p) =>
        p.length === 0 ||
        sParts.some((sp) => sp.includes(p))
    );
  };
  let filteredFarms:FarmInfo[] = [];
  let filteredUsers:FarmUserInfo[] = [];
  farmList.forEach((farm, index) => {
    const { lpToken } = farm;
    console.log(userList[index].amount)
    if ((lpToken.tokens.length === 0 && matchesSearch("swpr")) || (lpToken.tokens.length === 2 && matchesSearch(lpToken.tokens[0].symbol)) || (lpToken.tokens.length === 2 && matchesSearch(lpToken.tokens[1].symbol))) {
      filteredFarms.push(farm);
      filteredUsers.push(userList[index]);      
    }
  });
  return { filteredFarms, filteredUsers };
}

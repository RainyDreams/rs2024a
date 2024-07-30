/**
 * 
 * @param {*} fd 
 * @param {*} sd 
 * @returns 
 */
export function dateDiff(fd, sd) {
  let date1 = new Date(fd);
  let date2 = new Date(sd);
  let dateDiff = date2.getTime() - date1.getTime();
  return Math.floor(dateDiff / (24 * 3600 * 1000));
}
/**
 * 
 * @param {*} dt 时间
 * @returns 
 */
export function getDateDiff(dt) {
  // debugger;
  let now = new Date();
  let nowDay = now.getDay();
  let nowDate = now.getDate();
  let nowMonth = now.getMonth() + 1;
  let nowYear = now.getFullYear();
  let nowStr = nowYear + "-" + nowMonth + "-" + nowDate;
  let date = new Date(dt);
  let dateDay = date.getDay();
  let dateDate = date.getDate();
  let dateMonth = date.getMonth() + 1;
  let dateYear = date.getFullYear();
  let dateStr = dateYear + "-" + dateMonth + "-" + dateDate;
  let dateDiffRst = dateDiff(nowStr, dateStr);
  // if (dateDiffRst === 0) {
  //   return { str: '今天', show: true };
  // } else if (dateDiffRst === 1) {
  //   return { str: '明天', show: true };
  // } else if (dateDiffRst === 2) {
  //   return { str: '后天', show: true };
  // } else if (dateDiffRst === -1) {
  //   return { str: '昨天', show: true };
  // } else if (dateDiffRst === -2) {
  //   return { str: '前天', show: true };
  // } else {
    return { str: dateStr, show: false };
  // }
}

/**
 * Description
 * @param {any} role 角色名称
 * @returns {any}
 */
export function getRole(role){
  const roleMap = {
    'creator': '创建者',
    'owner': '拥有者',
    'admin': '管理员',
    'member': '普通成员'
  }
  return roleMap[role] || '未知角色'
}
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
  return { str: dateStr, show: false };
}


export const roleMap = [
  {
    value:'creator',
    label:'创建者',
  },
  {
    value:'owner',
    label:'拥有者',
  },
  {
    value:'admin',
    label:'管理员',
  },
  {
    value:'member',
    label:'成员',
  },
]
/**
 * Description
 * @param {any} role 角色名称
 * @returns {any}
 */
export function getRole(role){
  return roleMap[role] || '未知角色'
}

/**
 * Description
 * @param {any} func
 * @param {any} wait
 * @returns {any}
 */
export function throttle(func, wait) {
  let timeout;
  let previous = 0;
  const later = function () {
    previous = +new Date();
    timeout = null;
    return func.apply(this, arguments);
  };
  return function () {
    const now = +new Date();
    if (!previous) previous = now;
    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, arguments);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
}
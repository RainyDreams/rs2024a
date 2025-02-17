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

export function getRadomString(len){
  let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rst = '';
  for(let i = 0; i < len; i++){
    rst += str.charAt(Math.floor(Math.random() * str.length));
  }
  return rst;
}

export const commonRoleMap = [
  {
    value:'admin',
    label:'管理员',
  },
  {
    value:'member',
    label:'成员',
  },
]
export const roleMap = [
  {
    value:'creator',
    label:'创建者',
  },
  {
    value:'owner',
    label:'拥有者',
  },
  ...commonRoleMap
]
/**
 * Description
 * @param {any} role 角色名称
 * @returns {any}
 */
export function getRole(role){
  return (roleMap.find(e=>e.value == role)?.label || '查询错误')
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
export function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
export function asyncThrottle(func, delay, defaultFunc) {
  let lastCallTime = 0;
  return async function (...args) {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      return func(...args);
    } else {
      return defaultFunc(...args);
    }
  };
}

export function functionCallPlugin(md) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      if (token.info === 'Function call') {
          try {
              const jsonObj = JSON.parse(token.content);
              if (jsonObj.name && jsonObj.args) {
                  // 调用 call(jsonObj) 函数并返回结果
                  // return call(jsonObj);
                  // // console.log('nb')
              }
          } catch (e) {
              // // console.error("Error parsing FUNCTION CALL JSON:", e);
          }
      }
      return fence(tokens, idx, options, env, self);
  };
}
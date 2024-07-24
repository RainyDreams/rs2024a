/*

*/
import Cookies from 'js-cookie';

class Auth {
  static async loginByPassword(username, password){
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username:username, password:password })
    });
    if (response.status === 200) {
      const data = await response.json();
      if(data.status == 'sus'){
        console.log('[prtoken] success',data)
        Cookies.set('czigauth', `${(new Date().getTime()).toString(36)}`, { expires: new Date(data.content.expires),Domain:'.chiziingiin.top' });
      } else {
        return { status: 'error', content: data.content };
      }
    } else {
      return { status: 'error', content: response };
    }
  }
  static async logout(){ Cookies.remove('czigauth'); }
  static async checkAuth(){ return Cookies.get('czigauth') != null; }
  static async getPrtoken(){
    if(Cookies.get('czigauth_prtoken')){
      return {status: 'exist', content: Cookies.get('czigauth_prtoken')};
    }
    const response = await fetch('/api/prtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      if(data.status == 'sus'){
        return Cookies.set('czigauth_prtoken', `${(new Date().getTime()).toString(36)}`, { expires: new Date(data.content.expires),Domain:'.chiziingiin.top' });
      } else {
        throw { status: 'error', content: data.content };
      }
    } else if(response.status === 401){
      throw { status: 'invalid', content:response };
    } else {
      throw { status: 'error', content: response };
    }
  }
  static async getTeamInfo(o){
    const response = await fetch('/api/teamInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid:o.uid, pid:o.pid })
    });
    if (response.status === 200) {
      const data = await response.json();
      if(data.status == 'sus'){
        return { status: 'sus', content: data.content };
      } else {
        return { status: 'error', content: data.content };
      }
    } else if(response.status === 401){
      return { status: 'invalid', content:response };
    } else {
      return { status: 'error', content:response  }
    }
  }
  static async getUserInfo(){
    const response = await fetch('/api/userinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      if(data.status == 'sus'){
        return { status: 'sus', content: data.content };
      } else {
        return { status: 'error', content: data.content };
      }
    } else if(response.status === 401){
      return { status: 'invalid', content:response };
    } else {
      return { status: 'error', content:response  }
    }
  }
}

export default Auth;
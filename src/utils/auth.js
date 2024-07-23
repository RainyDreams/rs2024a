/*

*/

class Auth {
  static async loginByPassword(username, password){
    const response = await fetch('https://auth.chiziingiin.top/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username:username, password:password })
    });
    if (response.status === 200) {
      const data = await response.json();
      if(data.status == 'sus'){
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
    const response = await fetch('https://auth.chiziingiin.top/api/prtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      const data = await response.json();
      if(data.status == 'sus'){
        Cookies.set('czigauth_prtoken', `${(new Date().getTime()).toString(36)}`, { expires: new Date(data.content.expires),Domain:'.chiziingiin.top' });
      } else {
        return { status: 'error', content: data.content };
      }
    } else {
      return { status: 'error', content: response };
    }
  }
  static async getUserInfo(){
    const response = await fetch('https://auth.chiziingiin.top/api/userinfo', {
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
    } else {
      return { status: 'error', content: response };
    }
  }
}

export default Auth;
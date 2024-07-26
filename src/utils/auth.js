/*

*/
const BASICURL = ''
import Cookies from 'js-cookie';

class Auth {
  static 
  async basicAuth(url, body, { success = async () => {}, failed = async () => {} }) {
    try { 
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data.status ==='sus') {
          return { status:'sus', content: await success(data) };
        } else {
          return await failed(response,0) ;
        }
      } else {
        return await failed(response,1) ;
      }
    } catch(error) {
      return await failed(error,2) ;
    }
  }

  static async loginByPassword(username, password) {
    return this.basicAuth(BASICURL+'/api/login', JSON.stringify({ username: username, password: password }), {
      success: async (data) => data,
      failed: async (response) => ({ status: 'error', content: data.content })
    });
  }

  static async logout() {
    Cookies.remove('czigauth');
  }

  static async checkAuth() {
    return Cookies.get('czigauth')!= null;
  }

  static async getPrtoken() {
    console.log(Cookies.get('czigauth'))
    if (Cookies.get('czigauth')) {
      return { status: 'exist', content: Cookies.get('czigauth') };
    }
    return this.basicAuth(BASICURL+'/api/prtoken', '', {
      success: async (data) => {
        Cookies.set('czigauth', 'Already Authenticated', { expires: new Date(data.content.expires) });
        return { status: 'sus', content: data.content };
      },
      failed: async (response,code) => {
        if(code<2 && response.status === 401)
          return { status: 'invalid', content: response };
        else return { status: 'error', content: response };
      }
    });
  }
  static async createTeam(param) {
    return this.basicAuth(BASICURL+'/api/createTeam', JSON.stringify({ name:param.name,desc:param.desc }), {
      success: async (data) => data.content,
      failed: async (response) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response };
        }
        return { status: 'error', content: response };
      }
    });
  }
  static async getTeamInfo(param={}) {
    return this.basicAuth(BASICURL+'/api/teamInfo', JSON.stringify({ uid: param.uid||'', pid: param.pid }), {
      success: async (data) => data.content,
      failed: async (response) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response };
        }
        return { status: 'error', content: response };
      }
    });
  }

  static async getTeamList(param={}){
    return this.basicAuth(BASICURL+'/api/teamList', JSON.stringify({ uid: param.uid||'' }), {
      success: async (data) => data.content,
      failed: async (response) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response.content };
        }
        return { status: 'error', content: response };
      }
    });
  }

  static async getUserInfo() {
    return this.basicAuth(BASICURL+'/api/userinfo', '', {
      success: async (data) => data,
      failed: async (response) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response };
        }
        return { status: 'error', content: response };
      }
    });
  }
}

export default Auth;
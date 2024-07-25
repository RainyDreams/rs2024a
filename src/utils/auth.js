/*

*/
import Cookies from 'js-cookie';

class Auth {
  static 
  async basicAuth(url, body, { success = async () => {}, failed = async () => {} }) {
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
        return { status: 'error', content: await failed(response) };
      }
    } else {
      return { status: 'error', content: await failed(response) };
    }
  }

  static async loginByPassword(username, password) {
    return this.basicAuth('/api/login', JSON.stringify({ username: username, password: password }), {
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
    // debugger;
    if (Cookies.get('czigauth')) {
      return { status: 'exist', content: Cookies.get('czigauth') };
    }
    return this.basicAuth('/api/prtoken', '', {
      success: async (data) => {
        Cookies.set('czigauth', 'Already Authenticated', { expires: new Date(data.content.expires) });
        return { status: 'sus', content: data.content };
      },
      failed: async (response) => {
        throw { status: 'error', content: response };
      }
    });
  }

  static async getTeamInfo(param) {
    return this.basicAuth('/api/teamInfo', JSON.stringify({ uid: param.uid, pid: param.pid }), {
      success: async (data) => data.content,
      failed: async (response) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response };
        }
        return { status: 'error', content: response };
      }
    });
  }

  static async getTeamList(param){
    return this.basicAuth('/api/teamList', JSON.stringify({ uid: param.uid||'default' }), {
      success: async (data) => data,
      failed: async (response) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response };
        }
        return { status: 'error', content: response };
      }
    });
  }

  static async getUserInfo() {
    return this.basicAuth('/api/userinfo', '', {
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
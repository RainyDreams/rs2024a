/*

*/
const BASICURL = ''
const LOGINURL = 'https://auth.chiziingiin.top'
import Cookies from 'js-cookie';
const defaultSuccess = async (data) => data.content;
const defaultFailed = async (response) => {
  if (response.status === 401) {
    return { status: 'invalid', content: response };
  }
  return { status: 'error', content: response };
}
class Auth {
  static async init(){
    if ((await this.getPrtoken()).status == 'invalid') {
      window.location.href = LOGINURL+'?url=' + encodeURI(window.location.href);
    }
  }
  static async basicAuth(url, body, {
    success = defaultSuccess,
    failed = defaultFailed
  }={
    success : defaultSuccess, 
    failed :defaultFailed
  }){
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
    return this.basicAuth(BASICURL+'/api/login', JSON.stringify({ username: username, password: password }));
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
        return data.content;
      },
      failed: async (response,code) => {
        if(code<2 && response.status === 401)
          return { status: 'invalid', content: response };
        else return { status: 'error', content: response };
      }
    });
  }
  static async createTeam(param) {
    return this.basicAuth(BASICURL+'/api/createTeam', JSON.stringify({ name:param.name,desc:param.desc }), );
  }
  static async getTeamInfo(param={}) {
    return this.basicAuth(BASICURL+'/api/teamInfo', JSON.stringify({ uid: param.uid||'', pid: param.pid }), );
  }
  static async getTeamList(param={}){
    return this.basicAuth(BASICURL+'/api/teamList', JSON.stringify({ uid: param.uid||'' }), );
  }
  static async getJoinedTeamList(param={}){
    return this.basicAuth(BASICURL+'/api/joinedTeamList', JSON.stringify({ uid: param.uid||'' }), )
  }
  static async getDashboard(){
    return this.basicAuth(BASICURL+'/api/dashboard', '', )
  }
  static async createProject(param) {
    return this.basicAuth(BASICURL+'/api/createProject', JSON.stringify({ ...param }));
  }
  static async getProjectDetail(param={}) {
    return this.basicAuth(BASICURL+'/api/projectDetail', JSON.stringify({ projectid: param.id }), );
  }
  static async getProjectList(param={}) {
    return this.basicAuth(BASICURL+'/api/projectList', JSON.stringify({ uid: param.uid||'' }), );
  }
  static async getJoinedProjectList(param={}) {
    return this.basicAuth(BASICURL+'/api/joinedProjectList', JSON.stringify({ uid: param.uid||'' }), )
  }
  static async getUserInfo(param={}) {
    return this.basicAuth(BASICURL+'/api/userinfo', JSON.stringify({ uid: param.uid||'' }), );
  }
}

export default Auth;
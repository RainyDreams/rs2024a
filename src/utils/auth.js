/*

*/
const BASICURL = ''
const LOGINURL = 'https://auth.chiziingiin.top'
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox } from 'element-plus'
const defaultSuccess = async (data) => data.content;
const defaultFailed = async (response) => {
  if (response.status === 401) {
    return { status: 'invalid', content: response };
  } else {
    ElMessage.error('服务器错误');
    console.log(response)
    try{
      throw new Error(await response.text())
    } catch (err){
      console.error(err.stack)
      ElMessageBox.alert('', '服务器错误', {
        dangerouslyUseHTMLString:true,
        message: 
        `很抱歉我们的服务器出现了错误，请联系本RS2024A项目负责人张新越(赤峰二中202312班)<br/>
        以下是可以提供的错误信息<br/><b>错误代码：${response.status}</b><br/><b>${err.stack}</b>`,
        confirmButtonText: '我知道了',
        'show-close':false,
        type: 'error',
      })
    }
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

  static async test(){
    return this.basicAuth(BASICURL+'/api/test', );
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
/*

*/
function copyText(text) {
  // 创建一个临时的文本输入元素
  const textarea = document.createElement('textarea');
  textarea.value = text;
  // 将文本输入元素添加到文档主体
  document.body.appendChild(textarea);
  // 选中输入框中的文本
  textarea.select();
  // 执行复制操作
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('复制操作失败', err);
  }
  // 从文档主体中移除临时的文本输入元素
  document.body.removeChild(textarea);
}
const BASICURL = ''
const LOGINURL = 'https://auth.chiziingiin.top'
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox } from 'element-plus'
const defaultSuccess = async (data) => data.content?data.content:data;
const defaultFailed = async (response,code) => {
  if (response.status === 401) {
    ElMessage.error('你没有认证权限');
    return { status: 'invalid', content: response };
  } else {
    ElMessage.error('服务器错误');
    console.dir(response)

    try{
      if(code==2)
        throw response;
      const text = await response.json();
      // console.dir(new Error(response.url+"<br/>" + text.content))
      // (.read()).then((e)=>{console.log(e)})
      // const reader = response.body.getReader()
      // const read = async ()=>reader.read()
      // const text = await read().then((e)=>e.value).then((e)=>new TextDecoder().decode(e))
      // debugger
      // throw
      throw new Error(response.url+"<br/>" + text.content)
    } catch (err){
      // console.error(err.stack)
      ElMessageBox.alert('', '很抱歉，遇到了程序性错误', {
        dangerouslyUseHTMLString:true,
        customClass:'czigerr',
        message: 
        `本软件正在公测阶段，现遇到了程序、服务器错误，请联系本项目负责人张新越（赤峰二中202312班）<br/>
        以下是可以提供的错误信息<br/><b>错误代码：<span style="color:red">${response.status||'未知(可能为CORS)'}</span></b><br/><b>${(err.message+"</b><i>"+err.stack+"")}</i>`,
        confirmButtonText: '报告错误',
        showCancelButton:true,
        cancelButtonText:'忽略错误',
        'show-close':false,
        callback:async (value,action)=>{
          if(value=='confirm'){
            const ua = navigator.userAgent;
            const r = await Auth.reportErrlog(JSON.stringify({
              ua,
              content:`${response.status}:${err.stack+''}`,
              time:new Date().getTime()
            }))
            console.log(r)
            copyText(`${r.content.id}`)
            ElMessageBox.alert(`已尝试上传错误信息\n错误信息代码：${r.content.id}`,'提示',{})
          }
          action=null;
        }
        // type: 'error',
      })
    }
  }
  return { status: 'error', content: response };
}
class Auth {
  static async init(){
    if ((await this.getPrtoken()).status == 'invalid') {
      ElMessage.error('未登录，即将跳转登录页面');
      setTimeout(()=>{
        window.location.href = LOGINURL+'?url=' + encodeURI(window.location.href);
      },500)
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

  static async reportErrlog(content){
    return this.basicAuth(BASICURL+'/api/reportErrlog', content);
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
      // failed: async (response,code) => {
      //   if(code<2 && response.status === 401)
      //     return { status: 'invalid', content: response };
      //   else return { status: 'error', content: response };
      // }
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
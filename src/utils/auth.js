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
    return await Auth.getPrtoken('try')
    return { status: 'invalid', content: response };
  } else {
    ElMessage.error('服务器错误');
    console.dir(response)
    try{
      if(code==2)
        throw response;
      let text = (await response.text());
      throw new Error(response.url+"<br/>" + text)
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
        beforeClose:async (value,instance, done)=>{
          if(value=='confirm'){
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '上传错误信息'
            const ua = navigator.userAgent;
            const r = await Auth.reportErrlog(JSON.stringify({
              ua,
              content:`${response.status}:${err.message+err.stack+''}`,
              time:new Date().getTime()
            }))
            console.info('[errId]',r)
            copyText(`${r.content.id}`)
            
            ElMessageBox.alert(`已尝试上传错误信息\n错误信息代码：${r.content.id}\n可以将以上信息提供给我，便于分析处理错误`,'提示',{})
          }
          done();
        }
        // type: 'error',
      })
    }
  }
  return { status: 'error', content: response };
}
class Auth {
  static async init(){
    // if ((await this.getPrtoken()).status == 'invalid') {
    const res = await this.guestLogin()
    if(res.status == 'sus'){
      ElMessage.success('以访客身份登录成功');
    }
  }
  static async basicAuth(url=BASICURL, body='', {
    success = defaultSuccess,
    failed = defaultFailed
  } = {
    success : defaultSuccess, 
    failed : defaultFailed
  }){
    try { 
      const response = await fetch(BASICURL+url, {
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

  static async guestLogin(param) {
    const res = await this.basicAuth('/api/guestlogin', JSON.stringify({username:'guest'}));
    if (res.status == 'sus') {
      const rt = await this.getPrtoken();
      return rt
    } else {
      ElMessage.error('以访客身份登录：失败');
      return { status: 'error', content: res.content };
    }
  }

  static async test(){
    return this.basicAuth('/api/test', );
  }

  static async reportErrlog(content){
    return this.basicAuth('/api/reportErrlog', content);
  }

  static async getPrtoken(mode) {
    console.log(Cookies.get('czigauth'))
    if (Cookies.get('czigauth')) {
      return { status: 'exist', content: Cookies.get('czigauth') };
    }
    return this.basicAuth('/api/prtoken', '', {
      success: async (data) => {
        Cookies.set('czigauth', 'Already Authenticated', { expires: new Date(data.content.expires) });
        return data.content;
      },
      failed: mode!=='try' ? defaultFailed : async (response, type) => {
        ElMessage.error('网络错误，请重试');
        return { status: 'error', content: response };
      }
    });
  }
  static async createTeam(param) {
    return this.basicAuth('/api/createTeam', JSON.stringify({ name:param.name,desc:param.desc }), );
  }
  static async getTeamInfo(param={}) {
    return this.basicAuth('/api/teamInfo', JSON.stringify({ uid: param.uid||'', pid: param.pid }), );
  }
  static async getTeamList(param={}){
    return this.basicAuth('/api/teamList', JSON.stringify({ uid: param.uid||'' }), );
  }
  static async getJoinedTeamList(param={}){
    return this.basicAuth('/api/joinedTeamList', JSON.stringify({ uid: param.uid||'' }), )
  }
  static async getDashboard(){
    return this.basicAuth('/api/dashboard', '', )
  }
  static async createProject(param) {
    return this.basicAuth('/api/createProject', JSON.stringify({ ...param }));
  }
  static async getProjectDetail(param={}) {
    return this.basicAuth('/api/projectDetail', JSON.stringify({ projectid: param.id }), );
  }
  static async getProjectList(param={}) {
    return this.basicAuth('/api/projectList', JSON.stringify({ uid: param.uid||'' }), );
  }
  static async getJoinedProjectList(param={}) {
    return this.basicAuth('/api/joinedProjectList', JSON.stringify({ uid: param.uid||'' }), )
  }
  static async getUserInfo(param={}) {
    return this.basicAuth('/api/userinfo', JSON.stringify({ uid: param.uid||'' }), );
  }


  /* 实验性功能 */
  static async chatWithAI(list,param){
    const res = await this.basicAuth('/api/ai/send', JSON.stringify({ content:JSON.stringify(list) }) );
    if(res.status==='sus'){
      const eventSource = new EventSource('/api/ai/stream', { withCredentials: true });
      eventSource.onmessage = (e) => param.onmessage(e, eventSource);
      eventSource.onerror = (e) => param.onerror(e, eventSource);
      //   // if (error.eventPhase === EventSource.CLOSED) {
      //   //   console.error('EventSource connection closed:', error);
      //   // }
      //   // debugger;
      //   // param.onerror(error, eventSource);
      //   // eventSource.close();
      // }
    }

  }
}

export default Auth;
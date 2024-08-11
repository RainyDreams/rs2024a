/*

*/
import FingerprintJS from "@fingerprintjs/fingerprintjs";
function copyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('复制操作失败', err);
  }
  document.body.removeChild(textarea);
}
const BASICURL = ''
const LOGINURL = 'https://auth.chiziingiin.top'
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from "vue-router";
const defaultSuccess = async (data) => data.content?data.content:data;
const defaultFailed = async (response,code) => {
  if (response.status === 401) {
    const getPr = await Auth.getPrtoken();
    if(getPr.status=='sus'){
      ElMessageBox.alert('网络遇到问题，请刷新页面', '错误', {
        confirmButtonText: '确定',
        callback:()=>{
          window.location.reload()
        }
      })
    } else {
      ElMessage.error('未登录或登录过期');
      window.location.href="/login-needed?url="+encodeURIComponent(window.location.href)
      return { status: 'invalid', content: response };
    }
  } else {
    ElMessage.error('服务器错误');
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
  static async init() {
    const prStatus = (await this.getPrtoken("first")).status;
    console.log(prStatus);
    if (prStatus == "invalid") {
      ElMessage.info("正在尝试使用访客身份登录，请稍等");
      const res = await this.guestLogin();
      if (res.status == "sus") {
        ElMessage.success("以访客身份登录成功");
      }
    }
  }
  static async basicAuth(
    url = BASICURL,
    body = "",
    { success = defaultSuccess, failed = defaultFailed } = {
      success: defaultSuccess,
      failed: defaultFailed,
    }
  ) {
    try {
      const response = await fetch(BASICURL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data.status === "sus") {
          return { status: "sus", content: await success(data) };
        } else {
          return await failed(response, 0);
        }
      } else {
        return await failed(response, 1);
      }
    } catch (error) {
      return await failed(error, 2);
    }
  }
  static async handleRecaptcha() {
    return new Promise((resolve,reject)=>{
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6Ld2QRYqAAAAABbPygHb0HUKpd-LMU1Ckmy6nb8G', 
          { action: 'submit' }).then(token => {
          fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
              resolve({ status: "sus", content: token })
            } else {
              reject({ status: "error", content: data })
            }
          });
        });
      });
    })
  }
  static async getRecaptchaToken({action="default",id='#turnstile-box'}){
    return new Promise((resolve,reject)=>{
      // window.grecaptcha.ready(() => {
      //   window.grecaptcha.execute('6Ld2QRYqAAAAABbPygHb0HUKpd-LMU1Ckmy6nb8G', { action })
      //   .then(token => {
      //     resolve(token)
      //   }).catch(err=>{
      //     reject(err)
      //   })
      // });
      // if using synchronous loading, will be called once the DOM is ready
      window.turnstile.ready(function () {
        window.turnstile.render(id, {
          sitekey: '0x4AAAAAAAgyM4dGoERAGuG2',
          action: action,
          callback: function(token) {
            resolve(token)
          },
          'error-callback': function(err) {
            reject(err)
          },
          'refresh-expired':'auto'
        });
      });
    })
  }
  static async guestLogin(param) {
    const res = await this.basicAuth(
      "/api/guestlogin",
      JSON.stringify({ username: "guest" })
    );
    if (res.status == "sus") {
      const rt = await this.getPrtoken();
      return rt;
    } else {
      ElMessage.error("以访客身份登录：失败");
      return { status: "error", content: res.content };
    }
  }
  static async userRegister(param){
    return this.basicAuth("/api/reg", JSON.stringify(param))
  }
  static async logout(){
    await this.getPrtoken()
    return this.basicAuth("/api/logout")
  }
  static async checkUsername(value){
    return this.basicAuth("/api/checkUsername", JSON.stringify({username:value}))
  }
  static async test() {
    return this.basicAuth("/api/test");
  }
  static async reportErrlog(content) {
    return this.basicAuth("/api/reportErrlog", content);
  }
  static async getPrtoken(mode) {
    console.log(Cookies.get("czigauth"));
    if (Cookies.get("czigauth") == 'AlreadyAuthenticated') {
      return { status: "exist", content: Cookies.get("czigauth") };
    }
    return this.basicAuth("/api/prtoken", "", {
      success: async (data) => {
        Cookies.set("czigauth", "AlreadyAuthenticated", {
          expires: new Date(data.content.expires),
          path: "/",
          secure: true,
          domain:'.chiziingiin.top'
        });
        return data.content;
      },
      failed: async (response, type) => {
        if (response.status === 401) {
          return { status: 'invalid', content: response };
        } else {
          return { status: 'error', content: response };
        }
      }
    });
  }
  static async createTeam(param) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/createTeam",
      JSON.stringify({ name: param.name, desc: param.desc })
    );
  }
  static async getTeamInfo(param = {}) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/teamInfo",
      JSON.stringify({ uid: param.uid || "", pid: param.pid })
    );
  }
  static async getTeamList(param = {}) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/teamList",
      JSON.stringify({ uid: param.uid || "" })
    );
  }
  static async getJoinedTeamList(param = {}) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/joinedTeamList",
      JSON.stringify({ uid: param.uid || "" })
    );
  }
  static async getDashboard() {
    await this.getPrtoken();
    return this.basicAuth("/api/dashboard", "");
  }
  static async createProject(param) {
    await this.getPrtoken();
    return this.basicAuth("/api/createProject", JSON.stringify({ ...param }));
  }
  static async getProjectDetail(param = {}) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/projectDetail",
      JSON.stringify({ projectid: param.id })
    );
  }
  static async getProjectList(param = {}) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/projectList",
      JSON.stringify({ uid: param.uid || "" })
    );
  }
  static async getJoinedProjectList(param = {}) {
    await this.getPrtoken();
    return this.basicAuth(
      "/api/joinedProjectList",
      JSON.stringify({ uid: param.uid || "" })
    );
  }
  static async createProjectItem(param = {}){
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/create-item",
      JSON.stringify({ ...param })
    );
  }
  static async getProjectItem(param={}){
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/get-item",
      JSON.stringify({ projectId: param.projectId, type: param.type })
    );
  }
  static async getUserInfo(param = {}) {
    await this.getPrtoken();
    return this.basicAuth('/api/userinfo', JSON.stringify({ uid: param.uid||'' }), );
  }
  static async getUpdateList(param = {}){
    return this.basicAuth('/api/getUpdateList', JSON.stringify({ page:param.page }), );
  }

  /* 实验性功能 */
  static async getAIWelcome(){
    return this.basicAuth('/api/ai/welcome', '', );
  }
  static async AI_createWorkflow(param){
    await this.getPrtoken();
    return this.basicAuth('/api/ai/createWorkflow', JSON.stringify(param), );
  }
  static async chatWithAI(list, param) {
    await this.getPrtoken();
    const res = await this.basicAuth(
      "/api/ai/send",
      JSON.stringify({ content: JSON.stringify(list), vf: param.fingerprint })
    );
    if (res.status === "sus") {
      await this.getStreamText('/api/ai/stream', { content: JSON.stringify(list),}, {
        onmessage:param.onmessage,
        onclose:param.onclose
      });
    }
  }

  static async getStreamText(url,postData,param) {
    await this.getPrtoken();
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
      credentials: "include",
    };
    const response = await fetch(url, postOptions);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) { param.onclose(); break; }
      const textArray = (decoder.decode(value, { stream: true }).replace(/\n/g,"").trim().replace('data: ','')).split('data: ');
      for (const text of textArray) {
        if(text == '[DONE]') continue;
        param.onmessage(text);
      }
    }
  }


  static async getAIGuestList() {
    await this.getPrtoken();
    return this.basicAuth("/api/danger/viewAIGuest");
  }
  static async getUserFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    return visitorId;
  }
}

export default Auth;
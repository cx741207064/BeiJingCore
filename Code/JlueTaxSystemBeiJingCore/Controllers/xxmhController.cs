using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using JlueTaxSystemBeiJingCore.Code;
using Microsoft.AspNetCore.Http;
using System.Runtime.InteropServices;
using System.Text;

namespace JlueTaxSystemBeiJingCore.Controllers
{
    public class xxmhController : Controller
    {
        YsbqcSetting set { get; }

        Service service { get; }

        IHostingEnvironment he { get; }

        string action { get { return RouteData.Values["action"].ToString(); } }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        List<string> param { get; } = new List<string>();

        public xxmhController(IHostingEnvironment _he, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            set = _set;
            service = _ser;
        }

        [Route("/xxmh/html/index_login.html")]
        public ActionResult index_login()
        {
            string questionId = Request.Query["questionId"];
            string userquestionId = Request.Query["userquestionId"];
            string companyId = Request.Query["companyId"];
            string classId = Request.Query["classid"];
            string courseId = Request.Query["courseid"];
            string userId = Request.Query["userid"];
            string Name = Request.Query["Name"];

            if (!string.IsNullOrEmpty(questionId))
            {
                HttpContext.Session.SetString("questionId", questionId);
                HttpContext.Session.SetString("userquestionId", userquestionId);
                HttpContext.Session.SetString("companyId", companyId);
                HttpContext.Session.SetString("classId", classId);
                HttpContext.Session.SetString("courseId", courseId);
                HttpContext.Session.SetString("userId", userId);
                HttpContext.Session.SetString("Name", Name);

                JObject jo = new JObject();
                jo["questionId"] = questionId;
                jo["userquestionId"] = userquestionId;
                jo["companyId"] = companyId;
                jo["classId"] = classId;
                jo["courseId"] = courseId;
                jo["userId"] = userId;
                jo["Name"] = Name;

                string split;
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    split = "\\";
                }
                else
                {
                    split = "/";
                }
                string path = he.ContentRootPath + split + "Log";
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                string fileFullPath = path + split + "Session.json";
                StringBuilder str = new StringBuilder();
                str.Append(JsonConvert.SerializeObject(jo));
                StreamWriter sw;
                sw = System.IO.File.CreateText(fileFullPath);
                sw.WriteLine(str.ToString());
                sw.Close();
            }

            return View();
        }

        [Route("/xxmh/viewsControlController/getGolobalTitle.do")]
        public string getGolobalTitle()
        {
            param.Add(action);
            retStr = set.GetJsonString(param);
            return retStr;
        }

        [Route("/xxmh/viewsControlController/getShowGdsbz.do")]
        public string getShowGdsbz()
        {
            param.Add(action);
            retStr = set.GetJsonString(param);
            return retStr;
        }

        [Route("/xxmh/portalSer/checkLogin.do")]
        public JObject checkLogin()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/xxmh/bj/tzgg/query.do")]
        public JObject query()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/xxmh/sycdController/getCd.do")]
        public JObject getCd()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.setHeadNsrxx(retJobj);
            service.formatCd(retJobj);
            return retJobj;
        }

        [Route("/xxmh/myCenterController/getDbsx.do")]
        public JObject getDbsx()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/xxmh/myCenterController/getSstx.do")]
        public JObject getSstx()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/xxmh/myCenterController/getTzgg.do")]
        public JObject getTzgg()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/xxmh/cygnController/getCygncdDetail.do")]
        public JArray getCygncdDetail()
        {
            param.Add(action);
            retJarr = set.GetJsonArray(param);
            return retJarr;
        }

        [Route("/xxmh/portalSer/getRootMenu.do")]
        public string getRootMenu()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.setHeadNsrxx(retJobj);
            retStr = set.JsonToString(retJobj);
            return retStr;
        }

        [Route("/xxmh/portalSer/getSubMenus.do")]
        public string getSubMenus(string m1)
        {
            param.Add(action);
            param.Add(m1);
            retStr = set.GetJsonString(param);
            return retStr;
        }

        [Route("/xxmh/mlogController/addLog.do")]
        public string addLog()
        {
            param.Add(action);
            retStr = set.GetJsonString(param);
            return retStr;
        }

    }
}
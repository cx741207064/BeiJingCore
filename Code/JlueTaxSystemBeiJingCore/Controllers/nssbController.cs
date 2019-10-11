using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using JlueTaxSystemBeiJingCore.Code;
using Microsoft.AspNetCore.Hosting;
using JlueTaxSystemBeiJingCore.Models;

namespace JlueTaxSystemBeiJingCore.Controllers
{
    public class nssbController : Controller
    {
        YsbqcSetting set { get; }

        Service service { get; }

        IHostingEnvironment he { get; }

        string action { get { return RouteData.Values["action"].ToString(); } }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        Model m { get; set; }

        List<string> param { get; } = new List<string>();

        public nssbController(IHostingEnvironment _he, YsbqcSetting _set,Service _ser)
        {
            he = _he;
            set = _set;
            service = _ser;
        }

        [Route("/sbzs-cjpt-web/nssb/zzsybnsr/sffx/getData.do")]
        public JObject getData()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/sbzs-cjpt-web/nssb/getOtherData.do")]
        public JValue getOtherData()
        {
            param.Add(action);
            retJval = set.GetXmlValue(param);
            return retJval;
        }

        [Route("/sbzs-cjpt-web/nssb/jscwbbSbqx.do")]
        public JValue jscwbbSbqx()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            retJval = set.JTokenToJValue(retJtok);
            return retJval;
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/sbzf.do")]
        public ActionResult sbzf()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/getSsqz.do")]
        public string getSsqz()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.getSsqz(retJobj);
            retStr = set.JsonToString(retJobj);
            return retStr;
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/getsbzf.do")]
        public JValue getsbzf()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            service.getsbzf(retJtok);
            retJval = set.JTokenToJValue(retJtok);
            return retJval;
        }

        [Route("/sbzs-cjpt-web/nssb/jySbgzOrzf.do")]
        public JValue jySbgzOrzf()
        {
            param.Add(action);
            retJtok = set.GetJsonValue(param);
            retJval = set.JTokenToJValue(retJtok);
            return retJval;
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/getSbqx.do")]
        public string getSbqx()
        {
            param.Add(action);
            retStr = set.GetJsonString(param);
            return retStr;
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/sbzfmx.do")]
        public ActionResult sbzfmx(int pzxh)
        {
            m = service.getModel(pzxh);
            return View(m);
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/getsbzfmx.do")]
        public string getsbzfmx(int pzxh)
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.getsbzfmx(pzxh, retJobj);
            return set.JsonToString(retJobj);
        }

        [Route("/sbzs-cjpt-web/nssb/sbzf/sbZfSubmit.do")]
        public string sbZfSubmit()
        {
            JObject reqParamsJSON = JObject.Parse(Request.Form["reqParamsJSON"]);
            string pzxh = reqParamsJSON["pzxh"].ToString();
            service.sbZfSubmit(int.Parse(pzxh));
            param.Add(action);
            retStr = set.GetJsonString(param);
            return retStr;
        }

    }
}
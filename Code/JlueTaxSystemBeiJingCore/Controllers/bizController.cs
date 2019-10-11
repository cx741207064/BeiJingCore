using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlueTaxSystemBeiJingCore.Code;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Web;
using System.Text;
using Microsoft.AspNetCore.Http;
using JlueTaxSystemBeiJingCore.Models;

namespace JlueTaxSystemBeiJingCore.Controllers
{
    public class bizController : Controller
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

        Model m { get; set; }

        public bizController(IHostingEnvironment _he, YsbqcSetting _set, Service _ser)
        {
            he = _he;
            set = _set;
            service = _ser;
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/{op}")]
        public ActionResult sbqc(string op)
        {
            param.Add(op);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("/sbzs-cjpt-web/biz/yqsb/yqsbqc")]
        public ActionResult yqsbqc()
        {
            return View(set.functionNotOpen);
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/{submenu}/setting")]
        public ActionResult sbqcSetting(string submenu)
        {
            m = service.getModel(Ywbm.lhfjssb.ToString());
            return View(submenu + "_setting", m);
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/enterSbqc")]
        public async Task<JObject> enterSbqc()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            await service.aqsb_getSbqcList(retJobj);
            return retJobj;
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/sbqxControl")]
        public string sbqxControl(string type, string yzpzzlDm)
        {
            param.Add(action);
            param.Add(type);
            param.Add(yzpzzlDm);
            retStr = set.GetJsonString(param);
            return retStr;
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/sbqc_qtsb/enterQtsb")]
        public JObject enterQtsb()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            service.enterQtsb(retJobj);
            return retJobj;
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/{submenu}/{op}urlControl")]
        public string urlControl(string sbywbm, string op)
        {
            param.Add(op + action);
            param.Add(sbywbm);
            retStr = set.GetJsonString(param);
            return retStr;
        }

        [Route("/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/refreshSbqc")]
        public async Task<string> refreshSbqc(string type)
        {
            param.Add(action);
            param.Add(type);
            retJobj = set.GetJsonObject(param);
            if (type != "oneRefresh")
            {
                await service.aqsb_getSbqcList(retJobj);
            }
            retStr = set.JsonToString(retJobj);
            return retStr;
        }

        [Route("/sbzs-cjpt-web/biz/yqsb/yqsbqc/enterYqsbUrl")]
        public JObject enterYqsbUrl(string sbywbm)
        {
            param.Add(action);
            param.Add(sbywbm);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/sbzs-cjpt-web/biz/sbzs/{dm}")]
        public ActionResult sbzs(Ywbm dm, char ybsb)
        {
            if (ybsb == 'Y' && dm == Ywbm.ybnsrzzs)
            {
                return View(set.functionNotOpen);
            }
            param.Add(dm.ToString());
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/begin")]
        public ActionResult begin(string dm, string reset)
        {
            param.Add(action);
            cr = set.GetHtml(param);
            if (reset == "Y")
            {
                service.reset(dm);
            }
            return cr;
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/xSheets")]
        public JArray xSheets(Ywbm dm)
        {
            param.Add(action);
            retJarr = set.GetJsonArray(param);
            if (dm == Ywbm.ybnsrzzs)
            {
                service.setYbnsrzzsXbsz(retJarr);
            }
            return retJarr;
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/xFormula")]
        public JArray xFormula(string dm)
        {
            param.Add(action);
            retJarr = set.GetJsonArray(param);
            return retJarr;
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/xInitData")]
        public async Task<JObject> xInitData(string dm)
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            await service.getInitData(dm, retJobj);
            return retJobj;
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/xTempSave")]
        public async Task<JObject> xTempSave(string dm)
        {
            string ywbm = dm;
            string inputData = HttpUtility.UrlDecode(Request.Form["formData"], Encoding.UTF8);
            JObject input_jo = JsonConvert.DeserializeObject<JObject>(inputData);
            await service.SaveDataService(ywbm, input_jo);
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

        [Route("/sbzs-cjpt-web/biz/cwbb/cwbb_main")]
        public ActionResult cwbb_main()
        {
            return Redirect("/sbzs-cjpt-web/biz/setting/cwbbydy?ywbm=CWBBYDY");
        }

        [Route("/sbzs-cjpt-web/biz/cwbb/cwbb_qy_kjzz_ybqy")]
        public ActionResult cwbb_qy_kjzz_ybqy()
        {
            param.Add(action);
            cr = set.GetHtml(param);
            return cr;
        }

        [Route("/sbzs-cjpt-web/biz/setting/{act}")]
        public ActionResult setting(string act)
        {
            param.Add(act);
            cr = set.GetHtml(param, "aspx");
            return cr;
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/make")]
        public ActionResult make()
        {
            return View();
        }

        [Route("/sbzs-cjpt-web/biz/{submenu}/{dm}/well")]
        public ActionResult well(string dm)
        {
            Model m = service.getModel(dm);
            return View(m);
        }

    }
}
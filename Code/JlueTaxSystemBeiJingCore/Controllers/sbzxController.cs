using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using JlueTaxSystemBeiJingCore.Code;

namespace JlueTaxSystemBeiJingCore.Controllers
{
    public class sbzxController : Controller
    {
        YsbqcSetting set { get; }

        string action { get { return RouteData.Values["action"].ToString(); } }

        JObject retJobj { get; set; }

        List<string> param { get; } = new List<string>();

        public sbzxController(YsbqcSetting _set)
        {
            set = _set;
        }

        [Route("/sbzx-cjpt-web/ywzt/getYsData.do")]
        public JObject getYsData()
        {
            param.Add(action);
            retJobj = set.GetJsonObject(param);
            return retJobj;
        }

    }
}
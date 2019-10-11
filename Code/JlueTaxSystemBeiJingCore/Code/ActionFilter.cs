using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

namespace JlueTaxSystemBeiJingCore.Code
{
    public class ActionFilter : IActionFilter
    {
        private readonly IHostingEnvironment he;

        public ActionFilter(IHostingEnvironment _he)
        {
            he = _he;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
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
            string fileFullPath = path + split + "Session.json";
            if (!System.IO.File.Exists(fileFullPath))
            {
                return;
            }
            string str = System.IO.File.ReadAllText(fileFullPath);
            JObject jo = JsonConvert.DeserializeObject<JObject>(str);
            context.HttpContext.Session.SetString("questionId", jo["questionId"].ToString());
            context.HttpContext.Session.SetString("userquestionId", jo["userquestionId"].ToString());
            context.HttpContext.Session.SetString("companyId", jo["companyId"].ToString());
            context.HttpContext.Session.SetString("classId", jo["classId"].ToString());
            context.HttpContext.Session.SetString("courseId", jo["courseId"].ToString());
            context.HttpContext.Session.SetString("userId", jo["userId"].ToString());
            context.HttpContext.Session.SetString("Name", jo["Name"].ToString());
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            //context.HttpContext.Response.WriteAsync($"{GetType().Name} out. \r\n");
        }
    }
}

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JlueTaxSystemBeiJingCore.Models;
using JlueTaxSystemBeiJingCore.Views.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.RegularExpressions;
using System.Text;

namespace JlueTaxSystemBeiJingCore.Controllers
{
    public class HomeController : Controller
    {
        IHttpContextAccessor hca { get; }

        public HomeController(IHttpContextAccessor _hca)
        {
            hca = _hca;
        }

        public ActionResult Index()
        {
            return RedirectToAction("QuestionMain");
        }

        [Route("QuestionMain.aspx")]
        public ActionResult QuestionMain(string userid, string classid, string sortid)
        {
            string content = "";
            if (string.IsNullOrEmpty(userid))
            {
                content += "userid" + "不能为空，";
            }
            if (string.IsNullOrEmpty(classid))
            {
                content += "classid" + "不能为空，";
            }
            if (string.IsNullOrEmpty(sortid))
            {
                content += "sortid" + "不能为空";
            }
            if (content != "")
            {
                ErrorModel m = new ErrorModel { title = "参数错误", message = content };
                return View("Error", m);
            }
            return View();
        }

        [Route("/Error")]
        public ActionResult Error()
        {
            string Accept = hca.HttpContext.Request.Headers["Accept"];
            Exception ex = hca.HttpContext.Features.Get<IExceptionHandlerFeature>().Error;
            if (Regex.IsMatch(Accept, "json"))
            {
                return Content(ex.Message, "application/json", Encoding.UTF8);
            }
            ErrorModel em = new ErrorModel();
            em.title = "未知错误";
            em.message = ex.Message;
            em.stackTrace = ex.StackTrace;
            return View(em);
        }

    }
}

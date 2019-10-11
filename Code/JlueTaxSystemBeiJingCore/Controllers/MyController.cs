using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlueTaxSystemBeiJingCore.Code;
using Microsoft.AspNetCore.Mvc;

namespace JlueTaxSystemBeiJingCore.Controllers
{
    public class MyController : Controller
    {
        YsbqcSetting set { get; }

        public MyController(YsbqcSetting _set)
        {
            set = _set;
        }

        [Route("/zlpz-cjpt-web/view/ssws/viewAttachment.jsp")]
        public ActionResult viewAttachment()
        {
            return View(set.functionNotOpen);
        }

        [Route("/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do")]
        public ActionResult viewOrDownloadPdfFile()
        {
            return View(set.functionNotOpen);
        }

        [Route("/portalExt/controller/menu")]
        public ActionResult menu()
        {
            return View(set.functionNotOpen);
        }

        [Route("/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do")]
        public ActionResult showQjssPage()
        {
            return View(set.functionNotOpen);
        }

        [Route("/zyywn-cjpt-web/tzgg/preZcfg.do")]
        public ActionResult preZcfg()
        {
            return View(set.functionNotOpen);
        }

    }
}
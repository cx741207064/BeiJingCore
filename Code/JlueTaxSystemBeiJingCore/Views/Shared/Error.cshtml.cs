using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace JlueTaxSystemBeiJingCore.Views.Shared
{
    public class ErrorModel : PageModel
    {
        public string title { get; set; }

        public string message { get; set; }

        public string stackTrace { get; set; }

        public void OnGet()
        {
        }
    }
}
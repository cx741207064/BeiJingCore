using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Xml;
using Formatting = Newtonsoft.Json.Formatting;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Web;
using JlueTaxSystemBeiJingCore.Models;
using System.Reflection;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;

namespace JlueTaxSystemBeiJingCore.Code
{
    public class YsbqcSetting : Controller
    {
        public YsbqcSetting(IHostingEnvironment _he, IHttpContextAccessor _hca, IMemoryCache memoryCache)
        {
            he = _he;
            hca = _hca;
            cache = memoryCache;
        }

        static IMemoryCache cache { get; set; }

        IHostingEnvironment he { get; }

        IHttpContextAccessor hca { get; }

        HttpRequest req => hca.HttpContext.Request;

        ISession session => hca.HttpContext.Session;

        string fileName { get; set; }

        string reqPath { get; set; }

        DirectoryInfo Dir { get; set; }

        string JsonStr { get; set; }

        JToken retJtok { get; set; }

        JObject retJobj { get; set; }

        JArray retJarr { get; set; }

        JValue retJval { get; set; }

        string retStr { get; set; }

        ContentResult cr { get; set; }

        XmlDocument xd { get; set; }

        public string functionNotOpen => "FunctionNotOpen";

        public JObject GetJsonObject(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                reqPath = he.WebRootPath + req.Path.Value;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retJobj = JsonConvert.DeserializeObject<JObject>(JsonStr);
                return retJobj;
            }
        }

        public JArray GetJsonArray(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                reqPath = he.WebRootPath + req.Path.Value;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                retJarr = JsonConvert.DeserializeObject<JArray>(JsonStr);
                return retJarr;
            }
        }

        public JToken GetJsonValue(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "json";
                reqPath = he.WebRootPath + req.Path.Value;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                string val = JsonConvert.DeserializeObject<JValue>(JsonStr).Value<string>();
                bool bl = Regex.IsMatch(val, @"\A[\[\{]");
                if (!bl)
                {
                    retJtok = new JValue(val);
                }
                else
                {
                    retJtok = JsonConvert.DeserializeObject<JToken>(val);
                    //retJval = new JValue(JsonConvert.SerializeObject(retJtok));
                }
                return retJtok;
            }
        }

        public string GetJsonString(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    if (!string.IsNullOrEmpty(p))
                    {
                        fileName += p + ".";
                    }
                }
                fileName += "json";
                reqPath = he.WebRootPath + req.Path.Value;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                JsonTextReader reader = new JsonTextReader(new StringReader(JsonStr));
                if (reader.TokenType == JsonToken.None)
                {
                    retStr = JsonStr;
                }
                else
                {
                    retJtok = JsonConvert.DeserializeObject<JToken>(JsonStr);
                    retStr = JsonConvert.SerializeObject(retJtok, Formatting.None);
                }
                return retStr;
            }
        }

        public ContentResult GetHtml(List<string> param, string fileExtension = "html")
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += fileExtension;
                reqPath = he.WebRootPath + req.Path.Value;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                cr = Content(JsonStr, "text/html", Encoding.UTF8);
                return cr;
            }
        }

        public JValue GetXmlValue(List<string> param)
        {
            lock (this)
            {
                fileName = "";
                foreach (string p in param)
                {
                    fileName += p + ".";
                }
                fileName += "xml";
                reqPath = he.WebRootPath + req.Path.Value;
                Dir = Directory.GetParent(reqPath);
                JsonStr = System.IO.File.ReadAllText(Dir.GetFiles(fileName)[0].FullName);
                xd = new XmlDocument();
                xd.LoadXml(JsonConvert.DeserializeObject<JValue>(JsonStr).Value.ToString());
                retJval = new JValue(xd.InnerXml);
                return retJval;
            }
        }

        public SessionModel getSession()
        {
            SessionModel sm = new SessionModel();
            foreach (PropertyInfo pi in sm.GetType().GetProperties())
            {
                pi.SetValue(sm, session.GetString(pi.Name));
            }
            return sm;
        }

        public static SessionModel getCache()
        {
            SessionModel sm = new SessionModel();
            foreach (PropertyInfo pi in sm.GetType().GetProperties())
            {
                string str;
                cache.TryGetValue(pi.Name, out str);
                pi.SetValue(sm, str);
            }
            return sm;
        }

        public static void insertCache(JObject jo)
        {
            cache.Set("questionId", jo["questionId"].ToString());
            cache.Set("userquestionId", jo["userquestionId"].ToString());
            cache.Set("companyId", jo["companyId"].ToString());
            cache.Set("classId", jo["classId"].ToString());
            cache.Set("courseId", jo["courseId"].ToString());
            cache.Set("userId", jo["userId"].ToString());
            cache.Set("Name", jo["Name"].ToString());
        }

        public string MapPath(string fileName)
        {
            reqPath = he.WebRootPath + req.Path.Value;
            Dir = Directory.GetParent(reqPath);
            string FullName = Dir.GetFiles(fileName)[0].FullName;
            return FullName;
        }

        public JValue JTokenToJValue(JToken jt)
        {
            Type type = jt.GetType();
            if (type == typeof(JObject) || type == typeof(JArray))
            {
                return new JValue(JsonConvert.SerializeObject(jt));
            }
            else
            {
                return new JValue(jt.Value<string>());
            }
        }

        public string JsonToString(JToken jt)
        {
            return JsonConvert.SerializeObject(jt, Formatting.None);
        }

    }
}
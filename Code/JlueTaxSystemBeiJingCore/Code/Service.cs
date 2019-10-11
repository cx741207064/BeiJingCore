using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using JlueTaxSystemBeiJingCore.Models;
using System.Xml;
using System.IO;

namespace JlueTaxSystemBeiJingCore.Code
{
    public class Service
    {
        YsbqcSetting set { get; }

        Repository repos { get; }

        GDTXUserYSBQC qc { get; set; }

        GDTXDate gd { get; set; }

        Nsrxx xx { get; set; }

        IHostingEnvironment he { get; }

        IHttpContextAccessor hca { get; }

        HttpRequest req => hca.HttpContext.Request;

        public Service(IHostingEnvironment _he, YsbqcSetting _set, IHttpContextAccessor _hca, Repository _rep)
        {
            he = _he;
            set = _set;
            hca = _hca;
            repos = _rep;
        }

        public async Task SaveDataService(string ywbm, JToken input_jo)
        {
            await Task.Run(() =>
              {
                  if (ywbm == Ywbm.cwbbydy.ToString())
                  {
                      return;
                  }
                  qc = repos.getUserYSBQC(ywbm);
                  GTXResult saveresult = repos.SaveUserYSBQCReportData(input_jo, qc.Id, ywbm);
                  if (saveresult.IsSuccess)
                  {
                      UpdateYsbqcSBSE(qc.Id, input_jo, ywbm);
                  }
              });
        }

        public void UpdateYsbqcSBSE(int userYSBQCId, JToken input_jo, string ywbm)
        {
            string sbse = "";
            string s = ywbm;
            switch (s)
            {
                case "ybnsrzzs":
                    sbse = input_jo["zzsybsbSbbdxxVO"]["zzssyyybnsr_zb"]["zbGrid"]["zbGridlbVO"][0]["bqybtse"].ToString();
                    break;
                case "lhfjssb":
                    sbse = input_jo.SelectToken("fjsSbbdxxVO.fjssbb.sbxxGrid.bqybtsehj").ToString();
                    break;
                case "qysds_a_18yjd":
                    sbse = input_jo.SelectToken("ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.ybtsdseLj").ToString();
                    break;
                case "xgmzzs":
                    sbse = input_jo.SelectToken("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[0].bqybtse").ToString();
                    break;
            }
            repos.UpdateSBSE(userYSBQCId, sbse);
        }

        public async Task getInitData(string ywbm, JObject initJobj)
        {
            await Task.Run(() =>
            {
                qc = repos.getUserYSBQC(ywbm);
                JToken dbData = repos.getUserYSBQCReportData(qc.Id, qc.ywbm);
                if (dbData.HasValues)
                {
                    initJobj["body"] = JsonConvert.SerializeObject(dbData);
                    initJobj["flagExecuteInitial"] = false;
                }
                else
                {
                    JObject nsrjbxx;
                    JObject body = JObject.Parse(initJobj["body"].Value<string>());
                    switch (ywbm)
                    {
                        case "ybnsrzzs":
                            gd = repos.getGDTXDate(qc.ywbm);
                            nsrjbxx = (JObject)body["qcs"]["initData"]["nsrjbxx"];
                            JObject zzsybnsrsbInitData = (JObject)body["qcs"]["initData"]["zzsybnsrsbInitData"];
                            //清空银行卡信息
                            zzsybnsrsbInitData["zzsybnsrSfxy"] = new JArray();
                            //设置日期
                            zzsybnsrsbInitData["sbrq"] = gd.tbrq;
                            zzsybnsrsbInitData["sssq"]["rqQ"] = gd.skssqq;
                            zzsybnsrsbInitData["sssq"]["rqZ"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            getYbnsrzzsBnlj(zzsybnsrsbInitData);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case "lhfjssb":
                            gd = repos.getGDTXDate(qc.ywbm);
                            nsrjbxx = (JObject)body["qcs"]["initData"]["nsrjbxx"];
                            JObject fjssbInitData = (JObject)body["qcs"]["initData"]["fjssbInitData"];
                            nsrjbxx["tbrq"] = gd.tbrq;
                            fjssbInitData["sssq"]["rqQ"] = gd.skssqq;
                            fjssbInitData["sssq"]["rqZ"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case "qysds_a_18yjd":
                            gd = repos.getGDTXDate(qc.ywbm);
                            nsrjbxx = (JObject)body["fq"]["nsrjbxx"];
                            JObject sssq = (JObject)body["fq"];
                            nsrjbxx["tbrq"] = gd.tbrq;
                            sssq["sssq"]["sqQ"] = gd.skssqq;
                            sssq["sssq"]["sqZ"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                        case "cwbb_qy_kjzz_ybqy":
                            gd = repos.getGDTXDate(qc.ywbm);
                            nsrjbxx = (JObject)body["qcs"]["djNsrxx"];
                            JObject ZlbssldjNsrxxVO = (JObject)body["ZlbssldjNsrxxVO"];
                            body["qcs"]["bsrq"] = gd.tbrq;
                            ZlbssldjNsrxxVO["ssqq"] = gd.skssqq;
                            ZlbssldjNsrxxVO["ssqz"] = gd.skssqz;
                            setNsrxx(nsrjbxx);
                            initJobj["body"] = new JValue(JsonConvert.SerializeObject(body));
                            break;
                    }
                }
            });
        }

        public async Task mainSetting(string ywbm, JToken input)
        {
            await Task.Run(() =>
            {
                switch (ywbm)
                {
                    case "ybnsrzzsxbsz":
                        qc = repos.getUserYSBQC(Ywbm.ybnsrzzs.ToString());
                        JToken ybnsrzzsxbsz = repos.getUserYSBQCReportData(qc.Id, ywbm);
                        if (ybnsrzzsxbsz.HasValues)
                        {
                            input["body"] = ybnsrzzsxbsz;
                        }
                        break;
                    case "cwbbydy":
                        qc = repos.getUserYSBQC(Ywbm.cwbb_qy_kjzz_ybqy.ToString());
                        JObject body = JObject.Parse(input.SelectToken("body").Value<string>());
                        DateTime dt1 = DateTime.Parse(qc.SKSSQQ);
                        DateTime dt2 = DateTime.Parse(qc.SKSSQZ);
                        int ts = dt2.Month - dt1.Month;
                        if (ts != 2)
                        {
                            string msg = "税款所属期起：" + qc.SKSSQQ + "税款所属期止：" + qc.SKSSQZ + "不是季报";
                            Exception ex = new Exception(msg);
                            throw ex;
                        }
                        body["cwbbbsjcsz"]["sssqq"] = qc.SKSSQQ;
                        body["cwbbbsjcsz"]["sssqz"] = qc.SKSSQZ;
                        input["body"] = new JValue(JsonConvert.SerializeObject(body));
                        break;
                }
            });
        }

        void setNsrxx(JObject in_jo)
        {
            xx = repos.getNsrxx();
            in_jo["nsrmc"] = xx.NSRMC;
            in_jo["nsrsbh"] = xx.NSRSBH;
            in_jo["djzclxMc"] = xx.DJZCLX;
            in_jo["zcdz"] = xx.ZCDZ;
            in_jo["jydz"] = xx.SCJYDZ;
            in_jo["dhhm"] = xx.LXDH;
            in_jo["sshy"] = xx.GBHY;
            in_jo["hymc"] = xx.GBHY;
            in_jo["zgswskfjmc"] = xx.ZGDSSWJFJMC;
            in_jo["frxm"] = xx.Name;
            in_jo["fddbrsfzjhm"] = xx.IDCardNum;
        }

        void getYbnsrzzsBnlj(JObject in_jo)
        {
            string Name = set.getSession().Name;
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(File.ReadAllText(he.WebRootPath + "/industry.xml"));
            JToken industry = JsonConvert.DeserializeObject<JToken>(JsonConvert.SerializeXmlNode(doc));
            industry = industry.SelectToken("root.industry").Where(a => a["name"].ToString() == Name).ToList()[0];
            JObject zzsybnsrsbInitData_jo = JObject.Parse(File.ReadAllText(set.MapPath("zzsybnsrsbInitData." + industry["value"] + ".json")));
            in_jo.Merge(zzsybnsrsbInitData_jo, new JsonMergeSettings { MergeArrayHandling = MergeArrayHandling.Union });
        }

        public string getSBCGMessage(int id)
        {
            qc = repos.getUserYSBQC(id);
            gd = repos.getGDTXDate(qc.ywbm);
            string str = "";
            Ywbm bm = Enum.Parse<Ywbm>(qc.ywbm);
            switch (bm)
            {
                case Ywbm.ybnsrzzs:
                case Ywbm.xgmzzs:
                case Ywbm.lhfjssb:
                case Ywbm.qysds_a_18yjd:
                    str = string.Format("您的税款所属期为{0}至{1}的{2}（应征凭证序号为：**********）已申报成功。税款金额：{3}元，无需进行缴款。", gd.skssqq, gd.skssqz, qc.TaskName, qc.SBSE);
                    break;
                case Ywbm.cwbb_qy_kjzz_ybqy:
                    str = string.Format("您所报送的所属期为{0}至{1}的《企业会计准则（一般企业）财务报表报送与信息采集》已成功提交给税务机关。", gd.skssqq, gd.skssqz);
                    break;
            }
            return str;
        }

        public Model getModel(string dm)
        {
            qc = repos.getUserYSBQC(dm);
            gd = repos.getGDTXDate(dm);
            xx = repos.getNsrxx();
            Model m = new Model { qc = qc, GDTXDate = gd, Nsrxx = xx };
            return m;
        }

        public Model getModel(int id)
        {
            qc = repos.getUserYSBQC(id);
            gd = repos.getGDTXDate(id);
            xx = repos.getNsrxx();
            Model m = new Model { qc = qc, GDTXDate = gd, Nsrxx = xx };
            return m;
        }

        public void getsbzf(JToken re_json)
        {
            JArray sbzfList = new JArray();
            List<GDTXUserYSBQC> ysbqclist = repos.getYsbYSBQC();
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject item_jo = new JObject();
                item_jo["yzpzzlmc"] = item.TaskName;
                item_jo["sbrq"] = item.HappenDate;
                item_jo["skssqq"] = item.SKSSQQ;
                item_jo["skssqz"] = item.SKSSQZ;
                item_jo["ybtse"] = item.SBSE;
                item_jo["sbqdzf"] = "Y";
                item_jo["sbfsDm"] = "32";
                item_jo["pzxh"] = item.Id;
                item_jo["gdslxDm"] = "2";
                item_jo["yzpzzlDm"] = item.yzpzzlDm;
                item_jo["zsxmDm"] = "";
                item_jo["zsxmmc"] = "";
                item_jo["sbfsmc"] = "网络申报";
                sbzfList.Add(item_jo);
            }
            re_json["sbzfList"] = sbzfList;
        }

        public void getsbzfmx(int id, JObject in_jo)
        {
            JArray out_ja = new JArray();
            JToken data_json = new JObject();
            qc = repos.getUserYSBQC(id);
            data_json = repos.getUserYSBQCReportData(qc.Id, qc.ywbm);

            JObject jo = new JObject();
            JObject jo2 = new JObject();
            JObject jo3 = new JObject();
            Sbzfmx mx;
            Ywbm ywbm = Enum.Parse<Ywbm>(qc.ywbm.ToLower());
            switch (ywbm)
            {
                case Ywbm.ybnsrzzs:
                    jo.Add("zsxmDm", "10101");
                    jo.Add("skssqq", qc.SKSSQQ);
                    jo.Add("gdslxDm", "1");
                    jo.Add("sl1", "0.06");
                    jo.Add("pzxh", "10011119000006167259");
                    jo.Add("pzmxxh", "1");
                    jo.Add("zspmmc", "咨询服务");
                    jo.Add("ybtse", "0");
                    jo.Add("ynse", "");
                    jo.Add("skssqz", qc.SKSSQZ);
                    jo.Add("zsxmmc", "增值税");
                    jo.Add("zspmDm", "101016703");
                    out_ja.Add(jo);
                    jo2 = (JObject)jo.DeepClone();
                    jo2["sl1"] = "0.13";
                    jo2["pzmxxh"] = "2";
                    jo2["zspmmc"] = "商业(17%、16%)";
                    jo2["zspmDm"] = "101014001";
                    jo2["ybtse"] = qc.SBSE;
                    out_ja.Add(jo2);
                    break;
                case Ywbm.lhfjssb:
                    JToken sbxxGridlbVO = data_json.SelectToken("fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO");

                    jo.Add("zsxmDm", "10109");
                    jo.Add("skssqq", qc.SKSSQQ);
                    jo.Add("gdslxDm", "2");
                    jo.Add("sl1", "0.07");
                    jo.Add("pzxh", "10021119000009000150");
                    jo.Add("pzmxxh", "1");
                    jo.Add("zspmmc", "市区（增值税附征）");
                    jo.Add("skssqz", qc.SKSSQZ);
                    jo.Add("zsxmmc", "城市维护建设税");
                    jo.Add("zspmDm", "101090201");
                    JToken bqybtse = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqybtse"];
                    JToken bqynsfe = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqynsfe"];
                    jo.Add("ybtse", bqybtse.Value<string>());
                    jo.Add("ynse", bqynsfe.Value<string>());
                    out_ja.Add(jo);

                    jo2 = (JObject)jo.DeepClone();
                    jo2["zsxmDm"] = "30203";
                    jo2["sl1"] = "0.03";
                    jo2["pzmxxh"] = "2";
                    jo2["zspmmc"] = "增值税教育费附加";
                    jo2["zsxmmc"] = "教育费附加";
                    jo2["zspmDm"] = "302030100";
                    bqybtse = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo2["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqybtse"];
                    bqynsfe = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo2["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqynsfe"];
                    jo2["ybtse"] = bqybtse.Value<string>();
                    jo2["ynse"] = bqynsfe.Value<string>();
                    out_ja.Add(jo2);

                    jo3 = (JObject)jo.DeepClone();
                    jo3["zsxmDm"] = "30216";
                    jo3["sl1"] = "0.02";
                    jo3["pzmxxh"] = "3";
                    jo3["zspmmc"] = "增值税地方教育附加";
                    jo3["zsxmmc"] = "地方教育附加";
                    jo3["zspmDm"] = "302160100";
                    bqybtse = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo3["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqybtse"];
                    bqynsfe = sbxxGridlbVO.Where(a => a["zspmDm"].Value<string>() == jo3["zspmDm"].Value<string>()).ToList<JToken>()[0]["bqynsfe"];
                    jo3["ybtse"] = bqybtse.Value<string>();
                    jo3["ynse"] = bqynsfe.Value<string>();
                    out_ja.Add(jo3);
                    break;
                case Ywbm.qysds_a_18yjd:
                    JToken sbbxxForm = data_json.SelectToken("ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm");
                    mx = new Sbzfmx();
                    mx.zsxmDm = "10101";
                    mx.skssqq = qc.SKSSQQ;
                    mx.gdslxDm = "1";
                    mx.sl1 = "0.25";
                    mx.pzxh = qc.Id.ToString();
                    mx.pzmxxh = "1";
                    mx.zspmmc = "应纳税所得额";
                    mx.ybtse = qc.SBSE;
                    mx.ynse = sbbxxForm["ynsdseLj"].ToString();
                    mx.skssqz = qc.SKSSQZ;
                    mx.zsxmmc = "企业所得税";
                    mx.zspmDm = "101040001";
                    jo = JObject.Parse(JsonConvert.SerializeObject(mx));
                    out_ja.Add(jo);
                    break;
                case Ywbm.xgmzzs:
                    JToken zzsxgmGridlb = data_json.SelectToken("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[0]");
                    mx = new Sbzfmx();
                    mx.zsxmDm = "";
                    mx.skssqq = qc.SKSSQQ;
                    mx.gdslxDm = "1";
                    mx.sl1 = "0.03";
                    mx.pzxh = qc.Id.ToString();
                    mx.pzmxxh = "1";
                    mx.zspmmc = "";
                    mx.ybtse = qc.SBSE;
                    mx.ynse = zzsxgmGridlb["bqynse"].ToString();
                    mx.skssqz = qc.SKSSQZ;
                    mx.zsxmmc = "小规模增值税";
                    mx.zspmDm = "";
                    jo = JObject.Parse(JsonConvert.SerializeObject(mx));
                    out_ja.Add(jo);
                    break;
                case Ywbm.cwbb_qy_kjzz_ybqy:
                    mx = new Sbzfmx();
                    mx.zsxmDm = "";
                    mx.skssqq = qc.SKSSQQ;
                    mx.gdslxDm = "1";
                    mx.sl1 = "";
                    mx.pzxh = qc.Id.ToString();
                    mx.pzmxxh = "1";
                    mx.zspmmc = qc.TaskName;
                    mx.ybtse = qc.SBSE;
                    mx.ynse = "";
                    mx.skssqz = qc.SKSSQZ;
                    mx.zsxmmc = "财务报表";
                    mx.zspmDm = "";
                    jo = JObject.Parse(JsonConvert.SerializeObject(mx));
                    out_ja.Add(jo);
                    break;
            }
            in_jo["sbzfMxList"] = out_ja;
        }

        public void sbZfSubmit(int id)
        {
            repos.sbZfSubmit(id);
        }

        public void UpdateSBZT(int id, string sbzt)
        {
            repos.UpdateSBZT(id, sbzt);
        }

        public void reset(string dm)
        {
            repos.reset(dm);
        }

        public void setYbnsrzzsXbsz(JArray retJarr)
        {
            qc = repos.getUserYSBQC(Ywbm.ybnsrzzs.ToString());
            JToken data_jv = repos.getUserYSBQCReportData(qc.Id, Ywbm.ybnsrzzsxbsz.ToString());
            if (!data_jv.HasValues)
            {
                return;
            }
            JObject data_jo = JObject.Parse(data_jv.Value<string>());
            JObject jcxxsz = (JObject)data_jo["jcxxsz"];
            for (int i = retJarr.Count - 1; i >= 0; i--)
            {
                JToken jt = jcxxsz.SelectToken(retJarr[i]["dzbdbm"].ToString());
                if (jt.ToString() == "N")
                {
                    retJarr.RemoveAt(i);
                }
            }
        }

        public async Task aqsb_getSbqcList(JObject retJobj)
        {
            JArray out_ja = new JArray();
            List<GDTXUserYSBQC> ysbqclist = await Task.Run(() => repos.getUserYSBQC());
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject jo = new JObject();
                if (item.SBZT == SBZT.YSB)
                {
                    jo.Add("sbztDm", "210");
                    jo.Add("sbrq", item.HappenDate);
                }
                else
                {
                    jo.Add("sbztDm", "");
                    jo.Add("sbrq", "");
                }
                Ywbm ywbm = Enum.Parse<Ywbm>(item.ywbm.ToLower());
                switch (ywbm)
                {
                    case Ywbm.ybnsrzzs:
                        jo.Add("zsxmDm", "10101");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "06");
                        jo.Add("zsxmMc", "增值税(适用于一般纳税人)");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("lastzs", "Y");
                        jo.Add("yzpzzlDm", item.yzpzzlDm);
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "");
                        jo.Add("zspmDm", "101014001");
                        out_ja.Add(jo);
                        break;
                    case Ywbm.lhfjssb:
                        jo.Add("zsxmDm", "30216");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "06");
                        jo.Add("zsxmMc", "地方教育附加");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("yzpzzlDm", item.yzpzzlDm);
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "增值税地方教育附加");
                        jo.Add("zspmDm", "302160100");
                        out_ja.Add(jo);
                        JObject jo2 = (JObject)jo.DeepClone();
                        jo2["zsxmDm"] = "30203";
                        jo2["zsxmMc"] = "教育费附加";
                        jo2["zspmMc"] = "增值税教育费附加";
                        jo2["zspmDm"] = "302030100";
                        out_ja.Add(jo2);
                        JObject jo3 = (JObject)jo.DeepClone();
                        jo3["zsxmDm"] = "10109";
                        jo3["zsxmMc"] = "城市维护建设税";
                        jo3["zspmMc"] = "市区（增值税附征）";
                        jo3["zspmDm"] = "101090101";
                        out_ja.Add(jo3);
                        break;
                    case Ywbm.qysds_a_18yjd:
                        jo.Add("zsxmDm", "10104");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "08");
                        jo.Add("zsxmMc", "企业所得税(月季报)");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("lastzs", "Y");
                        jo.Add("yzpzzlDm", item.yzpzzlDm);
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "应纳税所得额");
                        jo.Add("zspmDm", "101040001");
                        out_ja.Add(jo);
                        break;
                    case Ywbm.xgmzzs:
                        jo.Add("zsxmDm", "10101");
                        jo.Add("jkztDm", "");
                        jo.Add("gdslxDm", "1");
                        jo.Add("nsqxDm", "08");
                        jo.Add("zsxmMc", "增值税(适用于小规模纳税人)");
                        jo.Add("skssqQ", item.SKSSQQ);
                        jo.Add("yxcfsb", "");
                        jo.Add("url", item.Url);
                        jo.Add("lastzs", "Y");
                        jo.Add("yzpzzlDm", item.yzpzzlDm);
                        jo.Add("sbqx", item.SBQX);
                        jo.Add("skssqZ", item.SKSSQZ);
                        jo.Add("sbywbm", item.ywbm.ToUpper());
                        jo.Add("uuid", item.Id);
                        jo.Add("zspmMc", "");
                        jo.Add("zspmDm", "");
                        out_ja.Add(jo);
                        break;
                    case Ywbm.cwbb_qy_kjzz_ybqy:
                        getSbqcCwbb(retJobj, item);
                        break;
                }
            }
            retJobj["sbqcList"] = out_ja;
        }

        private void getSbqcCwbb(JObject retJobj, GDTXUserYSBQC item)
        {
            JObject jo = new JObject();
            jo["bsqx"] = item.SBQX;
            jo["gdslxDm"] = "1";
            jo["sbztDm"] = "000";
            jo["bsrq"] = item.SBZT == SBZT.YSB ? item.HappenDate : "";
            jo["url"] = item.Url;
            jo["gdsbz"] = "gs";
            jo["bsssqQ"] = item.SKSSQQ;
            jo["bsssqZ"] = item.SKSSQZ;
            jo["cwbsxlmc"] = "企业会计准则（一般企业）财务报表报送与信息采集";
            jo["bbbsqDm"] = "3";
            jo["cwkjzd"] = "企业会计准则";
            jo["cwkjzdDm"] = "101";
            jo["cwbsxlDm"] = "ZL1001001";
            retJobj["cwbbList"][0] = jo;
        }

        public void getSbxxcx(JObject re_json)
        {
            JArray sbList = new JArray();
            List<GDTXUserYSBQC> ysbqclist = repos.getYsbYSBQC();
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject item_jo = new JObject();
                item_jo["id"] = item.Id;
                item_jo["pzxh"] = item.Id;
                item_jo["gdslxDm"] = "1";
                item_jo["showType"] = "2";
                item_jo["ywbm"] = item.ywbm.ToUpper();
                item_jo["version"] = "1";
                item_jo["sbzfbz"] = "N";
                item_jo["ywbmmc"] = item.TaskName;
                item_jo["zsxmmc"] = item.ZSXM;
                item_jo["sbrq"] = item.HappenDate;
                item_jo["ssqq"] = item.SKSSQQ;
                item_jo["ssqz"] = item.SKSSQZ;
                item_jo["ybtse"] = item.SBSE;
                sbList.Add(item_jo);
            }
            re_json["sbList"] = sbList;
        }

        public void query(JObject re_json)
        {
            JArray ysbxx = new JArray();
            List<GDTXUserYSBQC> ysbqclist = repos.getYsbYSBQC();
            foreach (GDTXUserYSBQC item in ysbqclist)
            {
                JObject item_jo = new JObject();
                item_jo["gdslx"] = "国地税";
                item_jo["zsxmmc"] = item.ZSXM;
                item_jo["zspmmc"] = item.ZSXM;
                item_jo["dzbzdszlmc"] = item.TaskName;
                item_jo["sbrq_1"] = item.HappenDate;
                item_jo["sbqx"] = item.SBQX;
                item_jo["skssqq"] = item.SKSSQQ;
                item_jo["skssqz"] = item.SKSSQZ;
                item_jo["ysx"] = "";
                item_jo["ynse"] = "";
                item_jo["jmse"] = "";
                item_jo["yjse"] = "";
                item_jo["ybtse"] = item.SBSE;
                ysbxx.Add(item_jo);
            }
            JToken taxML = re_json["taxML"]["body"]["taxML"];
            taxML["ysbxxList"]["ysbxx"] = ysbxx;
            taxML["yqwsbxxList"] = new JObject();
            taxML["yqwsbxxList"]["yqwsbxx"] = new JArray();
        }

        public void formatCd(JObject in_jo)
        {
            JToken ja = in_jo.SelectToken("menus.yhGncds[1].yhGncds");
            IEnumerable<JToken> yhGncds = ja.Where(a => a["cdmc"].ToString() != "公众服务");
            foreach (JObject jo in yhGncds)
            {
                JToken ja2 = jo["yhGncds"];
                IEnumerable<JToken> ijt = ja2.Where(a => a["cdmc"].ToString() != "税费申报及缴纳" && a["cdmc"].ToString() != "申报信息查询");
                foreach (JObject jo2 in ijt)
                {
                    JToken jp = jo2.Property("realUrl");
                    if (jp != null)
                    {
                        jp.Remove();
                    }
                }
            }

            JToken jt = ja.Where(a => a["cdmc"].ToString() == "公众服务").First();
            foreach (JObject jo in jt["yhGncds"])
            {
                foreach (JObject jo2 in jo["yhGncds"])
                {
                    JToken jp = jo2.Property("realUrl");
                    if (jp != null)
                    {
                        jp.Remove();
                    }
                }
            }
        }

        public void enterQtsb(JObject input)
        {
            gd = repos.getGDTXDate(Ywbm.lhfjssb.ToString());
            input["qtsbList"][0]["skssqQ"] = gd.tbrq;
            input["qtsbList"][0]["skssqZ"] = gd.tbrq;
        }

        public void getSsqz(JObject re_json)
        {
            gd = repos.getGDTXDate(Ywbm.lhfjssb.ToString());
            re_json["sbrqq"] = gd.sbrqq;
            re_json["sbrqz"] = gd.sbrqz;
        }

        public void setHeadNsrxx(JObject in_jo)
        {
            xx = repos.getNsrxx();
            in_jo["yhqymc"] = xx.NSRMC;
            in_jo["userName"] = xx.NSRSBH;
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SaongroupTest.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public    JsonResult GetCatRegions()
        { 
            return Json(Models.API.Get("regions"), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReports(string elink = "") 
        { 
            return Json(Models.API.Get(elink), JsonRequestBehavior.AllowGet);
        }

        public ActionResult JS()
        {

            return View();
        }

    }
}
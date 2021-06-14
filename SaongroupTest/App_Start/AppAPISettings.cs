using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SaongroupTest.App_Start
{
    public class AppAPISettings
    {
        private static string URLServer = System.Configuration.ConfigurationManager.AppSettings["URLServer"].ToString();
        private static string key = System.Configuration.ConfigurationManager.AppSettings["rapidapikey"].ToString();
        private static string host = System.Configuration.ConfigurationManager.AppSettings["rapidapihost"].ToString();
        public string Ruta { get; set; }
        public string Lkey { get; set; }
        public string Lhost { get; set; }
        public AppAPISettings()
        {
            Ruta = URLServer;
            Lkey = key;
            Lhost = host;
        }
    }
}
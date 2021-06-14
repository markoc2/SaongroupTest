using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace SaongroupTest.Models
{
    public class API
    {
         
        public static async Task<dynamic> Get(string elink)
        {

            string root = new App_Start.AppAPISettings().Ruta.ToString();
            string key = new App_Start.AppAPISettings().Lkey.ToString();
            string host = new App_Start.AppAPISettings().Lhost.ToString();
            var serializer = new JavaScriptSerializer();

            var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(root + elink),
                Headers =
                            {
                                { "x-rapidapi-key",key },
                                { "x-rapidapi-host", host},
                            },
            };

            var response = client.SendAsync(request).Result;

            if (!response.IsSuccessStatusCode)
            {
                string error = await response.Content.ReadAsStringAsync();
                object formatted = JsonConvert.DeserializeObject(error);
                throw new WebException("Error Calling the Graph API: \n" + JsonConvert.SerializeObject(formatted, Formatting.Indented));
            }

            var result = await response.Content.ReadAsStringAsync();


            var resultd = serializer.Deserialize<dynamic>(result);

            return resultd;
             

        }
    }


}
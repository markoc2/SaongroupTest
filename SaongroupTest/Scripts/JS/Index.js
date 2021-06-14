
var Globals = {
    Region: "ALL",
    provincesDS: null, 
    RegionDS: null, 
    url: "https://covid-19-statistics.p.rapidapi.com/",
    rapidapikey: "4ea755feb3mshe66f1b706661c59p18be46jsn4eb52ddad840",
    rapidapihost: "covid-19-statistics.p.rapidapi.com"

}
  

function fntRegionsDS(value) {
    
    API = Globals.url + "regions";

    $.ajax({
        async: true,
        crossDomain: true,
        url: API,
        method: "GET",
        headers: {
            "x-rapidapi-key": Globals.rapidapikey,
            "x-rapidapi-host": Globals.rapidapihost
        }
    })
        .done(function (RegionsDS) {
            
            RegionsDS.data.push({ iso: "ALL", name: " Regions " }); 
             
            var myDropDown = $('#RegionsCC').kendoDropDownList({
                autoWidth: true,
                dataTextField: "name",
                dataValueField: "iso",
                dataSource: {
                    data: RegionsDS.data.sort(function (a, b) {
                        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })
                },
                value: value,
                filter: "contains",
                change: function () {
                    Globals.Region = this.value();
                },
            }).data("kendoDropDownList"); 

        });
    
}

function fntprovincesDS() {

    if (Globals.Region === "ALL") {
        API = Globals.url + "reports?date=2020-04-16";

        $.ajax({
            async: true,
            crossDomain: true,
            url: API,
            method: "GET",
            headers: {
                "x-rapidapi-key": Globals.rapidapikey,
                "x-rapidapi-host": Globals.rapidapihost
            },
            beforeSend: function () {
                window.kendo.ui.progress($("#grid"), true);
            }
        })
            .done(function (RegionDS) {

                Globals.RegionDS = RegionDS.data
                    .map(row => ({ Region: row.region.iso, Cases: row.active, Deaths: row.deaths }))
                    .filter(row => row.Region != "Recovered")
                    .sort(function (a, b) { return a.Cases < b.Cases ? 1 : -1; })
                    .slice(0, 10);

                var result = [];
                Globals.RegionDS.reduce(function (res, value) {
                    if (!res[value.Region]) {
                        res[value.Region] = { Region: value.Region, Cases: 0, Deaths: 0 };
                        result.push(res[value.Region])
                    }
                    res[value.Region].Cases += value.Cases; 
                    res[value.Region].Deaths += value.Deaths;
                    return res;
                }, {});
                 

                fntCreateGrid(result)


                 
            }).always(function () {
                window.kendo.ui.progress($("#grid"), false);
                fntRegionsDS(Globals.Region);
            });

    } else {
     
    API = Globals.url + "reports?date=2020-04-16&iso=" + Globals.Region;

    $.ajax({
        async: true,
        crossDomain: true,
        url: API, 
        method: "GET",
        headers: {
            "x-rapidapi-key": Globals.rapidapikey,
            "x-rapidapi-host": Globals.rapidapihost
        },
        beforeSend: function () {
            window.kendo.ui.progress($("#grid"), true);
        }
    })
        .done(function (provincesDS) {

            
            Globals.provincesDS = provincesDS.data
                .map(row => ({ Province: row.region.province, Cases: row.active, Deaths: row.deaths  }))
                .filter(row => row.Province != "Recovered")
                .sort(function (a, b) { return a.Cases < b.Cases ? 1 : -1; })
                .slice(0, 10);
             

            fntCreateGrid(Globals.provincesDS)
 
           
 
        }).always(function () {
            window.kendo.ui.progress($("#grid"), false);
            fntRegionsDS(Globals.Region);
        });
    }
}

function fntCreateGrid(data) {

    if ((Globals.provincesDS != null && Globals.Region === "ALL") || (Globals.Region != "ALL" )) {
        $("#grid").removeData('kendoGrid');
        $("#grid").empty();
    }


    $("#grid").kendoGrid({
        toolbar: [

            { template: "<input id='RegionsCC' style='width: 250px; min-height: color: white !important; font-size: 12px !important; ' />" },
            {
                template: "<input type='button' class='k-button' value='Report' onclick='fntprovincesDS()' />",
                imageclass: "k-icon k-i-search"
            }, { name: "excel", text: "CSV" }


        ],
        excel: {
            fileName: "Report.csv",
            filterable: true
        },
        dataSource: {
            data: data
        }

    });
}
 
$(document).ready(function () { 
     
    fntCreateGrid(Globals.provincesDS) 
      
    fntRegionsDS(Globals.Region);
    fntprovincesDS();
     
});
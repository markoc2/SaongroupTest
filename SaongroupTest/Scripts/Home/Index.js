
var Globals = {
    Region: "ALL",
    provincesDS: null, 
    RegionDS: null  
}
  

function fntRegionsDS(value) {
    
    API = Globals.url + "GetCatRegions";

    $.ajax({
        url: "/Home/GetCatRegions", 
        method: "GET" 
    })
        .done(function (RegionsDS) {
             
            RegionsDS.Result.data.push({ iso: "ALL", name: " Regions " }); 

             
            var myDropDown = $('#RegionsCC').kendoDropDownList({
                autoWidth: true,
                dataTextField: "name",
                dataValueField: "iso",
                dataSource: {
                    data: RegionsDS.Result.data.sort(function (a, b) {
                        var nameA = a.name.toUpperCase();  
                        var nameB = b.name.toUpperCase();  
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        } 
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
        elink = "reports?date=2020-04-16" ;
 
        $.ajax({
            url: "/Home/GetReports",
            method: "GET",
            data: {
                elink: elink,
            },
            beforeSend: function () {
                window.kendo.ui.progress($("#grid"), true);
            }
        })
            .done(function (provincesDS) {
                console.log(provincesDS);

                Globals.provincesDS = provincesDS.Result.data
                    .map(row => ({ Region: row.region.iso, Cases: row.active, Deaths: row.deaths }))
                    .filter(row => row.Region != "Recovered")
                    .sort(function (a, b) { return a.Cases < b.Cases ? 1 : -1; })
                    .slice(0, 10);

                var result = [];
                Globals.provincesDS.reduce(function (res, value) {
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
     

        elink = "reports?date=2020-04-16&iso=" + Globals.Region;
  
        $.ajax({
            url: "/Home/GetReports",
            method: "GET",
            data: {
                elink: elink, 
            }, 
            beforeSend: function () {
                window.kendo.ui.progress($("#grid"), true);
            }
        })
        .done(function (provincesDS) {
            console.log(provincesDS);

            Globals.provincesDS = provincesDS.Result.data
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
       
    fntprovincesDS();
     
});
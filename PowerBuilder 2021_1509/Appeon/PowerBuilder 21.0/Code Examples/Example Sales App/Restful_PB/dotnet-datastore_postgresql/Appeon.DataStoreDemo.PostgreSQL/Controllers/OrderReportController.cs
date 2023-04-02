using SnapObjects.Data;
using DWNet.Data;
using Appeon.DataStoreDemo.PostgreSQL.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;

namespace Appeon.DataStoreDemo.SqlServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OrderReportController : ControllerBase
    {
        private readonly IOrderReportService _reportService;
        
        public OrderReportController(IOrderReportService reportService)
        {
            _reportService = reportService;
        }
        
        // GET api/OrderReport/WinOpen
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IDataPacker> WinOpen()
        {
            var packer = new DataPacker();
            int cateId = 0;
            
            var category = _reportService.Retrieve("d_dddw_category");
            var subCategory = _reportService.Retrieve("d_subcategory", cateId);
            
            if (category.RowCount == 0 || subCategory.RowCount == 0)
            {
                return NotFound();
            }
            
            packer.AddDataStore("Category", category);
            packer.AddDataStore("SubCategory", subCategory, true);
            
            return packer;
        }
        
        // GET api/Person/RetrievePerson
        // Use compress
        [HttpGet("{personType}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<string> RetrievePerson_Compress(string personType)
        {
        
            var personData = _reportService.Retrieve("d_person_list_compress", personType);
            
            if (personData.RowCount == 0)
            {
                return NotFound();
            }
            
            var json = personData.ExportPlainJson(false);
            return json;
        }
        
        // GET api/OrderReport/CategorySalesReport
        [HttpGet("{queryFrom}/{queryTo}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IDataPacker> CategorySalesReport(
            string queryFrom, string queryTo)
        {
            var packer = new DataPacker();
            
            var dataFrom = DateTime.Parse(queryFrom);
            var dataTo = DateTime.Parse(queryTo);
            var lastDataFrom = DateTime.Parse(queryFrom).AddYears(-1);
            var lastDataTo = DateTime.Parse(queryTo).AddYears(-1);
            
            var CategoryReport = _reportService.Retrieve("d_categorysalesreport_d", 
                dataFrom, dataTo);
                
            if (CategoryReport.RowCount == 0)
            {
                return NotFound();
            }
            
            packer.AddDataStore("Category.SalesReport", CategoryReport);
            
            packer.AddDataStore("Category.LastYearSalesReport",
                _reportService.Retrieve("d_categorysalesreport_d", 
                lastDataFrom, lastDataTo));
                
            return packer;
        }
        
        // GET api/OrderReport/SalesReportByMonth
        [HttpGet("{subCategoryId}/{salesYear}/{halfYear}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IDataPacker> SalesReportByMonth(
            int subCategoryId, string salesYear, string halfYear)
        {
            var packer = new DataPacker();
            
            var fromDate = DateTime.Parse(halfYear == "first" ? 
                salesYear + "-01-01" : salesYear + "-07-01");
            var toDate = DateTime.Parse(halfYear == "first" ? 
                salesYear + "-06-30" : salesYear + "-12-31");
            object[] yearMonth = new object[7];
            
            yearMonth[0] = subCategoryId;
            for (int month = 1; month < 7; month++)
            {
                yearMonth[month] = halfYear == "first" ? 
                    salesYear + string.Format("{0:00}", month) 
                    : salesYear + string.Format("{0:00}", (month + 6));
            }
            
            var SalesReport = _reportService.RetrieveSubCategorySalesReport(yearMonth);
            var ProductReport = _reportService.Retrieve("d_productsalesreport",
                subCategoryId, fromDate, toDate);
                
            if (ProductReport.RowCount == 0)
            {
                return NotFound();
            }
            
            packer.AddDataStore("SalesReport", SalesReport);
            packer.AddDataStore("ProductReport", ProductReport);
            
            return packer;
        }
    }
}

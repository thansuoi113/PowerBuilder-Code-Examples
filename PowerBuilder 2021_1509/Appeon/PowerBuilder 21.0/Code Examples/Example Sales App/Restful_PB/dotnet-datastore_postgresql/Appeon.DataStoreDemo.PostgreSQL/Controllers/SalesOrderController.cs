using SnapObjects.Data;
using DWNet.Data;
using Appeon.DataStoreDemo.PostgreSQL.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;

namespace Appeon.DataStoreDemo.PostgreSQL.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SalesOrderController : ControllerBase
    {
        private readonly ISalesOrderService _saleService;
        
        public SalesOrderController(ISalesOrderService saleService)
        {
            _saleService = saleService;
        }
        
        // GET api/salesorder/WinOpen
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> WinOpen()
        {
            var packer = new DataPacker();
            
            try
            {
                packer.AddDataStore("Customer", 
                _saleService.Retrieve("d_dddw_customer_individual"));
                packer.AddDataStore("SalesPerson", 
                    _saleService.Retrieve("d_dddw_salesperson"));
                packer.AddDataStore("SalesTerritory", 
                    _saleService.Retrieve("d_dddw_salesterritory"));
                packer.AddDataStore("ShipMethod", 
                    _saleService.Retrieve("d_dddw_shipmethod"));
                packer.AddDataStore("OrderProduct", 
                    _saleService.Retrieve("d_dddw_order_production"));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // GET api/SalesOrder/RetrieveSaleOrderList
        [HttpGet("{customerId}/{dateFrom}/{dateto}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IDataPacker> RetrieveSaleOrderList(
            int customerId, string dateFrom, string dateTo)
        {
            var packer = new DataPacker();
            var fromDate = DateTime.Parse(dateFrom);
            var toDate = DateTime.Parse(dateTo);
            
            try
            {
                packer.AddDataStore("SalesOrderHeader", 
                    _saleService.Retrieve("d_order_header_grid", 
                    fromDate, toDate, customerId));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // GET api/SalesOrder/RetrieveSaleOrderDetail
        [HttpGet("{salesOrderId}/{customerId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> RetrieveSaleOrderDetail(
            int salesOrderId, int customerId)
        {
            var packer = new DataPacker();
            
            try
            {
                packer.AddDataStore("SalesOrderDetail",
                _saleService.Retrieve("d_order_detail_list", salesOrderId));
                
                packer.AddDataStore("DddwAddress",
                    _saleService.Retrieve("d_dddw_customer_address", customerId));
                    
                packer.AddDataStore("DddwCreditcard",
                    _saleService.Retrieve("d_dddw_customer_creditcard", customerId));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // GET api/SalesOrder/RetrieveDropdownModel
        [HttpGet("{modelName}/{CodeId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> RetrieveDropdownModel(string modelName, int CodeId)
        {
            var packer = new DataPacker();
            
            try
            {
                switch (modelName)
                {
                    case "Customer":
                        packer.AddDataStore("DddwAddress", 
                            _saleService.Retrieve("d_dddw_customer_address", CodeId));
                        packer.AddDataStore("DddwCreditcard", 
                            _saleService.Retrieve("d_dddw_customer_creditcard", CodeId));
                        break;
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // POST api/salesorder/SaveSalesOrderAndDetail
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> SaveSalesOrderAndDetail(IDataUnpacker unPacker)
        {
            var packer = new DataPacker();
            var orderHeader = unPacker.GetDataStore("dw1", "d_order_header_free",MappingMethod.Key);
            var orderDetail = unPacker.GetDataStore("dw2", "d_order_detail_list",MappingMethod.Key);
            
            try
            {
                var saleOrderId = _saleService.SaveSalesOrderAndDetail(orderHeader, 
                    orderDetail);
                    
                if (saleOrderId > 0)
                {
                    packer.AddDataStore("SalesOrderHeader", 
                        _saleService.Retrieve("d_order_header_free", saleOrderId));
                    packer.AddDataStore("SalesOrderHeader.SalesOrderDetail", 
                        _saleService.Retrieve("d_order_detail_list", saleOrderId));
                }
                packer.AddValue("Status", "Success");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // POST api/salesorder/SaveChanges
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> SaveChanges(IDataUnpacker unpacker)
        {
            string status = "Success";
            var packer = new DataPacker();
            var modelname = unpacker.GetValue<string>("arm1");
            
            try
            {
                switch (modelname)
                {
                    case "SaleOrderHeader":
                        var orderHeader = unpacker.GetDataStore("dw1", "d_order_header_free",MappingMethod.Key);
                        status = _saleService.Update(true, orderHeader);
                        
                        packer.AddDataStore("SalesOrderHeader", orderHeader);
                        
                        break;
                        
                    case "SaleOrderDetail":
                        var orderDetail = unpacker.GetDataStore("dw1", "d_order_detail_list",MappingMethod.Key);
                        status = _saleService.Update(true, orderDetail);
                        
                        packer.AddValue("SaleOrderDetail.SalesOrderDetail",
                            orderDetail.RowCount);
                            
                        break;
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            packer.AddValue("Status", status);
            
            return packer;
        }
        
        // DELETE api/salesorder/DeleteSalesOrderByKey
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> DeleteSalesOrderByKey(IDataUnpacker unpacker)
        {
            var packer = new DataPacker();
            var modelName = unpacker.GetValue<string>("arm1");
            var saleOrderId = unpacker.GetValue<int>("arm2");
            var status = "Success";
            
            try
            {
                switch (modelName)
                {
                    case "SaleOrder":
                        status = _saleService.DeleteSalesOrder(saleOrderId);
                        break;
                        
                    case "OrderDetail":
                        var saleDetailId = unpacker.GetValue<int>("arm3");
                        status = _saleService.Delete("d_order_detail_list", true,
                            "SalesOrderDetailID = " + saleDetailId.ToString(), saleOrderId);
                        break;
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            packer.AddValue("Status", status);
            
            return packer;
        }
    }
}
using SnapObjects.Data;
using DWNet.Data;
using System;

namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    /// <summary>
    /// This Service needs to be injected into the ConfigureServices method of the Startup class. Sample code as follows:
    /// services.AddScoped<ISalesOrderService, SalesOrderService>();
    /// </summary>
    public class SalesOrderService : ServiceBase, ISalesOrderService
    {
        public SalesOrderService(OrderContext context)
            : base(context)
        {
        }
        public string DeleteSalesOrder(int saleOrderId)
        {
            string status = "Success";

            _context.BeginTransaction();

            status = Delete("d_order_detail_list", false, saleOrderId);
            status = Delete("d_order_header_free", false, saleOrderId);

            _context.Commit();

            return status;
        }

        public int SaveSalesOrderAndDetail(IDataStore salesOrderHeaders,
            IDataStore salesOrderDetails)
        {
            int intSalesOrderId = 0;

            _context.BeginTransaction();
                
            salesOrderHeaders.DataContext = _context;
            salesOrderHeaders.Update();

            intSalesOrderId = salesOrderHeaders.GetItem<int>(0, "salesorderid");

            SetPrimaryKey(salesOrderHeaders, salesOrderDetails);

            salesOrderDetails.DataContext = _context;
            salesOrderDetails.Update();

            _context.Commit();

            return intSalesOrderId;
        }

        private void SetPrimaryKey(IDataStore salesOrderHeaders, 
            IDataStore salesOrderDetails)
        {
            if (salesOrderHeaders.DeletedCount == 0 && 
                salesOrderHeaders.RowCount > 0)
            {
                var salesOrderId = salesOrderHeaders.GetItem<int>(0, "salesorderid");
                
                for (int i = 0; i < salesOrderDetails.RowCount; i++)
                {
                    if (salesOrderDetails.GetRowStatus(i) == ModelState.NewModified)
                    {
                        salesOrderDetails.SetItem(i, "salesorderid", salesOrderId);
                    }
                }
            }
        }
    }
}

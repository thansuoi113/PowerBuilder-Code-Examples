using DWNet.Data;

namespace Appeon.DataStoreDemo.SqlAnywhere.Services
{
    public interface ISalesOrderService : IServiceBase
    {
        int SaveSalesOrderAndDetail(IDataStore salesOrderHeaders, IDataStore salesOrderDetails);

        string DeleteSalesOrder(int saleOrderId);

    }
}

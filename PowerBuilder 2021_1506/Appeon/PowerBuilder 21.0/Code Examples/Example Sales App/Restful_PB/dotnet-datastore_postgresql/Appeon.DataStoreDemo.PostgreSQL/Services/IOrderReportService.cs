using DWNet.Data;

namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    public interface IOrderReportService : IServiceBase
    {
        IDataStore RetrieveSubCategorySalesReport(params object[] salesmonth);
    }
}


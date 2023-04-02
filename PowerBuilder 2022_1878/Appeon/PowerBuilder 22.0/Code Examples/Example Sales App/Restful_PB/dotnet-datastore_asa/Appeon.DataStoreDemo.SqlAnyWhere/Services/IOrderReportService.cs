using DWNet.Data;

namespace Appeon.DataStoreDemo.SqlAnywhere.Services
{
    public interface IOrderReportService : IServiceBase
    {
        IDataStore RetrieveSubCategorySalesReport(params object[] salesmonth);
    }
}


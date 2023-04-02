using DWNet.Data;

namespace Appeon.DataStoreDemo.SqlAnywhere.Services
{
    public interface IProductService : IServiceBase
    {
        string DeleteProduct(int productId);

        bool retrieveProductPhote(int productId, out string photoname, out byte[] photo);

        int SaveProductAndPrice(IDataStore product, IDataStore prices);

        int SaveHistoryPrices(IDataStore subcate, IDataStore product, IDataStore prices);

        void SaveProductPhoto(int productId, string photoname, byte[] photo);

    }
}

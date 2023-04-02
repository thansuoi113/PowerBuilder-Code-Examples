using DWNet.Data;

namespace Appeon.DataStoreDemo.SqlAnywhere.Services
{
    public interface IPersonService : IServiceBase
    {
        int SavePerson(IDataStore person, IDataStore addresses, IDataStore phones, IDataStore customers);

        string DeletePerson(int personId);

    }
}

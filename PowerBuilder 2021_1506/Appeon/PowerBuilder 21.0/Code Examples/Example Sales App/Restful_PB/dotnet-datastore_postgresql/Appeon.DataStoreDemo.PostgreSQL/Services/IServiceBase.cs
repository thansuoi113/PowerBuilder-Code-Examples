using DWNet.Data;

namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    public interface IServiceBase
    {
        IDataStore Retrieve(string dataobject, params object[] keyValue);

        string Delete(string dataobject, params object[] keyValue);

        string Delete(string dataobject, bool autoCommit, params object[] keyValue);

        string Delete(string dataobject, bool autoCommit, string filter, params object[] keyValue);

        string Update(IDataStore dataStore);

        string Update(bool autoCommit, IDataStore dataStore);

    }
}

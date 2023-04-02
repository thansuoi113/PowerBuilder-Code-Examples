using DWNet.Data;
using System;

namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    public abstract class ServiceBase : IServiceBase
    {
        protected readonly OrderContext _context;

        protected ServiceBase(OrderContext context)
        {
            _context = context;
        }

        public IDataStore Retrieve(string dataobject, params object[] keyValue)
        {
            var datastore = new DataStore(dataobject, _context);

            datastore.Retrieve(keyValue);

            return datastore;
        }

        public virtual string Delete(string dataobject, params object[] keyValue)
        {
            return Delete(dataobject, true, keyValue);
        }

        public string Delete(string dataobject, bool autoCommit, params object[] keyValue)
        {
            return Delete(dataobject, autoCommit, "", keyValue);
        }

        public string Delete(string dataobject, bool autoCommit, string filter, params object[] keyValue)
        {
            var dataStore = new DataStore(dataobject, _context);

            var count = dataStore.Retrieve(keyValue);
            if (count > 0)
            {
                if (autoCommit)
                {
                    _context.BeginTransaction();
                }
                if (filter.Length > 0)
                {
                    dataStore.SetFilter(filter);
                    dataStore.Filter();
                }

                for (var i = dataStore.RowCount - 1; i >= 0; i--)
                {
                    dataStore.DeleteRow(i);
                }

                dataStore.Update();

                if (autoCommit)
                {
                    _context.Commit();
                }
            }

            return "Success";
        }

        public string Update(IDataStore dataStore)
        {
            return Update(true, dataStore);
        }

        public string Update(bool autoCommit, IDataStore dataStore)
        {
            if (autoCommit)
            {
                _context.BeginTransaction();
                dataStore.DataContext = _context;
                dataStore.Update();
                _context.Commit();
            }
            else
            {
                dataStore.DataContext = _context;
                dataStore.Update();
            }

            return "Success";
        }
    }
}

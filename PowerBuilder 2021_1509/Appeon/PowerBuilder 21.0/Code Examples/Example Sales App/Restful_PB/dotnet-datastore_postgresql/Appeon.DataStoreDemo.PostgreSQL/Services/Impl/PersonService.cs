using SnapObjects.Data;
using DWNet.Data;
using System;

namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    /// <summary>
    /// This Service needs to be injected into the ConfigureServices method of the Startup class. Sample code as follows:
    /// services.AddScoped<IPersonService, PersonService>();
    /// </summary>
    public class PersonService : ServiceBase, IPersonService
    {
        public PersonService(OrderContext context)
            : base(context)
        {
        }
        
        public string DeletePerson(int personId)
        {
            string status = "Success";
            
            _context.BeginTransaction();
            
            status = Delete("d_businessentityaddress", false, personId);
            status = Delete("d_personphone", false, personId);
            
            long count = _context.SqlExecutor.Scalar<long>("select count(*) from sales.salesorderheader,sales.customer where sales.customer.customerid = sales.salesorderheader.customerid and sales.customer.personid=:personid", personId);
            
            if (count > 0)
            {
               status = "This customer didn't delete, because this customer exist salesorder";
                return status;
            }
            
            status = Delete("d_customer", false, personId);
            status = Delete("d_person", false, personId);
            
            _context.Commit();
            
            return status;
        }
        
        public int SavePerson(IDataStore person, IDataStore addresses, 
            IDataStore phones, IDataStore customers)
        {
            int intPersonId = 0;
            
            _context.BeginTransaction();
            
            if ((person.ModifiedCount == 1) && 
                person.GetRowStatus(0) == ModelState.NewModified)
            {
                var businessEntity = new DataStore("d_businessentity", _context);
                businessEntity.AddRow();
                businessEntity.SetItem(0, "modifieddate", DateTime.Now);
                
                var result = businessEntity.Update();
                if (result == 1)
                {
                    intPersonId = businessEntity.GetItem<int>(0, "businessentityid");
                    person.SetItem(0, "businessentityid", intPersonId);
                }
            }
            else
            {
                intPersonId = person.GetItem<int>(0, "businessentityid");
            }
            
            SetPrimaryKey(person, addresses, phones, customers);
            
            //Save person address, phone, customer
            person.DataContext = _context;
            person.Update();
            
            addresses.DataContext = _context;
            addresses.Update();
            
            phones.DataContext = _context;
            phones.Update();
            
            customers.DataContext = _context;
            customers.Update();
            
            _context.Commit();
            
            return intPersonId;
        }
        
        private void SetPrimaryKey(IDataStore person, IDataStore addresses, 
            IDataStore phones, IDataStore customers)
        {
            if (person.DeletedCount == 0 && person.RowCount > 0)
            {
                var PersonID = person.GetItem<int>(0, "businessentityid");
                
                for (int i = 0; i < addresses.RowCount; i++)
                {
                    if (addresses.GetRowStatus(i) == ModelState.NewModified)
                    {
                        addresses.SetItem(i, "businessentityid", PersonID);
                    }
                }
                
                for (int i = 0; i < phones.RowCount; i++)
                {
                    if (phones.GetRowStatus(i) == ModelState.NewModified)
                    {
                        phones.SetItem(i, "businessentityid", PersonID);
                    }
                }
                
                for (int i = 0; i < customers.RowCount; i++)
                {
                    if (customers.GetRowStatus(i) == ModelState.NewModified)
                    {
                        customers.SetItem(i, "personid", PersonID);
                    }
                }
            }
        }
    }
}

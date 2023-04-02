namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    /// <summary>
    /// This Service needs to be injected into the ConfigureServices method of the Startup class. Sample code as follows:
    /// services.AddScoped<IAddressService, AddressService>();
    /// </summary>
    public class AddressService : ServiceBase, IAddressService
    {
        public AddressService(OrderContext context)
            : base(context)
        {
          
        }
        
        public override string Delete(string dataobject, params object[] keyValue)
        {
            _context.SqlExecutor.Execute("delete from person.businessentityaddress where person.businessentityaddress.addressid = :addressid", keyValue);
            
           return base.Delete(dataobject, keyValue);
            
           
        }
    }
}

# <b>NET DataStore Example</b>

This C# project uses .NET DataStore from [DWNet.Data](<https://www.nuget.org/packages/DWNet.Data/>) for creating Web APIs.  It makes use of the latest released Appeon PowerBuilder and SnapDevelop, and shows how CRUD operations and transaction management works in .NET DataStore.

##### Sample Project Structure

This is C# project. This project uses .NET DataStore from [DWNet.Data](<https://www.nuget.org/packages/DWNet.Data/>). 

The project is structured as follows.

```
|—— .NET-DataStore-Example		Implemented with .NET DataStore from DWNet.Data
    |—— Appeon.DataStoreDemo.PostgreSQL       For working with PostgreSQL
```

##### Setting Up the Project

1. Open the PowerBuilder project in PowerBuilder IDE.

2. Open the C# project in SnapDevelop IDE. 

3. In SnapDevelop, in Tools > NuGet Package Manager > Manage NuGet Packages for Solution, make sure that Internet connection is available and the option "Include prerelease" is selected, so that the NuGet package can be restored.

4. Open the configuration file *appsettings.json* in the project, modify the ConnectionStrings with the actual database connection information. 

   ```json
   //Keep the database connection name as the default “PB Postgres” or change it to a name you prefer to use, and change the Data Source, User ID, Password and Initial Catalog according to the actual settings
   "ConnectionStrings": { "PB Postgres": "Data Source=127.0.0.1; Initial Catalog=PB Postgres; Integrated Security=False; User ID=sa; Password=123456; Pooling=True; Min Pool Size=0; Max Pool Size=100; ApplicationIntent=ReadWrite" } 
   ```

5. In the ConfigureServices method of *Startup.cs*, go to the following line, and make sure the ConnectionString name is the same as the database connection name specified in step #4.

   ```C#
   //Note: Change "OrderContext" if you have changed the default DataContext file name; change the "PB Postgres" if you have changed the database connection name in appsettings.json 
   services.AddDataContext<OrderContext>(m => m.UseSqlServer(Configuration["ConnectionStrings:PB Postgres"])); 
   ```

6. Press Ctrl+F5 in SnapDevelop IDE to build the project and run the Web APIs. 
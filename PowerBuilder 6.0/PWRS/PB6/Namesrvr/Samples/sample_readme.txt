PowerBuilder Distributed Name Server 

The idea behind the name server is to assign you physcial servers a logical type or class. This way you could have multiple physical application servers serving the same class. Example, the application type of a distributed accounting server maybe Acct_1 , Acct_2. Both of these application servers run under the class of  "accounting".  When a request from a client to connect to a particular class of server, the name server returns the physical connection information for the best server choice.



Components of the name server

The name_server.exe is the name server engine. Starting this will begin the process of polling for application servers and waiting for client request.

The nsadmin.exe is the name server administrator program. It can be run on the machine running the name server or remotely. This program will allow to monitor the name server status and make changes to available application servers.

Ns_clientside.pbl - this pbl contains the service that must be instantiated on the client pc in order to access the name server funtionality. This pbl is responsible for reading the nameserv file which has a list of available name servers. The use the of_getxxxserver method to resolve the class of the server to a definite location, application server.

Ns_serverside.pbl - this pbl contains the service that must be instatiated on the application server. This pbl is responsible for receiving request from the name server to update statistics.

Appserver - this file contains the list of all available application servers. This file must be available to the name_server.exe. Maitenance of this file can be done by hand, but the preferred method is to use the nsadmin program to maintain this file.

Nameserv - this file contains a list of available name servers. The nsadmin.exe and each client pc will need access to this file. It can be edited with any text editor.

Namer_server.exe - the actual name server program

Nsadmin.exe - the 
The Sample

This sample will demonstrate the functionality of the name sever. It does this by provide some basic client and severs. The demo was intended to be run on a single machine (not win16) with winsock installed.

1) The following needs to be added to the SERVICES file
in the c:\windows directory for the sample to run.


pbnameserver      20000/tcp
pbnameserver1      20001/tcp
pbnameserver2     20002/tcp
acct_1		20010/tcp
acct_2   		20011/tcp
acct_3		20012/tcp
prod_1		30000/tcp
prod_2		30001/tcp
prod_3		30002/tcp
mftg_1		40001/tcp
mftg_2		40002/tcp
mftg_3		40003/tcp

2) Start running a few  sample application servers by running a few  "\name server sample\simple_server.exe".  Choose the name of the server from the drop down list box and hit Start Server.

3) Start the name_server.exe. After a period of time, you will notice the servers you started appear on the name server console.

4) Starting the nsadmin.exe will allow you to view statistics on the name server.

5) Start a few clients  "\name server sample\simple_client.exe". On each client choose the "class" of application server that is requested. For example choose "accounting", and the first available "accounting" class server will be returned. At that point the client will connect to the app server to demonstrate a successful handoff.


Setting up a distributed application (client / app server) to use the name server:

CLIENT SIDE
1) Add the ns_clientside.pbl to the client's library search path.
2) In the nameserv file,  enter the name and locations of one or all of the nameservers that will be accessed by the clients. The clients will try in order each of the nameservers.
3) Instantiate the ncst_clientnameserver object as an instance variable in the client application
4) When you normally set the connection object information, call of_getapplicationserver( ) to receive the necessary connection information of a valid application server

APPLICATION SERVERSIDE
1) Add the ns_serverside.pbl to the server's library search path.
2) Instantiate the ncst_cservernameserver object as an instance variable in the server application
3) Using the name server administrator add the application server's connection information to the list of available servers. If an administrator password is required, supply these in the list.

NAME SERVER - The name server is configurable via the name sever admin program. (nsadmin.exe)
1) Editing the application server list will change the application servers that name server has available to use.
2) Under the Name Server Configuration menu item is a tab control with three tabs
a)	Intevals   - polling: the polling intervals determine how often the name server will poll known up application servers for statistics such as open connections. Scanning: the scanning interval determins how often the name server will go down the list of  available application servers to see which servers are up. ( this is the scan for new servers interval).
b) Load balancing - this is the way you configure which application server will be returned for a client making a request to a particular class. The filter and sort options on this tab work the same way a datawindow would use them. When a client makes a request for a class of applications server,  a datastore is populated with all available application servers that match the requested class. In addition, the sort and filter options shown on this tab will be applied to the datastore. So, adding connections < maxconnections will ensure that on servers with connections less than max allowed be on the datastore. After the sort and filter are applied, the record at the top of the datastore (record 1) will be returned as the best candidate. So the sort will affect which record is on the top most row.
c) General - this is the information about the nameserver startup. Information includes the name the nameserver will try to use and the driver to use. Password and login are set here also.





Notes:
An example of obtaining machine performance information is provided for win95 in the ncst_servernameserver object. Similar techniques can be used for the NT 4.0 platform. 



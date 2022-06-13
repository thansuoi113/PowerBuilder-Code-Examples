
--
-- salesdb_remote.sql - setup for PocketBuilder example for ASA
--

create table Customer (
    cust_id		integer	not null primary key,
    cust_name		varchar(30)
)
go

create unique index CustomerName on Customer (cust_name)
go

create table Product (
    prod_id		integer not null primary key, 
    price		integer,
    prod_name		varchar(30)
)
go

create index ProductName on Product (prod_name)
go

create table Employee (
    emp_id		integer	not null primary key,
    emp_name		varchar(30),
)
go

create index EmployeeName on Employee (emp_name)
go

create table "Orders" (
    order_id		integer	not null primary key,
    cust_id		integer	not null,	
    prod_id		integer	not null,
    emp_id		integer	not null,
    disc		integer,
    quant		integer not null,
    notes		varchar(50),
    status		varchar(20),
    foreign key (cust_id) references Customer (cust_id),
    foreign key (prod_id) references Product (prod_id),
    foreign key (emp_id) references Employee (emp_id)
)
go

-- Utility Tables
create table CustomerIDPool (
    pool_cust_id	integer not null default autoincrement,
    primary key (pool_cust_id)
)
go
create table OrderIDPool (
    pool_order_id	integer not null default autoincrement,
    primary key (pool_order_id)
)
go

create table SyncSettings (
	regkey    varchar(250) not null primary key,
	dbuser    varchar(128) not null,
	dbpass    varchar(128) not null,
	mluser    varchar(128) not null,
	mlpass    varchar(128),
	encrypt   varchar(128),
	authparms varchar(128)
)
go

create publication salesapi (
    table Employee (emp_id, emp_name),
    table Customer (cust_id, cust_name),
    table Product (prod_id, price, prod_name),
    table "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant, notes, status),
    table CustomerIDPool (pool_cust_id),
    table OrderIDPool (pool_order_id)
)
go

create synchronization user "50";
go

create synchronization subscription to "salesapi" for "50"
    type 'TCPIP' option ScriptVersion = 'salesdb';
go

create synchronization user "51";
go

create synchronization subscription to "salesapi" for "51"
    type 'TCPIP' option ScriptVersion = 'salesdb';
go

create synchronization user "52";
go

create synchronization subscription to "salesapi" for "52"
    type 'TCPIP' option ScriptVersion = 'salesdb';
go

create synchronization user "53";
go

create synchronization subscription to "salesapi" for "53"
    type 'TCPIP' option ScriptVersion = 'salesdb';
go

create synchronization user "54";
go

create synchronization subscription to "salesapi" for "54"
    type 'TCPIP' option ScriptVersion = 'salesdb';
go

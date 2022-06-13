
--
-- salesdb.sql - setup for PocketBuilder example for ASA
--

create table Customer (
    cust_id		integer	not null primary key,
    cust_name		varchar(30),
    last_modified	timestamp default timestamp
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
create table IdentifyEmployee_nosync (
    emp_id		integer	not null primary key
)
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
    last_modified	timestamp default timestamp, 
    foreign key (cust_id) references Customer (cust_id),
    foreign key (prod_id) references Product (prod_id),
    foreign key (emp_id) references Employee (emp_id)
)
go

--  EmpCust controls which customer's orders will be downloaded.
--  If the employee needs a new customer's orders, inserting the
--  employee id and customer id, will force the orders for that
--  customer to be downloaded.
--  If the employee no longer requires a customer's orders, the
--  action must be set to 'D' (delete).  A logical delete must be
--  used in this case so that the consolidated can identify which
--  rows to remove from the Orders table.  Once the deletes have
--  been downloaded, all records for that employee with an action
--  of 'D' can also be removed from the consolidated database.

create table EmpCust (
	emp_id    	  integer not null,
	cust_id 	  integer not null,
	action	 	  char(1) null,
	last_modified     timestamp default timestamp,
	PRIMARY KEY (emp_id, cust_id),
	foreign key (cust_id) references Customer (cust_id),	
	foreign key (emp_id) references Employee (emp_id)
)
go
create trigger SubscribeOrders
    after insert, update on "Orders"
    referencing new as o
    for each row
begin
    -- Make sure the employee that entered this order is downloading
    -- information for this customer.
    if not exists( select * from EmpCust ec 
		    where o.emp_id = ec.emp_id
		      and o.cust_id = ec.cust_id ) then
	-- Add a row to EmpCust
	insert into EmpCust (emp_id,cust_id) values (o.emp_id, o.cust_id);
    end if;
end
go

-- Utility Tables
create table CustomerIDPool (
    pool_cust_id	integer not null default autoincrement,
    pool_emp_id		integer not null,
    last_modified	timestamp default timestamp, 
    primary key (pool_cust_id),
    foreign key (pool_emp_id) references Employee (emp_id)
)
go
create table OrderIDPool (
    pool_order_id	integer not null default autoincrement,
    pool_emp_id		integer not null,
    last_modified	timestamp default timestamp, 
    primary key (pool_order_id),
    foreign key (pool_emp_id) references Employee (emp_id)
)
go

CREATE PROCEDURE ResetData()
BEGIN
    -- Delete existing data
    TRUNCATE TABLE CustomerIDPool;
    TRUNCATE TABLE OrderIDPool;
    TRUNCATE TABLE EmpCust;
    TRUNCATE TABLE "Orders";
    TRUNCATE TABLE Product;
    TRUNCATE TABLE Customer;
    TRUNCATE TABLE Employee;
    TRUNCATE TABLE IdentifyEmployee_nosync;
    -- Employee table
    INSERT INTO Employee (emp_id, emp_name) VALUES ( 50, 'Alan Able'  );
    INSERT INTO Employee (emp_id, emp_name) VALUES ( 51, 'Betty Best' );
    INSERT INTO Employee (emp_id, emp_name) VALUES ( 52, 'Chris Cash' );
    INSERT INTO Employee (emp_id, emp_name) VALUES ( 53, 'Mindy Manager' );
    -- Customer table
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2000, 'Apple St. Builders'     );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2001, 'Art''s Renovations'     );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2002, 'Awnings R Us'           );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2003, 'Al''s Interior Design'  );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2004, 'Alpha Hardware'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2005, 'Ace Properties'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2006, 'A1 Contracting'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2007, 'Archibald Inc.'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2008, 'Acme Construction'      );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2009, 'ABCXYZ Inc.'            );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2010, 'Buy It Co.'             );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2011, 'Bill''s Cages'          );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2012, 'Build-It Co.'           );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2013, 'Bass Interiors'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2014, 'Burger Franchise'       );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2015, 'Big City Builders'      );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2016, 'Bob''s Renovations'     );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2017, 'Basements R Us'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2018, 'BB Interior Design'     );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2019, 'Bond Hardware'          );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2020, 'Cat Properties'         );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2021, 'C & C Contracting'      );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2022, 'Classy Inc.'            );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2023, 'Cooper Construction'    );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2024, 'City Schools'           );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2025, 'Can Do It Co.'          );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2026, 'City Corrections'       );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2027, 'City Sports Arenas'     );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2028, 'Cantelope Interiors'    );
    INSERT INTO Customer (cust_id, cust_name) VALUES ( 2029, 'Chicken Franchise'      );
    -- Product table
    INSERT INTO Product VALUES ( 1,  400,  '4x8 Drywall x100'        );
    INSERT INTO Product VALUES ( 2,  3000, '8'' 2x4 Studs x1000'     );
    INSERT INTO Product VALUES ( 3,  40,   'Drywall Screws 10lb'     );
    INSERT INTO Product VALUES ( 4,  75,   'Joint Compound 100lb'    );
    INSERT INTO Product VALUES ( 5,  100,  'Joint Tape x25x500'      );
    INSERT INTO Product VALUES ( 6,  400,  'Putty Knife x25'         );
    INSERT INTO Product VALUES ( 7,  3000, '8'' 2x10 Supports x 200' );
    INSERT INTO Product VALUES ( 8,  75,   '400 Grit Sandpaper'      );
    INSERT INTO Product VALUES ( 9,  40,   'Screwmaster Drill'       );
    INSERT INTO Product VALUES ( 10, 100,  '200 Grit Sandpaper'      );
    -- Orders table
    -- Alan Able
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5100, 2000, 1,  50, 20, 25000 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5101, 2001, 2,  50, 10, 40 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5102, 2002, 4,  50, 10, 700 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5103, 2003, 3,  50, 5,  15 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5104, 2004, 5,  50, 20, 5000 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5105, 2005, 2,  50, 15, 75 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5106, 2006, 3,  50, 5,  40 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5107, 2007, 5,  50, 10, 48 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5108, 2008, 1,  50, 20, 6000 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5109, 2009, 4,  50, 5,  36 );
    -- Betty Best
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5110, 2010, 1,  51, 10, 200 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5111, 2011, 1,  51, 10, 300 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5112, 2012, 4,  51, 5,  30 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5113, 2013, 3,  51, 8,  10 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5114, 2014, 1,  51, 15, 600 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5200, 2015, 6,  51, 20, 25000 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5201, 2016, 7,  51, 10, 40 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5202, 2017, 8,  51, 10, 700 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5203, 2018, 9,  51, 5,  15 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5204, 2019, 10, 51, 20, 5000 );
    -- Chris Cash
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5205, 2020, 7,  52, 15, 75 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5206, 2021, 9,  52, 5,  40 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5207, 2022, 10, 52, 10, 48 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5208, 2023, 6,  52, 20, 6000 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5209, 2024, 8,  52, 5,  36 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5210, 2025, 6,  52, 10, 200 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5211, 2026, 6,  52, 10, 300 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5212, 2027, 8,  52, 5,  30 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5213, 2028, 9,  52, 8,  10 );
    INSERT INTO "Orders" (order_id, cust_id, prod_id, emp_id, disc, quant)
	VALUES ( 5214, 2029, 6,  52, 15, 600 );

    -- EmptCust table
    -- Add 2 customers for Mindy Manager
    INSERT INTO EmpCust (emp_id, cust_id) VALUES ( 53, 2000 );
    INSERT INTO EmpCust (emp_id, cust_id) VALUES ( 53, 2001 );

    -- Seed values so auto-increment values will start above
    -- the pre-inserted rows.
    INSERT INTO CustomerIDPool (pool_cust_id, pool_emp_id) VALUES( 3000, 50 );
    INSERT INTO OrderIDPool (pool_order_id, pool_emp_id) VALUES( 10000, 50 );
    -- Commit all of the data.
    COMMIT;
END
go

call ResetData()
go
CREATE PROCEDURE OrdersDownload ( 
		IN LastDownload	    timestamp,
		IN EmployeeID	    integer )
BEGIN
  SELECT o.order_id, o.cust_id, o.prod_id, o.emp_id, o.disc, o.quant, o.notes, o.status
    FROM "Orders" o, EmpCust ec 
   WHERE o.cust_id = ec.cust_id 
     AND ec.emp_id = EmployeeID
     AND ( o.last_modified > LastDownload OR ec.last_modified > LastDownload)
     AND ( o.status IS NULL  OR  o.status != 'Approved' )
     AND ( ec.action IS NULL )
END
go
CREATE PROCEDURE CustomerIDPool_maintain ( IN syncuser_id INTEGER )
BEGIN
    DECLARE pool_count INTEGER;
    
    -- Determine how many ids to add to the pool
    SELECT COUNT(*) INTO pool_count
	    FROM CustomerIDPool WHERE pool_emp_id = syncuser_id;
	    
    -- Top up the pool with new ids
    WHILE pool_count < 20 LOOP
	INSERT INTO CustomerIDPool ( pool_emp_id ) VALUES ( syncuser_id );
	SET pool_count = pool_count + 1;
    END LOOP;
END
go

CREATE PROCEDURE OrderIDPool_maintain ( IN syncuser_id INTEGER )
BEGIN
    DECLARE pool_count INTEGER;
    
    -- Determine how many ids to add to the pool
    SELECT COUNT(*) INTO pool_count
	    FROM OrderIDPool WHERE pool_emp_id = syncuser_id;
	    
    -- Top up the pool with new ids
    WHILE pool_count < 20 LOOP
	INSERT INTO OrderIDPool ( pool_emp_id ) VALUES ( syncuser_id );
	SET pool_count = pool_count + 1;
    END LOOP;
END
go

-------------------------------------------------------------------------
-- Synchronization
-------------------------------------------------------------------------

create global temporary table OldOrders (
    order_id		integer	not null primary key,
    cust_id		integer	not null,	
    prod_id		integer	not null,
    emp_id		integer	not null,
    disc		integer,
    quant		integer not null,
    notes		varchar(50),
    status		varchar(20)
)
go
create global temporary table NewOrders (
    order_id		integer	not null primary key,
    cust_id		integer	not null,	
    prod_id		integer	not null,
    emp_id		integer	not null,
    disc		integer,
    quant		integer not null,
    notes		varchar(50),
    status		varchar(20)
)
go
CREATE PROCEDURE HandleError(
    INOUT   action	    integer,
    IN	    error_code	    integer,
    IN	    error_message   varchar(1000),
    IN	    user_name	    varchar(128),
    IN	    table_name	    varchar(128) )
BEGIN
    -- -196 is SQLE_INDEX_NOT_UNIQUE
    -- -194 is SQLE_INVALID_FOREIGN_KEY
    if error_code = -196 or error_code = -194 then
	-- ignore the error and keep going
	SET action = 1000;
    else
	-- abort the synchronization
	SET action = 3000;
    end if;
END
go
call ml_add_connection_script( 'salesdb', 'handle_error',
'CALL HandleError( ?, ?, ?, ?, ? )' )
go
call ml_add_connection_script( 'salesdb', 'end_download',
'delete from EmpCust 
    where ? IS NOT NULL
      and emp_id=? 
      and action = ''D''  ' )
go

-- Customer 
--  Allow new customers to be uploaded.
--  Download all customers modified since the last download.

call ml_add_table_script( 'salesdb', 'Customer', 'upload_insert',
'INSERT INTO Customer( cust_id, cust_name ) VALUES( ?, ? )' )
go
call ml_add_table_script( 'salesdb', 'Customer', 'upload_update',
'UPDATE Customer SET cust_name = ? WHERE cust_id = ?' )
go
call ml_add_table_script( 'salesdb', 'Customer', 'upload_delete',
'DELETE FROM Customer WHERE cust_id = ?' )
go
call ml_add_table_script( 'salesdb', 'Customer', 'download_cursor',
'SELECT cust_id, cust_name FROM Customer WHERE last_modified > ? ' )
go
	
-- Product 
--  Do not need upload scripts, because products cannot be added remotely.
--  Download all products.

call ml_add_table_script( 'salesdb', 'Product', 'download_cursor',
'SELECT prod_id, price, prod_name FROM Product' )
go

-- Employee
--  Do not need upload scripts, because employee cannot be added remotely.
--  Download sync employee.

call ml_add_table_script( 'salesdb', 'Employee', 'download_cursor',
'SELECT emp_id, emp_name FROM Employee WHERE ? = NULL OR emp_id = ?' )
go

-- Orders
--  Allow new orders or updated orders.
--  Remove any orders that have been approved.
--  Download updated orders whose status is not approved.
--  Remove any orders if the employee no longer requires
--    that customer (EmpCust with an action of 'D')

call ml_add_table_script( 'salesdb', 'Orders', 'upload_insert',
'INSERT INTO Orders ( order_id, cust_id, prod_id, emp_id, disc, quant, notes, status ) VALUES( ?, ?, ?, ?, ?, ?, ?, ? )' )
go

call ml_add_table_script( 'salesdb', 'Orders', 'upload_update',
'UPDATE Orders SET cust_id = ?, prod_id = ?, emp_id = ?, disc = ?, quant = ?, notes = ?, status = ? WHERE order_id = ?' )
go

call ml_add_table_script( 'salesdb', 'Orders', 'upload_delete',
'DELETE FROM Orders WHERE order_id = ?' )
go

call ml_add_table_script( 'salesdb', 'Orders', 'upload_old_row_insert',
'INSERT INTO OldOrders ( order_id, cust_id, prod_id, emp_id, disc, quant, notes, status )
 VALUES (?, ?, ?, ?, ?, ?, ?, ?)' )
go

call ml_add_table_script( 'salesdb', 'Orders', 'upload_new_row_insert',
'INSERT INTO NewOrders ( order_id, cust_id, prod_id, emp_id, disc, quant, notes, status )
 VALUES (?, ?, ?, ?, ?, ?, ?, ?)' )
go

call ml_add_table_script( 'salesdb', 'Orders', 'upload_fetch',
'SELECT order_id, cust_id, prod_id, emp_id, disc, quant, notes, status
   FROM Orders WHERE order_id = ?' )
go


CREATE PROCEDURE ResolveOrderConflict()
BEGIN
    -- approval overrides denial
    IF 'Approved' = (SELECT status FROM NewOrders) THEN
	UPDATE "Orders" o SET o.status = n.status, o.notes = n.notes
		FROM NewOrders n WHERE o.order_id = n.order_id;
    END IF;
    DELETE FROM OldOrders;
    DELETE FROM NewOrders; 
END
go
call ml_add_table_script( 'salesdb', 'Orders', 'resolve_conflict',
'CALL ResolveOrderConflict')
go
call ml_add_table_script( 'salesdb', 'Orders', 'download_delete_cursor',
'SELECT o.order_id, o.cust_id, o.prod_id, o.emp_id, o.disc, o.quant, o.notes, o.status
   FROM "Orders" o, EmpCust ec
  WHERE o.cust_id = ec.cust_id 
    AND ( ( o.status = ''Approved'' AND o.last_modified > ? ) 
	   OR ( ec.action = ''D''  )  )
    AND ec.emp_id = ?
' )
go
    
call ml_add_table_script( 'salesdb', 'Orders', 'download_cursor',
'CALL OrdersDownload( ?, ? )' )
go
	
-- CustomerIDPool 
--  Maintain a pool of customer ids for adding new customers.

call ml_add_table_script( 'salesdb', 'CustomerIDPool', 'end_upload',
'CALL CustomerIDPool_maintain( ? )' )
go
call ml_add_table_script( 'salesdb', 'CustomerIDPool', 'download_cursor',
'SELECT pool_cust_id FROM CustomerIDPool 
  WHERE last_modified > ?
    AND pool_emp_id = ? ' )
go
call ml_add_table_script( 'salesdb', 'CustomerIDPool', 'upload_insert',
'INSERT INTO CustomerIDPool( pool_cust_id ) VALUES( ? )' )
go
call ml_add_table_script( 'salesdb', 'CustomerIDPool', 'upload_delete',
'DELETE FROM CustomerIDPool WHERE pool_cust_id = ?' )
go
	
-- OrderIDPool 
--  Maintain a pool of order ids for adding new orders.

call ml_add_table_script( 'salesdb', 'OrderIDPool', 'end_upload',
'CALL OrderIDPool_maintain( ? )' )
go
call ml_add_table_script( 'salesdb', 'OrderIDPool', 'download_cursor',
'SELECT pool_order_id FROM OrderIDPool WHERE last_modified > ? AND pool_emp_id = ? ' )
go
call ml_add_table_script( 'salesdb', 'OrderIDPool', 'upload_insert',
'INSERT INTO OrderIDPool( pool_order_id ) VALUES( ? )' )
go
call ml_add_table_script( 'salesdb', 'OrderIDPool', 'upload_delete',
'DELETE FROM OrderIDPool WHERE pool_order_id = ?' )
go

call ml_add_table_script( 'salesdb', 'OrderIDPool', 'download_delete_cursor',
'--{ml_ignore}' )
go
call ml_add_table_script( 'salesdb', 'CustomerIDPool', 'download_delete_cursor',
'--{ml_ignore}' )
go
call ml_add_table_script( 'salesdb', 'Employee', 'download_delete_cursor',
'--{ml_ignore}' )
go
call ml_add_table_script( 'salesdb', 'Product', 'download_delete_cursor',
'--{ml_ignore}' )
go
call ml_add_table_script( 'salesdb', 'Customer', 'download_delete_cursor',
'--{ml_ignore}' )
go

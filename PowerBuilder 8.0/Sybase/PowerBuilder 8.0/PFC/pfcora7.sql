-- ============================================================ 
--   This file      :  pfcora7.sql                              
--   DBMS name      :  ORACLE Version 7.0                       
--   Author         :  Powersoft Corporation                    
--   Created On     :  9/20/96  11:13 AM                        
--   Modified On    :  10/20/97 - change control column length 
--                                to 128 chars               
--                                                              
--   Purpose        :  This is a file of SQL statements you     
--                     can execute against a Oracle 7 database. 
--                     It creates the PFC DB tables which are   
--                     used by the PowerBuilder 5.0 Foundataion 
--                     Class Library (PFC) and then inserts     
--                     data into them. The tables are:          
--                           * messages                         
--                           * security_apps                    
--                           * security_groupings               
--                           * security_info                    
--                           * security_template                
--                           * security_users                   
--                                                              
--                     After loading data into the tables this  
--                     script will create indexes and foreign   
--                     keys.                                    
--                                                              
--   To use it      :  Follow these steps.                      
--                                                              
--                     1) Make sure the target database doesn't 
--                        already contain tables whose names    
--                        conflict with those to be added by    
--                        this file.                            
--                                                              
--                     2) Make sure the target database already 
--                        contains the PowerBuilder repository  
--                        tables (pbcatcol, pbcatedt, pbcatfmt, 
--                        pbcattbl, and pbcatvld).              
--                                                              
--                        If it does not, see the PowerBuilder  
--                        manual "Connecting to Your Database"  
--                        for instructions on creating these    
--                        repository tables.                    
--                                                              
--                     3) After scripts have finished grant the    
--                        proper privileges to the tables.                        
--
--                     4) Use SQL*Plus to execute this file     
--                        (pfcora7.sql).                        
--                                                              
--                                                              
-- ============================================================ 

-- ============================================================ 
-- drop the tables - uncomment them if tables already exist
-- ============================================================ 
-- drop table messages cascade constraints
-- ;
-- drop table security_groupings cascade constraints
-- ;
-- drop table security_info cascade constraints
-- ;
-- drop table security_users cascade constraints
-- ;
-- drop table security_apps cascade constraints
-- ;
-- drop table security_template cascade constraints
-- ;
-- commit
-- ;

-- ============================================================ 
--   Table : messages                                           
-- ============================================================ 
create table messages
(
    msgid                           varchar2(40)           not null,
    msgtitle                        varchar2(255)          not null,
    msgtext                         varchar2(255)          not null,
    msgicon                         varchar2(12)           not null,
    msgbutton                       varchar2(17)           not null,
    msgdefaultbutton                integer                not null,
    msgseverity                     integer                not null,
    msgprint		            char(1)                not null,
    msguserinput                    char(1)                not null,
    constraint pk_messages primary key (msgid)
)
tablespace bgdata
;
commit
;
-- ============================================================ 
--   Table : security_groupings                                 
-- ============================================================ 
create table security_groupings
(
    group_name                      varchar2(16)           not null,
    user_name                       varchar2(16)           not null,
    constraint pk_sec_groupings primary key (group_name, user_name)
)
;
commit
;
-- ============================================================ 
--   Table : security_info                                      
-- ============================================================ 
create table security_info
(
    application                     varchar2(32)           not null,
    window                          varchar2(64)           not null,
    control                         varchar2(128)          not null,
    user_name                       varchar2(16)           not null,
    status                          char(1)                not null,
    constraint pk_sec_info primary key (application, window, control, user_name)
)
;
commit
;
-- ============================================================ 
--   Table : security_users                                     
-- ============================================================ 
create table security_users
(
    name                            varchar2(16)           not null,
    description                     varchar2(32)           not null,
    priority                        integer                not null,
    user_type                       integer                        ,    
    constraint pk_sec_users primary key (name)
)
;
commit
;
-- ============================================================ 
--   Table : security_apps                                      
-- ============================================================ 
create table security_apps
(
    application                     varchar2(32)           not null,
    description                     varchar2(64)           not null,
    constraint pk_sec_apps primary key (application)
)
;
commit
;
-- ============================================================ 
--   Table : security_template                                  
-- ============================================================ 
create table security_template
(
    application                     varchar2(32)           not null,
    window                          varchar2(64)           not null,
    control                         varchar2(128)          not null,
    description                     varchar2(254)          not null,
    object_type                     varchar2(24)           not null,
    constraint pk_sec_template primary key (application, window, control)
)
;
commit
;

-- ============================================================ 
--   Grant privileges                                                  
-- ============================================================ 
-- grant select on messages to public
-- ;
-- grant select on security_groupings to public
-- ;
-- grant select on security_info to public
-- ;
-- grant select on security_users to public
-- ;
-- grant select on security_apps to public
-- ;
-- grant select on security_template to public
-- ;

-- ============================================================ 
--   Load data                                                  
-- ============================================================ 
-- ============================================================ 
--   Load messages table                                        
-- ============================================================ 
INSERT INTO messages VALUES (
	'pfc_closequery_savechanges',
	'Application',
	'Do you want to save changes?',
	'Exclamation',
	'YesNoCancel',
	1,
	0,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_closequery_failsvalidation',
	'Application',
	'The information entered does not pass validation and must be corrected before changes can be saved.~r~n~r~nClose without saving changes?',
	'Exclamation',
	'YesNo',
	2,
	5,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_requiredmissing',
	'Application',
	'Required value missing for %s on row %s.  Please enter a value.',
	'Information',
	'Ok',
	1,
	5,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_dwdberror',
	'Application',
	'%s',
	'StopSign',
	'Ok',
	1,
	20,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_systemerror',
	'System Error',
	'%s',
	'StopSign',
	'Ok',
	1,
	20,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_dwlinkage_rowchanging',
	'Application',
	'Updates are pending. ~r~nSave them now?',
	'Exclamation',
	'YesNoCancel',
	1,
	0,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_dwlinkage_predelete',
	'Application',
	'Delete row(s)?',
	'Exclamation',
	'OkCancel',
	1,
	0,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_dwlinkage_requiredmissing',
	'Application',
	'Required value missing for %s on row %s.  Please enter a value.',
	'Information',
	'Ok',
	1,
	5,
	'N',
	'N')
;
INSERT INTO messages VALUES (
	'pfc_dsaccepttext',
	'Application',
	'Failed accepttext validation on datastore.  Column  %s  on row  %s.',
	'Exclamation',
	'Ok',
	1,
	20,
	'N',
	'Y')
;
INSERT INTO messages VALUES (
	'pfc_requiredmissingondatastore',
	'Application',
	'Required value missing for %s on row %s.',
	'StopSign',
	'Ok',
	1,
	20,
	'N',
	'Y')
;
commit
;

-- ============================================================ 
--   Build foreign keys                                         
-- ============================================================ 
alter table security_groupings
    add constraint security_groupings_group foreign key (group_name)
       references security_users (name)
;

alter table security_groupings
    add constraint security_groupings_user foreign key (user_name)
       references security_users (name)
;

alter table security_info
    add constraint security_info_template foreign key (application, window, control)
       references security_template (application, window, control)
;

alter table security_info
    add constraint security_info_users foreign key (user_name)
       references security_users (name)
;

alter table security_template
    add constraint security_template_app foreign key (application)
       references security_apps (application)
;
commit
;
-- ============================================================ 
--   Load PowerBuilder Repository Tables                        
-- ============================================================ 
-- ============================================================ 
--   Load pbcatcol table                                        
-- ============================================================ 
DELETE FROM pbcatcol
WHERE pbc_tnam IN ('messages', 'security_apps', 'security_groupings', 
		'security_info', 'security_template', 'security_users')
;
commit
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgid',
	1,
	'msgid',
	0,
	'msgid',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgtitle',
	2,
	'msgtitle',
	0,
	'msgtitle',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgtext',
	3,
	'msgtext',
	0,
	'msgtext',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgicon',
	4,
	'msgicon',
	0,
	'msgicon',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgbutton',
	5,
	'msgbutton',
	0,
	'msgbutton',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgdefaultbutton',
	6,
	'msgdefaultbutton',
	0,
	'msgdefaultbutton',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgseverity',
	7,
	'msgseverity',
	0,
	'msgseverity',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msgprint',
	8,
	'msgprint',
	0,
	'msgprint',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'messages',
	'',
	USER,
	'msguserinput',
	9,
	'msguserinput',
	0,
	'msguserinput',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_groupings',
	'',
	USER,
	'group_name',
	1,
	'Group Name',
	0,
	'Group Name',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'security_groups',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_groupings',
	'',
	USER,
	'user_name',
	2,
	'User Name',
	0,
	'User Name',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'security_users',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_info',
	'',
	USER,
	'application',
	1,
	'Application : ',
	0,
	'Application',
	0,
	0,
	'',
	0,
	0,
	659,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_info',
	'',
	USER,
	'window',
	2,
	'Window: ',
	0,
	'Window',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_info',
	'',
	USER,
	'control',
	3,
	'Control: ',
	0,
	'Control',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_info',
	'',
	USER,
	'user_name',
	4,
	'Id: ',
	0,
	'User ID',
	0,
	23,
	'[General]',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_info',
	'',
	USER,
	'status',
	5,
	'Status:',
	0,
	'Status',
	0,
	23,
	'',
	0,
	0,
	439,
	'',
	'N',
	'',
	'',
	'security_statustypes',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_template',
	'',
	USER,
	'application',
	1,
	'application',
	0,
	'application',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_template',
	'',
	USER,
	'window',
	2,
	'window',
	0,
	'window',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_template',
	'',
	USER,
	'control',
	3,
	'control',
	0,
	'control',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_template',
	'',
	USER,
	'description',
	4,
	'description',
	0,
	'description',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_template',
	'',
	USER,
	'object_type',
	5,
	'object_type',
	0,
	'object_type',
	0,
	0,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_users',
	'',
	USER,
	'name',
	1,
	'User/Group Name:',
	0,
	'User/Group Name',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_users',
	'',
	USER,
	'description',
	2,
	'Description:',
	0,
	'Description',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_users',
	'',
	USER,
	'priority',
	3,
	'Priority:',
	0,
	'Priority',
	0,
	24,
	'[General]',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_users',
	'',
	USER,
	'user_type',
	4,
	'Entry Type:',
	0,
	'Entry Type',
	0,
	25,
	'[General]',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_apps',
	'',
	USER,
	'application',
	1,
	'Application:',
	0,
	'Application',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
INSERT INTO pbcatcol VALUES (
	'security_apps',
	'',
	USER,
	'description',
	2,
	'Description:',
	0,
	'Description',
	0,
	23,
	'',
	0,
	0,
	0,
	'',
	'N',
	'',
	'',
	'',
	'')
;
commit
;
-- ============================================================ 
--   Load pbcattbl table                                        
-- ============================================================ 
DELETE FROM pbcattbl
WHERE pbt_tnam IN ('messages', 'security_apps', 'security_groupings',
		 'security_info', 'security_template', 'security_users')
;
commit
;
INSERT INTO pbcattbl VALUES (
	'messages',
	'',
	USER,
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	'')
;
INSERT INTO pbcattbl VALUES (
	'security_groupings',
	'',
	USER,
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	'')
;
INSERT INTO pbcattbl VALUES (
	'security_info',
	'',
	USER,
	-10,
	400,
	'N',
	'N',
	0,
	34,
	'Arial',
	-10,
	400,
	'N',
	'N',
	0,
	34,
	'Arial',
	-10,
	400,
	'N',
	'N',
	0,
	34,
	'Arial',
	'')
;
INSERT INTO pbcattbl VALUES (
	'security_template',
	'',
	USER,
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	'')
;
INSERT INTO pbcattbl VALUES (
	'security_users',
	'',
	USER,
	-10,
	400,
	'N',
	'N',
	0,
	34,
	'Arial',
	-10,
	400,
	'N',
	'N',
	0,
	34,
	'Arial',
	-10,
	400,
	'N',
	'N',
	0,
	34,
	'Arial',
	'')
;
INSERT INTO pbcattbl VALUES (
	'security_apps',
	'',
	USER,
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	0,
	0,
	'N',
	'N',
	0,
	0,
	'',
	'')
;
commit
;


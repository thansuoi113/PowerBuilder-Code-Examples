/* ============================================================ */
/*   This file      :  pfcsy10.sql                              */
/*   DBMS name      :  SYBASE System 10 & 11                    */
/*   Author         :  Powersoft Corporation                    */
/*   Created On     :  9/20/96  11:13 AM                        */
/*   Modified On    :  10/20/97 - change control column length  */
/*                                to 128 chars                  */
/*                                                              */
/*   Purpose        :  This is a file of SQL statements you     */
/*                     can execute against a Sybase System 10   */
/*                     database. It creates the PFC DB tables   */
/*                     which are used by the PowerBuilder 5.0   */
/*                     Foundation Class Library (PFC) and then  */
/*                     inserts data into them. The tables are:  */
/*                           * messages                         */
/*                           * security_apps                    */
/*                           * security_groupings               */
/*                           * security_info                    */
/*                           * security_template                */
/*                           * security_users                   */
/*                                                              */
/*                     After loading data into the tables this  */
/*                     script will create indexes and foreign   */
/*                     keys.                                    */
/*                                                              */
/*   To use it      :  Follow these steps.                      */
/*                                                              */
/*                     1) Make sure the target database doesn't */
/*                        already contain tables whose names    */
/*                        conflict with those to be added by    */
/*                        this file.                            */
/*                                                              */
/*                     2) Make sure the target database already */
/*                        contains the PowerBuilder repository  */
/*                        tables (pbcatcol, pbcatedt, pbcatfmt, */
/*                        pbcattbl, and pbcatvld).              */
/*                                                              */
/*                        If it does not, see the PowerBuilder  */
/*                        manual "Connecting to Your Database"  */
/*                        for instructions on creating these    */
/*                        repository tables.                    */
/*                                                              */
/*                     3) After the script is finshed, grant    */
/*                        the appropriate privileges.           */
/*                        You can use the grants in this        */
/*                        script as a template.                 */
/*                        Just uncomment them.                  */
/*                                                              */
/*                     4) Use ISQL to execute this file         */
/*                        (pfcsy10.sql).                        */
/*                                                              */
/*                                                              */
/* ============================================================ */


/* ============================================================ */
/*   Specify the database to use:                               */
/*                                                              */
/*      use <dbname>                                            */
/*      go                                                      */
/*                                                              */
/* ============================================================ */

/* ============================================================ */
/*   Drop Tables - uncomment if they already exist in your db   */
/* ============================================================ */
/* drop table messages                                          */
/* go                                                           */
/* drop table security_groupings                                */
/* go                                                           */
/* drop table security_info                                     */
/* go                                                           */
/* drop table security_users                                    */
/* go                                                           */
/* drop table security_apps                                     */
/* go                                                           */
/* drop table security_template                                 */
/* go                                                           */

/* ============================================================ */
/*   Table : messages                                           */
/* ============================================================ */
create table messages
(
    msgid                           varchar(40)            not null,
    msgtitle                        varchar(255)           not null,
    msgtext                         varchar(255)           not null,
    msgicon                         varchar(12)            not null,
    msgbutton                       varchar(17)            not null,
    msgdefaultbutton                int                    not null,
    msgseverity                     int                    not null,
    msgprint                        char(1)                not null,
    msguserinput                    char(1)                not null,
    constraint pk_messages primary key nonclustered (msgid)
)
go

/* ============================================================ */
/*   Table : security_groupings                                 */
/* ============================================================ */
create table security_groupings
(
    group_name                      varchar(16)            not null,
    user_name                       varchar(16)            not null,
    constraint pk_sec_groupings primary key nonclustered (group_name, user_name)
)
go

/* ============================================================ */
/*   Table : security_info                                      */
/* ============================================================ */
create table security_info
(
    application                     varchar(32)            not null,
    window                          varchar(64)            not null,
    control                         varchar(128)           not null,
    user_name                       varchar(16)            not null,
    status                          char(1)                not null,
    constraint pk_sec_info primary key nonclustered (application, window, control, user_name)
)
go

/* ============================================================ */
/*   Table : security_users                                     */
/* ============================================================ */
create table security_users
(
    name                            varchar(16)            not null,
    description                     varchar(32)            not null,
    priority                        int                    not null,
    user_type                       int                    null    ,
    constraint pk_sec_users primary key nonclustered (name)
)
go

/* ============================================================ */
/*   Table : security_apps                                      */
/* ============================================================ */
create table security_apps
(
    application                     varchar(32)            not null,
    description                     varchar(64)            not null,
    constraint pk_sec_apps primary key nonclustered (application)
)
go

/* ============================================================ */
/*   Table : security_template                                  */
/* ============================================================ */
create table security_template
(
    application                     varchar(32)            not null,
    window                          varchar(64)            not null,
    control                         varchar(128)           not null,
    description                     varchar(254)           not null,
    object_type                     varchar(24)            not null,
    constraint pk_sec_template primary key nonclustered (application, window, control)
)
go
commit
go
/* ============================================================ */
/*   Grant privileges                                           */
/* ============================================================ */
/* grant select on messages to public                           */
/* go                                                           */
/* grant select on security_groupings to public                 */
/* go                                                           */
/* grant select on security_info to public                      */
/* go                                                           */
/* grant select on security_users to public                     */
/* go                                                           */
/* grant select on security_apps to public                      */
/* go                                                           */
/* grant select on security_template to public                  */
/* go                                                           */

/* ============================================================ */
/*   Load data                                                  */
/* ============================================================ */
/* ============================================================ */
/*   Load messages table                                        */
/* ============================================================ */
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
go
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
go
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
go
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
go
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
go
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
go
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
go
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
go
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
go
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
go
commit
go
/* ============================================================ */
/*   Build Indexes                                              */
/* ============================================================ */
create unique clustered index messages on messages (msgid)
go
commit
go

/* ============================================================ */
/*   Build foreign keys                                         */
/* ============================================================ */
alter table security_groupings
    add constraint security_groupings_group foreign key (group_name)
       references security_users
go

alter table security_groupings
    add constraint security_groupings_user foreign key (user_name)
       references security_users
go

alter table security_info
    add constraint security_info_template foreign key (application, window, control)
       references security_template
go

alter table security_info
    add constraint security_info_users foreign key (user_name)
       references security_users
go

alter table security_template
    add constraint security_template_app foreign key (application)
       references security_apps
go
commit
go

/* ============================================================ */
/*   Load PowerBuilder Repository Tables                        */
/* ============================================================ */
/* ============================================================ */
/*   Load pbcatcol table                                        */
/* ============================================================ */
DELETE FROM pbcatcol
WHERE pbc_tnam IN ('messages', 'security_apps', 'security_groupings', 
		'security_info', 'security_template', 'security_users')
go
commit
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_groupings',
	OBJECT_ID('dbo.security_groupings'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_groupings',
	OBJECT_ID('dbo.security_groupings'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_info',
	OBJECT_ID('dbo.security_info'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_info',
	OBJECT_ID('dbo.security_info'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_info',
	OBJECT_ID('dbo.security_info'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_info',
	OBJECT_ID('dbo.security_info'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_info',
	OBJECT_ID('dbo.security_info'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_template',
	OBJECT_ID('dbo.security_template'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_template',
	OBJECT_ID('dbo.security_template'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_template',
	OBJECT_ID('dbo.security_template'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_template',
	OBJECT_ID('dbo.security_template'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_template',
	OBJECT_ID('dbo.security_template'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_users',
	OBJECT_ID('dbo.security_users'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_users',
	OBJECT_ID('dbo.security_users'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_users',
	OBJECT_ID('dbo.security_users'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_users',
	OBJECT_ID('dbo.security_users'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_apps',
	OBJECT_ID('dbo.security_apps'),
	'dbo',
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
go
INSERT INTO pbcatcol VALUES (
	'security_apps',
	OBJECT_ID('dbo.security_apps'),
	'dbo',
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
go
commit
go
/* ============================================================ */
/*   Load pbcattbl table                                        */
/* ============================================================ */
DELETE FROM pbcattbl
WHERE pbt_tnam IN ('messages', 'security_apps', 'security_groupings',
		 'security_info', 'security_template', 'security_users')
go
commit
go
INSERT INTO pbcattbl VALUES (
	'messages',
	OBJECT_ID('dbo.messages'),
	'dbo',
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
go
INSERT INTO pbcattbl VALUES (
	'security_groupings',
	OBJECT_ID('dbo.security_groupings'),
	'dbo',
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
go
INSERT INTO pbcattbl VALUES (
	'security_info',
	OBJECT_ID('dbo.security_info'),
	'dbo',
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
go
INSERT INTO pbcattbl VALUES (
	'security_template',
	OBJECT_ID('dbo.security_template'),
	'dbo',
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
go
INSERT INTO pbcattbl VALUES (
	'security_users',
	OBJECT_ID('dbo.security_users'),
	'dbo',
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
go
INSERT INTO pbcattbl VALUES (
	'security_apps',
	OBJECT_ID('dbo.security_apps'),
	'dbo',
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
go
commit
go


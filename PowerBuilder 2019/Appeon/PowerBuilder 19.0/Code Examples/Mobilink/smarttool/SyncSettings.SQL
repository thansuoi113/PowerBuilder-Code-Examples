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
GRANT SELECT, INSERT, UPDATE ON SyncSettings TO public
go

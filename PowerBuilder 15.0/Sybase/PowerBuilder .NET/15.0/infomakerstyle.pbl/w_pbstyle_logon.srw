$PBExportHeader$w_pbstyle_logon.srw
forward
global type w_pbstyle_logon from Window
end type
type sle_password from SingleLineEdit within w_pbstyle_logon
end type
type sle_userid from SingleLineEdit within w_pbstyle_logon
end type
type cb_cancel from CommandButton within w_pbstyle_logon
end type
type cb_ok from CommandButton within w_pbstyle_logon
end type
type st_2 from StaticText within w_pbstyle_logon
end type
type st_1 from StaticText within w_pbstyle_logon
end type
end forward

global type w_pbstyle_logon from Window
sle_password sle_password
sle_userid sle_userid
cb_cancel cb_cancel
cb_ok cb_ok
st_2 st_2
st_1 st_1
end type
global w_pbstyle_logon w_pbstyle_logon

on w_pbstyle_logon.create
this.sle_password = create sle_password
this.sle_userid = create sle_userid
this.cb_cancel = create cb_cancel
this.cb_ok = create cb_ok
this.st_2 = create st_2
this.st_1 = create st_1
this.Control[]={this.sle_password,&
this.sle_userid,&
this.cb_cancel,&
this.cb_ok,&
this.st_2,&
this.st_1}
end on

on w_pbstyle_logon.destroy
destroy(this.sle_password)
destroy(this.sle_userid)
destroy(this.cb_cancel)
destroy(this.cb_ok)
destroy(this.st_2)
destroy(this.st_1)
end on

event open;//*-----------------------------------------------------------------*/
//*    open event: ByPass the Logon if it is in the INI File 
//*-----------------------------------------------------------------*/
If SQLCA.LogID <> "" And SQLCA.LogPass <> "" Then
	Post Close ( this )
Else
	this.Visible = True
	sle_userid.Text   = SQLCA.UserID
	sle_password.Text = SQLCA.dbPass
End If
end event

type sle_password from SingleLineEdit within w_pbstyle_logon
end type

on sle_password.create
end on

on sle_password.destroy
end on

type sle_userid from SingleLineEdit within w_pbstyle_logon
end type

on sle_userid.create
end on

on sle_userid.destroy
end on

type cb_cancel from CommandButton within w_pbstyle_logon
end type

on cb_cancel.create
end on

on cb_cancel.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event: Clear Settings
//*-----------------------------------------------------------------*/
SQLCA.userid  = ""
SQLCA.logid   = ""
SQLCA.dbpass  = ""
SQLCA.logpass = ""
Close ( Parent )
end event

type cb_ok from CommandButton within w_pbstyle_logon
end type

on cb_ok.create
end on

on cb_ok.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event: Set Values
//*-----------------------------------------------------------------*/
SQLCA.userid  = sle_userid.Text
SQLCA.logid   = sle_userid.Text
SQLCA.dbpass  = sle_password.Text
SQLCA.logpass = sle_password.Text
Close ( Parent )
end event

type st_2 from StaticText within w_pbstyle_logon
end type

on st_2.create
end on

on st_2.destroy
end on

type st_1 from StaticText within w_pbstyle_logon
end type

on st_1.create
end on

on st_1.destroy
end on

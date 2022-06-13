$PBExportHeader$w_pbstyle_frame_ancestor.srw
forward
global type w_pbstyle_frame_ancestor from Window
end type
type mdi_1 from MDIClient within w_pbstyle_frame_ancestor
end type
end forward

global type w_pbstyle_frame_ancestor from Window
string MenuName = "m_pbstyle_frame_ancestor"
mdi_1 mdi_1
end type
global w_pbstyle_frame_ancestor w_pbstyle_frame_ancestor

type variables
// Query governor row limit
boolean ib_limitrows = false
long il_rowlimit = 1000

// Query governor time limit
boolean ib_limittime = false
time it_timelimit = 00:10:00

// Hide the forms button
boolean ib_hideforms = false

// Hide the reports button
boolean ib_hidereports = false

// Hide the pipelines button
boolean ib_hidepipelines = false
end variables

forward prototypes
public function integer of_processcommandline (string as_commandparm)
end prototypes

public function integer of_processcommandline (string as_commandparm);//*-----------------------------------------------------------------*/
//*    of_ProcessCommandLine function:   Process Parameters sent in Command Line
//*-----------------------------------------------------------------*/
m_pbstyle_frame_ancestor lm_Menu
long ll_pos, ll_o, ll_objs
string ls_object, ls_arglist, ls_action
string ls_names[], ls_objnames[], ls_comments[], ls_objecttype, ls_type
boolean lb_objexists
w_pbstyle_report lw_report
//w_pbstyle_pipeline lw_pipeline
window lw_form
s_parm lstr_parm

lm_Menu = this.MenuID

If Len ( as_commandparm ) > 0 Then
	If Pos ( as_commandparm, " " ) = 0 Then
		If Pos ( as_commandparm, "/?" ) = 0 Then
			Messagebox ( "InfoMaker error", "Commandline option error:~r~n~r~n" + as_commandparm + " is an invalid commandline parameter specification.~r~n~r~nUse exename /? for Help", StopSign!)
			Return -1
		End If
	End If
End If

If Pos ( Lower (as_commandparm), "/rpc" ) = 1 Then
	/*  Open Report, Print, Close */
	ls_action = "rpc" ; ls_objecttype = "report" ; ls_type = "r"
	ll_pos = Pos ( as_commandparm, " ", 5 ) 
	If ll_pos > 0 Then 
		//ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	Else
		MessageBox ( "CommandLine Error", "Report name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		Return -1
	End If
	
ElseIf Pos ( Lower (as_commandparm), "/rp" ) = 1 Then
	/*  Open Report, Print */
	ls_action = "rp" ; ls_objecttype = "report" ; ls_type = "r"
	ll_pos = Pos ( as_commandparm, " ", 4 ) 
	If ll_pos > 0 Then 
		//ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	Else
		MessageBox ( "CommandLine Error", "Report name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		Return -1
	End If
	
ElseIf Pos ( Lower (as_commandparm), "/r" ) = 1 Then
	/*  Open Report */
	ls_action = "r" ; ls_objecttype = "report" ; ls_type = "r"
	ll_pos = Pos ( as_commandparm, " ", 3 ) 
	If ll_pos > 0 Then 
		//ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	Else
		MessageBox ( "CommandLine Error", "Report name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		Return -1
	End If
	
ElseIf Pos ( Lower (as_commandparm), "/fpc" ) = 1 Then
	/*  Open Form, Print, Close */
	ls_action = "fpc" ; ls_objecttype = "form" ; ls_type = "f"
	ll_pos = Pos ( as_commandparm, " ", 5 ) 
	If ll_pos > 0 Then 
		//ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	Else
		MessageBox ( "CommandLine Error", "Form name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		Return -1
	End If
	
ElseIf Pos ( Lower (as_commandparm), "/fp" ) = 1 Then
	/*  Open Form, Print */
	ls_action = "fp" ; ls_objecttype = "form" ; ls_type = "f"
	ll_pos = Pos ( as_commandparm, " ", 4 ) 
	If ll_pos > 0 Then 
		//ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	Else
		MessageBox ( "CommandLine Error", "Form name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		Return -1
	End If	
	
ElseIf Pos ( Lower (as_commandparm), "/f" ) = 1 Then
	/*  Open Form */
	ls_action = "f" ; ls_objecttype = "form" ; ls_type = "f"
	ll_pos = Pos ( as_commandparm, " ", 3 ) 
	If ll_pos > 0 Then 
		//ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	Else
		MessageBox ( "CommandLine Error", "Form name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		Return -1
	End If
	
//ElseIf Pos ( Lower (as_commandparm), "/pc" ) = 1 Then
	///*  Open Pipeline, Close */
	//ls_action = "pc" ; ls_objecttype = "pipeline" ; ls_type = "p"
	//ll_pos = Pos ( as_commandparm, " ", 4 ) 
	//If ll_pos > 0 Then 
		////ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		//ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) )
	//Else
		//MessageBox ( "CommandLine Error", "Pipeline name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		//Return -1
	//End If
	//
//ElseIf Pos ( Lower (as_commandparm), "/p" ) = 1 Then
	///*  Open Pipeline */
	//ls_action = "p" ; ls_objecttype = "pipeline" ; ls_type = "p"
	//ll_pos = Pos ( as_commandparm, " ", 3 ) 
	//If ll_pos > 0 Then 
		////ls_object = Trim ( Lower ( Mid ( as_commandparm, ll_pos + 1 ) ) )  
		//ls_object = Trim ( Mid ( as_commandparm, ll_pos + 1 ) ) 
	//Else
		//MessageBox ( "CommandLine Error", "Pipeline name not specified.  Command was:~r~n~r~n" + as_commandparm, StopSign! ) 
		//Return -1
	//End If

ElseIf Pos ( as_commandparm, "/?" ) = 1 Then
	/*  Help */ 
	MessageBox ( "InfoMaker Commandline syntax", &
		"InfoMaker Commandline syntax:~r~n~r~n" +  &
		"exename /switch <object_name> /a <arg1;arg2;...<argn>>~r~n" + &
		"Where:~r~n" + &
		"/r report_name (Run report)~r~n" + &
		"/rp report_name (Run report and print)~r~n" + &
		"/rpc report_name (Run report, print, close)~r~n" + &
		"/p pipeline_name (Run pipeline)~r~n" + &
		"/pc pipeline_name (Run pipeline and close)~r~n" + &
		"/f form_name (Run form)~r~n" + &
		"/fp form_name (Run form and print)~r~n" + &
		"/fpc form_name (Run form, print, close)~r~n" + &
		"/? (Help)~r~n"+ &
		"~r~nEx: tutorial.exe /r customer_list", Information! )
	Return 1

End If

/*  Look for Arguments following report name  */
ll_pos = Pos ( Lower(ls_object), "/a" )
If ll_pos > 0 Then
	ls_arglist = Trim ( Mid ( ls_object, ll_pos + 2 ) )
	ls_object = Lower (Trim ( Left ( ls_object, ll_pos - 1 ) ) )
End If
lstr_parm.s_Object = ls_object 
lstr_parm.s_ArgString = ls_arglist 

/*  Get a list of objects  */
lm_menu.f_GetObjectsofType ( ls_type, ls_names, ls_objnames, ls_comments )
ll_objs = UpperBound ( ls_objnames ) 
/*  Make sure object is part of the executable  */
For ll_o = 1 to ll_objs
	If ls_object = ls_objnames[ll_o] Then
		lb_objexists = True
		Exit
	End If
Next
If Not lb_objexists Then 
	Messagebox ( "InfoMaker Commandline option error", WordCap ( ls_objecttype ) + " object '" + ls_object + "' is not found.  Command was:~r~n~r~n" + as_commandparm, StopSign! )
	Return -1
End If

SetPointer ( HourGlass! )

/*  Perform Action  */
Choose Case ls_action
	Case "r"
		OpenSheetWithParm ( lw_report, lstr_parm, this, 4, Layered! )	 
		
	Case "rp"
		OpenSheetWithParm ( lw_report, lstr_parm, this, 4, Layered! )	 
		lw_report.Dynamic Event Print ()
		
	Case "rpc"
		OpenSheetWithParm ( lw_report, lstr_parm, this, 4, Layered! )	 
		lw_report.Dynamic Event Print ()
		Close ( this )
		
	//Case "p"
		//OpenSheetWithParm ( lw_pipeline, ls_object, this, 4, Layered! )	 
		//lw_pipeline.PostEvent ( "ue_execute_pipe" ) 
//
	//Case "pc"
		//OpenSheetWithParm ( lw_pipeline, ls_object, this, 4, Layered! )	 
		//lw_pipeline.PostEvent ( "ue_execute_pipe" ) 
		//Post Close ( this ) 
		
	Case "f"
		OpenSheet ( lw_form, ls_object, this, 4, Layered! ) 

	Case "fp"
		OpenSheet ( lw_form, ls_object, this, 4, Layered! )	 
		lw_form.Dynamic Event Print ()
	
	Case "fpc"
		OpenSheet ( lw_form, ls_object, this, 4, Layered! )	 
		lw_form.Dynamic Event Print ()
		Close ( this )
		
	Case Else
		//  Do Nothing 
End Choose

Return 1
end function

on w_pbstyle_frame_ancestor.create
if IsValid(this.MenuID) then destroy(this.MenuID)
if this.MenuName = "m_pbstyle_frame_ancestor" then this.MenuID = create m_pbstyle_frame_ancestor
this.mdi_1 = create mdi_1
this.Control[]={this.mdi_1}
end on

on w_pbstyle_frame_ancestor.destroy
if IsValid(this.MenuID) then destroy(this.MenuID)
destroy(this.mdi_1)
end on

event open;//*-----------------------------------------------------------------*/
//*    open function:   Initialization
//*-----------------------------------------------------------------*/
m_pbstyle_frame_ancestor lm_current
string ls_command
Application la_app
boolean lb_requirelogin = True

la_app = GetApplication ()
la_app.ToolbarText = True
la_app.ToolbarTips = True

//  Get ini file
string sIni 
sIni = GetCurrentDirectory()
sIni += "\" + la_app.AppName + ".ini"
If FileExists(sIni) Then
Else
	MessageBox ("Missing INI File", "The file " + sIni + " cannot be located.")
	Return -1
End If

SQLCA.DBMS       = ProfileString (sIni, "database", "DBMS", "ODBC")
SQLCA.Database   = ProfileString (sIni, "database", "Database", "")
SQLCA.UserId     = ProfileString (sIni, "database", "UserID", "")
SQLCA.DBPass     = ProfileString (sIni, "database", "DatabasePassWord", "")
SQLCA.LogId      = ProfileString (sIni, "database", "LogID", "")
SQLCA.LogPass    = ProfileString (sIni, "database", "LogPassWord", "")
SQLCA.ServerName = ProfileString (sIni, "database", "ServerName", "")
SQLCA.AutoCommit = (ProfileInt   (sIni, "database", "AutoCommit", 0 ) = 1)
SQLCA.dbParm     = ProfileString (sIni, "database", "DBParm", "ConnectString='DSN=EAS Demo DB V125;UID=dba;PWD=sql'")
SQLCA.Lock       = ProfileString (sIni, "database", "Lock", "")

//  Determine if we need to prompt for login or not
If (Trim (SQLCA.UserId) <> "" And Trim (SQLCA.DBPass) <> "") Then
	lb_requirelogin = False
ElseIf (Trim (SQLCA.LogID) <> "" And Trim (SQLCA.LogPass) <> "") Then
	lb_requirelogin = False
ElseIf (Pos (Lower (SQLCA.dbParm), "uid=") > 0 And Pos (Lower (SQLCA.dbParm), "pwd=") > 0) Then
	lb_requirelogin = False
End If

If (lb_requirelogin) Then
	Open (w_pbstyle_logon)
End If

/*  Actual DB connection */
Connect using SQLCA;

If SQLCA.SQLCode <> 0 Then
	MessageBox ("Cannot Connect to Database", SQLCA.SQLErrText)
	Return -1
End If

ls_command = Trim (CommandParm ())
this.Tag = Message.StringParm

//  Get a reference to the menu
lm_current = this.MenuID

// Hide any appropriate buttons
If ib_hideforms Then lm_current.f_HideFormsButton ( )
If ib_hidereports Then lm_current.f_HideReportsButton ( )
If ib_hidepipelines Then lm_current.f_HidePipelinesButton ( )

If ls_command <> "" Then of_ProcessCommandLine ( ls_command )
end event

type mdi_1 from MDIClient within w_pbstyle_frame_ancestor
end type

on mdi_1.create
end on

on mdi_1.destroy
end on

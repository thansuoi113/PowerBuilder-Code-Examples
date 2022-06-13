$PBExportHeader$w_pbstyle_report.srw
forward
global type w_pbstyle_report from Window
end type
type dw_report from DataWindow within w_pbstyle_report
end type
end forward

global type w_pbstyle_report from Window
string MenuName = "m_pbstyle_report"
event cancelretrieve pbm_custom01
event print ()
event printdlg ()
event printpreview (boolean ab_onoff)
dw_report dw_report
end type
global w_pbstyle_report w_pbstyle_report

type variables
boolean ib_CancelRetrieve

// Query governor row variables
boolean ib_limitrows
long il_rowlimit

// Query governor time variables
boolean ib_limittime
time it_timelimit

WSConnection i_wsConnection
end variables

forward prototypes
public function long of_parsetoarray (string as_source, string as_delimiter, ref string as_rtnarray[])
public function integer of_getdwargs (ref string as_args[], ref string as_types[])
public function boolean of_populatewsconnection (readonly string as_report)
end prototypes

public function long of_parsetoarray (string as_source, string as_delimiter, ref string as_rtnarray[]);//*-----------------------------------------------------------------------------------------------------------------------*/
//*    of_parsetoarray:  Parse a delimited string into an array of strings
//*-----------------------------------------------------------------------------------------------------------------------*/
long ll_DelLen, ll_pos, ll_Count, ll_Start, ll_Length
string ls_holder

If IsNull ( as_source ) Or IsNull ( as_delimiter ) Then
	long ll_null
	SetNull ( ll_null )
	Return ll_null
End If

/*  Check for at least one entry  */

If Trim ( as_source ) = "" Then Return 0

/*  Get the length of the delimiter  */
ll_DelLen = Len ( as_Delimiter )

ll_pos =  Pos ( Upper ( as_source ), Upper ( as_Delimiter ) )
/*  Only one entry was found  */
If ll_pos = 0 Then
	as_RtnArray[1] = as_source
	Return 1
End If

/*  More than one entry was found - loop to get all of them  */
ll_Count = 0
ll_Start = 1

Do While ll_pos > 0
	/*  Set current entry  */
	ll_Length = ll_pos - ll_Start
	ls_holder = Mid ( as_source, ll_start, ll_length )

	/*  Update array and counter  */
	//If Trim ( ls_holder ) > "" Then
		ll_Count ++
		as_RtnArray[ll_Count] = ls_holder
	//End If
	
	/*  Set the new starting position  */
	ll_Start = ll_pos + ll_DelLen

	ll_pos =  Pos ( Upper ( as_source ), Upper ( as_Delimiter ), ll_Start )
Loop

/*  Set last entry  */
ls_holder = Mid ( as_source, ll_start, Len ( as_source ) )

/*  Update array and counter if necessary  */
If Trim (ls_holder) <> "" Then
	ll_Count ++
	as_RtnArray[ll_Count] = ls_holder
End If

/*  Return the number of entries found  */
Return ll_Count
end function

public function integer of_getdwargs (ref string as_args[], ref string as_types[]);string ls_dwargs, ls_dwargswithtype[], ls_args[], ls_types[]
long ll_a, ll_args, ll_pos

ls_dwargs = dw_report.Describe ( "DataWindow.Table.Arguments" ) 

ll_args = of_ParseToArray ( ls_dwargs, "~n", ls_dwargswithtype ) 

For ll_a = 1 to ll_args
	ll_pos = Pos ( ls_dwargswithtype[ll_a], "~t", 1 )
	If ll_pos > 0 Then
		as_args[UpperBound(as_args)+1] = Left ( ls_dwargswithtype[ll_a], ll_pos - 1 ) 
		as_types[UpperBound(as_types)+1] = Mid ( ls_dwargswithtype[ll_a], ll_pos + 1 ) 
	End If
Next

Return UpperBound ( as_args )
end function

public function boolean of_populatewsconnection (readonly string as_report);string ls_connectobj 
ClassDefinition lcd

//  Try and create the report's associated WSConnection NVObject
ls_connectobj = "n_WSCObject_" + as_report;
lcd = FindClassDefinition (ls_connectobj)
If (IsNull (lcd)) Then Return False						//  The WSConnection object does not exist
If (Not IsValid (lcd)) Then Return False                //  Or, is not valid

//  OK, it at least exists
i_wsConnection = Create Using ls_connectobj

If (IsNull (i_wsConnection)) Then Return False                              //  Something went wrong
If (Not IsValid (i_wsConnection)) Then Return False                         //  Is not valid
If (i_wsConnection.Dynamic f_GetUseDefaults() = True) Then Return False     //  Object exists, but is marked to use defaults	

//  WSConnection object is good to go, use it
Return True
end function

on w_pbstyle_report.create
if IsValid(this.MenuID) then destroy(this.MenuID)
if this.MenuName = "m_pbstyle_report" then this.MenuID = create m_pbstyle_report
this.dw_report = create dw_report
this.Control[]={this.dw_report}
end on

on w_pbstyle_report.destroy
if IsValid(this.MenuID) then destroy(this.MenuID)
destroy(this.dw_report)
end on

event cancelretrieve;//*-----------------------------------------------------------------*/
//*    cancelretrieve event:  Set Cancel Flag
//*-----------------------------------------------------------------*/
ib_CancelRetrieve = TRUE
end event

event print;//*-----------------------------------------------------------------*/
//*    print event:   Print the Report
//*-----------------------------------------------------------------*/
dw_report.Print ( True )
end event

event printdlg;//*-----------------------------------------------------------------*/
//*    printdlg event:   Print the Report with dialog
//*-----------------------------------------------------------------*/
If OpenWithParm ( w_pbstyle_dw_print_options, dw_report ) <> -1 Then
	If Message.DoubleParm <> -1 Then
		dw_report.Print ( True )
	End If
End If
end event

event printpreview;//*-----------------------------------------------------------------*/
//*    printpreview event:   PrintPreview the Report
//*-----------------------------------------------------------------*/
string ls_yesno

ls_yesno = "No"
If (ab_onoff) Then
	ls_yesno = "Yes"
End If

dw_report.Modify ("DataWindow.Print.Preview='" + ls_yesno + "'")
end event

event close;//*-----------------------------------------------------------------*/
//*    close event:   Clean-up  
//*-----------------------------------------------------------------*/
If (Not IsNull (i_wsConnection)) Then
	Destroy i_wsConnection
End If
end event

event open;//*-----------------------------------------------------------------*/
//*    open event:   Initialization
//*-----------------------------------------------------------------*/
m_pbstyle_report lm_menu
s_parm lstr_parm
string ls_args[], ls_dwargs[], ls_dwtypes[], ls_stringarray[], ls_temp[]
long ll_a, ll_args, ll_da, ll_dargs, ll_x, ll_items
int li_decpos, li_rc
any la_args[15]
date ld_datearray[]
time lt_timearray[]
datetime ldt_datetimearray[]
long ll_numberarray[]   

If IsNull ( Message.PowerObjectParm ) &
Or Not ( IsValid ( Message.PowerObjectParm ) ) Then
	lstr_parm.s_Object = Message.StringParm
	lstr_parm.s_argstring = ""
Else
	lstr_parm = Message.PowerObjectParm
End If

this.Title = "Report - " + lstr_parm.s_Object

lm_menu = this.MenuID
lm_menu.f_SetDataWindow ( dw_report )

dw_report.DataObject = lstr_parm.s_Object
dw_report.Modify ("DataWindow.Readonly = yes")

//  What kind of dw is this?
String sSyntax
sSyntax = Lower (dw_report.Describe ("DataWindow.Syntax"))
If (Pos (sSyntax, "webservice=") > 0) Then
	//  Must be WebService source
	If of_PopulateWSConnection (lstr_parm.s_Object) Then
		li_rc = dw_report.SetWSObject (i_wsConnection)
		If (li_rc <> 1) Then
			MessageBox ("Web Service Report", "Failed to establish Web Service Connection.  Check the connection parameters in the application's INI file.", StopSign!) 
			Return
		End If
	End If
Else
	dw_report.SetTransObject ( SQLCA )
End If

If Trim ( lstr_parm.s_argstring ) <> "" Then
	ll_args = of_ParseToArray ( lstr_parm.s_argstring, ";", ls_args ) 
	ll_dargs = of_GetDwArgs ( ls_dwargs, ls_dwtypes ) 
	If ll_dargs <> ll_args Then 
		MessageBox ( "Report Retrieval", "Number of arguments passed on commandline does not match number of report arguments.", StopSign! ) 
		dw_report.Retrieve ( )
		Return
	End If
	For ll_da = 1 to ll_dargs
		
		Choose Case Lower ( ls_dwtypes[ll_da] )
			Case "string"
				la_args[ll_da] = ls_args[ll_da]
				
			Case "number"
				/* Make a guess about the datatype.  If it contains a decimal separator,
					assume decimal, else long */
				li_decpos = Pos ( ls_args[ll_da], ".", 1 )
				If li_decpos = 0 Then			// if that fails, try ','
					li_decpos = Pos ( ls_args[ll_da], ",", 1 )
				End If
				If li_decpos = 0 Then
					la_args[ll_da] = Long ( ls_args[ll_da] )
				Else
					la_args[ll_da] = Dec ( ls_args[ll_da] )
				End If				
				
			Case "date"
				If Not IsDate (  ls_args[ll_da] ) Then
					MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid date.  Value was: " + ls_args[ll_da], StopSign! ) 
					Return 
				End If
				la_args[ll_da] = Date ( ls_args[ll_da] )
				
			Case "time"
				If Not IsTime (  ls_args[ll_da] ) Then
					MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid time.  Value was: " + ls_args[ll_da], StopSign! ) 
					Return 
				End If
				la_args[ll_da] = Time ( ls_args[ll_da] )
				
			Case "datetime"
				date ld_date
				time lt_time
				ld_date = Date ( ls_args[ll_da] )
				lt_time = Time ( ls_args[ll_da] )
				If Not IsDate ( ls_args[ll_da] ) Then
					MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid date.  Value was: " + ls_args[ll_da], StopSign! ) 
					Return 
				End If
				
				If Not IsTime ( ls_args[ll_da] ) Then
					MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid time.  Value was: " + ls_args[ll_da], StopSign! ) 
					Return 
				End If
				la_args[ll_da] = DateTime ( ls_args[ll_da] )
				
			Case "stringlist"
				ll_items = of_ParseToArray ( ls_args[ll_da], ",", ls_temp ) 
				For ll_x = 1 to ll_items
					ls_stringarray[ll_x] = ls_temp[ll_x]
				Next 
				la_args[ll_da] = ls_stringarray
				
			Case "numberlist"
				ll_items = of_ParseToArray ( ls_args[ll_da], ",", ls_temp ) 
				For ll_x = 1 to ll_items
					li_decpos = Pos ( ls_temp[ll_x], ".", 1 )
					If li_decpos = 0 Then			// if that fails, try ','
						li_decpos = Pos ( ls_temp[ll_x], ",", 1 )
					End If
					If li_decpos = 0 Then
						ll_numberarray[ll_x] = Long ( ls_temp[ll_x] )
					Else
						MessageBox ( "Argument Error", "Decimal Array arguments are not supported.", StopSign! ) 
						Return
					End If
				Next 
				la_args[ll_da] = ll_numberarray
				
			Case "datelist"
				ll_items = of_ParseToArray ( ls_args[ll_da], ",", ls_temp ) 
				For ll_x = 1 to ll_items
					If Not IsDate (  ls_temp[ll_x] ) Then
						MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid date.  Value was: " + ls_temp[ll_x], StopSign! ) 
						Return 
					End If
					ld_datearray[ll_x] = Date ( ls_temp[ll_x] )
				Next 
				la_args[ll_da] = ld_datearray
				
			Case "timelist"
				ll_items = of_ParseToArray ( ls_args[ll_da], ",", ls_temp ) 
				For ll_x = 1 to ll_items
				If Not IsTime (  ls_temp[ll_x] ) Then
						MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid time.  Value was: " + ls_temp[ll_x], StopSign! ) 
						Return 
					End If
					lt_timearray[ll_x] = Time ( ls_temp[ll_x] )
				Next 
				la_args[ll_da] = lt_timearray
				
			Case "datetimelist"	
				ll_items = of_ParseToArray ( ls_args[ll_da], ",", ls_temp ) 
				For ll_x = 1 to ll_items
					If Not IsDate ( ls_temp[ll_x] ) Then
						MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid date.  Value was: " + ls_temp[ll_x], StopSign! ) 
						Return 
					End If
				
					If Not IsTime ( ls_temp[ll_x] ) Then
						MessageBox ( "Argument Error", ls_dwargs[ll_da] + " argument passed is not a valid time.  Value was: " + ls_temp[ll_x], StopSign! ) 
						Return 
					End If
					ldt_datetimearray[ll_x] = DateTime ( ls_temp[ll_x] )
				Next 
				la_args[ll_da] = ldt_datetimearray
		End Choose
		
	Next
	dw_report.Retrieve ( la_args[1],la_args[2],la_args[3],la_args[4],la_args[5], & 
							   la_args[6],la_args[7],la_args[8],la_args[9],la_args[10], &
							   la_args[11],la_args[12],la_args[13],la_args[14],la_args[15] )
Else
	dw_report.Retrieve ( )
End If
end event

event resize;//*-----------------------------------------------------------------*/
//*    resize event:  
//*-----------------------------------------------------------------*/
dw_report.Resize ( this.WorkSpaceWidth ( ), this.WorkSpaceHeight ( ) )
end event

type dw_report from DataWindow within w_pbstyle_report
end type

on dw_report.create
end on

on dw_report.destroy
end on

event retrieveend;//*-----------------------------------------------------------------*/
//*    retrieveend event:  
//*-----------------------------------------------------------------*/
m_pbstyle_report	lm_menu

// Get menu handle
lm_menu = Parent.MenuId

// Reset retrieve state
lm_menu.f_SetRetrieve ( False )

// Reset MicroHelp
Parent.SetMicroHelp ( "Ready" )
end event

event retrievestart;//*-----------------------------------------------------------------*/
//*    retrievestart event:  
//*-----------------------------------------------------------------*/
m_pbstyle_report	lm_menu

// Set Cancel state
ib_CancelRetrieve = False

// Get menu handle
lm_menu = Parent.MenuId

// Set retrieve state
lm_menu.f_SetRetrieve ( True )

// Set up the row query governor
ib_limitrows = w_pbstyle_frame_ancestor.ib_limitrows
If ib_limitrows Then
	il_rowlimit = w_pbstyle_frame_ancestor.il_rowlimit
End If

// Set up the time query governor
ib_limittime = w_pbstyle_frame_ancestor.ib_limittime
If ib_limittime Then
	it_timelimit = RelativeTime ( Now ( ), SecondsAfter ( 00:00:00, w_pbstyle_frame_ancestor.it_timelimit ) )
End If

// Reset MicroHelp
Parent.SetMicroHelp ( "Hit Cancel to stop retrieval." )
end event

event retrieverow;//*-----------------------------------------------------------------*/
//*    retrieverow event:  
//*-----------------------------------------------------------------*/
// Did they cancel?
If ib_CancelRetrieve = True Then
	// Yes, cancel retrieve
	Return 1
End If

// Row query governor
If ib_limitrows Then
	il_rowlimit --
	If il_rowlimit <= 0 Then
		Parent.SetMicroHelp ( "Query Governor row limit reached.  Rows retrieved: " + String ( row ) )
		Return 1
	End If
End If

// Time query governor
If ib_limittime Then
	If it_timelimit < Now ( ) Then
		Parent.SetMicroHelp ( "Query Governor time limit reached.  Rows retrieved: " + String ( row ) )
		Return 1
	End If
End If

// Update the microhelp
Parent.SetMicroHelp ( "Hit Cancel to stop retrieval.  Rows retrieved: " + String ( row ) )
end event

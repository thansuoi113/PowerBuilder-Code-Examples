$PBExportHeader$w_pbstyle_mst_det_12many.srw
forward
global type w_pbstyle_mst_det_12many from Window
end type
type dw_detail_12many from DataWindow within w_pbstyle_mst_det_12many
end type
type dw_master_12many from DataWindow within w_pbstyle_mst_det_12many
end type
end forward

global type w_pbstyle_mst_det_12many from Window
string MenuName = "m_pbstyle_mst_det_12many"
event getfirstrow ()
event getnextrow ()
event getpriorrow ()
event getlastrow ()
event updaterow ()
event deleterow ()
event insertrow ()
event nomorerows ()
event print ()
event specifycriteria ()
event applycriteria ()
event cancelupdates ()
event retrieve ()
event type integer ue_createprintdw ()
event type integer ue_establishtaborder (DataWindow adw)
event type integer ue_restoretaborder (DataWindow adw)
event type integer ue_setdw (DataWindow adw)
dw_detail_12many dw_detail_12many
dw_master_12many dw_master_12many
end type
global w_pbstyle_mst_det_12many w_pbstyle_mst_det_12many

type variables
boolean ib_DetailIsUpdatable  	
boolean ib_MasterIsUpdatable  	

// false=master last had focus
// true=detail last had focus
boolean ib_DetailHadFocus

/*  Save Original Tab Order for QueryMode  */
int ii_TabOrders[]

datastore dw_print
end variables

forward prototypes
public subroutine Apply_Criteria ()
public function boolean Update_Rows ()
public subroutine Specify_Criteria ()
public subroutine Sort_Master_Dialog ()
public subroutine Sort_Detail_Dialog ()
public subroutine Prior_Row ()
public subroutine Next_Row ()
public subroutine Last_Row ()
public subroutine First_Row ()
public subroutine Filter_Master_Dialog ()
public subroutine Filter_Detail_Dialog ()
public subroutine Delete_Row ()
public subroutine Cancel_Updates ()
public subroutine Print_Dialog ()
public function integer Retrieve ()
public subroutine Clear_Detail_Filter ()
public subroutine Clear_Master_Filter ()
public subroutine Print ()
public subroutine Close_Form ()
public subroutine Print_Setup ()
public subroutine Insert_Row ()
end prototypes

public subroutine Apply_Criteria ();//*-----------------------------------------------------------------*/
//*     Apply_Criteria routine:   End QueryMode and Apply Criteria
//*-----------------------------------------------------------------*/
boolean lb_ReSpecify, lb_setMenuItems
m_pbstyle_mst_det_12many lm_Menu

lb_ReSpecify = False
lb_setMenuItems = False

 // Did we pass criteria test?
If	( dw_master_12many.AcceptText ( ) = 1 ) Then

	// Yes, turn off redraw for now
	dw_master_12many.SetRedraw ( False )
	// Enable detail
	dw_detail_12many.Enabled = True
	// Switch out of QueryMode
	dw_master_12many.Modify ( "DataWindow.QueryMode=no" )
	// Get a hold of menu
	lm_Menu = MenuID 
	// Let it shift out of criteria mode
	lm_Menu.SetCriteriaMode ( False )
	//  Return to orginal Tab Order
	this.Event ue_RestoreTabOrder ( dw_master_12many ) 
	// Turn redraw back on
	dw_master_12many.SetRedraw ( True )
	
	// Re-retrieve
	If	( dw_master_12many.Retrieve ( ) > 0 ) Then
		// Yes, clear any locks
		Commit; 
		// Enable detail
		dw_detail_12many.Enabled = True
		// Force a retrieval of detail
		dw_master_12many.TriggerEvent ("RowFocusChanged")
	Else
		// Enable detail
		dw_detail_12many.Enabled = True
		Messagebox ( "Apply Criteria","The criteria entered returned no rows, please enter a different criteria or erase criteria to restore original result set" )
		lb_ReSpecify = True
		Specify_Criteria ( )
	End If
 End If
 
 // set the form back to readonly if that's how it started before the specify criteria
 If ib_DetailIsUpdatable = False and lb_ReSpecify = False Then
	dw_detail_12many.Modify ( "DataWindow.Readonly = yes" )
	lb_setMenuItems = True
End If

 If ib_MasterIsUpdatable = False and lb_ReSpecify = False Then
	dw_master_12many.Modify ( "DataWindow.Readonly = yes" )
	lb_setMenuItems = True
End If
	
If lb_setMenuItems = True Then
	// Disable certain menu items
	lm_Menu.m_data.m_update.Enabled = False
	lm_Menu.m_data.m_delete.Enabled = False
	lm_Menu.m_data.m_insert.Enabled = False
	lm_Menu.m_data.m_cancelchanges.Enabled = False
End If
end subroutine

public function boolean Update_Rows ();//*-----------------------------------------------------------------*/
//*    Update_Rows routine:   Update Changes to Database
//*-----------------------------------------------------------------*/
boolean lb_Result
string  ls_Describe

// Assume it works
lb_Result = True

// See if we're in QueryMode
ls_Describe = dw_master_12many.Describe ( "Datawindow.QueryMode" )

// Are we?
If	( ls_Describe = "no" ) Then
	// No, is Master is Updatable?
	If	( ib_MasterIsUpdatable = True ) Then
		// Yes, did Master DataWindow update work?
		If	( dw_master_12many.Update ( ) = -1 ) Then
			// No, return failure
			lb_Result = False
			// Rollback changes 
			Rollback;
		End If 
	End If 

	// We still OK?
	If	( lb_Result = True ) Then
		// Yes, is Detail is Updatable?
		If	( ib_DetailIsUpdatable = True ) Then
			// Yes, did Detail DataWindow update work?
			If	( dw_detail_12many.Update ( ) = -1 ) Then
				// No, return failure
				lb_Result = False
				// Rollback changes 
				Rollback;
			End If 
		End If 
	End If
End If

// Save changes
Commit;

// All done
Return lb_Result
end function

public subroutine Specify_Criteria ();//*-----------------------------------------------------------------*/
//*     Specify_Criteria routine:   Put DataWindow into QueryMode
//*-----------------------------------------------------------------*/
int li_rc
long ll_RowCount
m_pbstyle_mst_det_12many lm_Menu

// Prompt for save
If	dw_master_12many.ModifiedCount ( )	+ dw_master_12many.DeletedCount ( ) + &
	dw_detail_12many.ModifiedCount ( )	+ dw_detail_12many.DeletedCount ( ) > 0 Then
	li_rc = MessageBox ( "Specify Criteria", "Would you like to save changes before switching into Specify Criteria mode?", Question!, YesNo! )
Else
	li_rc = 2
End If

If	li_rc = 1 Then
	// Yes--update and retrieve
	If	Update_Rows ( ) = False Then
		Return
	End If
End If

// refresh detail by triggering master
dw_master_12many.TriggerEvent ("RowFocusChanged")

// if the form is readonly, set to write
If	ib_DetailIsUpdatable = False Then
	dw_detail_12many.Modify ( "DataWindow.Readonly=no" )
End If

If	ib_MasterIsUpdatable = False Then
	dw_master_12many.Modify ( "DataWindow.Readonly=no" )
End If

// Yes, clear any locks
Commit; 
	
// Turn off redraw for now
dw_master_12many.SetRedraw ( False )
// Switch into QueryMode
dw_master_12many.Modify ( "DataWindow.QueryMode=yes" )
// Get a hold of menu
lm_Menu = MenuID 
// Let it shift into criteria mode
lm_Menu.SetCriteriaMode ( True )
// Disable detail
dw_detail_12many.Enabled = False
// Reset detail
dw_detail_12many.Reset ( )
//  Establish Tab Order in the Master
this.Event ue_EstablishTabOrder ( dw_master_12many )
// Make sure Master has focus
dw_master_12many.SetFocus ( )
// Turn redraw back on
dw_master_12many.SetRedraw ( True )
end subroutine

public subroutine Sort_Master_Dialog ();//*-----------------------------------------------------------------*/
//*    Sort_Master_Dialog routine:
//*-----------------------------------------------------------------*/
string ls_null

SetNull ( ls_null )

If	dw_master_12many.SetSort ( ls_null ) <> -1 Then 
	dw_master_12many.Sort ( )
	dw_master_12many.TriggerEvent ("RowFocusChanged")
End If
end subroutine

public subroutine Sort_Detail_Dialog ();//*-----------------------------------------------------------------*/
//*    Sort_Detail_Dialog routine:
//*-----------------------------------------------------------------*/
string ls_null

SetNull ( ls_null )

If	dw_detail_12many.SetSort ( ls_null ) <> -1 Then 
	dw_detail_12many.Sort ( )
End If
end subroutine

public subroutine Prior_Row ();//*-----------------------------------------------------------------*/
//*    Prior_Row routine:   Scroll to the Previous Row
//*-----------------------------------------------------------------*/
long ll_CurrentRow

// Is Detail Updatable?
If	( ib_DetailIsUpdatable = True ) Then
	// Yes, did Detail DataWindow update work?
	If	( dw_detail_12many.Update ( ) = -1 ) Then
		// No, rollback changes 
		Rollback;
		// Don't scroll
		Return
	End If 
End If 

// Get the current row
ll_CurrentRow = dw_master_12many.GetRow ( )

// Get the prior row
dw_master_12many.ScrollPriorRow ( )

// Did we move?
If	( ll_CurrentRow = 1 ) Then
	// No, let the user know
	MessageBox ( this.Title, "This is the first row for this table!", Exclamation! )
End If
end subroutine

public subroutine Next_Row ();//*-----------------------------------------------------------------*/
//*    Next_Row routine:   Scroll to the Next Row
//*-----------------------------------------------------------------*/
long ll_CurrentRow

// Is Detail Updatable?
If	( ib_DetailIsUpdatable = True ) Then
	// Yes, did Detail DataWindow update work?
	If ( dw_detail_12many.Update ( ) = -1 ) Then
		// No, rollback changes 
		Rollback;
		// Don't scroll
		Return
	End If 
End If 

// Get current row
ll_CurrentRow = dw_master_12many.GetRow ( )

// Get the next row 
dw_master_12many.ScrollNextRow ( )

// Did we move?
If	( ll_CurrentRow = dw_master_12many.RowCount ( ) ) Then
	// No, let the user know
	MessageBox ( this.Title, "This is the last row for this table!", Exclamation! )
End If
end subroutine

public subroutine Last_Row ();//*-----------------------------------------------------------------*/
//*     Last_Row routine:   Scroll to the Last Row
//*-----------------------------------------------------------------*/
long ll_RowCount

// Is Detail Updatable?
If ( ib_DetailIsUpdatable = True ) Then
	// Yes, did Detail DataWindow update work?
	If ( dw_detail_12many.Update ( ) = -1 ) Then
		// No, rollback changes 
		Rollback;
		// Don't scroll
		Return
  	End If 
End If 

// Scroll to the end 
dw_master_12many.ScrollToRow ( 9999999 )
// Get the current row count  
ll_RowCount = dw_master_12many.RowCount ( )
// Got any rows?
If ll_RowCount = 0 Then this.Dynamic Event NoMoreRows ()
end subroutine

public subroutine First_Row ();//*-----------------------------------------------------------------*/
//*    First_Row routine:   Scroll to the First Row
//*-----------------------------------------------------------------*/
long ll_RowCount

// Is Detail Updatable?
If	( ib_DetailIsUpdatable = True ) Then
	// Yes, did Detail DataWindow update work?
	If	( dw_detail_12many.Update() = -1 ) Then
		// No, rollback changes 
		Rollback;
		// Don't scroll
		Return
	End If 
End If 

// Get the current row count  
ll_RowCount = dw_master_12many.RowCount ( )

// Got any rows?
If	ll_RowCount > 0 Then 
	// Yes, scroll to first one
	dw_master_12many.ScrollToRow( 1 ) 
Else
   	// No, then issue error 
 	this.Dynamic Event NoMoreRows ()
End If
end subroutine

public subroutine Filter_Master_Dialog ();//*-----------------------------------------------------------------*/
//*    Filter_Master_Dialog routine:
//*-----------------------------------------------------------------*/
string ls_null, ls_oldfilter, ls_errormsg

SetNull ( ls_null )

If	dw_master_12many.SetFilter ( ls_null )  <> -1 Then 
	dw_master_12many.Filter ( )
	
	// check if you've lost all rows
	If	dw_master_12many.RowCount ( ) = 0 Then
  		// disallow filter
		ls_oldfilter = dw_master_12many.Object.DataWindow.Table.Filter
		ls_errormsg = "Filter '" + ls_oldfilter + "' has no rows.  Resetting filter."
		MessageBox ( "Filter Error", ls_errormsg )
		dw_master_12many.SetFilter ( "" )
		dw_master_12many.Filter ( )
	End If
	
	// in any case,  re-synchronize detail with currently showing master row
	dw_master_12many.TriggerEvent ("RowFocusChanged")
End If
end subroutine

public subroutine Filter_Detail_Dialog ();//*-----------------------------------------------------------------*/
//*    Filter_Detail_Dialog routine:
//*-----------------------------------------------------------------*/
string ls_null, ls_oldfilter, ls_errormsg

SetNull ( ls_null )

If	dw_detail_12many.SetFilter ( ls_null )  <> -1 Then 
	dw_detail_12many.Filter ( )
	  
	// check if you've lost all rows
	If	dw_detail_12many.RowCount ( ) = 0 Then
		// disallow filter
		ls_oldfilter = dw_detail_12many.Object.Datawindow.Table.Filter
		ls_errormsg = "Filter '" + ls_oldfilter + "' has no rows.  Resetting filter."
		MessageBox ( "Filter Error", ls_errormsg )
		dw_detail_12many.SetFilter ( "" )
		dw_detail_12many.Filter ( )
  	End If
End If
end subroutine

public subroutine Delete_Row ();//*-----------------------------------------------------------------*/
//*     Delete_Row routine:  Delete the current DataWindow Row	
//*-----------------------------------------------------------------*/
datawindow ldw_WithFocus
long ll_RowCount 		
	
// Determine the datawindow to manipulate
If ib_DetailHadFocus Then
	ldw_WithFocus = dw_detail_12many
Else
	ldw_WithFocus = dw_master_12many
End If

// We deleting from Master?
If	( ldw_WithFocus = dw_master_12many ) Then

	If MessageBox ( "Delete Row", "Are you sure you want to delete the master record and ALL associated records in detail?", Exclamation!, YesNo!, 2 ) <> 1 Then Return
		
	// Is detail updatable?
	If ( ib_DetailIsUpdatable ) Then
		// Yes, turn off redraw
		dw_detail_12many.SetRedraw ( False )
		// Get row count
		ll_RowCount = dw_detail_12many.RowCount ( )

		// Loop through and delete all details
		Do While ( ll_RowCount > 0 )
			// Delete this row
			dw_detail_12many.DeleteRow ( ll_RowCount )
			// Decrement count
			ll_RowCount --
		Loop
	
		// Turn redraw back
		dw_detail_12many.SetRedraw ( True )
	End If
	
	// Delete master now
	dw_master_12many.DeleteRow ( 0 )
	// Make sure we get new details
	dw_master_12many.TriggerEvent ("RowFocusChanged")
		
Else

	// No, just delete detail
	dw_detail_12many.DeleteRow( 0 )
End If
end subroutine

public subroutine Cancel_Updates ();//*-----------------------------------------------------------------*/
//*     Cancel_Updates routine:   Undo Pending Updates
//*-----------------------------------------------------------------*/
If	( MessageBox ( this.Title, "Are you sure you want to cancel all changes?", Question!, YesNo!, 2 ) = 1 ) Then
	// Yes, then RollBack changes
	Rollback;
	// Turn off redraw for now
	dw_master_12many.SetRedraw ( False )
	// Clear the existing contents
	dw_master_12many.Reset ( )

	// CR 193635:  Make sure the Update buffers are cleared
	// 				   so that there is no prompt on the retrieve
	dw_detail_12many.Reset ( )

	// Call the Retrieve function
	Retrieve ( )
	// Turn redraw back on
	dw_master_12many.SetRedraw ( True )
End If
end subroutine

public subroutine Print_Dialog ();//*-----------------------------------------------------------------*/
//*     Print_Dialog routine:   Invoke Print Dialog and Print
//*-----------------------------------------------------------------*/
If OpenWithParm ( w_pbstyle_dw_print_options, dw_print ) <> -1 Then
	If Message.DoubleParm <> -1 Then
		this.Print ( )
	End If
End If
end subroutine

public function integer Retrieve ();//*-----------------------------------------------------------------*/
//*    Retrieve routine: Retrieve rows from the database
//*-----------------------------------------------------------------*/
int li_rc
long ll_RowCount

// Prompt for save
If	dw_master_12many.ModifiedCount ( )	+ dw_master_12many.DeletedCount ( ) + &
	dw_detail_12many.ModifiedCount ( )	+ dw_detail_12many.DeletedCount ( ) > 0 Then
	li_rc = MessageBox ( "Retrieve", "Would you like to save changes before retrieve?", Question!, YesNo! )
Else
	li_rc = 2
End If

If	li_rc = 1 Then
	// Yes--update and retrieve
	If	Update_Rows ( ) = False Then
		Return -1
	End If
End If

// refresh detail by triggering master
dw_master_12many.TriggerEvent ("RowFocusChanged")

dw_master_12many.SetReDraw ( False )
// This will cause the datawindow to reset after using QueryMode  */
dw_master_12many.DataObject = dw_master_12many.DataObject
dw_master_12many.SetTransObject ( SQLCA )

// Got any rows?  
ll_RowCount = dw_master_12many.Retrieve ( )
dw_master_12many.SetReDraw ( True )

If	( ll_RowCount > 0 ) Then
	// Yes, clear any locks
	Commit; 
ElseIf ll_RowCount = -1 Then
	Return ll_RowCount	//  User cancelled
Else
  	 // No, let the user know 
	Messagebox ( "Apply Criteria","The criteria entered returned no rows, please enter a different criteria or erase criteria to restore original result set" )
	this.Post Specify_Criteria ( )
	Return ll_RowCount
End If

dw_master_12many.TriggerEvent ("RowFocusChanged")
 
Return 1
end function

public subroutine Clear_Detail_Filter ();//*-----------------------------------------------------------------*/
//*    Clear_Detail_Filter routine:
//*-----------------------------------------------------------------*/
dw_detail_12many.SetFilter ( "" )
dw_detail_12many.Filter ( )
dw_detail_12many.Sort ( ) 
dw_detail_12many.ScrollToRow ( 1 )
end subroutine

public subroutine Clear_Master_Filter ();//*-----------------------------------------------------------------*/
//*    Clear_Master_Filter routine:
//*-----------------------------------------------------------------*/
dw_master_12many.SetFilter ( "" )
dw_master_12many.Filter ( )
dw_master_12many.Sort ( ) 
dw_master_12many.ScrollToRow ( 1 ) 
dw_master_12many.TriggerEvent ("RowFocusChanged")
end subroutine

public subroutine Print ();//*-----------------------------------------------------------------*/
//*     Print routine:   Print the DataWindow
//*-----------------------------------------------------------------*/
If this.Event ue_CreatePrintDW ( ) = 1 Then
	dw_print.Print ( True )
Else
	dw_master_12many.Print ( True ) 
	dw_detail_12many.Print ( True ) 
End If

Destroy dw_print
end subroutine

public subroutine Close_Form ();//*-----------------------------------------------------------------*/
//*     Close_Form routine:   Close the form
//*-----------------------------------------------------------------*/
Close (this)
end subroutine

public subroutine Print_Setup ();//*-----------------------------------------------------------------*/
//*     Print_Setup routine:   Open Print Setup dialog
//*-----------------------------------------------------------------*/
PrintSetup ()
end subroutine

public subroutine Insert_Row ();//*-----------------------------------------------------------------*/
//*     Insert_Row routine:   Insert a new row
//*-----------------------------------------------------------------*/
long ll_NewRow, ll_Master
datawindow ldw_WithFocus

// If Master AcceptText fails, then don't allow insert
If	dw_master_12many.AcceptText ( ) = -1 Then Return
	
// Did Detail AcceptText fails, then don't allow insert
If dw_detail_12many.AcceptText ( ) = -1 Then Return

// Determine the datawindow to manipulate
If ib_DetailHadFocus Then
	ldw_WithFocus = dw_detail_12many
Else
	ldw_WithFocus = dw_master_12many
End If

// We Inserting into Master?
If	( ldw_WithFocus = dw_master_12many ) Then
	
	// Insert a new row in the DataWindow
	ll_NewRow = dw_master_12many.InsertRow( 0 )
 
 	// Scroll it into view
	dw_master_12many.ScrollToRow ( dw_master_12many.RowCount ( ) )
	 
	dw_master_12many.SetItemStatus ( ll_NewRow, 0, Primary!, NotModified! ) 
	dw_master_12many.SetItemStatus ( ll_NewRow, 0, Primary!, New! ) 

	Return
End If

// if there are no rows at all, then add one so we don't have a problem
// with the detail
If	( dw_master_12many.RowCount ( ) = 0) Then
	Specify_Criteria ( )
	Return
End If

// Insert into detail (0 means last row => insert at bottom)
ll_NewRow = dw_detail_12many.InsertRow ( 0 )

// Populate the detail row with the current key values from the master
integer li_pos, li_pos2, li_result, li_column, li_columncount
string ls_mastername, ls_mastertype, ls_dbname, ls_detaildbname, ls_detailname, ls_detailtype, ls_tag, ls_decimal

// The tag value is populated by the IM internals  
ls_tag = dw_master_12many.Tag
Do While Trim (ls_tag) <> ""
	
	// Break into the pieces
	li_pos = Pos ( ls_tag, "," )
	ls_mastername = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
	
	li_pos = Pos ( ls_tag, "," )
	ls_mastertype = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
	
	li_pos = Pos ( ls_tag, "," )
	ls_detaildbname = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
	
	li_pos = Pos ( ls_tag, ";" )
	ls_detailtype = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )

	// ls_detaildbname is the database name for the column
	// Determine the datawindow column name for that column
	li_columncount = Integer ( dw_detail_12many.Describe ( "DataWindow.Column.Count" ) )
	For li_column = 1 to li_columncount
		// Get the column name and dbname
		ls_detailname = dw_detail_12many.Describe ( "#" + String ( li_column ) + ".Name" )
		ls_dbname = dw_detail_12many.Describe ( ls_detailname + ".dbname" )
		If	Pos ( ls_dbname, "." ) > 0 Then ls_dbname = Mid ( ls_dbname, Pos ( ls_dbname, "." ) + 1 )
			
		// Is this the same database column?
		If	ls_dbname = ls_detaildbname Then
			// Yes, then this is the current datawindow column
			GoTo found
		End If
	Next
	ls_detailname = ""
	
	found:
	If	ls_detailname <> "" Then
		ll_Master = dw_master_12many.GetRow ( )
	
		//  Set the item
		//  Note: This datatype comes from PB internals and does not match
		//   the various dw column types.   Therefore, the case statement
		//   tests are different from a describe of ".coltype"
		
		Choose Case Trim ( Lower ( ls_mastertype ) )
			Case "string"
				li_result = dw_detail_12many.SetItem ( ll_NewRow, ls_detailname, &
							dw_master_12many.GetItemString ( ll_Master, ls_mastername ) )
		
			Case "date"
				li_result = dw_detail_12many.SetItem ( ll_NewRow, ls_detailname, &
							dw_master_12many.GetItemDate ( ll_Master, ls_mastername ) )
	
			Case "datetime"
				li_result = dw_detail_12many.SetItem ( ll_NewRow, ls_detailname, &
							dw_master_12many.GetItemDateTime ( ll_Master, ls_mastername ) )
		
			Case "number"
				li_result = dw_detail_12many.SetItem ( ll_NewRow, ls_detailname, &
							dw_master_12many.GetItemNumber ( ll_Master, ls_mastername ) )
		
			Case "time"
				li_result = dw_detail_12many.SetItem ( ll_NewRow, ls_detailname, &
							dw_master_12many.GetItemTime ( ll_Master, ls_mastername ) )
							
		End Choose
	End If
Loop

dw_detail_12many.SetItemStatus ( ll_NewRow, 0, Primary!, NotModified! ) 
dw_detail_12many.SetItemStatus ( ll_NewRow, 0, Primary!, New! ) 
	
// Make sure it's on screen
dw_detail_12many.ScrollToRow ( ll_NewRow )

// Get the column with the lowest tab order
this.Event ue_SetDw ( dw_detail_12many )

dw_detail_12many.SetFocus ( )
end subroutine

on w_pbstyle_mst_det_12many.create
if IsValid(this.MenuID) then destroy(this.MenuID)
if this.MenuName = "m_pbstyle_mst_det_12many" then this.MenuID = create m_pbstyle_mst_det_12many
this.dw_detail_12many = create dw_detail_12many
this.dw_master_12many = create dw_master_12many
this.Control[]={this.dw_detail_12many,&
this.dw_master_12many}
end on

on w_pbstyle_mst_det_12many.destroy
if IsValid(this.MenuID) then destroy(this.MenuID)
destroy(this.dw_detail_12many)
destroy(this.dw_master_12many)
end on

event getfirstrow;//*-----------------------------------------------------------------*/
//*    getfirstrow event:   Scroll to the First Row
//*-----------------------------------------------------------------*/
this.First_Row ( )
end event

event getnextrow;//*-----------------------------------------------------------------*/
//*    getnextrow event:   Scroll to the Next Row
//*-----------------------------------------------------------------*/
this.Next_Row ( )
end event

event getpriorrow;//*-----------------------------------------------------------------*/
//*    getpriorrow event:   Scroll to the Previous Row
//*-----------------------------------------------------------------*/
this.Prior_Row ( )
end event

event getlastrow;//*-----------------------------------------------------------------*/
//*     getlastrow event:   Scroll to the Last Row
//*-----------------------------------------------------------------*/
this.Last_Row ( )
end event

event updaterow;//*-----------------------------------------------------------------*/
//*    updaterow event:   Update Changes to Database
//*-----------------------------------------------------------------*/
this.Update_Rows ( )
end event

event deleterow;//*-----------------------------------------------------------------*/
//*     deleterow event:  Delete the current DataWindow Row	
//*-----------------------------------------------------------------*/
this.Delete_Row ( )
end event

event insertrow;//*-----------------------------------------------------------------*/
//*     insertrow event:   Insert a new row
//*-----------------------------------------------------------------*/
this.Insert_Row ( )
end event

event nomorerows;//*-----------------------------------------------------------------*/
//*     nomorerows event:   Display Message to User
//*-----------------------------------------------------------------*/
// Any rows in here?
If	( dw_master_12many.RowCount ( ) = 0 ) Then
	MessageBox ( this.Title, "No rows exist for this criteria!", Exclamation! )

	// No, insert a new row
	this.Dynamic Event InsertRow ()
End If
end event

event print;//*-----------------------------------------------------------------*/
//*     print event:   Print the DataWindow
//*-----------------------------------------------------------------*/
this.Print ( )
end event

event specifycriteria;//*-----------------------------------------------------------------*/
//*     specifycriteria event:   Put DataWindow into QueryMode
//*-----------------------------------------------------------------*/
this.Specify_Criteria ( )
end event

event applycriteria;//*-----------------------------------------------------------------*/
//*     applycriteria event:   End QueryMode and Apply Criteria
//*-----------------------------------------------------------------*/
this.Apply_Criteria ( )
end event

event cancelupdates;//*-----------------------------------------------------------------*/
//*     cancelupdates event:   Undo Pending Updates
//*-----------------------------------------------------------------*/
this.Cancel_Updates ( )
end event

event retrieve;//*-----------------------------------------------------------------*/
//*     retrieve event:   Retrieve rows from the database
//*-----------------------------------------------------------------*/
this.Retrieve ( )
end event

event ue_createprintdw;//*-----------------------------------------------------------------*/
//*    ue_CreatePrintDW routine:  Build a nested report in the
//*		master to print a "true" Master/Detail report
//*-----------------------------------------------------------------*/
int li_tab, li_thisy, li_thisx, li_highy, li_lowx, li_height, li_detail, li_pos, li_colid
int li_a, li_args
string ls_objstring, ls_objholder, ls_highobj, ls_syntax, ls_rtn, ls_tag
string ls_mastername[], ls_mastertype[], ls_detaildbname[], ls_detailtype[], ls_argstring

SetPointer ( HourGlass! )

If Trim ( dw_master_12many.Tag ) = "" Then Return -1 

dw_print = Create datastore

dw_print.DataObject = dw_master_12many.DataObject 
dw_print.SetTransObject ( sqlca )
/*  Find the object with the highest Y-Coordinate  */
ls_ObjString = dw_print.Describe("Datawindow.Objects")

/*  Loop thru the DataWindow Objects */
li_Tab =  Pos(ls_ObjString, "~t", 1 )
Do  While Trim (ls_ObjString) <> ""
	If li_Tab = 0 Then
		ls_ObjHolder = ls_ObjString
		ls_ObjString = ""
	Else
		ls_ObjHolder = Left(ls_ObjString, li_Tab -1 )
	End If
	/*  Determine if object is in the detail band  */
	If dw_print.Describe(ls_ObjHolder + ".band") = "detail" Then
		li_thisY = Integer ( dw_print.Describe ( ls_ObjHolder + ".Y" ) )
		li_thisx = Integer ( dw_print.Describe ( ls_ObjHolder + ".X" ) )
		If li_thisY > li_HighY Then
			/*  Save High Y Object  */
			ls_highobj = ls_ObjHolder
			li_highY = li_thisY
		End If
		If li_lowx = 0 Then li_lowx = li_thisX
		If li_thisX < li_lowx Then
			/*  Save Lowest X-Coordinate  */
			li_lowx = li_thisX
		End If
	End if

	/*  Get the next object */
	ls_ObjString = Mid ( ls_ObjString, li_Tab + 1 )
	li_Tab = Pos ( ls_ObjString, "~t", 1 )
Loop 

li_height = Integer ( dw_print.Describe ( ls_highobj + ".Height" ) )
li_highy += li_height + 96			//  Leave some adjustment

/*  Get the criteria information  */
ls_tag = dw_master_12many.Tag				// The tag value is populated by the IM internals  
Do While Trim (ls_tag) <> ""
	
	li_args++
	// Break into the pieces
	li_pos = Pos ( ls_tag, "," )
	ls_mastername[li_args] = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
	
	li_pos = Pos ( ls_tag, "," )
	ls_mastertype[li_args] = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
	
	li_pos = Pos ( ls_tag, "," )
	ls_detaildbname[li_args] = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
	
	li_pos = Pos ( ls_tag, ";" )
	ls_detailtype[li_args] = Left ( ls_tag, li_pos - 1 )
	ls_tag = Mid ( ls_tag, li_pos + 1 )
Loop

ls_argstring = "nest_arguments=("
For li_a = 1 to li_args
	/*  Construct the Args statement  */
	ls_argstring = ls_argstring + "(~"" + ls_mastername[li_a] + "~")" + ","
Next
If Right ( ls_argstring, 1 ) = "," Then ls_argstring = Left ( ls_argstring, Len ( ls_argstring ) -1 ) 
ls_argstring = ls_argstring + ")"

ls_syntax = "create report(band=detail dataobject='" + dw_detail_12many.DataObject + "'" + &
				" moveable=0 resizeable=0 x='" + String ( li_LowX ) + "' y='" + &
				String ( li_HighY ) + "' height='85' width='3000' border='0'  " + &
				"slideup=directlyabove trail_footer = yes" + &
				" slideleft=yes name=report1 border='0' visible = '1' height.autosize=yes " + &
				'criteria="" ' + ls_argstring + &
				" )"

ls_rtn = dw_print.Modify ( ls_syntax )
li_detail = Integer ( dw_print.Describe ( "DataWindow.Detail.Height" ) )
li_detail = li_HighY + 100
ls_rtn = dw_print.Modify ( "DataWindow.Detail.Height = '" + String ( li_detail ) + "'" ) 
ls_rtn = dw_print.Modify ( "DataWindow.Detail.Height.AutoSize = yes" ) 

ls_syntax = dw_print.Describe ( "datawindow.syntax" ) 

dw_print.Retrieve ( )

Return 1
end event

event ue_establishtaborder;//*-----------------------------------------------------------------*/
//*    ue_EstablishTabOrder routine:  When the master goes into
//*				QueryMode, make sure all the columns have taborder
//*-----------------------------------------------------------------*/
string ls_describe
int li_colcount, li_index, li_Taborder, li_OrigOrder

ls_Describe = adw.Describe ( "DataWindow.Column.Count" )
li_colcount = Integer ( ls_Describe )

For li_index = 1 to li_colcount
	ls_Describe = adw.Describe ( "#" + String ( li_index ) + ".TabSequence" )
	li_OrigOrder = Integer ( ls_Describe )
	If li_OrigOrder = 0 Then
		li_TabOrder += 10
	Else
		li_TabOrder = li_OrigOrder
	End If
	ii_TabOrders[li_index] = li_OrigOrder
	adw.Modify ( "#" + String ( li_index ) + ".TabSequence = '" + String ( li_TabOrder ) + "'" )
Next

Return 1
end event

event ue_restoretaborder;//*-----------------------------------------------------------------*/
//*    ue_RestoreTabOrder routine: Return master taborder to original
//*			settings after QueryMode is turned off
//*-----------------------------------------------------------------*/
string ls_describe
int li_colcount, li_index

ls_Describe = adw.Describe ( "DataWindow.Column.Count" )
li_colcount = Integer ( ls_Describe )

For li_index = 1 to li_colcount
	adw.Modify ( "#" + String ( li_index ) + ".TabSequence = '" + String ( ii_TabOrders[li_index]  ) + "'" )
Next

Return 1
end event

event ue_setdw;//*-----------------------------------------------------------------*/
//*    ue_SetDW routine:
//*-----------------------------------------------------------------*/
string ls_Describe
integer li_index, li_colcount, li_LowestOrder, li_LowestColumn, li_TabOrder

this.Visible = True

// We want to set focus on the column/dw with the lowest tab order
// By-the-by - whoever coded this in pf*.cpp made sure that all the columns
// were multiples of 10, and no 10*n can be skipped - so all we really want
// to know is "Who has the tabsequence=10"
ls_Describe = adw.Describe ( "DataWindow.Column.Count" )
li_colcount = Integer ( ls_Describe )

li_LowestOrder = -1
li_LowestColumn = -1
For li_index = 1 to li_colcount
	ls_Describe = adw.Describe ( "#" + String ( li_index ) + ".TabSequence" )
	li_TabOrder = Integer ( ls_Describe )
	
	If	li_TabOrder = 10 Then
		li_LowestColumn = li_index
	End If
Next

If	li_LowestColumn > 0 Then
	adw.SetColumn ( li_LowestColumn )
End If

adw.TriggerEvent ("RowFocusChanged")
Return 1
end event

event resize;//*-----------------------------------------------------------------*/
//*     resize event:   Resize the datawindow when the window resizes
//*-----------------------------------------------------------------*/
integer li_Y

// We have positive Y?
If ( dw_master_12many.Y > 0 ) Then
	// Yes, then clear it
	li_Y = 0	
Else
	// No, trust the current value
	li_Y = dw_master_12many.Y
End If

// Make sure the DataWindow is in upper left
dw_master_12many.Move ( 0, li_Y )

// Resize the DataWindow to match the Form
dw_master_12many.Resize ( this.WorkSpaceWidth ( ), this.WorkSpaceHeight ( ) )
end event

event open;//*-----------------------------------------------------------------*/
//*    open event:   Initialization
//*-----------------------------------------------------------------*/
integer li_index, li_colcount
long ll_rows
boolean lb_updatetable
string ls_Describe
m_pbstyle_mst_det_12many lm_Menu

// Set HourGlass
SetPointer ( HourGlass! )

// Set message titles
dw_master_12many.Modify ( "DataWindow.Message.Title = '" + this.Title + "'" )
dw_detail_12many.Modify ( "DataWindow.Message.Title = '" + this.Title + "'" )

// Get a hold of menu
lm_Menu = MenuID 

// Let the menu know about the DW
lm_Menu.SetDWObject ( dw_master_12many, dw_detail_12many )

// See if Master is Updatable
ls_Describe = dw_master_12many.Describe ( "Datawindow.Column.Count" )
li_colcount = Integer ( ls_Describe )

lb_updatetable = False
For li_index = 1 to li_colcount
	ls_Describe = dw_master_12many.Describe( "#" + String ( li_index ) + ".Update" )
	
	//  Datawindow is updateable, if any column is updateable
	If	( ls_Describe = "yes" ) Then 
		lb_updatetable = True
		Exit
	End If
Next

// Is it?
If	( lb_updatetable = False ) Then
	// No, then make readonly
	dw_master_12many.Modify ( "DataWindow.Readonly = yes" )
	// Note that no updates allowed
	ib_MasterIsUpdatable = False
	
	// Disable certain menu items
	lm_Menu.m_data.m_update.Enabled = False
	lm_Menu.m_data.m_delete.Enabled = False
	lm_Menu.m_data.m_insert.Enabled = False
	lm_Menu.m_data.m_cancelchanges.Enabled = False
Else
	// Yes, note that updates are allowed
	ib_MasterIsUpdatable = True
End If

// See if Detail is Updatable
lb_updatetable = False
ls_Describe = dw_detail_12many.Describe ( "DataWindow.Column.Count" )
li_colcount = Integer ( ls_Describe )

For li_index = 1 to li_colcount
	ls_Describe = dw_detail_12many.Describe ( "#" + String ( li_index ) + ".Update" )
	
	If	( ls_Describe = "yes" ) Then
		lb_updatetable = True
		Exit
	End If
Next

// Are we?
If	( lb_updatetable = False ) Then
	// No, then make readonly
	dw_detail_12many.Modify ( "DataWindow.Readonly = yes" )
	// Note that no updates allowed
	ib_DetailIsUpdatable = False
	
	// Disable certain menu items
	lm_Menu.m_data.m_update.Enabled = False
	lm_Menu.m_data.m_delete.Enabled = False
	lm_Menu.m_data.m_insert.Enabled = False
	lm_Menu.m_data.m_cancelchanges.Enabled = False
Else
	// Yes, note that updates are allowed
	ib_DetailIsUpdatable = True
End If

// Set the SQLCA for the Master and Detail
dw_master_12many.SetTransObject ( SQLCA )
dw_detail_12many.SetTransObject ( SQLCA )
 
// Go retrieve
ll_rows = this.Retrieve ( )
If ll_rows = 0 Then Return
If ll_rows = -1 Then Post Close ( this ) 

this.Event ue_SetDw ( dw_master_12many )
end event

event close;//*-----------------------------------------------------------------*/
//*     close event:   Save changes and release locks
//*-----------------------------------------------------------------*/
Commit;
end event

event closequery;//*-----------------------------------------------------------------*/
//*     closequery event:  Prompt for changes before closing
//*-----------------------------------------------------------------*/
int li_rc, li_Valid
long ll_Modified
string ls_MsgText	
string ls_Describe1, ls_Describe2

// Force an accept for master
li_Valid = dw_master_12many.AcceptText ( ) 

ls_Describe1 = dw_master_12many.Describe ( "DataWindow.Table.UpdateTable" )
ls_Describe2 = dw_detail_12many.Describe ( "DataWindow.Table.UpdateTable" )
If (ls_Describe1 = "?" And ls_Describe2 = "?") Then
	Return	//  DataWindows are not updateable
End If

// Got an error?
If	li_Valid <> -1 Then 
	// Force an accept for detail
	li_Valid = dw_detail_12many.AcceptText() 
End If

// Got an error?
If	li_Valid <> -1 Then 

	// No, Check for modified rows
	ll_Modified  = dw_master_12many.DeletedCount ( )
	ll_Modified += dw_master_12many.ModifiedCount ( )
	ll_Modified += dw_detail_12many.DeletedCount ( )
	ll_Modified += dw_detail_12many.ModifiedCount ( )

	// Got any modifications?	
	If	ll_Modified > 0 Then
		// Yes, load up message
		ls_MsgText = "Database changes were not saved.~nSave before closing form?"
		// See what they want 
		li_rc = MessageBox ( this.Title, ls_MsgText, Question!, YesNoCancel! )
		
		// Determine action
		Choose Case li_rc
			Case 2								// They want to exit?
				Return							// Yes, ignore changes

			Case 3								// They change their mind?
				Message.ReturnValue = 1		// Yes, keep form open
				Return
		End Choose
	End If
End If

// Got an error yet?
If	li_Valid <> -1 Then
	// No, did update fail?
	If	Update_Rows ( ) = False Then 
		// Yes, set error 
		li_Valid = -1 
	End If
End If

If	li_Valid = -1 Then
	// Yes, load up message
	ls_MsgText = "Database changes were not saved.~nClose form anyway?"
	// They want to close?
	If MessageBox ( this.Title, ls_MsgText, Question!, YesNo! ) = 2 Then    
		// No, keep form open
		Message.ReturnValue = 1
	End If
End If
end event

type dw_detail_12many from DataWindow within w_pbstyle_mst_det_12many
end type

on dw_detail_12many.create
end on

on dw_detail_12many.destroy
end on

event getfocus;//*-----------------------------------------------------------------*/
//*    getfocus event:  Set which dw has focus
//*-----------------------------------------------------------------*/
ib_DetailHadFocus = True
end event

type dw_master_12many from DataWindow within w_pbstyle_mst_det_12many
end type

on dw_master_12many.create
end on

on dw_master_12many.destroy
end on

event getfocus;//*-----------------------------------------------------------------*/
//*    getfocus event:  Set which dw has focus
//*-----------------------------------------------------------------*/
ib_DetailHadFocus=False
end event

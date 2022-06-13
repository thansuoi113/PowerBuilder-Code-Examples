$PBExportHeader$w_pbstyle_grid.srw
forward
global type w_pbstyle_grid from Window
end type
type dw_grid from DataWindow within w_pbstyle_grid
end type
type dw_freeform from DataWindow within w_pbstyle_grid
end type
end forward

global type w_pbstyle_grid from Window
string MenuName = "m_pbstyle_grid"
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
event importfile ()
event retrieve ()
event saveas ()
dw_grid dw_grid
dw_freeform dw_freeform
end type
global w_pbstyle_grid w_pbstyle_grid

type variables
boolean  ib_update
end variables

forward prototypes
public subroutine Apply_Criteria ()
public subroutine Retrieve ()
public function boolean Update_Rows ()
public subroutine Specify_Criteria ()
public subroutine Sort_Dialog ()
public subroutine Save_As ()
public subroutine Prior_Row ()
public subroutine Print_Dialog ()
public subroutine Print ()
public subroutine Next_Row ()
public subroutine Last_Row ()
public subroutine Insert_Row ()
public subroutine First_Row ()
public subroutine Filter_Dialog ()
public subroutine Delete_Row ()
public subroutine Clear_Filter ()
public subroutine Cancel_Updates ()
public subroutine Import_File ()
public subroutine Close_Form ()
public subroutine Print_Setup ()
end prototypes

public subroutine Apply_Criteria ();//*-----------------------------------------------------------------*/
//*     Apply_Criteria routine:   End QueryMode and Apply Criteria
//*-----------------------------------------------------------------*/
m_pbstyle_sheet_ancestor lm_Menu
boolean lb_ReSpecify

lb_ReSpecify = False

// Did we pass criteria test?
If dw_grid.AcceptText ( ) = 1 Then

	// Yes, turn off redraw for now
	dw_grid.SetRedraw ( True )
 
	// Switch out of QueryMode
	dw_grid.Modify ( "DataWindow.QueryMode = no" )

	// Get a hold of menu
	lm_Menu = MenuID 

	// Let it shift out of criteria mode
	lm_Menu.SetCriteriaMode ( False )

	// Re-retrieve
	If  dw_grid.Retrieve ( ) > 0 Then
		// Yes, clear any locks
		Commit; 
		// Turn redraw back on
		dw_grid.SetRedraw ( True )
	Else
		// Turn redraw back on
		dw_grid.SetRedraw( True )
		Messagebox ( "Apply Criteria", "The criteria entered returned no rows, please enter a different criteria or erase criteria to restore original result set" )
		
		lb_ReSpecify = True
		this.Specify_Criteria ( )
	End If
End If

// set the form back to readonly if that's how it started before the specify criteria
If ib_update = False And lb_ReSpecify = False Then
	dw_grid.Modify ( "DataWindow.Readonly = yes")
	
	// Disable certain menu items
	lm_Menu.m_data.m_update.Enabled = False
	lm_Menu.m_data.m_delete.Enabled = False
	lm_Menu.m_data.m_insert.Enabled = False
	lm_Menu.m_data.m_cancelchanges.Enabled = False
End If
end subroutine

public subroutine Retrieve ();//*-----------------------------------------------------------------*/
//*     Retrieve routine:   Retrieve rows from the database
//*-----------------------------------------------------------------*/
int li_rc

// Prompt for save
If dw_grid.ModifiedCount ( ) + dw_grid.DeletedCount ( ) > 0 Then
	li_rc = MessageBox ( "Retrieve", "Would you like to save changes before retrieve?", Question!, YesNo! )
Else
	li_rc = 2
End If

If li_rc = 1 Then
	// Yes--update and retrieve
	If this.Update_Rows ( ) = False Then
		Return
	End If
End If
 
dw_grid.SetReDraw ( False )
// This will cause the datawindow to reset after using QueryMode  */
dw_grid.DataObject = dw_grid.DataObject
dw_grid.SetTransObject ( SQLCA )


// Got any rows?  
If dw_grid.Retrieve ( ) > 0 Then
   // Yes, clear any locks
   Commit;
Else
	// No, let the user know 
	this.Post Event NoMoreRows ( )
End If
dw_grid.SetReDraw ( True )
end subroutine

public function boolean Update_Rows ();//*-----------------------------------------------------------------*/
//*    Update_Rows routine:   Update Changes to Database
//*-----------------------------------------------------------------*/
string  ls_Describe

// See if we're in QueryMode
ls_Describe = dw_grid.Describe ( "DataWindow.QueryMode" )

// Are we?
If ( ls_Describe = "no" ) Then

	// No, see if we're Updateable
	ls_Describe = dw_grid.Describe ( "DataWindow.Table.UpdateTable" )

	// Are we?
	If ( ls_Describe <> "?" ) Then
		// Yes, did DataWindow update work?
		If ( dw_grid.Update( ) = -1 ) Then
			// Rollback changes 
			Rollback;
			Return False
	   End If
	Else
		//  DW is not updateable
		MessageBox ("Update", "This form is not updateable.  Please set Update Properties in the form painter to allow updates.", Information!, Ok!)
		Return False
	End If
End If

// Save changes
Commit;

Return True
end function

public subroutine Specify_Criteria ();//*-----------------------------------------------------------------*/
//*     Specify_Criteria routine:   Put DataWindow into QueryMode
//*-----------------------------------------------------------------*/
m_pbstyle_sheet_ancestor lm_menu
int li_rc

// Prompt for save
If dw_grid.ModifiedCount ( ) + dw_grid.DeletedCount ( ) > 0 Then
	li_rc = MessageBox ( "Specify Criteria", "Would you like to save changes before switching into Specify Criteria mode?", Question!, YesNo! )
Else
	li_rc = 2
End If

If li_rc = 1 Then
	// Yes--update and retrieve
	If this.Update_Rows ( ) = False Then
		Return
	End If
End If

// if the form is readonly, set to write
If ib_update = False Then
	dw_grid.Modify ( "DataWindow.Readonly = no" )
End If

 // Got any rows?  
If dw_grid.Retrieve ( ) > 0 Then
   // Yes, clear any locks
   Commit;
End If

// Switch into QueryMode
dw_grid.Modify ( "DataWindow.QueryMode = yes" )

// Get a hold of menu
lm_menu = MenuID 

// Let it shift into criteria mode
lm_menu.SetCriteriaMode ( True )
end subroutine

public subroutine Sort_Dialog ();//*-----------------------------------------------------------------*/
//*     Sort_Dialog routine:   Invoke Sort Dialog and Sort
//*-----------------------------------------------------------------*/
string ls_null

SetNull ( ls_null )

If dw_grid.SetSort ( ls_null ) <> -1 Then
	dw_grid.Sort ( )
End If
end subroutine

public subroutine Save_As ();//*-----------------------------------------------------------------*/
//*     Save_As routine:   Save Rows As
//*-----------------------------------------------------------------*/
dw_grid.SaveAs ( )
end subroutine

public subroutine Prior_Row ();//*-----------------------------------------------------------------*/
//*    Prior_Row routine:   Scroll to the Previous Row
//*-----------------------------------------------------------------*/
long ll_CurrentRow

// Get current row
ll_CurrentRow = dw_grid.GetRow ( )

// Were we at the end?
If ( ll_CurrentRow = 1 ) Then
	// Yes, let the user know
	MessageBox ( this.title, "This is the first row for this table!", Exclamation! )
	Return
End If

// Go to the next row 
dw_grid.ScrollPriorRow ( )
end subroutine

public subroutine Print_Dialog ();//*-----------------------------------------------------------------*/
//*     Print_Dialog routine:   Invoke Print Dialog and Print
//*-----------------------------------------------------------------*/
If OpenWithParm ( w_pbstyle_dw_print_options, dw_grid ) <> -1 Then
	If Message.DoubleParm <> -1 Then
		dw_grid.Print ( )
	End If
End If
end subroutine

public subroutine Print ();//*-----------------------------------------------------------------*/
//*     Print routine:   Print the DataWindow
//*-----------------------------------------------------------------*/
dw_grid.Print ( )
end subroutine

public subroutine Next_Row ();//*-----------------------------------------------------------------*/
//*    Next_Row routine:   Scroll to the Next Row
//*-----------------------------------------------------------------*/
long ll_CurrentRow

// Get current row
ll_CurrentRow = dw_grid.GetRow ( )

// Were we at the end?
If ( ll_CurrentRow = dw_grid.RowCount(  ) ) Then
	// Yes, let the user know
	MessageBox ( this.title, "This is the last row for this table!", Exclamation! )
	Return
End If

// Go to the next row 
dw_grid.ScrollNextRow ( )
end subroutine

public subroutine Last_Row ();//*-----------------------------------------------------------------*/
//*     Last_Row routine:   Scroll to the Last Row
//*-----------------------------------------------------------------*/
// Yes, scroll to the end 
dw_grid.ScrollToRow ( 9999999 )

// Got any rows?
If dw_grid.RowCount ( ) = 0 Then 
	// No, then issue error 
	this.Dynamic Event NoMoreRows ()
End If
end subroutine

public subroutine Insert_Row ();//*-----------------------------------------------------------------*/
//*     Insert_Row routine:   Insert a new row
//*-----------------------------------------------------------------*/
string ls_Describe
integer li_i
integer li_cols
integer li_LowTab
integer li_Tab
string str_describe
string sNum
integer li_LowCol

// Did AcceptText fail?
If dw_grid.AcceptText ( ) = -1 Then
	// Yes, don't allow insert
	Return
End If

// Insert a new row in the DataWindow
dw_grid.ScrollToRow ( dw_grid.InsertRow( 0 ) )

// Get the column with the lowest tab order
ls_Describe = dw_grid.Describe ( "DataWindow.Column.Count" )
li_cols = Integer ( ls_Describe )

li_LowTab = -1
li_LowCol = 1
For li_i = 1 to li_cols
	ls_Describe = dw_grid.Describe ( "#" + String ( li_i ) + ".TabSequence" )
	li_Tab = Integer ( ls_Describe )
	
	If li_LowTab = -1 Then
		li_LowTab = li_Tab
		li_LowCol = li_i
	Else
		If li_Tab < li_LowTab Then
			li_LowTab = li_Tab
			li_LowCol = li_i
		End If
	End If
Next

dw_grid.SetColumn ( li_LowCol )
dw_grid.SetFocus ( )
end subroutine

public subroutine First_Row ();//*-----------------------------------------------------------------*/
//*    First_Row routine:   Scroll to the First Row
//*-----------------------------------------------------------------*/
long ll_rows

// Get the current row count  
ll_rows = dw_grid.RowCount ( )

// Got any rows?
If ll_rows > 0 Then 
	// Yes, scroll to first one
	dw_grid.ScrollToRow ( 1 ) 
Else
   // No, then issue error 
   this.Dynamic Event NoMoreRows ()
End If
end subroutine

public subroutine Filter_Dialog ();//*-----------------------------------------------------------------*/
//*     Filter_Dialog routine:   Invoke Filter Dialog and Filter
//*-----------------------------------------------------------------*/
string ls_null

SetNull ( ls_null )

If dw_grid.SetFilter ( ls_null ) <> -1 Then
	dw_grid.Filter ( )
End If
end subroutine

public subroutine Delete_Row ();//*-----------------------------------------------------------------*/
//*     Delete_Row routine:  Delete the current DataWindow Row	
//*-----------------------------------------------------------------*/
dw_grid.DeleteRow ( 0 )
end subroutine

public subroutine Clear_Filter ();//*-----------------------------------------------------------------*/
//*     Clear_Filter routine:   Reset the Filter
//*-----------------------------------------------------------------*/
dw_grid.SetFilter ( "" )
dw_grid.Filter ( )
end subroutine

public subroutine Cancel_Updates ();//*-----------------------------------------------------------------*/
//*     Cancel_Updates routine:   Undo Pending Updates
//*-----------------------------------------------------------------*/
// They really want to Cancel?
If ( MessageBox ( this.title, "Are you sure you want to cancel all changes?", Question!, YesNo!, 2 ) = 1 ) Then
	// Yes, turn off redraw for now
	dw_grid.SetRedraw ( False )

	// Clear the existing contents
	dw_grid.Reset ( )

	// Call the Retrieve Event
    this.Retrieve ( )

	// Turn redraw back on
	dw_grid.SetRedraw ( True )

End If
end subroutine

public subroutine Import_File ();//*-----------------------------------------------------------------*/
//*     Import_File routine:   Import an External File
//*-----------------------------------------------------------------*/
int	 li_Result
string ls_FileName, ls_PathName

// Try to get file name
li_Result = GetFileOpenName ( "Select Import File", ls_PathName, &
			  ls_FileName, "txt", "Tab separated file(.txt),*.txt,Comma separated file(.csv),*.csv,XML file(.xml),*.xml" )

// Did we get a file name?
If li_Result = 1 Then
	// Yes, go try to import rows into it
	li_Result = dw_grid.ImportFile ( ls_PathName )

	// Insert any rows?
	If li_Result > 0 Then
		// Yes, now go to the First Row 
		this.First_Row ( ) 
	End If
End If
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

on w_pbstyle_grid.create
if IsValid(this.MenuID) then destroy(this.MenuID)
if this.MenuName = "m_pbstyle_grid" then this.MenuID = create m_pbstyle_grid
this.dw_grid = create dw_grid
this.dw_freeform = create dw_freeform
this.Control[]={this.dw_grid,&
this.dw_freeform}
end on

on w_pbstyle_grid.destroy
if IsValid(this.MenuID) then destroy(this.MenuID)
destroy(this.dw_grid)
destroy(this.dw_freeform)
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
// Let the user know
MessageBox ( this.title, "No rows exist for this table!", Exclamation! )

// Any rows in here?
If ( dw_grid.RowCount ( ) = 0 ) Then
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

event importfile;//*-----------------------------------------------------------------*/
//*     importfile event:   Import an External File
//*-----------------------------------------------------------------*/
this.Import_File ( )
end event

event retrieve;//*-----------------------------------------------------------------*/
//*     retrieve event:   Retrieve rows from the database
//*-----------------------------------------------------------------*/
this.Retrieve ( )
end event

event saveas;//*-----------------------------------------------------------------*/
//*     saveas event:   Save Rows As
//*-----------------------------------------------------------------*/
this.Save_As ( )
end event

event open;//*-----------------------------------------------------------------*/
//*    open event:   Initialization
//*-----------------------------------------------------------------*/
m_pbstyle_sheet_ancestor lm_menu
string ls_Describe
integer li_i, li_cols

// Set HourGlass
SetPointer ( HourGlass! )

// Get a hold of menu
lm_menu = MenuID 

// Let the menu know about the DW
lm_menu.SetDWObject ( dw_grid )

// Connect the DataWindow up to the transaction
dw_grid.SetTransObject ( SQLCA )

// Set message title
dw_grid.Modify ( "DataWindow.Message.Title=" + "'" + this.Title + "'" )

// See if we're Updateable
ib_update = False
ls_Describe = dw_grid.Describe ( "DataWindow.Column.Count" )
li_cols = Integer ( ls_Describe )
For li_i = 1 to li_cols
	ls_Describe = dw_grid.Describe ("#" + String ( li_i ) + ".Update" )
	
	// if any column is updatable, then the table is not readonly
	If ls_Describe = "yes" Then
		ib_update = True
	End If
Next

// Are we?
If ib_update = False Then
	// No, then make readonly
	dw_grid.Modify ( "DataWindow.Readonly = yes" )
	// Disable certain menu items
	lm_menu.m_data.m_update.Enabled = False
	lm_menu.m_data.m_delete.Enabled = False
	lm_menu.m_data.m_insert.Enabled = False
	lm_menu.m_data.m_cancelchanges.Enabled = False
End If

// Call the Retrieve function
this.Retrieve ( )
end event

event close;//*-----------------------------------------------------------------*/
//*     close event:   Save changes and release locks
//*-----------------------------------------------------------------*/
Commit;
end event

event closequery;//*-----------------------------------------------------------------*/
//*     closequery event:  Prompt for changes before closing
//*-----------------------------------------------------------------*/
int li_rc, li_update
long ll_TotalModified
string ls_Describe

// Force an accept 
li_update = dw_grid.AcceptText ( ) 

ls_Describe = dw_grid.Describe ( "DataWindow.Table.UpdateTable" )
If ( ls_Describe = "?" ) Then Return	//  DataWindow is not updateable

// Got an error?
If li_update <> -1 Then 

	// No, Check for modified rows
	ll_TotalModified  = dw_grid.DeletedCount ( )
	ll_TotalModified += dw_grid.ModifiedCount ( )
	// Got any modifications?	
	If ll_TotalModified > 0 Then
		// See what they want
		li_rc = MessageBox ( this.Title, "Database changes were not saved.~nSave before closing form?", Question!, YesNoCancel! )
		
		// Determine action
		Choose Case li_rc
	   		Case 2 									// They want to close?
				// Yes, ignore changes
				Return

	   		Case 3 									// They change their mind?
				// No, keep form open
				Message.ReturnValue = 1
				// All done for now
				Return
		End Choose

	End If
End If

// Got an error yet?
If li_update <> -1 Then
	// No, did update fail?
	If this.Update_Rows ( ) = False Then 
		// Yes, set error 
		li_update = -1 
	End If
End If

If li_update = -1 Then
	// They want to close?
   If MessageBox( this.Title, "Database changes were not saved.~nClose form anyway?", Question!, YesNo! ) = 2 Then    
		// No, keep form open
		Message.ReturnValue = 1
   End If
End If
end event

type dw_grid from DataWindow within w_pbstyle_grid
end type

on dw_grid.create
end on

on dw_grid.destroy
end on

event dberror;//*-----------------------------------------------------------------*/
//    dberror:  Put out error message
//*-----------------------------------------------------------------*/
MessageBox ( "Form Database Error", sqlerrtext, Exclamation! )

// Let DW know we handled error
Return 1
end event

type dw_freeform from DataWindow within w_pbstyle_grid
end type

on dw_freeform.create
end on

on dw_freeform.destroy
end on

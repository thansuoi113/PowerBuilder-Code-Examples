$PBExportHeader$w_pbstyle_query_governor.srw
forward
global type w_pbstyle_query_governor from Window
end type
type cb_2 from CommandButton within w_pbstyle_query_governor
end type
type cb_1 from CommandButton within w_pbstyle_query_governor
end type
type em_time from EditMask within w_pbstyle_query_governor
end type
type em_rows from EditMask within w_pbstyle_query_governor
end type
type cbx_time from CheckBox within w_pbstyle_query_governor
end type
type cbx_rows from CheckBox within w_pbstyle_query_governor
end type
end forward

global type w_pbstyle_query_governor from Window
cb_2 cb_2
cb_1 cb_1
em_time em_time
em_rows em_rows
cbx_time cbx_time
cbx_rows cbx_rows
end type
global w_pbstyle_query_governor w_pbstyle_query_governor

on w_pbstyle_query_governor.create
this.cb_2 = create cb_2
this.cb_1 = create cb_1
this.em_time = create em_time
this.em_rows = create em_rows
this.cbx_time = create cbx_time
this.cbx_rows = create cbx_rows
this.Control[]={this.cb_2,&
this.cb_1,&
this.em_time,&
this.em_rows,&
this.cbx_time,&
this.cbx_rows}
end on

on w_pbstyle_query_governor.destroy
destroy(this.cb_2)
destroy(this.cb_1)
destroy(this.em_time)
destroy(this.em_rows)
destroy(this.cbx_time)
destroy(this.cbx_rows)
end on

event open;//*-----------------------------------------------------------------*/
//*    open event:   Initialization
//*-----------------------------------------------------------------*/
w_pbstyle_frame_ancestor lw_parent

lw_parent = ParentWindow ( )

// Initialize the row limit
If lw_parent.ib_limitrows Then
	cbx_rows.Checked = True
	em_rows.Text = String ( lw_parent.il_rowlimit )
Else
	em_rows.Enabled = False
End If

// Initialize the time limit
If lw_parent.ib_limittime Then
	cbx_time.Checked = True
	em_time.Text = String ( lw_parent.it_timelimit )
Else
	em_time.Enabled = False
End If
end event

type cb_2 from CommandButton within w_pbstyle_query_governor
end type

on cb_2.create
end on

on cb_2.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Cancel & Return
//*-----------------------------------------------------------------*/
CloseWithReturn ( Parent, -1 )
end event

type cb_1 from CommandButton within w_pbstyle_query_governor
end type

on cb_1.create
end on

on cb_1.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Process & Close
//*-----------------------------------------------------------------*/
w_pbstyle_frame_ancestor lw_parent

lw_parent = ParentWindow ( )

// Check for range error
If cbx_rows.Checked And Long ( em_rows.Text ) < 1 Then
	MessageBox ( "Query Governor", "The row limit must be 1 or more." )
	em_rows.SetFocus ( )
	Return
End If

// Save the new values
lw_parent.ib_limitrows = cbx_rows.Checked
lw_parent.il_rowlimit = Long ( em_rows.Text )
lw_parent.ib_limittime = cbx_time.Checked
lw_parent.it_timelimit = Time ( em_time.Text )

// Indicate that OK was pressed
CloseWithReturn ( Parent, 1 )
end event

type em_time from EditMask within w_pbstyle_query_governor
end type

on em_time.create
end on

on em_time.destroy
end on

type em_rows from EditMask within w_pbstyle_query_governor
end type

on em_rows.create
end on

on em_rows.destroy
end on

type cbx_time from CheckBox within w_pbstyle_query_governor
end type

on cbx_time.create
end on

on cbx_time.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   
//*-----------------------------------------------------------------*/
em_time.Enabled = this.Checked
end event

type cbx_rows from CheckBox within w_pbstyle_query_governor
end type

on cbx_rows.create
end on

on cbx_rows.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   
//*-----------------------------------------------------------------*/
em_rows.Enabled = this.Checked
end event

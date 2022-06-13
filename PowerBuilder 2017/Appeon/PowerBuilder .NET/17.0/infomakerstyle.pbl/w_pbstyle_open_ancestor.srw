$PBExportHeader$w_pbstyle_open_ancestor.srw
forward
global type w_pbstyle_open_ancestor from Window
end type
type lv_object_list from ListView within w_pbstyle_open_ancestor
end type
type cb_cancel from CommandButton within w_pbstyle_open_ancestor
end type
type cb_ok from CommandButton within w_pbstyle_open_ancestor
end type
type st_1 from StaticText within w_pbstyle_open_ancestor
end type
end forward

global type w_pbstyle_open_ancestor from Window
lv_object_list lv_object_list
cb_cancel cb_cancel
cb_ok cb_ok
st_1 st_1
end type
global w_pbstyle_open_ancestor w_pbstyle_open_ancestor

type variables
string is_objtype
int ii_picture
integer ii_origHeight, ii_origWidth
end variables

forward prototypes
public function integer f_add_objects ()
end prototypes

public function integer f_add_objects ();//*-----------------------------------------------------------------*/
//*    f_add_objects function:   Add objects of type to list
//*-----------------------------------------------------------------*/
string ls_names[], ls_objnames[], ls_comments[]
integer li_index, li_itemindex, li_objs
listviewitem lvi_item
window lw_parent
m_pbstyle_frame_ancestor lm_menu

// Locate the parent menu object
lw_parent = ParentWindow ( )
lm_menu = lw_parent.MenuID
	
// Get the objects from menu
lm_menu.f_GetObjectsOfType ( is_objtype, ls_names, ls_objnames, ls_comments )
// Add each of the entries to the list
li_objs = UpperBound ( ls_names )
For li_index = 1 to li_objs
	lvi_item.Label = ls_names[li_index]
	lvi_item.Data = ls_objnames[li_index]
	lvi_item.PictureIndex = ii_picture
	li_itemindex = lv_object_list.AddItem ( lvi_item )
	lv_object_list.SetItem ( li_itemindex, 2, ls_comments[li_index] )
Next
	
lv_object_list.GetItem ( 1, lvi_item )
lvi_item.Selected = True
lv_object_list.SetItem ( 1, lvi_item )

Return 1
end function

on w_pbstyle_open_ancestor.create
this.lv_object_list = create lv_object_list
this.cb_cancel = create cb_cancel
this.cb_ok = create cb_ok
this.st_1 = create st_1
this.Control[]={this.lv_object_list,&
this.cb_cancel,&
this.cb_ok,&
this.st_1}
end on

on w_pbstyle_open_ancestor.destroy
destroy(this.lv_object_list)
destroy(this.cb_cancel)
destroy(this.cb_ok)
destroy(this.st_1)
end on

event Open;ii_origHeight = this.Height
ii_origWidth = This.Width
end event

event Resize;Constant int LI_ADJUSTWIDTH = 54	//  Leave room on the right
Constant int LI_ADJUSTHEIGHT = 210	//  Leave room on the bottom
int li_heightdiff, li_ButtonPos_Y, li_widthdiff

li_heightdiff = newheight - ii_origHeight
li_widthdiff = newwidth - ii_origWidth

If SizeType = 0 Then			/*SIZE_RESTORED*/
	
	li_ButtonPos_Y = newheight - 100
	cb_cancel.Move 	(cb_cancel.X + li_widthdiff, li_ButtonPos_Y)
	cb_ok.Move 	(cb_ok.X + li_widthdiff, li_ButtonPos_Y)
	
	lv_object_list.Resize (newwidth - LI_ADJUSTWIDTH, newheight - LI_ADJUSTHEIGHT)
		
	ii_OrigHeight = newheight
	ii_OrigWidth = newwidth
	
Else
	//  Continue processing
	Return 0
End If
end event

type lv_object_list from ListView within w_pbstyle_open_ancestor
end type

on lv_object_list.create
end on

on lv_object_list.destroy
end on

event constructor;//*-----------------------------------------------------------------*/
//*    constructor event:   Setup Report Columns
//*-----------------------------------------------------------------*/
this.AddColumn ( "Name", Left!, this.Width / 2 )
this.AddColumn ( "Description", Left!, this.Width * 1.5 )
end event

event doubleclicked;//*-----------------------------------------------------------------*/
//*    doubleclicked event:   Act like OK Button
//*-----------------------------------------------------------------*/
cb_ok.TriggerEvent ( Clicked! )
end event

type cb_cancel from CommandButton within w_pbstyle_open_ancestor
end type

on cb_cancel.create
end on

on cb_cancel.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Cancel & Close
//*-----------------------------------------------------------------*/
CloseWithReturn ( Parent, "" )
end event

type cb_ok from CommandButton within w_pbstyle_open_ancestor
end type

on cb_ok.create
end on

on cb_ok.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Get Object Name and Return
//*-----------------------------------------------------------------*/
listviewitem lvi_item
string ls_objname

If lv_object_list.SelectedIndex ( ) > 0 Then
	
	lv_object_list.GetItem ( lv_object_list.SelectedIndex ( ), lvi_item )
	ls_objname = Trim ( lvi_item.Data )
	
	If ls_objname <> "" Then
		CloseWithReturn ( Parent, ls_objname )
	Else
		Beep ( 1 )
	End If
Else
	Beep ( 1 )
End If
end event

type st_1 from StaticText within w_pbstyle_open_ancestor
end type

on st_1.create
end on

on st_1.destroy
end on

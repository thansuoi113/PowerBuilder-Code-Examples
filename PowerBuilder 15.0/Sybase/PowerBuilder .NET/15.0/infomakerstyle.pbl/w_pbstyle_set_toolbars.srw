$PBExportHeader$w_pbstyle_set_toolbars.srw
forward
global type w_pbstyle_set_toolbars from Window
end type
type rb_floating from RadioButton within w_pbstyle_set_toolbars
end type
type rb_bottom from RadioButton within w_pbstyle_set_toolbars
end type
type rb_right from RadioButton within w_pbstyle_set_toolbars
end type
type rb_top from RadioButton within w_pbstyle_set_toolbars
end type
type rb_left from RadioButton within w_pbstyle_set_toolbars
end type
type cbx_show_tips from CheckBox within w_pbstyle_set_toolbars
end type
type cbx_showtext from CheckBox within w_pbstyle_set_toolbars
end type
type cb_done from CommandButton within w_pbstyle_set_toolbars
end type
type cb_visible from CommandButton within w_pbstyle_set_toolbars
end type
type gb_1 from GroupBox within w_pbstyle_set_toolbars
end type
end forward

global type w_pbstyle_set_toolbars from Window
rb_floating rb_floating
rb_bottom rb_bottom
rb_right rb_right
rb_top rb_top
rb_left rb_left
cbx_show_tips cbx_show_tips
cbx_showtext cbx_showtext
cb_done cb_done
cb_visible cb_visible
gb_1 gb_1
end type
global w_pbstyle_set_toolbars w_pbstyle_set_toolbars

type variables
window iw_win_ref
application iapp_ref
end variables

on w_pbstyle_set_toolbars.create
this.rb_floating = create rb_floating
this.rb_bottom = create rb_bottom
this.rb_right = create rb_right
this.rb_top = create rb_top
this.rb_left = create rb_left
this.cbx_show_tips = create cbx_show_tips
this.cbx_showtext = create cbx_showtext
this.cb_done = create cb_done
this.cb_visible = create cb_visible
this.gb_1 = create gb_1
this.Control[]={this.rb_floating,&
this.rb_bottom,&
this.rb_right,&
this.rb_top,&
this.rb_left,&
this.cbx_show_tips,&
this.cbx_showtext,&
this.cb_done,&
this.cb_visible,&
this.gb_1}
end on

on w_pbstyle_set_toolbars.destroy
destroy(this.rb_floating)
destroy(this.rb_bottom)
destroy(this.rb_right)
destroy(this.rb_top)
destroy(this.rb_left)
destroy(this.cbx_show_tips)
destroy(this.cbx_showtext)
destroy(this.cb_done)
destroy(this.cb_visible)
destroy(this.gb_1)
end on

event open;//*-----------------------------------------------------------------*/
//*    open event:  Initialization
//*-----------------------------------------------------------------*/
iw_win_ref = w_pbstyle_frame_ancestor

Choose Case iw_win_ref.ToolBarAlignment
	Case AlignAtBottom! 
		rb_bottom.Checked = True
	Case AlignAtLeft!
		rb_left.Checked = True
	Case AlignAtRight!
		rb_right.Checked = True
	Case AlignAtTop! 
		rb_top.Checked = True
	Case Floating!
		rb_floating.Checked = True
End Choose

If iw_win_ref.ToolbarVisible Then
	cb_visible.Text = "_Hide"
Else
	cb_visible.Text = "_Show"
End If

iapp_ref = GetApplication ( )
cbx_showtext.Checked = iapp_ref.ToolbarText
cbx_show_tips.Checked = iapp_ref.ToolbarTips
end event

type rb_floating from RadioButton within w_pbstyle_set_toolbars
end type

on rb_floating.create
end on

on rb_floating.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Alignment
//*-----------------------------------------------------------------*/
iw_win_ref.ToolbarAlignment = Floating!
end event

type rb_bottom from RadioButton within w_pbstyle_set_toolbars
end type

on rb_bottom.create
end on

on rb_bottom.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Alignment
//*-----------------------------------------------------------------*/
iw_win_ref.ToolbarAlignment = AlignAtBottom!
end event

type rb_right from RadioButton within w_pbstyle_set_toolbars
end type

on rb_right.create
end on

on rb_right.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Alignment
//*-----------------------------------------------------------------*/
iw_win_ref.ToolbarAlignment = AlignAtRight!
end event

type rb_top from RadioButton within w_pbstyle_set_toolbars
end type

on rb_top.create
end on

on rb_top.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Alignment
//*-----------------------------------------------------------------*/
iw_win_ref.ToolbarAlignment = AlignAtTop!
end event

type rb_left from RadioButton within w_pbstyle_set_toolbars
event ue_post ()
end type

on rb_left.create
end on

on rb_left.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Alignment
//*-----------------------------------------------------------------*/
iw_win_ref.ToolbarAlignment = AlignAtLeft!
end event

type cbx_show_tips from CheckBox within w_pbstyle_set_toolbars
end type

on cbx_show_tips.create
end on

on cbx_show_tips.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Tips
//*-----------------------------------------------------------------*/
iapp_ref.ToolbarTips = this.Checked
end event

type cbx_showtext from CheckBox within w_pbstyle_set_toolbars
end type

on cbx_showtext.create
end on

on cbx_showtext.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Text
//*-----------------------------------------------------------------*/
iapp_ref.ToolbarText = this.Checked
end event

type cb_done from CommandButton within w_pbstyle_set_toolbars
end type

on cb_done.create
end on

on cb_done.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Close
//*-----------------------------------------------------------------*/
Close ( Parent )
end event

type cb_visible from CommandButton within w_pbstyle_set_toolbars
end type

on cb_visible.create
end on

on cb_visible.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Hide / Show
//*-----------------------------------------------------------------*/
If this.Text = "_Hide" then
	iw_win_ref.ToolbarVisible = False
	this.Text = "_Show"
Else
	iw_win_ref.ToolbarVisible = True
	this.Text = "_Hide"
End If
end event

type gb_1 from GroupBox within w_pbstyle_set_toolbars
end type

on gb_1.create
end on

on gb_1.destroy
end on

$PBExportHeader$w_pbstyle_zoom.srw
forward
global type w_pbstyle_zoom from Window
end type
type cb_cancel from CommandButton within w_pbstyle_zoom
end type
type cb_ok from CommandButton within w_pbstyle_zoom
end type
type st_1 from StaticText within w_pbstyle_zoom
end type
type sle_custom from SingleLineEdit within w_pbstyle_zoom
end type
type rb_custom from RadioButton within w_pbstyle_zoom
end type
type rb_30 from RadioButton within w_pbstyle_zoom
end type
type rb_65 from RadioButton within w_pbstyle_zoom
end type
type rb_100 from RadioButton within w_pbstyle_zoom
end type
type rb_200 from RadioButton within w_pbstyle_zoom
end type
type gb_1 from GroupBox within w_pbstyle_zoom
end type
end forward

global type w_pbstyle_zoom from Window
event ue_postopen ()
cb_cancel cb_cancel
cb_ok cb_ok
st_1 st_1
sle_custom sle_custom
rb_custom rb_custom
rb_30 rb_30
rb_65 rb_65
rb_100 rb_100
rb_200 rb_200
gb_1 gb_1
end type
global w_pbstyle_zoom w_pbstyle_zoom

type variables
string is_parm
end variables

on w_pbstyle_zoom.create
this.cb_cancel = create cb_cancel
this.cb_ok = create cb_ok
this.st_1 = create st_1
this.sle_custom = create sle_custom
this.rb_custom = create rb_custom
this.rb_30 = create rb_30
this.rb_65 = create rb_65
this.rb_100 = create rb_100
this.rb_200 = create rb_200
this.gb_1 = create gb_1
this.Control[]={this.cb_cancel,&
this.cb_ok,&
this.st_1,&
this.sle_custom,&
this.rb_custom,&
this.rb_30,&
this.rb_65,&
this.rb_100,&
this.rb_200,&
this.gb_1}
end on

on w_pbstyle_zoom.destroy
destroy(this.cb_cancel)
destroy(this.cb_ok)
destroy(this.st_1)
destroy(this.sle_custom)
destroy(this.rb_custom)
destroy(this.rb_30)
destroy(this.rb_65)
destroy(this.rb_100)
destroy(this.rb_200)
destroy(this.gb_1)
end on

event ue_postopen;Choose Case is_parm
	Case "200"
		rb_200.Checked = True
		rb_200.SetFocus ()
	Case "100"
		rb_100.Checked = True
		rb_100.SetFocus ()
	Case "65"
		rb_65.Checked = True
		rb_65.SetFocus ()
	Case "30"
		rb_30.Checked = True
		rb_30.SetFocus ()
	Case Else
		rb_custom.Checked = True
		rb_custom.SetFocus ()
End Choose

sle_custom.Text = is_parm
end event

event open;//*-----------------------------------------------------------------*/
//*    open event:  Initialization
//*-----------------------------------------------------------------*/
is_parm = Message.StringParm
this.PostEvent ("ue_postopen")
end event

type cb_cancel from CommandButton within w_pbstyle_zoom
end type

on cb_cancel.create
end on

on cb_cancel.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Cancel & Close
//*-----------------------------------------------------------------*/
CloseWithReturn ( Parent, "" )
end event

type cb_ok from CommandButton within w_pbstyle_zoom
end type

on cb_ok.create
end on

on cb_ok.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Process & Close
//*-----------------------------------------------------------------*/
CloseWithReturn ( Parent, sle_custom.Text )
end event

type st_1 from StaticText within w_pbstyle_zoom
end type

on st_1.create
end on

on st_1.destroy
end on

type sle_custom from SingleLineEdit within w_pbstyle_zoom
end type

on sle_custom.create
end on

on sle_custom.destroy
end on

type rb_custom from RadioButton within w_pbstyle_zoom
end type

on rb_custom.create
end on

on rb_custom.destroy
end on

type rb_30 from RadioButton within w_pbstyle_zoom
end type

on rb_30.create
end on

on rb_30.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Custom Text
//*-----------------------------------------------------------------*/
sle_custom.Text = "30"
end event

type rb_65 from RadioButton within w_pbstyle_zoom
end type

on rb_65.create
end on

on rb_65.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Custom Text
//*-----------------------------------------------------------------*/
sle_custom.Text = "65"
end event

type rb_100 from RadioButton within w_pbstyle_zoom
end type

on rb_100.create
end on

on rb_100.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Custom Text
//*-----------------------------------------------------------------*/
sle_custom.Text = "100"
end event

type rb_200 from RadioButton within w_pbstyle_zoom
end type

on rb_200.create
end on

on rb_200.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:  Set Custom Text
//*-----------------------------------------------------------------*/
sle_custom.Text = "200"
end event

type gb_1 from GroupBox within w_pbstyle_zoom
end type

on gb_1.create
end on

on gb_1.destroy
end on

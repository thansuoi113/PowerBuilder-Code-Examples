$PBExportHeader$w_pbstyle_dw_print_options.srw
forward
global type w_pbstyle_dw_print_options from Window
end type
type st_4 from StaticText within w_pbstyle_dw_print_options
end type
type cb_printer from CommandButton within w_pbstyle_dw_print_options
end type
type cb_cancel from CommandButton within w_pbstyle_dw_print_options
end type
type cbx_collate from CheckBox within w_pbstyle_dw_print_options
end type
type cbx_print_to_file from CheckBox within w_pbstyle_dw_print_options
end type
type st_3 from StaticText within w_pbstyle_dw_print_options
end type
type sle_page_range from SingleLineEdit within w_pbstyle_dw_print_options
end type
type rb_pages from RadioButton within w_pbstyle_dw_print_options
end type
type rb_current_page from RadioButton within w_pbstyle_dw_print_options
end type
type rb_all from RadioButton within w_pbstyle_dw_print_options
end type
type em_copies from EditMask within w_pbstyle_dw_print_options
end type
type st_2 from StaticText within w_pbstyle_dw_print_options
end type
type sle_printer from SingleLineEdit within w_pbstyle_dw_print_options
end type
type st_printername from StaticText within w_pbstyle_dw_print_options
end type
type cb_ok from CommandButton within w_pbstyle_dw_print_options
end type
type gb_1 from GroupBox within w_pbstyle_dw_print_options
end type
type gb_printer from GroupBox within w_pbstyle_dw_print_options
end type
type gb_copies from GroupBox within w_pbstyle_dw_print_options
end type
type ddlb_range from DropDownListBox within w_pbstyle_dw_print_options
end type
type st_print_file from StaticText within w_pbstyle_dw_print_options
end type
type cb_file from StaticText within w_pbstyle_dw_print_options
end type
end forward

global type w_pbstyle_dw_print_options from Window
st_4 st_4
cb_printer cb_printer
cb_cancel cb_cancel
cbx_collate cbx_collate
cbx_print_to_file cbx_print_to_file
st_3 st_3
sle_page_range sle_page_range
rb_pages rb_pages
rb_current_page rb_current_page
rb_all rb_all
em_copies em_copies
st_2 st_2
sle_printer sle_printer
st_printername st_printername
cb_ok cb_ok
gb_1 gb_1
gb_printer gb_printer
gb_copies gb_copies
ddlb_range ddlb_range
st_print_file st_print_file
cb_file cb_file
end type
global w_pbstyle_dw_print_options w_pbstyle_dw_print_options

type variables
string is_page_range
datawindow idw_dw
end variables

forward prototypes
private subroutine wf_page_range (RadioButton a_buttonclicked)
public subroutine wf_enable_printfile ()
public subroutine wf_disable_printfile ()
end prototypes

private subroutine wf_page_range (RadioButton a_buttonclicked);//*-----------------------------------------------------------------*/
//*    wf_page_range function:   Set Up Print Range
//*-----------------------------------------------------------------*/
Choose Case a_buttonclicked
		
	Case rb_all
		sle_page_range.Text = ""
		sle_page_range.Enabled = False
		is_page_range = "a"
		
	Case rb_current_page
		sle_page_range.Text = ""
		sle_page_range.Enabled = False
		is_page_range = "c"
		
	Case rb_pages		
		sle_page_range.Enabled = True
		is_page_range = "p"
		
End Choose
end subroutine

public subroutine wf_enable_printfile ();//*-----------------------------------------------------------------*/
//*    wf_enable_printfile function:   Show all items related to choosing a file
//*-----------------------------------------------------------------*/
st_print_file.Visible = True
cb_file.Visible = True
end subroutine

public subroutine wf_disable_printfile ();//*-----------------------------------------------------------------*/
//*    wf_disable_printfile function:   Hide all items related to choosing a file
//*-----------------------------------------------------------------*/
st_print_file.Visible = False
cb_file.Visible = False
st_print_file.Text = ""
end subroutine

on w_pbstyle_dw_print_options.create
this.st_4 = create st_4
this.cb_printer = create cb_printer
this.cb_cancel = create cb_cancel
this.cbx_collate = create cbx_collate
this.cbx_print_to_file = create cbx_print_to_file
this.st_3 = create st_3
this.sle_page_range = create sle_page_range
this.rb_pages = create rb_pages
this.rb_current_page = create rb_current_page
this.rb_all = create rb_all
this.em_copies = create em_copies
this.st_2 = create st_2
this.sle_printer = create sle_printer
this.st_printername = create st_printername
this.cb_ok = create cb_ok
this.gb_1 = create gb_1
this.gb_printer = create gb_printer
this.gb_copies = create gb_copies
this.ddlb_range = create ddlb_range
this.st_print_file = create st_print_file
this.cb_file = create cb_file
this.Control[]={this.st_4,&
this.cb_printer,&
this.cb_cancel,&
this.cbx_collate,&
this.cbx_print_to_file,&
this.st_3,&
this.sle_page_range,&
this.rb_pages,&
this.rb_current_page,&
this.rb_all,&
this.em_copies,&
this.st_2,&
this.sle_printer,&
this.st_printername,&
this.cb_ok,&
this.gb_1,&
this.gb_printer,&
this.gb_copies,&
this.ddlb_range,&
this.st_print_file,&
this.cb_file}
end on

on w_pbstyle_dw_print_options.destroy
destroy(this.st_4)
destroy(this.cb_printer)
destroy(this.cb_cancel)
destroy(this.cbx_collate)
destroy(this.cbx_print_to_file)
destroy(this.st_3)
destroy(this.sle_page_range)
destroy(this.rb_pages)
destroy(this.rb_current_page)
destroy(this.rb_all)
destroy(this.em_copies)
destroy(this.st_2)
destroy(this.sle_printer)
destroy(this.st_printername)
destroy(this.cb_ok)
destroy(this.gb_1)
destroy(this.gb_printer)
destroy(this.gb_copies)
destroy(this.ddlb_range)
destroy(this.st_print_file)
destroy(this.cb_file)
end on

event open;//*-----------------------------------------------------------------*/
//*    open event:   we assume that this window will be opened using 
//*		OpenWithParm and that a datawindow control will be passed to it
//*-----------------------------------------------------------------*/
string ls_rc

idw_dw = Message.PowerObjectParm
sle_printer.text = idw_dw.Describe ( "DataWindow.Printer" )

//  set the page print include (all,even,odd)
ls_rc = idw_dw.Describe ( "DataWindow.Print.Page.RangeInclude" )

//  determine rangeinclude (all,even,odd)
Choose Case Left ( ls_rc, 1 )
	Case "0" 					// all
		ddlb_range.SelectItem ( 1 ) 
		is_page_range = "a"
	Case "1" 					// even
		ddlb_range.SelectItem ( 2 ) 
		is_page_range = "e"
	Case "2" 					// odd
		ddlb_range.SelectItem ( 3 ) 
		is_page_range = "o"
End Choose

ls_rc = idw_dw.Describe ( "DataWindow.Print.Collate" )
cbx_collate.Checked = ( ls_rc = "yes" )

//  page_range 
ls_rc = idw_dw.Describe ( "DataWindow.Print.Page.Range" )
If ls_rc = "" Then
	is_page_range = "a"
	rb_all.Checked = True
Else
	is_page_range = "p"
	rb_pages.checked = True
	sle_page_range.Text = ls_rc
End If

//  number of copies ?
ls_rc = idw_dw.Describe ( "DataWindow.Print.Copies" )
//copies = 0 is actually 1 copy.....
If ls_rc = "0" Then ls_rc = "1"
em_copies.Text = ls_rc

//  print to file ?
ls_rc = idw_dw.Describe ( "DataWindow.Print.Filename" )
If ls_rc <> "" and ls_rc <> "!" Then 
	cbx_print_to_file.Checked = True
	wf_enable_printfile ( )
	//strip the ~'s out of the file name to display properly
	Do While ( Pos ( ls_rc, "~~" ) > 0)
		integer li_p
		li_p = Pos ( ls_rc, "~~" )
		ls_rc = Left ( ls_rc, li_p - 1 ) + Mid ( ls_rc, li_p + 1 )
	Loop
	st_print_file.Text = ls_rc
Else
	cbx_print_to_file.Checked = False
	wf_disable_printfile ( )
End If
end event

type st_4 from StaticText within w_pbstyle_dw_print_options
end type

on st_4.create
end on

on st_4.destroy
end on

type cb_printer from CommandButton within w_pbstyle_dw_print_options
end type

on cb_printer.create
end on

on cb_printer.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Select Printer
//*-----------------------------------------------------------------*/
PrintSetup ( )
sle_printer.Text = idw_dw.Describe ( "DataWindow.Printer" )
end event

type cb_cancel from CommandButton within w_pbstyle_dw_print_options
end type

on cb_cancel.create
end on

on cb_cancel.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Cancel & Close
//*-----------------------------------------------------------------*/
CloseWithReturn ( Parent, -1 )
end event

type cbx_collate from CheckBox within w_pbstyle_dw_print_options
end type

on cbx_collate.create
end on

on cbx_collate.destroy
end on

type cbx_print_to_file from CheckBox within w_pbstyle_dw_print_options
end type

on cbx_print_to_file.create
end on

on cbx_print_to_file.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Set Print File Options
//*-----------------------------------------------------------------*/
If this.Checked Then
	wf_enable_printfile ( )
Else
	wf_disable_printfile ( )
End If
end event

type st_3 from StaticText within w_pbstyle_dw_print_options
end type

on st_3.create
end on

on st_3.destroy
end on

type sle_page_range from SingleLineEdit within w_pbstyle_dw_print_options
end type

on sle_page_range.create
end on

on sle_page_range.destroy
end on

type rb_pages from RadioButton within w_pbstyle_dw_print_options
end type

on rb_pages.create
end on

on rb_pages.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Set Page Range
//*-----------------------------------------------------------------*/
wf_page_range ( this )
end event

type rb_current_page from RadioButton within w_pbstyle_dw_print_options
end type

on rb_current_page.create
end on

on rb_current_page.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Set Page Range
//*-----------------------------------------------------------------*/
wf_page_range ( this )
end event

type rb_all from RadioButton within w_pbstyle_dw_print_options
end type

on rb_all.create
end on

on rb_all.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Set Page Range
//*-----------------------------------------------------------------*/
wf_page_range ( this )
end event

type em_copies from EditMask within w_pbstyle_dw_print_options
end type

on em_copies.create
end on

on em_copies.destroy
end on

type st_2 from StaticText within w_pbstyle_dw_print_options
end type

on st_2.create
end on

on st_2.destroy
end on

type sle_printer from SingleLineEdit within w_pbstyle_dw_print_options
end type

on sle_printer.create
end on

on sle_printer.destroy
end on

type st_printername from StaticText within w_pbstyle_dw_print_options
end type

on st_printername.create
end on

on st_printername.destroy
end on

type cb_ok from CommandButton within w_pbstyle_dw_print_options
end type

on cb_ok.create
end on

on cb_ok.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Apply Selected Options
//*-----------------------------------------------------------------*/
string ls_temp, ls_command
long ll_row
decimal ll_copies
string	ls_docname, ls_named
int	li_value

Choose Case Lower ( Left ( ddlb_range.Text, 1 ) )  	// determine rangeinclude (all,even,odd)
	Case "a" 			// all
		ls_temp = "0"
	Case "e" 			// even
		ls_temp = "1"
	Case "o" 			//odd
		ls_temp = "2"
End Choose
ls_command = "DataWindow.Print.Page.RangeInclude = " + ls_temp

If cbx_collate.Checked Then 		// collate output ?
	ls_command = ls_command +  " DataWindow.Print.Collate = yes"
Else
	ls_command = ls_command +  " DataWindow.Print.Collate = no"
End If

Choose Case is_page_range 			// did they pick a page range?
	Case "a" 		 // all
		ls_temp = ""
	Case "c" 		// current page?
		ll_row = idw_dw.GetRow()
		ls_temp = idw_dw.Describe ( "Evaluate('page()'," + String ( ll_row ) + ")" )
	Case "p" 		// a range? 
		ls_temp = sle_page_range.Text
End Choose		
ls_command = ls_command +  " DataWindow.Print.Page.Range = '" + ls_temp + "'"

// number of copies ?
em_copies.GetData ( ll_copies )
If ll_copies > 0 then ls_command = ls_command +  " DataWindow.Print.Copies = " + String ( ll_copies ) 

If cbx_print_to_file.Checked And st_print_file.Text = "" Then 	// print to file and no file seleted yet?
	li_value = GetFileSaveName ( "Print To File", ls_docname, ls_named, "PRN", "Print (*.PRN),*.PRN")
	If li_value = 1 Then 
		st_print_file.text= ls_docname
	Else // they canceled out of the dialog so quit completely
		Return
	End If
End If

If cbx_print_to_file.Checked Then
	ls_command = ls_command + " DataWindow.Print.Filename = '" + st_print_file.Text + "'"
Else
	ls_command = ls_command + " DataWindow.Print.Filename = '' "
End If

//  now alter the DataWindow
ls_temp = idw_dw.Modify ( ls_command )
If Len ( ls_temp ) > 0 Then 		// if error the display the 
	MessageBox ( "Error Setting Print Options", "Error message = " + ls_temp + "~r~ncommand = " + ls_command )
	Return
End If

CloseWithReturn ( Parent, 1 )
end event

type gb_1 from GroupBox within w_pbstyle_dw_print_options
end type

on gb_1.create
end on

on gb_1.destroy
end on

type gb_printer from GroupBox within w_pbstyle_dw_print_options
end type

on gb_printer.create
end on

on gb_printer.destroy
end on

type gb_copies from GroupBox within w_pbstyle_dw_print_options
end type

on gb_copies.create
end on

on gb_copies.destroy
end on

type ddlb_range from DropDownListBox within w_pbstyle_dw_print_options
end type

on ddlb_range.create
end on

on ddlb_range.destroy
end on

type st_print_file from StaticText within w_pbstyle_dw_print_options
end type

on st_print_file.create
end on

on st_print_file.destroy
end on

type cb_file from StaticText within w_pbstyle_dw_print_options
end type

on cb_file.create
end on

on cb_file.destroy
end on

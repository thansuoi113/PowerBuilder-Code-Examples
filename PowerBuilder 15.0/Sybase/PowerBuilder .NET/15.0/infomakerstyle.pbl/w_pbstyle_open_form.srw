$PBExportHeader$w_pbstyle_open_form.srw
forward
global type w_pbstyle_open_form from w_pbstyle_open_ancestor
end type
end forward

global type w_pbstyle_open_form from w_pbstyle_open_ancestor
end type
global w_pbstyle_open_form w_pbstyle_open_form

on w_pbstyle_open_form.create
call super::create
end on

on w_pbstyle_open_form.destroy
call super::destroy
end on

event open;call super::open;//*-----------------------------------------------------------------*/
//*    open event:   Set Type Information and Populate
//*-----------------------------------------------------------------*/
is_objtype = "f"
ii_picture = 2

f_Add_Objects ( )
end event

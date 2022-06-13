$PBExportHeader$w_pbstyle_open_report.srw
forward
global type w_pbstyle_open_report from w_pbstyle_open_ancestor
end type
end forward

global type w_pbstyle_open_report from w_pbstyle_open_ancestor
end type
global w_pbstyle_open_report w_pbstyle_open_report

on w_pbstyle_open_report.create
call super::create
end on

on w_pbstyle_open_report.destroy
call super::destroy
end on

event open;call super::open;//*-----------------------------------------------------------------*/
//*    open event:   Set Type Information and Populate
//*-----------------------------------------------------------------*/
is_objtype = "r"
ii_picture = 1

f_Add_Objects ( )
end event

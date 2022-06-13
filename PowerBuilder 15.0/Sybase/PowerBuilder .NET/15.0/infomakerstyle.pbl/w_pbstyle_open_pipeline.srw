forward
global type w_pbstyle_open_pipeline from w_pbstyle_open_ancestor
end type
end forward


global type w_pbstyle_open_pipeline from w_pbstyle_open_ancestor 

end type


global w_pbstyle_open_pipeline w_pbstyle_open_pipeline

event open;call super::open;//*-----------------------------------------------------------------*/
//*    open event:   Set Type Information and Populate
//*-----------------------------------------------------------------*/
is_objtype = "p"
ii_picture = 3

f_Add_Objects ( )
end event

on w_pbstyle_open_pipeline.create
call super::create
end on

on w_pbstyle_open_pipeline.destroy
call super::destroy
end on

type lv_object_list from w_pbstyle_open_ancestor`lv_object_list within w_pbstyle_open_pipeline 

end type



type cb_cancel from w_pbstyle_open_ancestor`cb_cancel within w_pbstyle_open_pipeline 
end type



type cb_ok from w_pbstyle_open_ancestor`cb_ok within w_pbstyle_open_pipeline 
end type



type st_1 from w_pbstyle_open_ancestor`st_1 within w_pbstyle_open_pipeline 

end type


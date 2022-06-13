$PBExportHeader$w_pbstyle_about.srw
forward
global type w_pbstyle_about from Window
end type
type st_subsid from StaticText within w_pbstyle_about
end type
type st_phone_number from StaticText within w_pbstyle_about
end type
type st_web_address from StaticText within w_pbstyle_about
end type
type st_email_address from StaticText within w_pbstyle_about
end type
type st_developer_name from StaticText within w_pbstyle_about
end type
type p_1 from Picture within w_pbstyle_about
end type
type st_software_name from StaticText within w_pbstyle_about
end type
type cb_ok from CommandButton within w_pbstyle_about
end type
type ln_1 from Line within w_pbstyle_about
end type
type st_software_version from StaticText within w_pbstyle_about
end type
type st_devusing from StaticText within w_pbstyle_about
end type
type st_copyright from StaticText within w_pbstyle_about
end type
end forward

global type w_pbstyle_about from Window
st_subsid st_subsid
st_phone_number st_phone_number
st_web_address st_web_address
st_email_address st_email_address
st_developer_name st_developer_name
p_1 p_1
st_software_name st_software_name
cb_ok cb_ok
ln_1 ln_1
st_software_version st_software_version
st_devusing st_devusing
st_copyright st_copyright
end type
global w_pbstyle_about w_pbstyle_about

on w_pbstyle_about.create
this.st_subsid = create st_subsid
this.st_phone_number = create st_phone_number
this.st_web_address = create st_web_address
this.st_email_address = create st_email_address
this.st_developer_name = create st_developer_name
this.p_1 = create p_1
this.st_software_name = create st_software_name
this.cb_ok = create cb_ok
this.ln_1 = create ln_1
this.st_software_version = create st_software_version
this.st_devusing = create st_devusing
this.st_copyright = create st_copyright
this.Control[]={this.st_subsid,&
this.st_phone_number,&
this.st_web_address,&
this.st_email_address,&
this.st_developer_name,&
this.p_1,&
this.st_software_name,&
this.cb_ok,&
this.ln_1,&
this.st_software_version,&
this.st_devusing,&
this.st_copyright}
end on

on w_pbstyle_about.destroy
destroy(this.st_subsid)
destroy(this.st_phone_number)
destroy(this.st_web_address)
destroy(this.st_email_address)
destroy(this.st_developer_name)
destroy(this.p_1)
destroy(this.st_software_name)
destroy(this.cb_ok)
destroy(this.ln_1)
destroy(this.st_software_version)
destroy(this.st_devusing)
destroy(this.st_copyright)
end on

event open;//*-----------------------------------------------------------------*/
//*    open event:   Extract Information from the INI File
//*					 for the Help About Box
//*-----------------------------------------------------------------*/
int li_major, li_minor
string ls_logo, ls_name, ls_email, ls_web, ls_phone
date ld_now
window lw_frame
contextinformation lcx_key
Application la_app

la_app = GetApplication ()

/*  Get frame handle and tag value  */
lw_frame = ParentWindow ()

/*  Construct the INI File Name  */
string sIni 
sIni = GetCurrentDirectory()
sIni += "\" + la_app.AppName + ".ini"

//  Fail silently, we already reported this
//if FileExists(sIni) then
//else
	//MessageBox ("Missing INI File", "The file " + sIni + " cannot be located.")
//end if

st_software_name.Text = lw_frame.Title
st_software_version.Text= ProfileString (sIni, "about", "software_version", "" )

ls_name = ProfileString (sIni, "about", "developer_name", "" )
If ls_name <> "" Then
	st_developer_name.Text = "Developed by: " + ls_name
End If

ls_email = ProfileString (sIni, "about", "email_address", "" )
If ls_email <> "" Then
	st_email_address.Text = "Email: " + ls_email
End If

ls_web = ProfileString (sIni, "about", "web_address", "" )
If ls_web <> "" Then
	st_web_address.Text = "Web: " + ls_web
End If

ls_phone = ProfileString (sIni, "about", "phone_number", "" )
If ls_phone <> "" Then
	st_phone_number.Text = "Phone: " + ls_phone
End If

ls_logo = ProfileString (sIni, "about", "company_logo", "" )
If ls_logo <> "" Then
	/*  Look for Logo Bitmap  */
	If FileExists ( ls_logo ) Then
 		p_1.PictureName = ls_logo
	Else
		/*  Don't show picture control  */
		p_1.Visible = False
   End If
Else  	/*  company_logo not in INI file  */
		/*  Don't show picture control  */
		p_1.Visible = False
End If

If p_1.Visible = False Then
	/*  Move text and version to the middle of the window  */
	st_software_name.X 		= ( this.Width - st_software_name.Width ) / 2
	st_software_version.X 	= ( this.Width - st_software_name.Width ) / 2
End If

/*  Get Version and CopyRight Information  */
ld_now = Today ( )

/*  Get PB Version.    */
GetContextService ( "ContextInformation", lcx_key)
lcx_key.GetMajorVersion ( li_major )
lcx_key.GetMinorVersion ( li_minor )

/*  Set Version and CopyRight Information  */
st_devusing.Text = "This product was developed using InfoMaker .NET " + String ( li_major ) + "." + String ( li_minor )
st_copyright.Text = "Copyright © 1991-" + String ( Year ( ld_now ), "####" ) + " Sybase, Inc."
end event

type st_subsid from StaticText within w_pbstyle_about
end type

on st_subsid.create
end on

on st_subsid.destroy
end on

type st_phone_number from StaticText within w_pbstyle_about
end type

on st_phone_number.create
end on

on st_phone_number.destroy
end on

type st_web_address from StaticText within w_pbstyle_about
end type

on st_web_address.create
end on

on st_web_address.destroy
end on

type st_email_address from StaticText within w_pbstyle_about
end type

on st_email_address.create
end on

on st_email_address.destroy
end on

type st_developer_name from StaticText within w_pbstyle_about
end type

on st_developer_name.create
end on

on st_developer_name.destroy
end on

type p_1 from Picture within w_pbstyle_about
end type

on p_1.create
end on

on p_1.destroy
end on

type st_software_name from StaticText within w_pbstyle_about
end type

on st_software_name.create
end on

on st_software_name.destroy
end on

type cb_ok from CommandButton within w_pbstyle_about
end type

on cb_ok.create
end on

on cb_ok.destroy
end on

event clicked;//*-----------------------------------------------------------------*/
//*    clicked event:   Close About Box Dialog
//*-----------------------------------------------------------------*/
Close ( Parent )
end event

type ln_1 from Line within w_pbstyle_about
end type

on ln_1.create
end on

on ln_1.destroy
end on

type st_software_version from StaticText within w_pbstyle_about
end type

on st_software_version.create
end on

on st_software_version.destroy
end on

type st_devusing from StaticText within w_pbstyle_about
end type

on st_devusing.create
end on

on st_devusing.destroy
end on

type st_copyright from StaticText within w_pbstyle_about
end type

on st_copyright.create
end on

on st_copyright.destroy
end on

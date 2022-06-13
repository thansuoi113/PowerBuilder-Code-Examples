//**************************************************************************
//		Copyright  Sybase, Inc. 2004-2006
//						 All Rights reserved.
//
//	Sybase, Inc. ("Sybase") claims copyright in this
//	program and documentation as an unpublished work, versions of
//	which were first licensed on the date indicated in the foregoing
//	notice.  Claim of copyright does not imply waiver of Sybase's
//	other rights.
//
//	 It is provided subject to the terms of the Sybase License Agreement
//	 for use as is, without alteration or modification.  
//	 Sybase shall have no obligation to provide support or error correction 
//	 services with respect to any altered or modified versions of this code.  
//
//       ***********************************************************
//       **     DO NOT MODIFY OR ALTER THIS CODE IN ANY WAY       **
//       ***********************************************************
//
//       ***************************************************************
//       ** IMPLEMENTATION DETAILS SUBJECT TO CHANGE WITHOUT NOTICE.  **
//       **            DO NOT RELY ON IMPLEMENTATION!!!!		      **
//       ***************************************************************
//**************************************************************************

function PBPicture()
{
    this.strUniqueID = "";
    this.bHyperLink = false;
    this.timeoutID = 0;
}

function PBPictureManager_Get(strID)
{
	return this.Pictures.Get(strID);
}

function PBPictureManager_Add(strID, oPicture)
{
	this.Pictures.Put(strID, oPicture)
}
	
function PBPictureManager_GetIDs()
{
	return this.Pictures.KeySet();
}

function PBPictureManager_Count() 
{
	return this.Pictures.Size();
}

function PBPictureManager_Register(strID, strUniqueID, bHyperLink) 
{
    var oPicture = new PBPicture();
    oPicture.strUniqueID = strUniqueID;
    oPicture.bHyperLink = bHyperLink;
    this.Add(strID, oPicture);
}

function PBPictureManager_GetData(strID)
{
   this.strID = strID;
   var oPicture = this.Get(strID);
   this.strUniqueID = oPicture.strUniqueID;
   this.bHyperLink = oPicture.bHyperLink;
}

function PBPictureManager_OnDoubleClick(evt, strID) 
{
    this.GetData(strID);
    
    __doPostBack(this.strUniqueID, "DoubleClick");
}

function PBPictureManager_OnDoubleClickTimeout(evt, strID) 
{
	var oPicture = this.Get(strID);
	window.clearTimeout(oPicture.timeoutID);
	oPicture.timeoutID = 0;

	this.OpenHref(strID);
	this.OnDoubleClick(evt, strID);
}

function PBPictureManager_OnClick(evt, strID, open) 
{
    this.GetData(strID);
    
    if (open)
    {
		this.OpenHref(strID);
	}
    __doPostBack(this.strUniqueID, "Click");
}

function PBPictureManager_OnClickTimeout(evt, strID) 
{
	var oPicture = this.Get(strID);
    oPicture.timeoutID = window.setTimeout("goPictureManager.OnClick(event, '"
		+ strID + "', true);", 300);
}

function PBPictureManager_OpenHref(strID)
{
    this.GetData(strID);

    var oPicture = document.getElementById(strID);
    var pbHref = oPicture.getAttribute("pbhref");
    if (this.bHyperLink && pbHref != "")
    {
		window.open(pbHref);
	}
}

function PBPictureManager()
{
    this.strID = "";
    this.strUniqueID = "";
    this.bHyperLink = false;
    this.Pictures = new PBMap();
    this.Get = PBPictureManager_Get;
    this.Add = PBPictureManager_Add;
    this.GetIDs = PBPictureManager_GetIDs;
    this.Count = PBPictureManager_Count;
    this.Register = PBPictureManager_Register;
    this.OnDoubleClick = PBPictureManager_OnDoubleClick;
    this.OnDoubleClickTimeout = PBPictureManager_OnDoubleClickTimeout;
    this.OnClick = PBPictureManager_OnClick;
    this.OnClickTimeout = PBPictureManager_OnClickTimeout;
    this.GetData = PBPictureManager_GetData;
    this.OpenHref = PBPictureManager_OpenHref;
}

var goPictureManager = new PBPictureManager();

PB_AjaxJsLoaded();

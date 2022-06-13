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

function PBStatic()
{
	this.strUniqueID = "";
	this.bHyperLink = false;
	this.bPopup = true;
	this.timeoutID = 0;
}

function PBStaticManager_Get(strID)
{
	return this.Statics.Get(strID);
}

function PBStaticManager_Add(strID, oStatic)
{
	this.Statics.Put(strID, oStatic)
}
	
function PBStaticManager_GetIDs()
{
	return this.Statics.KeySet();
}

function PBStaticManager_Count() 
{
	return this.Statics.Size();
}

function PBStaticManager_GetData(strID)
{
	this.strID = strID;
	var oStatic = this.Get(strID);
	this.strUniqueID = oStatic.strUniqueID;
	this.bHyperLink = oStatic.bHyperLink;
	this.bPopup = oStatic.bPopup;
}

function PBStaticManager_OnDoubleClick(evt, strID) 
{
    this.GetData(strID);
    
	__doPostBack(this.strUniqueID, "DoubleClick");
}

function PBStaticManager_OnDoubleClickTimeout(evt, strID) 
{
	var oStatic = this.Get(strID);
	window.clearTimeout(oStatic.timeoutID);
	oStatic.timeoutID = 0;

	this.OpenHref(strID);
	this.OnDoubleClick(evt, strID);
}

function PBStaticManager_OnClick(evt, strID, open) 
{
	this.GetData(strID);
	
	if (open)
	{
		this.OpenHref(strID);
	}
	__doPostBack(this.strUniqueID, "Click");
}

function PBStaticManager_OnClickTimeout(evt, strID) 
{
	var oStatic = this.Get(strID);
	oStatic.timeoutID = window.setTimeout("goStaticManager.OnClick(event, '"
		+ strID + "', true);", 300);
}

function PBStaticManager_OpenHref(strID)
{
	this.GetData(strID);
	
	var oStatic = document.getElementById(strID);
	var pbHref = oStatic.getAttribute("pbhref");
	if (this.bPopup && this.bHyperLink && pbHref != "")
	{
		window.open(pbHref);
	}
}

function PBStaticManager_OnMouseUp(evt, strID) 
{
	this.GetData(strID);
	
	var oStatic = document.getElementById(strID);
	__doPostBack(this.strUniqueID, "MouseUp, 0");
}

function PBStaticManager_Register(strID, strUniqueID, bHyperLink, bPopup) 
{
	var oStatic = new PBStatic();
	oStatic.strUniqueID = strUniqueID;
	oStatic.bHyperLink = bHyperLink;
	oStatic.bPopup = bPopup;
	this.Add(strID, oStatic);
}

function PBStaticManager()
{
	this.strID = "";
	this.strUniqueID = "";
	this.bHyperLink = false;
	this.bPopup = true;
	this.Statics = new PBMap();
	this.Get = PBStaticManager_Get;
	this.Add = PBStaticManager_Add;
	this.GetIDs = PBStaticManager_GetIDs;
	this.Count = PBStaticManager_Count;
	this.Register = PBStaticManager_Register;
	this.GetData = PBStaticManager_GetData;
	this.OnMouseUp = PBStaticManager_OnMouseUp;
	this.OnDoubleClick = PBStaticManager_OnDoubleClick;
	this.OnDoubleClickTimeout = PBStaticManager_OnDoubleClickTimeout;
	this.OnClick = PBStaticManager_OnClick;
	this.OnClickTimeout = PBStaticManager_OnClickTimeout;
	this.OpenHref = PBStaticManager_OpenHref;
}

var goStaticManager = new PBStaticManager();

PB_AjaxJsLoaded();

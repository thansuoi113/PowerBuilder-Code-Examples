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

var IE = document.all?true:false;

function PBGraphMouseEvent(id,type,x,y)
{
	__doPostBack(id,type+","+x+","+y);
}

var PBGraphEventControlId="";
var PBGraphEventType="";
var PBGraphEventArgs="";
var PBGraphTimeout;

function PBGraphDoPostBack()
{
	PB_ShowMask();
	__doPostBack(PBGraphEventControlId,PBGraphEventType+","+PBGraphEventArgs);
	PB_HideMask();
}

function PBGraphSetMousePosition(e, strID)
{
	PBGraphEventArgs=e.offsetX+","+e.offsetY;
}

function PBGraph_OnClick(evt)
{
	var e = PB_GetEvent(evt);
	PBGraphEventControlId=this.uniqueID;	
	PBGraphEventType="Clicked";
	PBGraphSetMousePosition(e, this.strID);
	PBGraphDoPostBack();
	return true;
}

function PBGraph_DelayedOnClick(evt)
{
	var e = PB_GetEvent(evt);
	PBGraphEventControlId=this.uniqueID;
	PBGraphEventType="Clicked";
	PBGraphSetMousePosition(e, this.strID);
	clearTimeout(PBGraphTimeout);
	PBGraphTimeout=setTimeout("PBGraphDoPostBack()",3000);
	return true;
}

function PBGraph_OnDblClick(evt)
{
	var e = PB_GetEvent(evt);
	PBGraphEventControlId=this.uniqueID;
	PBGraphEventType="DoubleClicked";
	PBGraphSetMousePosition(e, this.strID);
	PBGraphDoPostBack();
	return true;
}

function PBGraph_DelayedOnDblClick(evt)
{
	var e = PB_GetEvent(evt);
	clearTimeout(PBGraphTimeout);
	PBGraphEventControlId=this.uniqueID;	
	PBGraphEventType="DoubleClicked";
	PBGraphSetMousePosition(e, this.strID);
	PBGraphDoPostBack();
	return true;
}

function PBGraph()
{
	this.strID="";
	this.uniqueID="";
	this.OnClick=PBGraph_OnClick;
	this.DelayedOnClick=PBGraph_DelayedOnClick;
	this.OnDblClick=PBGraph_OnDblClick;
	this.DelayedOnDblClick=PBGraph_DelayedOnDblClick;
}

function PBGraphManager_Get(strID)
{
	return this.Graphs.Get(strID);
}

function PBGraphManager_Register(strID, uniqueID) 
{
	var oGraph = new PBGraph();
	oGraph.strID=strID;
	oGraph.uniqueID=uniqueID;
	this.Graphs.Put(strID, oGraph);
}

function PBGraphManager()
{
	this.Graphs = new PBMap();
	this.Get = PBGraphManager_Get;
	this.Register = PBGraphManager_Register;
}

var goGraphManager = new PBGraphManager();

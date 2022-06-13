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

var HORIZONTAL = 1;
var VERTICAL = 2;
var PROGRESSBAR_AREA_ID_SUFFIX = "_Progress_Area";

// ProgressBar Class defination
function PBProgressBar()
{
    this.minmum = 0;
    this.maximum = 0;
    this.progressPosition = 1;
    this.orientation =  1;
    this.progessLength = 1;
    this.Left = 0;
    this.Top = 0;
    this.pixelArray = new Array();
}

function PBProgressBarMgr_GetData(widgetID)
{
	this.widgetID = widgetID;
	var pbProgressBarObject = this.Get(widgetID);
	this.minmum = pbProgressBarObject.minmum;
	this.maximum = pbProgressBarObject.maximum;
	this.progressPosition = pbProgressBarObject.progressPosition;
	this.orientation = pbProgressBarObject.orientation;
	this.pixelArray = pbProgressBarObject.pixelArray;
    this.progessLength  = pbProgressBarObject.progessLength;
	this.widgetID =  pbProgressBarObject.widgetID;
	this.Left = pbProgressBarObject.Left;
	this.Top = pbProgressBarObject.Top;
}

function PBProgressBarMgr_Get(widgetID)
{
	return this.ProgressBars.Get(widgetID);
}

function PBProgressBarMgr_Add(widgetID, pbProgressBarObject)
{
	this.ProgressBars.Put(widgetID, pbProgressBarObject);
}

function PBProgressBarMgr_GetIDs()
{
	return this.ProgressBars.KeySet();
}

function PBProgressBarMgr_Count() 
{
	return this.ProgressBars.Size();
}

function PBProgressBarMgr_SetProgressPos(widgetID)
{
	 var pbProgressBarObject = this.Get(widgetID);
	 
	 var oProgThumbID  = document.getElementById(widgetID + PROGRESSBAR_AREA_ID_SUFFIX);
	 
	 if (pbProgressBarObject.progressPosition <= 0)
	 {
		oProgThumbID.style.visibility = "hidden";
		
		return;
	 }
	  
	 oProgThumbID.style.visibility = "visible";
	 	 	
	 var pixelValue = -1;
	 
	 if (pbProgressBarObject.maximum < pbProgressBarObject.progessLength)
	 {	
		if (pbProgressBarObject.progressPosition <= -1)
		    pbProgressBarObject.progressPosition = 0;
		else if (pbProgressBarObject.progressPosition >= pbProgressBarObject.pixelArray.length)
		    pbProgressBarObject.progressPosition = pbProgressBarObject.pixelArray.length - 1;
			
		pixelValue = pbProgressBarObject.pixelArray[pbProgressBarObject.progressPosition];
	 }			
	
	 else
	 {
		for (var i = 1; i <= pbProgressBarObject.pixelArray.length; i++)
		{			
			if ( pbProgressBarObject.pixelArray[i] >= pbProgressBarObject.progressPosition)
			{
				pixelValue = i;	
				
				break;
			}	
		} 
	 }
	 
	 if (pixelValue == -1 || pixelValue == null || pixelValue == undefined)
	 {
	    pixelValue = 0;
	 }
	 	
	 if (pbProgressBarObject.orientation == HORIZONTAL)
	 {	 
		oProgThumbID.style.width = pixelValue + "px";
	 }
	 else
	 {	 
		var progHeight = pixelValue - 1;
		progHeight = pixelValue > 0 ? progHeight : 0;
		
		oProgThumbID.style.top = pbProgressBarObject.progessLength - pixelValue - 2 + "px";
		oProgThumbID.style.height = progHeight + "px"; 	 
	 }	 		
}

function PBProgressBarMgr_Register(widgetID, minmum, maximum, progessLength,
	progressPosition, orientation)
{
    var pbProgressBarObject = new PBProgressBar();
   
    pbProgressBarObject.widgetID = widgetID;   
    pbProgressBarObject.minmum = minmum;
    pbProgressBarObject.maximum = maximum; 
    pbProgressBarObject.progessLength = progessLength; 		
    pbProgressBarObject.progressPosition = progressPosition;
    pbProgressBarObject.orientation = orientation;
     
    if (maximum  < progessLength)
	{	
		var ticks =  parseFloat(progessLength / maximum);
	       
		for (var i = 1; i <= maximum; i++)
		{								
			pbProgressBarObject.pixelArray[i] = Math.floor(ticks * i);
		}
	}
	else
	{
		var ticks =  parseFloat(maximum / progessLength);
		
		for (var i = 1; i <= progessLength ; i++)
		{					
			pbProgressBarObject.pixelArray[i] = Math.floor(ticks * i);
		}
	}
	
    this.Add(widgetID, pbProgressBarObject);

	this.SetProgressPos(widgetID);			
}

 function PBProgressBarMgr_OnControlClicked(evt, controlUniqueID)
 {    	    	
	try
	{
		var e = PB_GetEvent(evt);
	    var argument = "Clicked," + e.button + "," + e.offsetX + "," + e.offsetY;
	    e.cancelBuble = true;
    	
	    __doPostBack(controlUniqueID, argument);
	}
	catch(ex){}
}

// ProgressBarManager Class defination, Maintains all the ProgressBars in a Page
function PBProgressBarMgr()
{
	this.widgetID = "";	
    this.ProgressBars = new PBMap();
    this.Get = PBProgressBarMgr_Get;
    this.Add = PBProgressBarMgr_Add;
    this.GetIDs = PBProgressBarMgr_GetIDs;
    this.Count = PBProgressBarMgr_Count;
    this.Register = PBProgressBarMgr_Register;
	this.SetProgressPos = PBProgressBarMgr_SetProgressPos;
	this.OnControlClicked = PBProgressBarMgr_OnControlClicked;
}

var goProgressBarMgr = new PBProgressBarMgr();

PB_AjaxJsLoaded();

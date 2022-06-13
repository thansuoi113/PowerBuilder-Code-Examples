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

var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_HOME = 36;
var KEY_END = 35;
var KEY_PAGE_UP = 33;
var KEY_PAGE_DOWN = 34;

var HORIZONTAL = 1;
var VERTICAL = 2;

var SCROLLBAR = 1;
var TRACKBAR = 2;

var SCROLL_AREA_ID_SUFFIX	= "_ScrArea";
var THUMB_ID_SUFFIX			= "_Thumb"

var LINE_UP		= "lineup";
var LINE_DOWN	= "linedown";
var LINE_LEFT	= "lineleft";
var LINE_RIGHT	= "lineright";

var PAGE_UP		= "pageup";
var PAGE_DOWN	= "pagedown";
var PAGE_LEFT	= "pageleft";
var PAGE_RIGHT	= "pageright";

var THUMB_MOVE	= "thumbmove";

var HOME		= "home";
var END			= "end"
var RBUTTON_DOWN = "rbuttondown";

var gDocMouseMove = null;
var gDocMouseUp = null; 

function PBScrBarMgr_RButtonDown(e, pbScrollBarObject)
{	
	return (e.button == 2);
}

function PBScrBarMgr_LeftOrUpScrollButtonClicked(pbScrollBarObject, widgetID, scrPos, key)
{
	var eventName;
	
	if (key == KEY_LEFT)
		eventName = LINE_LEFT;
	else
		eventName = LINE_UP;
    	
	if (scrPos <= 1)
	{
		pbScrollBarObject.lastScrollIndex = 1;
		pbScrollBarObject.thumbPosition = 0;		
		
	    __doPostBack(pbScrollBarObject.controlUniqueID, 
									eventName + "," +  pbScrollBarObject.scrPos)		   		
	}
    
	scrPos -= pbScrollBarObject.lineValue;
	pbScrollBarObject.scrPos = scrPos;		
    
	if (pbScrollBarObject.maximum < pbScrollBarObject.scrollLength)
	{
		if (scrPos <= 0) 
			scrPos = 1;
    		
		__doPostBack(pbScrollBarObject.controlUniqueID, 
									eventName + "," +  pbScrollBarObject.scrPos)						
	}
	else
	{
	    __doPostBack(pbScrollBarObject.controlUniqueID, 
									eventName + "," +  pbScrollBarObject.scrPos)  					
	}
}

function PBScrBarMgr_RightOrDownScrollButtonClicked(pbScrollBarObject, widgetID, scrPos, key)
{
	var eventName;
	
	if (key == KEY_RIGHT)
		eventName = LINE_RIGHT;
	else
		eventName = LINE_DOWN;

	if(scrPos > pbScrollBarObject.maximum )
	{
		pbScrollBarObject.thumbPosition = pbScrollBarObject.scrollLength;
		
		return false;
	}

	scrPos += pbScrollBarObject.lineValue;

	if (scrPos > pbScrollBarObject.maximum )
		scrPos = pbScrollBarObject.maximum;

	pbScrollBarObject.scrPos = scrPos;

	__doPostBack(pbScrollBarObject.controlUniqueID, 
									eventName + "," +  pbScrollBarObject.scrPos)	   		
}

function PBScrBarMgr_ScrollButtonClicked(widgetID, key)
{	
	try
	{
		var nPixIncr = 0;
		
		var pbScrollBarObject = this.Get(widgetID);
		
		var scrPos = pbScrollBarObject.scrPos;		
	
		if (key == KEY_LEFT ||key == KEY_UP)
		{		
			this.LeftOrUpScrollButtonClicked(pbScrollBarObject, widgetID, scrPos, key);
		}
		else if (key == KEY_RIGHT ||key == KEY_DOWN)
		{
			this.RightOrDownScrollButtonClicked(pbScrollBarObject, widgetID, scrPos, key);
		}    				
	}
	catch(e)
	{
		// do nothing
	}		
}
 	
function PBScrBarMgr_KeyLeft(ScrBarID)
{	
	this.ScrollButtonClicked(ScrBarID, KEY_LEFT);
}

function PBScrBarMgr_KeyRight(widgetID)
{
	this.ScrollButtonClicked(widgetID, KEY_RIGHT);
}

function PBScrBarMgr_KeyHome(widgetID)
{		
	try
	{		
		var pbScrollBarObject = this.Get(widgetID); 
	    pbScrollBarObject.scrPos = pbScrollBarObject.minimum;    	
	    __doPostBack(pbScrollBarObject.controlUniqueID, 
			HOME + "," +  pbScrollBarObject.scrPos)
	}
	catch(e)
	{
		//do nothing
	}
}

function PBScrBarMgr_KeyEnd(ScrBarID)
{
    try
    {	
	   var pbScrollBarObject = this.Get(ScrBarID);     			
        pbScrollBarObject.scrPos = pbScrollBarObject.maximum;		   
        __doPostBack(pbScrollBarObject.controlUniqueID, 
			END + "," +  pbScrollBarObject.scrPos)	
    }
	catch(e)
	{
		//do nothing	
	}
}
		
function PBScrBarMgr_KeyUpArrow(ScrBarID)
{	
	this.ScrollButtonClicked(ScrBarID, KEY_UP);
}

function PBScrBarMgr_KeyDownArrow(ScrBarID)
{
	this.ScrollButtonClicked(ScrBarID, KEY_DOWN);		
}

function PBScrBarMgr_KeyPageUp(ScrBarID)
{       
	var eventName;
	var pbScrollBarObject = this.Get(ScrBarID);
	
	pbScrollBarObject.scrPos -= pbScrollBarObject.pageValue;
		
	if ( pbScrollBarObject.scrPos <= pbScrollBarObject.minimum)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
		pbScrollBarObject.lastScrollIndex = 1;
	}
	else
	{
	    pbScrollBarObject.lastScrollIndex  = pbScrollBarObject.scrPos;
	}
        	
	if (pbScrollBarObject.orientation == HORIZONTAL)	
		eventName = PAGE_LEFT; 
	else 				 
		eventName = PAGE_UP;     	
		
	 __doPostBack(pbScrollBarObject.controlUniqueID, 
									    eventName + "," +  pbScrollBarObject.scrPos)  
}

function PBScrBarMgr_KeyPageDown(ScrBarID)
{
	var eventName;
	var pbScrollBarObject = this.Get(ScrBarID);
	pbScrollBarObject.scrPos += pbScrollBarObject.pageValue;
	if ( pbScrollBarObject.scrPos >= pbScrollBarObject.maximum)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
		pbScrollBarObject.lastScrollIndex = pbScrollBarObject.scrollLength;
	}
	else
	{
	    pbScrollBarObject.lastScrollIndex  = pbScrollBarObject.scrPos;
	}
        	
	if (pbScrollBarObject.orientation == HORIZONTAL)	
		eventName = PAGE_RIGHT; 
	else 				 
		eventName = PAGE_DOWN;  
		
	 __doPostBack(pbScrollBarObject.controlUniqueID, eventName + "," +  pbScrollBarObject.scrPos);
}

function PBScrBarMgr_KeyDown(evt, widgetID)
{
	var e = PB_GetEvent(evt);
    
    switch (e.keyCode) 
    {
        case KEY_LEFT: 
            this.KeyLeft(widgetID);
    
            break;
            
        case KEY_RIGHT: 
            this.KeyRight(widgetID);
    
            break; 
            
        case KEY_HOME: 
            this.KeyHome(widgetID);
    
            break;
            
        case KEY_END: 
            this.KeyEnd(widgetID);
    
            break;
            
        case KEY_DOWN:
            this.KeyDownArrow(widgetID); 
    
            break;
            
        case KEY_UP: 
            this.KeyUpArrow(widgetID);
    
            break;
            
        case KEY_PAGE_DOWN: 
            this.KeyPageDown(widgetID);
          
            break;
            
        case KEY_PAGE_UP: 
            this.KeyPageUp(widgetID); 
           
            break;
     }   
}

function PBScrBarMgr_SetFocus(widgetID)
{
    goWindowManager.OnFocusOwn(widgetID);	
}

function PBScrBarMgr_GetData(widgetID)
{
	try
	{	
	    this.widgetID = widgetID;
	    
	    var oScrollBar = this.Get(widgetID);
	    
	    this.minimum = oScrollBar.minimum;
	    this.maximum = oScrollBar.maximum;
	    this.scrPos = oScrollBar.scrPos;
	    this.orientation = oScrollBar.orientation;
	    this.pixelArray = oScrollBar.pixelArray;
        this.scrollLength  = oScrollBar.scrollLength;
        this.thumbDrag = oScrollBar.bScrDrag;
	    this.pageValue = oScrollBar.pageValue;
	    this.lastScrollIndex = oScrollBar.lastScrollIndex;
	    this.widgetID =  oScrollBar.widgetID;
	    this.Left = oScrollBar.Left;
	    this.Top = oScrollBar.Top;
	    this.thumbPosition = oScrollBar.thumbPosition;
	    this.lineValue = oScrollBar.lineValue;
	 }
	 catch(e)
	 {
		//do nothing	
	 }
}

function PBScrBarMgr_Get(widgetID)
{
	return this.ScrollBars.Get(widgetID);
}

function PBScrBarMgr_Add(widgetID, oScrollBar)
{
	this.ScrollBars.Put(widgetID, oScrollBar);
}

function PBScrBarMgr_GetIDs()
{
	return this.ScrollBars.KeySet();
}

function PBScrBarMgr_Count() 
{
	return this.ScrollBars.Size();
}

function PBScrBarMgr_SetScrollPos(widgetID)
{
	try
	{
	    var pbScrollBarObject = this.Get(widgetID);
	   
	    var pixelValue = -1;
    	 
	    if (pbScrollBarObject.maximum < pbScrollBarObject.scrollLength)
	    {
		    pixelValue = pbScrollBarObject.pixelArray[pbScrollBarObject.scrPos];   		
	    }
	    else
	    {
		    for (var i = 1; i <= pbScrollBarObject.pixelArray.length; i++)
		    {			
			    if ( pbScrollBarObject.pixelArray[i]  >= pbScrollBarObject.scrPos)
			    {
				    pixelValue = i;	
    				
				    break;
			    }	
		    } 
	    }
	    
	    if (pixelValue == -1) 
			return;
    	 
	    if (pbScrollBarObject.minimum == 1 && pbScrollBarObject.maximum == 1)// default
			pixelValue = 1;    
	    else if (pixelValue == 1)
		    pixelValue-= 3;
    	 
	    var ThumbID = widgetID + THUMB_ID_SUFFIX;
	    
	    var oThumb  = document.getElementById(ThumbID);
	    
	    pbScrollBarObject.lastScrollIndex = pixelValue;
    	
	    if (pbScrollBarObject.orientation == HORIZONTAL)
	    {	 
		    oThumb.style.left = pixelValue + "px";
		    oThumb.xPos = pixelValue ;	
	    }
	    else
	    {	 
		    oThumb.style.top = pixelValue + "px"; 
		    oThumb.yPos = pixelValue ;	 
	    }
	}
	catch(e)
    {
	 // do nothing
    }		 		
}

function PBScrBarMgr_Register(controlUniqueID, widgetID, minimum, maximum, scrollLength, pageValue, 
							  scrPos, orientation, controlType, thumbPosition, thumb, lineValue)
{
    try
    {
        var oScrollBar = new PBScrollBar();
   
        oScrollBar.controlUniqueID = controlUniqueID;
        oScrollBar.widgetID = widgetID;   
        oScrollBar.minimum = minimum;
        oScrollBar.maximum = maximum; 
        oScrollBar.scrollLength = scrollLength; 		
        oScrollBar.scrPos = scrPos;
        oScrollBar.orientation = orientation;
        oScrollBar.thumbPosition = thumbPosition;
        oScrollBar.thumbDrag = false;
        oScrollBar.lineValue = lineValue;
        oScrollBar.thumb = thumb;
        
        var type = widgetID.substr(0, 4);        
        oScrollBar.type = controlType;
		oScrollBar.pixelArray[0] = 0;
		
		if (maximum  < scrollLength)
	    {	
		    var nTicks =  parseFloat(scrollLength / maximum);
		      
		    for (var i = 1; i <= maximum; i++)
		    {		    				
			    oScrollBar.pixelArray[i] = Math.floor(nTicks * i);
		    }
	    }
	    else
	    {
		    var nTicks =  parseFloat(maximum / scrollLength);
		      
		    for (var i = 1; i <= scrollLength ; i++)
		    {							
			    oScrollBar.pixelArray[i] = Math.floor(nTicks * i);
		    }
	    }
    	
	    oScrollBar.pageValue = pageValue;
    	
        this.Add(widgetID, oScrollBar);
        
        if (thumb)    		       
	        this.SetScrollPos(widgetID);
	  }
      catch(e)
      {
		//do nothing
      }		
}

function PBScrBarMgr_MousUpOnPage(widgetID)
{
      var pbScrollBarObject = this.Get(widgetID);
     
      pbScrollBarObject.thumbDrag = false;            
}

function PBScrBarMgr_MousDownOnPage(widgetID, nCellNo)
{
      var pbScrollBarObject = this.Get(widgetID);
     
	  pbScrollBarObject.thumbDrag = true;           
}

function  PBScrBarMgr_DragThumbWhenMaxIsLowerThanRange(pbScrollBarObject, widgetID, thumb, x, y)
{	
	if (x <= 1)
	{
		thumb.style.left = "-1px";
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
	}
	else if (x == pbScrollBarObject.scrollLength)
	{
		thumb.style.left= pbScrollBarObject.scrollLength + "px";
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
	}
	else
	{
		var nScrollVal;
		var nPixelNo;
	    
		for (var nPixelNo = 1; nPixelNo <= pbScrollBarObject.pixelArray.length; nPixelNo++)
		{ 
			if (pbScrollBarObject.pixelArray[nPixelNo] >= x)
			{
				pbScrollBarObject.scrPos = nPixelNo;
				pbScrollBarObject.lastScrollIndex = nPixelNo;
				break;
			}
		}
	}
	
	thumb.style.left = x + "px";
	thumb.xPos = x;
	pbScrollBarObject.thumbPosition = x;
}

function  PBScrBarMgr_DragThumbWhenMaxIsHigherThanRange(pbScrollBarObject, widgetID, thumb, x, y)
{
	pbScrollBarObject.scrPos = pbScrollBarObject.pixelArray[x];		
	thumb.style.left = x + "px";
	pbScrollBarObject.lastScrollIndex = x;
	thumb.xPos = x;	
	pbScrollBarObject.thumbPosition = x;
    
	if (x <= 1)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
		pbScrollBarObject.thumbPosition = 0;
	}
	else if (x == pbScrollBarObject.scrollLength)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
		pbScrollBarObject.thumbPosition = pbScrollBarObject.scrollLength;	
		thumb.xPos = pbScrollBarObject.scrollLength;						
	}	
}

function PBScrBarMgr_HorizontalScrollBarThumbDragged(pbScrollBarObject, widgetID, thumb,
	x, y, newmx, newmy, mx, my)
{
	if (x < 1 || x > pbScrollBarObject.scrollLength)
	{
		x -= newmx - mx;
		y -= newmy - my;
        
		return false;
	}
	else
	{
		if (pbScrollBarObject.maximum < pbScrollBarObject.scrollLength)	  
			this.DragThumbWhenMaxIsLowerThanRange(pbScrollBarObject, widgetID, thumb, x, y);
		else
			this.DragThumbWhenMaxIsHigherThanRange(pbScrollBarObject, widgetID, thumb, x, y);
	}   
}

function PBScrBarMgr_DraggThumbBelow(pbScrollBarObject, widgetID, thumb, x, y)
{
	pbScrollBarObject.scrPos = pbScrollBarObject.pixelArray[y];
	thumb.style.top = y + "px";				
	thumb.yPos = y;
	pbScrollBarObject.lastScrollIndex = y;
	pbScrollBarObject.thumbPosition = y;					
    
	if (y <= 1)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
		var EventPara = THUMB_MOVE + "," +  pbScrollBarObject.minimum;
		thumb.style.top = "-1px";
		thumb.yPos = 0;
		pbScrollBarObject.thumbPosition = 0;
	}
	else if (y == pbScrollBarObject.scrollLength)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
		thumb.style.top = pbScrollBarObject.scrollLength + "px";
		thumb.yPos = pbScrollBarObject.scrollLength;
		pbScrollBarObject.thumbPosition = pbScrollBarObject.scrollLength;
	}   
}

function PBScrBarMgr_DraggThumbAbove(pbScrollBarObject, widgetID, thumb, x, y)
{		
	if (y <= 1)
	{
		thumb.style.top = "-1px";
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
	}
	else if (y == pbScrollBarObject.scrollLength)
	{
		thumb.style.top = pbScrollBarObject.scrollLength + "px";
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
	}
	else
	{
		var nScrollVal;
		var nPixelNo;
	    
		for (var nPixelNo = 1; nPixelNo <= pbScrollBarObject.pixelArray.length; nPixelNo++)
		{ 
			if (pbScrollBarObject.pixelArray[nPixelNo] >= y)
			{
				pbScrollBarObject.scrPos = nPixelNo;
				pbScrollBarObject.lastScrollIndex = nPixelNo;
				break;
			}
		}
	}
	
	thumb.style.top = y + "px";
	thumb.yPos = y;
	pbScrollBarObject.thumbPosition = y;								
}

function PBScrBarMgr_VerticalScrollBarThumbDragged(pbScrollBarObject, widgetID, thumb,
													 x, y, newmx, newmy, mx, my)
{
    if (y < 1 || y > pbScrollBarObject.scrollLength)
	{
		x -= newmx - mx;
		y -= newmy - my;
		
		return false;
	}
	else
	{
		if (pbScrollBarObject.maximum < pbScrollBarObject.scrollLength)
			this.DraggThumbAbove(pbScrollBarObject, widgetID, thumb, x, y, newmx, newmy, mx, my);
		else
			this.DraggThumbBelow(pbScrollBarObject, widgetID, thumb, x, y, newmx, newmy, mx, my);
	}
}

function PBScrBar_OnMouseMove(evt)
{
	var e = PB_GetEvent(evt);
	var pbScrollBarObject =goScrBarMgr.Get(goScrBarMgr.currentScrBarID);
	var ThumbID = goScrBarMgr.currentScrBarID + THUMB_ID_SUFFIX;
	    
	var thumb  = document.getElementById(ThumbID);
	var root = document.documentElement || document.body;
	var newmx = e.pageX || e.clientX + root.scrollLeft;
	var newmy = e.pageY || e.clientY + root.scrollTop; 		   
	goScrBarMgr.x += newmx - goScrBarMgr.mx;
goScrBarMgr.y += newmy - goScrBarMgr.my;

	pbScrollBarObject.thumbDrag = true;

	if (pbScrollBarObject.orientation == HORIZONTAL)
	{
		goScrBarMgr.HorizontalScrollBarThumbDragged(pbScrollBarObject, goScrBarMgr.wcurrentScrBarID,
									 thumb, goScrBarMgr.x, goScrBarMgr.y, newmx, newmy, goScrBarMgr.mx, goScrBarMgr.my);  
	}
	else
	{		
		goScrBarMgr.VerticalScrollBarThumbDragged( pbScrollBarObject,goScrBarMgr.currentScrBarID,
									 thumb, goScrBarMgr.x, goScrBarMgr.y, newmx, newmy, goScrBarMgr.mx, goScrBarMgr.my); 
	}

	goScrBarMgr.mx = newmx;
	goScrBarMgr.my = newmy;
	thumb.style.zIndex = "10"; 

	return false;
}

function PBScrBar_OnMouseUp(evt)
{
	var pbScrollBarObject = goScrBarMgr.Get(goScrBarMgr.currentScrBarID);
  var e = PB_GetEvent(evt);
	// document.onmousemove = document.onmouseup = null;
	document.onmousemove = gDocMouseMove;
    document.onmouseup = gDocMouseUp;
	e.cancelBubble = true;   
    pbScrollBarObject.thumbDrag  =  false;
	// WebForm_DoCallback(document.getElementById(widgetID).PBUniqueID, THUMB_MOVE + 
	//     "," +  pbScrollBarObject.scrPos, ScriptCallback, null, true);
    
    __doPostBack(pbScrollBarObject.controlUniqueID,
							 THUMB_MOVE + "," +  pbScrollBarObject.scrPos);	

    return false;
}

function PBScrBarMgr_MouseDownOnThumb(evt, widgetID, thumb, how)
{
	try
	{
		  
     goScrBarMgr.currentScrBarID = widgetID;
      var e = PB_GetEvent(evt);
	    var pbScrollBarObject = this.Get(widgetID);
	    
	    if (this.RButtonDown(e, pbScrollBarObject))
			return false;
	   
	    var root = document.documentElement || document.body;	   
	    
	    this.x = thumb.xPos || (how == "relative" ? 0 : thumb.offsetLeft);
	   this.y = thumb.yPos || (how == "relative" ? 0 : thumb.offsetTop);

	    this.mx = e.pageX || e.clientX + root.scrollLeft;
	    this.my = e.pageY || e.clientY + root.scrollTop;    
    	
    	gDocMouseMove = document.onmousemove;
    	gDocMouseUp = document.onmouseup;
	    document.onmousemove = PBScrBar_OnMouseMove;
	    document.onmouseup = PBScrBar_OnMouseUp;                 
	}
    catch(ex)
    {
    } 
}

function PBScrBarMgr_MouseUpOnThumb(widgetID)
{
	try
	{
	    var pbScrollBarObject = this.Get(widgetID);
	    
	    pbScrollBarObject.thumbDrag = false;
	}
    catch(e)
    {
	 // do nothing
    }	
}

function PBScrBarMgr_FirePageEventWhenMaxIsLowerThanRange(pbScrollBarObject, widgetID, thumb, key, x, y)
{
	var thumbMousePos;
	var eventName;
		
	if (pbScrollBarObject.orientation == HORIZONTAL)	   
		thumbMousePos =  thumb.style.left;
	else
		thumbMousePos =  thumb.style.top;
	
	thumbMousePos = thumbMousePos.substr(0, thumbMousePos.length - 2);
        
	if (thumbMousePos < mouseOffSet)
	{
		pbScrollBarObject.scrPos += pbScrollBarObject.pageValue;
    	
		if ( pbScrollBarObject.scrPos >= pbScrollBarObject.maximum)
		{
			pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
			pbScrollBarObject.lastScrollIndex = pbScrollBarObject.scrollLength;
		}
		else
		{
		    pbScrollBarObject.lastScrollIndex  = pbScrollBarObject.scrPos;
		}
            	
		if (pbScrollBarObject.orientation == HORIZONTAL)	
			eventName = PAGE_RIGHT; 
		else 				 
			eventName = PAGE_DOWN;           					   	
	}
	else if (thumbMousePos > mouseOffSet)
	{
		pbScrollBarObject.scrPos -= pbScrollBarObject.pageValue;
		
		if ( pbScrollBarObject.scrPos <= pbScrollBarObject.minimum)
		{
			pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
			pbScrollBarObject.lastScrollIndex = 1;
		}
		else
		{
		    pbScrollBarObject.lastScrollIndex  = pbScrollBarObject.scrPos;
		}
            	
		if (pbScrollBarObject.orientation == HORIZONTAL)	
			eventName = PAGE_LEFT; 
		else 				 
			eventName = PAGE_UP;
	}					
	else
	{
		return false;
	}  
		        
	if (pbScrollBarObject.scrPos <= pbScrollBarObject.minimum)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
		pixelValue = 0;
	}
	else if ( pbScrollBarObject.scrPos >= pbScrollBarObject.maximum)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
		pixelValue = pbScrollBarObject.scrollLength;
	}
	else
	{
		pixelValue = pbScrollBarObject.pixelArray[pbScrollBarObject.lastScrollIndex];
	}
            
	pbScrollBarObject.thumbPosition = pixelValue;
	
	__doPostBack(pbScrollBarObject.controlUniqueID, eventName + "," + pbScrollBarObject.scrPos);
}

function PBScrBarMgr_FirePageEventWhenMaxIsHigherThanRange(pbScrollBarObject,
	widgetID, thumb, key, x, y)
{
	var thumbMousePos;
	var eventName;
	
	if (pbScrollBarObject.orientation == HORIZONTAL)	   
		thumbMousePos =  thumb.style.left;
	else
		thumbMousePos =  thumb.style.top;
		
    thumbMousePos = thumbMousePos.substr(0, thumbMousePos.length - 2);
    
	if (thumbMousePos < mouseOffSet || key == KEY_PAGE_DOWN )
	{
		pbScrollBarObject.scrPos += pbScrollBarObject.pageValue;
		
		if (pbScrollBarObject.orientation == HORIZONTAL)	
			eventName = PAGE_RIGHT; 
		else 				 
			eventName = PAGE_DOWN; 
		
	}
	else if (thumbMousePos > mouseOffSet || key == KEY_PAGE_UP)
	{
		pbScrollBarObject.scrPos -= pbScrollBarObject.pageValue;				
		
		if (pbScrollBarObject.orientation == HORIZONTAL)	
			eventName = PAGE_LEFT; 
		else 				 
			eventName = PAGE_UP; 
	}
	else
	{
		return false;
	}	
    
	if(pbScrollBarObject.scrPos <= pbScrollBarObject.minimum)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.minimum;
		pbScrollBarObject.thumbPosition = 0;   		
	}
	else if (pbScrollBarObject.scrPos >= pbScrollBarObject.maximum)
	{
		pbScrollBarObject.scrPos = pbScrollBarObject.maximum;
		pbScrollBarObject.thumbPosition = pbScrollBarObject.maximum;		
	}
	else
	{
		for (var i = 1; i <= pbScrollBarObject.pixelArray.length; i++)
		{			
			if ( pbScrollBarObject.pixelArray[i] >= pbScrollBarObject.scrPos)
			{
				pixelValue = i;	
				
				break;
			}						
		}
    	
		pbScrollBarObject.thumbPosition = pixelValue;
	}
	 			
	__doPostBack(pbScrollBarObject.controlUniqueID, eventName + "," + pbScrollBarObject.scrPos);
}

function PBScrBarMgr_FirePageEvent(e, pbScrollBarObject, widgetID,  thumb, key, x, y)
{    
    if (this.RButtonDown(e, pbScrollBarObject))
		return;	
    
    if (pbScrollBarObject.orientation == HORIZONTAL)
		mouseOffSet = x;
	else
		mouseOffSet = y;			
    
    if (pbScrollBarObject.maximum < pbScrollBarObject.scrollLength)
		this.FirePageEventWhenMaxIsLowerThanRange(pbScrollBarObject, widgetID, thumb, key, x, y);					
    else
		this.FirePageEventWhenMaxIsHigherThanRange(pbScrollBarObject, widgetID, thumb, key, x, y);		
}

//Page event for both ScrollBar and  TrackBar
function PBScrBarMgr_PageEvent(evt, widgetID, key)
{
	try
	{	  	    	   
		var e = PB_GetEvent(evt);
	    var scrBarAreaID = widgetID + SCROLL_AREA_ID_SUFFIX;
	
	    if (e.srcElement.id != undefined && e.srcElement.id != scrBarAreaID)
			return;
	    
	    goWindowManager.OnFocusOwn(widgetID);
	    
	    var pbScrollBarObject = this.Get(widgetID);
	   
	    if (!pbScrollBarObject.thumb) 
			return;
    	
	    if (pbScrollBarObject.bScrDrag) 
			return;
    	   
	    var thumb  = document.getElementById(widgetID + THUMB_ID_SUFFIX);
    	
		var root = document.documentElement || document.body;	
		var x = e.offsetX + root.scrollLeft;
		var y = e.offsetY + root.scrollLeft;
		  	
		this.FirePageEvent(e, pbScrollBarObject, widgetID, thumb, key, x, y); 
	
		pbScrollBarObject.thumbDrag = false;		  
    }
    catch(ex)
    {
		//do nothing
    }            
}

function PBScrBarMgr_MouseDownOnScrollButton(evt, widgetID, buttonObj, key)
{
	var e = PB_GetEvent(evt);
	var pbScrollBarObject = this.Get(widgetID);
	
	if (this.RButtonDown(e, pbScrollBarObject))
		return;
		
	this.ScrollButtonClicked(widgetID, key);	
	
	return false;
}

// Represents the ScrollBar or TrackBar Class defination
function PBScrollBar()
{  
    this.minimum = 0;
    this.maximum = 0;
    this.scrPos = 1;
    this.orientation =  1;
    this.scrollLength = 1;
    this.thumbDrag = false;
    this.pageValue = 0;
    this.lastScrollIndex = 1;
    this.Left = 0;
    this.Top = 0;
    this.thumbPosition = 0;
    this.pixelArray = new Array();
    this.controlUniqueID = ""
    this.lineValue = 1;
    this.type = 0;
    this.thumb = true;
}
// ScrollBar and TrackBar Manager class
function PBScrBarMgr()
{
	this.widgetID = "";	
	this.ScrollBars = new PBMap();
	this.Get = PBScrBarMgr_Get;
	this.Add = PBScrBarMgr_Add;
	this.GetIDs = PBScrBarMgr_GetIDs;
	this.Count = PBScrBarMgr_Count;
	this.Register = PBScrBarMgr_Register;
	this.KeyDownArrow = PBScrBarMgr_KeyDownArrow;
	this.KeyUpArrow = PBScrBarMgr_KeyUpArrow;
	this.KeyPageUp = PBScrBarMgr_KeyPageUp;
	this.KeyPageDown = PBScrBarMgr_KeyPageDown;
	this.KeyLeft = PBScrBarMgr_KeyLeft;
	this.KeyRight = PBScrBarMgr_KeyRight;
	this.KeyHome = PBScrBarMgr_KeyHome;
	this.KeyEnd = PBScrBarMgr_KeyEnd;
	this.SetFocus = PBScrBarMgr_SetFocus;
	this.ScrollButtonClicked =  PBScrBarMgr_ScrollButtonClicked;
	this.PageEvent = PBScrBarMgr_PageEvent;
	this.MousUpOnPage = PBScrBarMgr_MousUpOnPage;
	this.MousDownOnPage = PBScrBarMgr_MousDownOnPage;
	this.MouseUpOnThumb = PBScrBarMgr_MouseUpOnThumb;
	this.MouseDownOnThumb = PBScrBarMgr_MouseDownOnThumb;
	this.KeyDown = 	PBScrBarMgr_KeyDown;
	this.SetScrollPos = PBScrBarMgr_SetScrollPos;
	this.MouseDownOnScrollButton = PBScrBarMgr_MouseDownOnScrollButton;
	this.FirePageEvent = PBScrBarMgr_FirePageEvent;
	this.HorizontalScrollBarThumbDragged = PBScrBarMgr_HorizontalScrollBarThumbDragged; 
	this.VerticalScrollBarThumbDragged = PBScrBarMgr_VerticalScrollBarThumbDragged; 
	this.DragThumbWhenMaxIsLowerThanRange = PBScrBarMgr_DragThumbWhenMaxIsLowerThanRange;
	this.DragThumbWhenMaxIsHigherThanRange = PBScrBarMgr_DragThumbWhenMaxIsHigherThanRange;
	this.FirePageEventWhenMaxIsHigherThanRange = PBScrBarMgr_FirePageEventWhenMaxIsHigherThanRange;
	this.FirePageEventWhenMaxIsLowerThanRange = PBScrBarMgr_FirePageEventWhenMaxIsLowerThanRange;
	this.DraggThumbAbove = PBScrBarMgr_DraggThumbAbove;
	this.DraggThumbBelow = PBScrBarMgr_DraggThumbBelow;
	this.LeftOrUpScrollButtonClicked = PBScrBarMgr_LeftOrUpScrollButtonClicked;
	this.RightOrDownScrollButtonClicked = PBScrBarMgr_RightOrDownScrollButtonClicked;
	this.RButtonDown = PBScrBarMgr_RButtonDown;
	this.currentScrBarID = null;
	this.x;
	this.y;
	this.mx;
	this.my;
}

var goScrBarMgr = new PBScrBarMgr();

PB_AjaxJsLoaded();

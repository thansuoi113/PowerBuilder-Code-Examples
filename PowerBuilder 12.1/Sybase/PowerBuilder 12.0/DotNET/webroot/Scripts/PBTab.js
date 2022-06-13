/**************************************************************************
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
//**************************************************************************/

var DELIMITER = "-";
var TAB_CONTAINER_SUFFIX = "_tab_container"; 
var TABPAGE_CONTAINER_SUFFIX  = "_tabpage_container";
var TAB_SUFFIX = '_tab'
var SELECTED_TAB_INDEX = "_sti";
var VISIBLE_START_INDEX = "_vsi";
var TAB_PAGE_STATUS = "_tps";
var TAB_PAGE_INDEX = "tpi";
var RIGHT_SCROLLBUTTON_SUFFIX = "_RSB";
var LEFT_SCROLLBUTTON_SUFFIX = "_LSB";
var CLOSE_BUTTON_SUFFIX = "_TCB";
var SCROLL_BUTTON_OFFEST = 23;
var TABS_ON_TOP = 1;
var TABS_ON_LEFT = 2;
var RIGHT_CLICK = 2;
var RIGHT_CLICK_EVENT = "RightClick";
var TAB_CLICK_EVENT = "TabClick";
var TAB_SELECTED_EVENT = "TabSelected";
var TOP_TAB_HIGHLIGHTED_WIDTH = 3;
var TOP_TAB_HIGHLIGHTED_HEIGHT = 3;
var TOP_TAB_HIGHLIGHTED_HEIGHT_CORRECTION = 0;
var TAB_BORDER = "TabBorder";
var TAB_BORDER_WIDTH_COREECTION = 5;
var TAB_BORDER_HEIGHT_COREECTION = 6;
var LEFT_OFFSET = 2;
var FIRST_TAB_LABEL_CLOSE_BTN_COR = 5;
var FOCUS_RECT_BORDER_COLOR = "#A9A9A9";
var TAB_LABEL_Z_INDEX = 14;
var CLASSIC = 1;
var XP = 2;
var CLOSE_BTN_SELECTED_OFFSET = 4;
var TAB_CLOSE_BUTTON_WIDTH = 18;
/****************************  Tab Class definition ************************/
function PBTab()
{
    this.tabLabelsList = new Array();
    this.visbleStartIndex = 0;
    this.selectedTabIndex = 0;
    this.isTabBarLonger = false;
    this.widgetID = null;
    this.controlUniqueID  = "";
    this.noOfTabPages = 0;
    this.noOfTabRows = 1;
    this.controlWidth = 0;
    this.tps = "e";//tps = TabPageStatus
    this.boldSelectedText = false;
    this.currentTabRowSequence = new Array(); 
    this.tabsPosition = TABS_ON_TOP;
    /*Safe side we maintain this variable, to prevent the clicked event being triggered
    * after SelectionChanged event	 
	*/
    this.isSelectionEventFired = false;
}

function TabBox()
{
    label = "";
    width = 0;
    title = 0;
    color = "";
    height = 0;
    fontWeight = "normal";
    X = 0;
    Y = 0;
    rowIndex = 1;
    boldLabelWidth = 0;
    tabPageIndex = 0;
    backGroundImage = "";
    backGroundPos = "";
    disabled = "false";
}
/****************************************************************************/
function PBTabManager_OnTabLeftScrollClicked(evt, widgetID)
{
	var pbTabObject = this.Get(widgetID);
	
	var noOfTabs = pbTabObject.tabLabelsList.length; 	   	
   
	if (pbTabObject.visbleStartIndex <= 0)
	 return;

	if (pbTabObject.isTabBarLonger == true)
	{
		if (pbTabObject.visbleStartIndex > 0)// visbleStartIndex shouldn't be negative.
			pbTabObject.visbleStartIndex--; 
	}
	
	for (var i = 0; i < pbTabObject.noOfTabPages; i++)
    {   		
	    var tabLabelID  = widgetID + "_" + i;
		
		var tabLabelObj = document.getElementById(tabLabelID);			
		
		var attribute  = widgetID  + TAB_SUFFIX;			
		var showIndex  = i + pbTabObject.visbleStartIndex;
		var tabLabel = null;
		
		if (showIndex > pbTabObject.noOfTabPages) 
			break;
       
		try
		{             
			tabLabel = pbTabObject.tabLabelsList[showIndex].label;
		}
		catch(ex){}

		if(tabLabel == null)  
		{
			tabLabelObj.style.visibility = "hidden";
		}
		else
		{
			tabLabelObj.innerHTML = tabLabel;
			tabLabelObj.style.width =  pbTabObject.tabLabelsList[showIndex].width;
			tabLabelObj.style.height =  pbTabObject.tabLabelsList[showIndex].height;
			
			if (i > 0) 
			{
				if (pbTabObject.tabsPosition == TABS_ON_TOP)
					tabLabelObj.style.left = this.GetOffset(pbTabObject.visbleStartIndex, 
					showIndex , pbTabObject, pbTabObject.tabLabelsList[showIndex].rowIndex, "left");	
				else	
					tabLabelObj.style.top = this.GetOffset(pbTabObject.visbleStartIndex,
					 showIndex , pbTabObject, pbTabObject.tabLabelsList[showIndex].rowIndex, "top");	
			}
			
			tabLabelObj.style.color = pbTabObject.tabLabelsList[showIndex].color;
			tabLabelObj.title = pbTabObject.tabLabelsList[showIndex].title;
			tabLabelObj.style.backgroundRepeat="no-repeat";
			
			
			if (pbTabObject.tabLabelsList[showIndex].backGroundPos!= undefined && pbTabObject.tabLabelsList[showIndex].backGroundPos != "")
			   tabLabelObj.style.backgroundPosition = pbTabObject.tabLabelsList[showIndex].backGroundPos;
			    
			tabLabelObj.disabled = pbTabObject.tabLabelsList[showIndex].disabled;
			tabLabelObj.style.backgroundImage = pbTabObject.tabLabelsList[showIndex].backGroundImage;
		    tabLabelObj.blw = pbTabObject.tabLabelsList[showIndex].boldLabelWidth;
		    tabLabelObj.tps = pbTabObject.tabLabelsList[showIndex].tps;			
			tabLabelObj.setAttribute(TAB_PAGE_INDEX,   pbTabObject.tabLabelsList[showIndex ].tabPageIndex);			
			tabLabelObj.style.visibility = "visible";
		}		
	}  
	
	var selctedIndexOffset = pbTabObject.selectedTabIndex - pbTabObject.visbleStartIndex;
	
	if (selctedIndexOffset < 0) 
		return; 				
	
	this.SetSelctedStyle(widgetID, selctedIndexOffset);     
 }

 function PBTabManager_OnTabRightScrollClicked(evt, widgetID)
 {
	var pbTabObject = this.Get(widgetID);
    
    var noOfTabs = pbTabObject.tabLabelsList.length; 	   
	 
    if (pbTabObject.visbleStartIndex > noOfTabs - 2)
		 return;
   
    if (pbTabObject.isTabBarLonger == true)   
		pbTabObject.visbleStartIndex++;  
	
	for (var i = 0; i < pbTabObject.noOfTabPages; i++)
    {   			  
	   var tabLabelID  = widgetID + "_" + i;
	   
	   var tabLabelObj = document.getElementById(tabLabelID);    
       
       var showIndex  = i + pbTabObject.visbleStartIndex;
	   var tabLabel = null;
       
       try
       {            
			tabLabel = pbTabObject.tabLabelsList[showIndex ].label;
	   }
	   catch(ex)
	   {
			// do nothing
	   }
       
        if(tabLabel == null)
        {
			tabLabelObj.style.visibility = "hidden";
			tabLabelObj.style.zIndex = -1;
		}				
		else
		{
			tabLabelObj.innerHTML = tabLabel;
			tabLabelObj.style.width = pbTabObject.tabLabelsList[showIndex].width;	
			tabLabelObj.style.height =  pbTabObject.tabLabelsList[showIndex].height;
				
			if (showIndex > 0 && i > 0)
			{ 				
				if (pbTabObject.tabsPosition == TABS_ON_TOP)
				{
					tabLabelObj.style.left = this.GetOffset(pbTabObject.visbleStartIndex, 
					showIndex, pbTabObject, pbTabObject.tabLabelsList[showIndex].rowIndex, "left");
				}								
				else
				{
					tabLabelObj.style.top = this.GetOffset(pbTabObject.visbleStartIndex,
					showIndex, pbTabObject, pbTabObject.tabLabelsList[showIndex].rowIndex, "top");
				}
			}										
			
			tabLabelObj.style.color = pbTabObject.tabLabelsList[showIndex ].color;
			tabLabelObj.title = pbTabObject.tabLabelsList[showIndex ].title;
			tabLabelObj.style.backgroundRepeat="no-repeat";
			if (pbTabObject.tabLabelsList[showIndex].backGroundPos != undefined && pbTabObject.tabLabelsList[showIndex ].backGroundPos != "")
			    tabLabelObj.style.backgroundPosition = pbTabObject.tabLabelsList[showIndex].backGroundPos;
			tabLabelObj.disabled = pbTabObject.tabLabelsList[showIndex ].disabled;
			tabLabelObj.style.backgroundImage  = pbTabObject.tabLabelsList[showIndex].backGroundImage;
			tabLabelObj.blw = pbTabObject.tabLabelsList[showIndex].boldLabelWidth;		
			tabLabelObj.style.visibility = "visible";			
			tabLabelObj.setAttribute(TAB_PAGE_INDEX, pbTabObject.tabLabelsList[showIndex ].tabPageIndex);
			tabLabelObj.tps = pbTabObject.tabLabelsList[showIndex].tps;
		}				    
	}
     
	var selctedIndexOffset = pbTabObject.selectedTabIndex - pbTabObject.visbleStartIndex;
	
	this.SetSelctedStyle(widgetID, selctedIndexOffset);
}

function PBTabManager_PrepareDataForPost(pbTabObject, selectedTabIndex)
{
	var postData = "";
	
	for (var i = 0; i < pbTabObject.noOfTabRows; i++)
		postData += pbTabObject.currentTabRowSequence[i] + DELIMITER;
	// remove the last DELIMITER	
	postData = postData.substr(0, postData.length - 1);
	
	return postData;		
}

/*************************** Postback functions **************************/
function PBTabManager_OnTabBarClicked(evt, widgetID, focus, tabObject)
{	
	//for the sheetTab
	if (!focus) 
	    return;
	
	var pbTabObject = this.Get(widgetID);
   
	goWindowManager.OnFocusOwn(widgetID);
	/* we canceled the event by "event.cancelBubble = true" to not to escalate the event after Tab 
	 * SelectionChanged event fired, safe side just double check.
	 */ 
	if (pbTabObject.isSelectionEventFired == true) 
		return;
	
	document.getElementsByName(widgetID + SELECTED_TAB_INDEX)[0].value = pbTabObject.selectedTabIndex;
	
	document.getElementsByName(widgetID + VISIBLE_START_INDEX)[0].value = pbTabObject.visbleStartIndex;
	
	var argument = ""; 
	
	var e = PB_GetEvent(evt);
	if (e.button == RIGHT_CLICK)
	     argument = RIGHT_CLICK_EVENT + "," + "-1";
	else	     
	     argument = TAB_CLICK_EVENT + "," + "-1";    
	
	__doPostBack(pbTabObject.controlUniqueID, argument);
}
  
function PBTabManager_OnTabClicked(evt, widgetID, focus, tabObject)
{
	var selectedTabIndex = tabObject.getAttribute(TAB_PAGE_INDEX);	
	var tabBar  = document.getElementById(widgetID);
	var pbTabObject = this.Get(widgetID);
	var e = PB_GetEvent(evt);

	if (typeof(goPictureListBoxManager) != "undefined")
	{
		goPictureListBoxManager.HideDropDown(evt, true);
	}

	if (focus)
	{
		goWindowManager.OnFocusOwn(widgetID);
	}
	else
	{
		if (pbTabObject.selectedTabIndex == selectedTabIndex)
			return;
	}
		
	if (!focus)
	{
		goWindowManager.SheetTabCallBack(evt, selectedTabIndex);
	}	
	var argument = "";	
	if (e.button == RIGHT_CLICK)
	{
	     //Right click is not for SheetTab
	     if (!focus)
			return;
	     argument = RIGHT_CLICK_EVENT + ","	 + selectedTabIndex;
	}
	else
	{
		if (tabObject.getAttribute("tps") == "e")
		{
			document.getElementsByName(widgetID + SELECTED_TAB_INDEX)[0].value = selectedTabIndex;
			document.getElementsByName(widgetID + TAB_PAGE_STATUS)[0].value = "e";
			argument = TAB_SELECTED_EVENT + ",";
		}
		else
		{// if tabpage is disabled, then Tab clicked event is fired.
			document.getElementsByName(widgetID + TAB_PAGE_STATUS)[0].value = "d";
			argument = TAB_CLICK_EVENT + ",";
		}		  		 
		 
		if (pbTabObject.noOfTabRows > 1)
		{
			var postData = this.PrepareDataForPost(pbTabObject, selectedTabIndex);
			
			document.getElementsByName(widgetID + VISIBLE_START_INDEX)[0].value = postData;
		}
		else
		{
			document.getElementsByName(widgetID + VISIBLE_START_INDEX)[0].value  = 
			pbTabObject.visbleStartIndex;			
		}		 	 
		
		argument = argument + selectedTabIndex;
	}        
	
	pbTabObject.isSelectionEventFired = true;
	PB_ShowMask();
	__doPostBack(pbTabObject.controlUniqueID, argument);	
	e.cancelBubble = true;
	PB_HideMask();
} 

/************************************************************************/

function PBTabManager_SwapTabRows(widgetID, tabRowIndex)
{
	var pbTabObject = this.Get(widgetID);
	
	var tabRowOffset;	
	
	var virtualTabRowIndex = this.GetVirtualTabRowNumber(pbTabObject, tabRowIndex); 
	//last TabRow has been clicked
	if (virtualTabRowIndex == pbTabObject.noOfTabRows - 1)
		return;
	
	var virtualBottomTabRowIndex = pbTabObject.currentTabRowSequence[pbTabObject.noOfTabRows - 1];
	
	for (var i = 0; i < pbTabObject.noOfTabPages; i++)
    {   			  
	   var tabLabelID  = widgetID + "_" + i;
	   
	   var tabLabelObj = document.getElementById(tabLabelID);
	   
	   var rowIndex = tabLabelObj.getAttribute("rowIndex");
	   
	   if (tabRowIndex == rowIndex)
	   {				
			tabRowOffset = this.GetTabRowOffset(pbTabObject.noOfTabRows - 1,
											 pbTabObject.tabLabelsList, "top");		
			tabLabelObj.style.top = tabRowOffset;
			tabLabelObj.style.zIndex = pbTabObject.noOfTabRows - 1;		
	   }
	   else if(rowIndex == virtualBottomTabRowIndex)
	   {
			tabRowOffset = this.GetTabRowOffset(virtualTabRowIndex, 
											pbTabObject.tabLabelsList, "top");		
			tabLabelObj.style.top = tabRowOffset;		
	   }
	   else
	   {
			// do nothing
	   }
	}
	
	pbTabObject.currentTabRowSequence[virtualTabRowIndex ] = virtualBottomTabRowIndex;	// store the bottom row 
	pbTabObject.currentTabRowSequence[pbTabObject.noOfTabRows - 1] = tabRowIndex;
}
  
function PBTabManager_HighlightMultiRowTabItem(widgetID, selectedIndex)
{     
    var pbTabObject = this.Get(widgetID);
    
    var tabRowTopOffset;
    var tabRowLeftOffset;
  
    for (var i = 0 ; i < pbTabObject.noOfTabPages; i++)
    {   			    
	    var tabLabelID  = widgetID + "_" + i;
	    
	    var tabLabelObj = document.getElementById(tabLabelID);
	   
	    var tabPageID = widgetID + TABPAGE_CONTAINER_SUFFIX;
		
		var tabPageObj = document.getElementById(tabPageID);
		
		var selectedTabIndex = tabLabelObj.getAttribute(TAB_PAGE_INDEX);		
		var rowIndex = tabLabelObj.getAttribute("rowIndex");
				
		if (selectedTabIndex == selectedIndex)
		{			
			tabPageObj.style.zIndex = 6;
			tabLabelObj.style.zIndex = TAB_LABEL_Z_INDEX;
			tabRowLeftOffset = this.GetOffsetBasedOnTabIndex(pbTabObject,
				selectedIndex, "left");
			
			if (tabRowLeftOffset > 0)
				tabLabelObj.style.left = tabRowLeftOffset - 3;
			
			if (tabRowLeftOffset + pbTabObject.tabLabelsList[i].width < pbTabObject.controlWidth)
			{
				if (pbTabObject.boldSelectedText == true)
					tabLabelObj.style.width = pbTabObject.tabLabelsList[selectedTabIndex].width + 3;
				else				
					tabLabelObj.style.width = pbTabObject.tabLabelsList[selectedTabIndex].width + 3;
			}
			else
			{
				tabLabelObj.style.width = pbTabObject.tabLabelsList[selectedTabIndex].width + 3;
			}
				
			tabRowTopOffset = this.GetTabRowOffset(pbTabObject.noOfTabRows - 1, 
													pbTabObject.tabLabelsList, "top");
			tabLabelObj.style.top = tabRowTopOffset - 3;
			
			if (this.Theme == XP)
				tabLabelObj.style.height = pbTabObject.tabLabelsList[i].height + 2;
			else
				tabLabelObj.style.height = pbTabObject.tabLabelsList[i].height + 3;
			   
			if (pbTabObject.boldSelectedText ==  true) 
				tabLabelObj.style.fontWeight = "bold";	
			
			tabLabelObj.className = "Top_SelectedTab";
			
			this.DecorateSelectedTab(widgetID, false, true);	
		}		
		else  
		{					 
			tabRowTopOffset = this.GetTabRowOffset(this.GetVirtualTabRowNumber(pbTabObject, rowIndex),
													pbTabObject.tabLabelsList, "top");
			
			var ro = this.GetVirtualTabRowNumber(pbTabObject, rowIndex); 						
			
			tabLabelObj.style.zIndex = ro;
			 
			 tabLabelObj.className = "Top_DefaultTab";	
			 tabRowLeftOffset = this.GetOffsetBasedOnTabIndex(pbTabObject, i, "left");
			
			 if (tabRowLeftOffset <= 0)
			 {
				tabLabelObj.style.left = tabRowLeftOffset  + LEFT_OFFSET;
				tabLabelObj.style.width = pbTabObject.tabLabelsList[i].width - LEFT_OFFSET;
			 }
			else
			{
				tabLabelObj.style.left = tabRowLeftOffset; 				
				tabLabelObj.style.width = pbTabObject.tabLabelsList[i].width;
			}
			
			tabLabelObj.style.height = pbTabObject.tabLabelsList[i].height;
			tabLabelObj.style.fontWeight = pbTabObject.tabLabelsList[i].fontWeight;
			tabLabelObj.style.top = tabRowTopOffset;
			
			this.DecorateTabLabel(pbTabObject, tabLabelObj, false, false, null);	
		}		
	}				          
 }

function PBTabManager_GetData(widgetID)
{
	this.widgetID = widgetID;
	var pbTabObject = this.Get(widgetID);
	this.tabLabelsList  = pbTabObject.tabLabelsList;
	this.visbleStartIndex = pbTabObject.visbleStartIndex;
	this.selectedTabIndex = pbTabObject.selectedTabIndex;
	this.noOfTabPages = pbTabObject.noOfTabPages;
	this.tabsPosition  = pbTabObject.tabsPosition;
	this.noOfTabRows   = pbTabObject.noOfTabRows;
	this.currentTabRowSequence = pbTabObject.currentTabRowSequence; 
	this.boldSelectedText =  pbTabObject.boldSelectedText;
	this.isTabBarLonger =  pbTabObject.isTabBarLonger;
}

function PBTabManager_Get(strID)
{
	return this.Tabs.Get(strID);
}

function PBTabManager_Add(strID, pbTabObject)
{
	this.Tabs.Put(strID, pbTabObject);
}

function PBTabManager_GetIDs()
{
	return this.Tabs.KeySet();
}

function PBTabManager_Count() 
{
	return this.Tabs.Size();
}

function PBTabManager_SetTabOfTopTabsDefault(tabLabelObj, extraBoldValue, showIndex, widgetID, index)
{	
	var pbTabObject = this.Get(widgetID);
	
	tabLabelObj.className = "Top_DefaultTab";
	tabLabelObj.style.zIndex = 0;
	//tabLabelObj.style.width = pbTabObject.tabLabelsList[showIndex].width;
	var rowIndex = tabLabelObj.getAttribute("rowIndex");				
	var left = this.GetOffset(pbTabObject.visbleStartIndex, showIndex, pbTabObject, rowIndex, 
																		"left");	
	var tao = pbTabObject.tabLabelsList[showIndex];
	if (left <= 0)
	{
		tabLabelObj.style.left = left + extraBoldValue + LEFT_OFFSET;
		tabLabelObj.style.width = tao.width;
	}	
	else
	{
		var l = left + tao.boldLabelWidth + tao.width;
		var w = tao.width;
		var d = l - pbTabObject.controlWidth;	
		if (pbTabObject.isTabBarLonger == false && d > 0)
			w -= d;				
		tabLabelObj.style.left = left + extraBoldValue;
		tabLabelObj.style.width = w;
	}
		
	tabLabelObj.style.top  = tao.Y;				
	tabLabelObj.style.height = tao.height; 
	tabLabelObj.style.fontWeight = tao.fontWeight;	
	this.DecorateTabLabel(pbTabObject, tabLabelObj, false, false, null);	  
}

function PBTabManager_SetTabOfTopTabsSelected(tabLabelObj, showIndex, widgetID, 
															selectedIndex, index) 
{		
	var pbTabObject = this.Get(widgetID);
	tabLabelObj.style.zIndex = TAB_LABEL_Z_INDEX;
	tabLabelObj.className = "Top_SelectedTab";
	
	var heightCorr = TOP_TAB_HIGHLIGHTED_HEIGHT;
	
	if (this.Theme != XP)
	    heightCorr - 1;
	    
	tabLabelObj.style.top = pbTabObject.tabLabelsList[pbTabObject.selectedTabIndex].Y  - heightCorr;
	var rowIndex = tabLabelObj.getAttribute("rowIndex");	
	var left = this.GetOffset(pbTabObject.visbleStartIndex, showIndex , pbTabObject, rowIndex, 	"left");		
    var selTabLabel = pbTabObject.tabLabelsList[pbTabObject.selectedTabIndex];	

	
	if (left <= 0)
	{
		tabLabelObj.style.left = left + 1;
		tabLabelObj.style.width = selTabLabel.width + selTabLabel.boldLabelWidth + TOP_TAB_HIGHLIGHTED_WIDTH - 1;
	}
	else
	{
		tabLabelObj.style.left = left - TOP_TAB_HIGHLIGHTED_WIDTH;	
	
		if (left + selTabLabel.width  + 7 < pbTabObject.controlWidth )
		{
			tabLabelObj.style.width = selTabLabel.width + selTabLabel.boldLabelWidth + 7;
	    }	   	
		else
		{	
		    if (left + selTabLabel.width + TOP_TAB_HIGHLIGHTED_WIDTH + 1 >= pbTabObject.controlWidth
		        && pbTabObject.isTabBarLonger == false)
			    tabLabelObj.style.width = pbTabObject.controlWidth - left + 3;
			else	
		        tabLabelObj.style.width = selTabLabel.width + selTabLabel.boldLabelWidth 
		                                  + TOP_TAB_HIGHLIGHTED_WIDTH;
		}
	}	
	
    var clsBtnID =widgetID + CLOSE_BUTTON_SUFFIX;   
    var clsBtn = document.getElementById(clsBtnID);
   
   // null for non sheet tab
   if (clsBtn != null )
   {
       var corr = 0;
       
       // first tab label width is always little smaller so adjust it, otherwise the margin to the next tab label very low.
       if (left  <= 0)
          corr = FIRST_TAB_LABEL_CLOSE_BTN_COR;
       
        var clsBtnLeft = clsBtn.style.left;
        clsBtn.style.left = parseInt( selTabLabel.width)   + selTabLabel.boldLabelWidth - TAB_CLOSE_BUTTON_WIDTH - corr ;
    }	

	 var tabPageID = widgetID + TABPAGE_CONTAINER_SUFFIX;
	 var correction;
	 var tabLabelHeight = tabLabelObj.style.height;
	 var tabPageObj = document.getElementById(tabPageID);
	 
	 if (tabPageObj != null && tabPageObj != undefined) 
	 {
		var tabPageTop = tabPageObj.style.top;
	    tabLabelHeight = parseInt(tabPageTop.substr(0, tabPageTop.length - 2)) + TOP_TAB_HIGHLIGHTED_HEIGHT;
	 } 
	 
	 if (this.Theme == XP)
		tabLabelObj.style.height = tabLabelHeight - 1;
     else
		tabLabelObj.style.height = pbTabObject.tabLabelsList[selectedIndex].height
	                            + heightCorr;            
	
	if (pbTabObject.boldSelectedText == true) 
		tabLabelObj.style.fontWeight = "bold";	
		
	this.DecorateSelectedTab(widgetID, false, true);	
}

function PBTabManager_SetTabOfLeftTabsSelected(tabLabelObj, showIndex, widgetID, 
															selectedIndex, index) 
{		
	var pbTabObject = this.Get(widgetID);
	tabLabelObj.style.zIndex = TAB_LABEL_Z_INDEX;
	tabLabelObj.className = "Left_SelectedTab";
	tabLabelObj.style.left = pbTabObject.tabLabelsList[showIndex].X;
	sTLO = pbTabObject.tabLabelsList[pbTabObject.selectedTabIndex];
	
	if (this.Theme == XP)
		tabLabelObj.style.width = sTLO.width - 1;
	else
		tabLabelObj.style.width = sTLO.width;
	
	var rowIndex = tabLabelObj.getAttribute("rowIndex");	
	var top = this.GetOffset(pbTabObject.visbleStartIndex, showIndex, 
						     pbTabObject, rowIndex, "top");			
	if (index == 0)
		tabLabelObj.style.top = top;
	else
		tabLabelObj.style.top = top - LEFT_OFFSET;	
	
	tabLabelObj.style.height = sTLO.height + 2 * LEFT_OFFSET;	
	if (pbTabObject.boldSelectedText == true)
		 tabLabelObj.style.fontWeight = "bold";	
		 
	this.DecorateSelectedTab(widgetID, false, true);			
}

function PBTabManager_SetTabOfLeftTabsDefault(tabLabelObj, extraBoldValue, showIndex, pbTabObject, index)
{	
	tabLabelObj.style.left = pbTabObject.tabLabelsList[showIndex].X;		
	tabLabelObj.className = "Left_DefaultTab";
	tabLabelObj.style.zIndex = 0;
	tabLabelObj.style.width = pbTabObject.tabLabelsList[showIndex].width;
	var rowIndex = tabLabelObj.getAttribute("rowIndex");						
	
	var top = this.GetOffset(pbTabObject.visbleStartIndex, showIndex , pbTabObject, rowIndex,
																		 "top");	
	tabLabelObj.style.top = top;		
	tabLabelObj.style.height = pbTabObject.tabLabelsList[showIndex].height + extraBoldValue;
	tabLabelObj.style.fontWeight = pbTabObject.tabLabelsList[showIndex].fontWeight;     
}

function PBTabManager_SetSelctedStyle(widgetID, selectedIndex)
{     
    var pbTabObject = this.Get(widgetID);
  
    for (var i = 0 ; i < pbTabObject.noOfTabPages; i++)
    {   		
	    var showIndex = i + pbTabObject.visbleStartIndex;	
	    
	    if ( showIndex < 0 || showIndex >= pbTabObject.noOfTabPages) 
			return; 
	    
	    var tabLabelID  = widgetID  + "_" + i;
	   
	    var tabLabelObj = document.getElementById(tabLabelID);
	   
	    var tabPageID = widgetID + TABPAGE_CONTAINER_SUFFIX;
		
		var tabPageObj = document.getElementById(tabPageID);
		
		if (i == selectedIndex)
		{			
			tabPageObj.style.zIndex = 6;
			
			if (pbTabObject.tabsPosition == TABS_ON_TOP)
			{ 
				this.SetTabOfTopTabsSelected(tabLabelObj, showIndex, widgetID, 
																selectedIndex, i);			
			}
			else if (pbTabObject.tabsPosition == TABS_ON_LEFT)
			{ 
				this.SetTabOfLeftTabsSelected(tabLabelObj, showIndex, widgetID, 
															selectedIndex, i);			
			}
			else
			{
			}
		}
		else
		{
			var extraBoldValue = 0;
			
			if (selectedIndex < i && selectedIndex >= 0)
			   extraBoldValue = pbTabObject.tabLabelsList[selectedIndex].boldLabelWidth;
			else 
			   extraBoldValue = 0;	
			
			if (pbTabObject.tabsPosition == TABS_ON_TOP)
				this.SetTabOfTopTabsDefault(tabLabelObj, extraBoldValue, showIndex, widgetID, i);			
			else if (pbTabObject.tabsPosition == TABS_ON_LEFT) 
				this.SetTabOfLeftTabsDefault(tabLabelObj, extraBoldValue, showIndex, pbTabObject, i);
		}
	}					          
}

function PBTabManager_Register(controlUniqueID, widgetID, controlWidth, selIndex,
	visbleStartIndex, isTabBarLonger, noOfTabPages,
	tabsPosition, noOfTabRows, boldSelectedText, theme)
{
    var pbTabObject = new PBTab();
    this.Theme = theme;
    pbTabObject.controlUniqueID = controlUniqueID;
    pbTabObject.controlId = widgetID;
    pbTabObject.selectedTabIndex  = selIndex;
    pbTabObject.noOfTabPages = noOfTabPages;
    pbTabObject.tabsPosition = tabsPosition;
    pbTabObject.noOfTabRows = noOfTabRows;
    pbTabObject.controlWidth  = controlWidth;
    pbTabObject.boldSelectedText = boldSelectedText;
     
    if (isTabBarLonger == true)
    {
		 if (selIndex >= 0)
			pbTabObject.visbleStartIndex =  visbleStartIndex - 1;
	}
	else
	{
		pbTabObject.visbleStartIndex = 0;  
	} 
    
    pbTabObject.isTabBarLonger = isTabBarLonger;
   
    this.Add(widgetID, pbTabObject);
        	
    for (var i = 0; i < noOfTabPages; i++)
    {   		
		var tabLabelID  = widgetID  + "_" + i;
		
		var tabLabel = document.getElementById(tabLabelID);		
		
		var oTabBox = new TabBox();	
		
		oTabBox.label = tabLabel.innerHTML;
		oTabBox.rowIndex = parseInt(tabLabel.getAttribute("rowIndex"));
		oTabBox.tabPageIndex = parseInt(tabLabel.getAttribute(TAB_PAGE_INDEX));
		oTabBox.width = parseInt(tabLabel.style.width.substr(0, 
											tabLabel.style.width.length - 2));
		oTabBox.height = parseInt(tabLabel.style.height.substr(0, 
											tabLabel.style.height.length - 2));
		oTabBox.X =  parseInt(tabLabel.style.left.substr(0, 
											tabLabel.style.left.length - 2));	
		oTabBox.Y = parseInt(tabLabel.style.top.substr(0, 
											tabLabel.style.top.length - 2));
		oTabBox.color = tabLabel.style.color;
		oTabBox.title = tabLabel.title;
		oTabBox.fontWeight = tabLabel.style.fontWeight;
		oTabBox.disabled = tabLabel.disabled;
		oTabBox.backGroundImage = tabLabel.style.backgroundImage;
		oTabBox.boldLabelWidth	= parseInt(tabLabel.getAttribute("blw"));
		oTabBox.backGroundPos = tabLabel.style.backgroundPosition; 

		oTabBox.tps = tabLabel.tps;
		pbTabObject.tabLabelsList[i] = oTabBox;		
	}
     	 
    if (selIndex >= 0 && isTabBarLonger == true)
    {
        this.OnTabRightScrollClicked(g_dummyWindowEvent, widgetID);		
	}
				
	if (noOfTabRows == 1)
	{
		this.SetSelctedStyle(widgetID, selIndex - visbleStartIndex); 
	}	
	else
	{	
		// for the multi Tabrow tab control we use 'widgetID + "_visible_start_index" '( hidden
		// field ) to store the tab row sequence.
		var value  = document.getElementsByName(widgetID + VISIBLE_START_INDEX)[0].value;
		
		if (value  != "0")
		{
			pbTabObject.currentTabRowSequence = value.split(DELIMITER);
		}
		else
		{			  
			for (var i = 0; i < noOfTabRows; i++)
				pbTabObject.currentTabRowSequence[i] = i;
		}
		
		if (selIndex >= 0)
		{
			this.SwapTabRows(widgetID, pbTabObject.tabLabelsList[selIndex].rowIndex);
		
			this.HighlightMultiRowTabItem(widgetID, selIndex);	
		}
	}
}

function PBTabManager_GetOffset(startIndex, endIndex, pbTabObject, rowIndex, offsetType)
{
	var offset = 0;
	
	for (var i = startIndex; i < endIndex; i++)
	{					
		if (pbTabObject.tabLabelsList[i].rowIndex == rowIndex)
		{
			if (offsetType == "left")
			{		
				if (pbTabObject.noOfTabRows > 1)
					offset  += pbTabObject.tabLabelsList[i].width;
				else
					offset  += pbTabObject.tabLabelsList[i].width + 1;
			}
			else if(offsetType == "top")
			{
				offset += pbTabObject.tabLabelsList[i].height;
			}
		}		
	}
	
	return offset;
}

function PBTabManager_GetTabInfoObject(tabName, tabLabelsList)
{
	var left = 0;
	
	for (var i = 0; i < tabLabelsList; i++)
	{
		if (tabName == tabLabelsList[i].label)
		{
			return tabLabelsList[i];
		}
	} 
}

function PBTabManager_GetTabRowOffset(tabRowNumber, tabLabelsList,
														 offsetType)
{
	var offset = 0;
	
	for (var i = 0; i < tabLabelsList.length; i++)
	{					
		if (tabLabelsList[i].rowIndex == tabRowNumber)
		{
			if (offsetType == "left")			
				return tabLabelsList[i].X;
			else if(offsetType == "top")
				return tabLabelsList[i].Y;
		}		
	}
	
	return offset;
}

function PBTabManager_GetOffsetBasedOnTabIndex(pbTabObject, tabPageIndex, 
														offsetType)
{
	for (var i = 0; i < pbTabObject.tabLabelsList.length; i++)
	{					
		if (i == tabPageIndex)
		{
			if (offsetType == "left")			
				return pbTabObject.tabLabelsList[i].X;
			else if(offsetType == "top")
				return pbTabObject.tabLabelsList[i].Y;
		}		
	}
	
	return 0;
}

function PBTabManager_GetVirtualTabRowNumber(pbTabObject, rowIndex)
{	
	 for (var i = 0; i < pbTabObject.currentTabRowSequence.length; i++)
		if (pbTabObject.currentTabRowSequence[i] == rowIndex) 
			return i;
}

function PBTabManager_SetScrollButtonsVisibility(widgetID, value, left, top)
{
  var scrollButtonID = widgetID + RIGHT_SCROLLBUTTON_SUFFIX;
  var scrollButtonObj;
  
  scrollButtonObj = document.getElementById(scrollButtonID);
 
  scrollButtonObj.style.visibility = value;
  scrollButtonObj.style.left = left - SCROLL_BUTTON_OFFEST;
  scrollButtonObj.style.top = top;
  scrollButtonObj.style.zIndex = 999; 	
  scrollButtonID = widgetID + LEFT_SCROLLBUTTON_SUFFIX;
 
  scrollButtonObj = document.getElementById(scrollButtonID);
  
  scrollButtonObj.style.visibility = value;
  scrollButtonObj.style.left = left - 2 * SCROLL_BUTTON_OFFEST;
  scrollButtonObj.style.top = top;
  scrollButtonObj.style.zIndex = 999;
}

function PBTabManager_GetTabBarSize(widgetID)
{
  var tabPageContainerID = widgetID + TABPAGE_CONTAINER_SUFFIX;
  var tabPageContainerObject = document.getElementById(tabPageContainerID);

  return tabPageContainerObject.getAttribute("TabBarWidth");  
}

function PBTabManager_LostFocus(widgetID)
{    
    try
    {      
        var pbTabObject = this.Get(widgetID);      
        var tabLabelID  = widgetID  + "_" + 
						  (pbTabObject.selectedTabIndex - pbTabObject.visbleStartIndex);
		var tabBorderID = 	tabLabelID + TAB_BORDER;
		var tabBorderObj = document.getElementById(tabBorderID);
		
		if (tabBorderObj != null && tabBorderObj != undefined)
		{	               
      		var tabLabelObj = document.getElementById(tabLabelID);	
      		tabBorderObj.style.borderStyle = "none";		
		}			  
	}
	catch(e){}	   	
}

function PBTabManager_DecorateTabLabel(pbTabObject, tabLabelObj, focus, selected, tabBorderID)
{	
    var width = parseInt(tabLabelObj.style.width.substr(0, 
                     (tabLabelObj.style.width.length - 2)));
                     	
    var height = parseInt(tabLabelObj.style.height.substr(0, 
                     (tabLabelObj.style.height.length - 2)));

	if (isNaN(width) || isNaN(height))
		return;
	
	if (width > TAB_BORDER_WIDTH_COREECTION)
		width = width - TAB_BORDER_WIDTH_COREECTION;
	
	if (height > TAB_BORDER_HEIGHT_COREECTION)
		height = height - TAB_BORDER_HEIGHT_COREECTION;		 
    
    var tbDiv = "";
    
    if (this.Theme == XP)
    {				
		if (pbTabObject.tabsPosition == TABS_ON_TOP)
		{				
			if (selected == true)
			{
				tbDiv = tbDiv + "<div class=SelTabLeftCorner></div>";
		   
				tbDiv = tbDiv + "<div class=SelTabRightCorner style=\"left:" +
				(parseInt(width) + 1) + "px;\"></div>";
      
				tbDiv = tbDiv + "<div class=SelTabTop style=\"width:" +
				( parseInt(width) + 1) + "px;\"></div>";
		     }
		     else if (selected == false)
		     {
				tbDiv = tbDiv + "<div class=DefaultTabLeftCorner></div>";		   
				tbDiv = tbDiv + "<div class=DefaultSelTabRightCorner style=\"left:" +
				(parseInt(width) - 2) + "px;\"></div>";		     
		     }
		     else
		     {
		      //do nothing
		     
		     }
		}
		else
		{
			tbDiv = tbDiv + "<div class=SelLeftTabTopCorner></div>";
	   
			tbDiv = tbDiv + "<div class=SelLeftTabBottomCorner style=\"top:" +
			(parseInt(height) + 2) + "px;\"></div>";
  
			tbDiv = tbDiv + "<div class=SelLeftTab style=\"height:" +
			( parseInt(height) + 3) + "px;\"></div>";				
		}
	}
	
	if (focus)
	{			
		tbDiv = "<div id =\"" + tabBorderID + "\" style=\"position:absolute;border-color:" + FOCUS_RECT_BORDER_COLOR + ";width:" +  width + ";height:" +						height + ";left:0px" + ";top:1px;font-size:1pt;border-width:1px;border-style:dashed;\"></div>";
   
	}

	tabLabelObj.innerHTML = tbDiv + tabLabelObj.innerHTML;
}

function PBTabManager_DecorateSelectedTab(widgetID, focus, selected)
{    
    try
    {      
        var pbTabObject = this.Get(widgetID);      
		var tabLabelID  = widgetID  + "_" + 
						  (pbTabObject.selectedTabIndex - pbTabObject.visbleStartIndex);
	    var tabLabelObj = document.getElementById(tabLabelID);	
		var tabLabelID  = widgetID  + "_" + 
					     (pbTabObject.selectedTabIndex - pbTabObject.visbleStartIndex);	
		var tabBorderID = 	tabLabelObj.id + TAB_BORDER;
		var tabBorderObj = document.getElementById(tabBorderID);
		
		if (tabBorderObj == null && tabBorderObj == undefined)
		{	               
      		this.DecorateTabLabel(pbTabObject, tabLabelObj, focus, selected, tabBorderID);
		}			  
	}
	catch(e){}	   	
}

function PBTabManager_SetFocus(widgetID)
{    
   this.DecorateSelectedTab(widgetID, true, false);
}

function PBTabManager_MouseMoveOnCloseButton(id)
{
    var clsBtn = document.getElementById(id);
    var imgName = "images/xp_close.gif";
   
     if (this.Theme != XP)
        imgName = "images/close.gif";
        
     clsBtn.src = imgName;        
}

function PBTabManager_MouseOutFromCloseButton(id)
{
     var clsBtn = document.getElementById(id);
     var imgName = "images/tab_close_xp_normal.gif";
      
     if (this.Theme != XP)
        imgName = "images/tab_close_classic_normal.gif"; 
        
    clsBtn.src = imgName;
 }


// TabManager Class definition
function PBTabManager()
{
	this.Theme = XP;
	this.strID = "";
    this.Tabs = new PBMap();
    this.Get = PBTabManager_Get;
    this.GetData = PBTabManager_GetData;
    this.Add = PBTabManager_Add;
    this.GetIDs = PBTabManager_GetIDs;
    this.Count = PBTabManager_Count;
    this.Register = PBTabManager_Register;
    this.OnTabLeftScrollClicked = PBTabManager_OnTabLeftScrollClicked;
    this.OnTabRightScrollClicked = PBTabManager_OnTabRightScrollClicked;
    this.OnTabBarClicked = PBTabManager_OnTabBarClicked;
    this.OnTabClicked = PBTabManager_OnTabClicked;
    this.SetSelctedStyle = PBTabManager_SetSelctedStyle;
    this.GetOffset = PBTabManager_GetOffset;
    this.GetTabInfoObject = PBTabManager_GetTabInfoObject;
    this.SetTabOfTopTabsSelected = PBTabManager_SetTabOfTopTabsSelected;
    this.SetTabOfTopTabsDefault = PBTabManager_SetTabOfTopTabsDefault;
    this.SetTabOfLeftTabsSelected = PBTabManager_SetTabOfLeftTabsSelected;
    this.SetTabOfLeftTabsDefault = PBTabManager_SetTabOfLeftTabsDefault;
    this.GetTabRowOffset = PBTabManager_GetTabRowOffset;
    this.SwapTabRows = PBTabManager_SwapTabRows;
    this.HighlightMultiRowTabItem = PBTabManager_HighlightMultiRowTabItem;
    this.GetVirtualTabRowNumber = PBTabManager_GetVirtualTabRowNumber;
    this.GetOffsetBasedOnTabIndex = PBTabManager_GetOffsetBasedOnTabIndex;
    this.PrepareDataForPost = PBTabManager_PrepareDataForPost;
    this.SetScrollButtonsVisibility = PBTabManager_SetScrollButtonsVisibility;
    this.GetTabBarSize = PBTabManager_GetTabBarSize;
    this.SetFocus = PBTabManager_SetFocus;
    this.LostFocus = PBTabManager_LostFocus;
    this.DecorateSelectedTab = PBTabManager_DecorateSelectedTab;
    this.DecorateTabLabel = PBTabManager_DecorateTabLabel;
    this.MouseOutFromCloseButton =  PBTabManager_MouseOutFromCloseButton;
    this.MouseMoveOnCloseButton =  PBTabManager_MouseMoveOnCloseButton;
}
   
var goTabManager = new PBTabManager();

PB_AjaxJsLoaded();

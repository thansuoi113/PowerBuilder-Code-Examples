//**************************************************************************
//		Copyright  Sybase, Inc.	2004-2006
//						 All Rights	reserved.
//
//	Sybase,	Inc. ("Sybase")	claims copyright in	this
//	program	and	documentation as an	unpublished	work, versions of
//	which were first licensed on the date indicated	in the foregoing
//	notice.	 Claim of copyright	does not imply waiver of Sybase's
//	other rights.
//
//	 It	is provided	subject	to the terms of	the	Sybase License Agreement
//	 for use as	is,	without	alteration or modification.
//	 Sybase	shall have no obligation to	provide	support	or error correction
//	 services with respect to any altered or modified versions of this code.
//
//		 ***********************************************************
//		 **		DO NOT MODIFY OR ALTER THIS	CODE IN	ANY	WAY		  **
//		 ***********************************************************
//
//		 ***************************************************************
//		 **	IMPLEMENTATION DETAILS SUBJECT TO CHANGE WITHOUT NOTICE.  **
//		 **			   DO NOT RELY ON IMPLEMENTATION!!!!			  **
//		 ***************************************************************
//**************************************************************************

var	BORDER_WIDTH = 2;
var	TITLE_HEIGHT = 18;
var	MENUBAR_HEIGHT = 20;
var BREAK_LINE_HEIGHT = 2;
//var	TABBAR_HEIGHT = 32;
var	MIN_WIDTH =	180;
var	CORNERWIDTH = 10;

var	WIN_STATE_MIN =	0;
var	WIN_STATE_NOR =	1;
var	WIN_STATE_MAX =	2;

var	PB_ACTIVE_WIN_ZINDEX = "pbActiveWindowZIndex";

var	WIN_TOOLBARPANE	= "toolbar";
var	WIN_MENUBARPANE	= "menubar";
var	WIN_STATUSBARPANE =	"statusbar";
var	WIN_CONTENTPANE	= "content";
var	WIN_MDICONTENTPANE	= "mdicontent";
var	WIN_TITLEPANE =	"title";
var	WIN_BREAKIMG = "brimg";
var	WIN_CANANS = "canvas";
var	WIN_HF_STATE = "state";
var	WIN_HF_LEFT	= "left";
var	WIN_HF_TOP = "top";
var	WIN_HF_WIDTH = "width";
var	WIN_HF_HEIGHT =	"height";
var	WIN_MT_HEIGHT =	"mtheight";
var	WIN_HF_PCLEFT =	"pclientleft";
var	WIN_HF_PCTOP = "pclienttop";
var	WIN_HF_PCWIDTH = "pclientwidth";
var	WIN_HF_PCHEIGHT	= "pclientheight";
var	WIN_HF_ZINDEX =	"zindex";
var	WIN_HF_FOCUS_ID	= "focusid";
var WIN_HF_POINTERX = "pointerx";
var WIN_HF_POINTERY = "pointery";

var	BT_WIN_MIN = "btmin";
var	BT_WIN_NOR = "btnor";
var	BT_WIN_MAX = "btmax";
var	BT_WIN_CLS = "btcls";

var	BT_MDI_WIN_MIN = "btmdimin";
var	BT_MDI_WIN_NOR = "btmdinor";
var	BT_MDI_WIN_CLS = "btmdicls";

var	DESKTOP	= "desktop";
var	WIN_PREFIX = "win";
var TITLE_PREFIX = "titlewin";
var TITLE_SPAN_PREFIX = "titlespanwin";
var	CONTENTWIN_PREFIX =	"contentwin";
var MDICONTENTPANE_PREFIX = "mdicontent";
var	TAB_PREFIX = "tab_";
var	TEXTBOX_SUFFIX = "_textbox";
var	TAB_MDICONTENTPANE_SUFFIX = "tab_container";
var TABPAGE_MDICONTENTPANE_SUFFIX = "_tabpage_container";
var WINDOW_STYLE = 1;
var WEB_STYLE = 2;

var	AT_TILE	= 1;
var	AT_LAYER = 2;
var	AT_CASCADE = 3;
var	AT_ICONS = 4;
var	AT_TILEHORIZONTAL =	5;

var	gWindowStyle;
var gbShowExitMessage;
var gstrExitMessage;
var gbUnloadPage;

var goYield = null;
var goIdle = null;
var goTimer = null;
var goTimeChild = null;
var gbSubmit;
var gbPrompt;
var gbIdle = false;
var gbYield = false;
var gbF5 = false;
var gbCloseByError = false;

var g_ajaxWaitMsg; 
var g_ajaxWaitMsgBoxWidth;
var g_ajaxWaitMsgBoxHeight;
var g_ajaxWaitMsgFontName;
var g_ajaxWaitMsgFontSize;
var ajaxWaitMsgBoxPosition;
var TOPLEFT = "topleft";
var TOPRIGHT = "topright";
var BOTTOMLEFT = "bottomleft";
var BOTTOMRIGHT = "bottomright";
var AJAX_MSG_BOX_CORRECTION = 30;
var CLASSIC = 1;

function PBClearField(id)
{
    var oNode = document.getElementById(id + "_client");
    if (oNode != null)
        oNode.parentNode.removeChild(oNode);
    oNode = document.getElementById(id + "_context");
    if (oNode != null)
        oNode.parentNode.removeChild(oNode);
    oNode = document.getElementById(id + "_rejectedValue");
    if (oNode != null)
        oNode.parentNode.removeChild(oNode);
    oNode = document.getElementById(id + "_rejectedRow");
    if (oNode != null)
        oNode.parentNode.removeChild(oNode);
    oNode = document.getElementById(id + "_rejectedColumn");
    if (oNode != null)
        oNode.parentNode.removeChild(oNode);
    oNode = document.getElementById(id + "_rejectedColumnName");
    if (oNode != null)
        oNode.parentNode.removeChild(oNode); 
}
function InitShiftKey()
{
	goShiftKey.Put('`','~');
	goShiftKey.Put('1','!');
	goShiftKey.Put('2','@');
	goShiftKey.Put('3','#');
	goShiftKey.Put('4','$');
	goShiftKey.Put('5','%');
	goShiftKey.Put('6','^');
	goShiftKey.Put('7','&');
	goShiftKey.Put('8','*');
	goShiftKey.Put('9','(');
	goShiftKey.Put('9','(');
	goShiftKey.Put('0',')');
	goShiftKey.Put('-','_');
	goShiftKey.Put('+','=');
	goShiftKey.Put('[','{');
	goShiftKey.Put(']','}');
	goShiftKey.Put('\\','|');
	goShiftKey.Put(';',':');
	goShiftKey.Put('\'','"');
	goShiftKey.Put(',','<');
	goShiftKey.Put('.','>');
	goShiftKey.Put('/','?');
}

function PBControl()
{
  this.nType = -1;
  this.strAccelerator = "";
  this.nTabIndex = -1;
  this.bHasRMB = false;
}

function PBWindow_RenderContentPane()
{
	var oWindowPane = this.GetWindowPane();
	var oParentWindow = goWindowManager.Get(this.strParentID);
	
	try
	{
		var oTitlebar = this.GetTitlePane();
		if (oTitlebar)
		{
			with(oTitlebar.style)
			{
				top = 0;
				left = 0;
				height = TITLE_HEIGHT;
			}
		}
		if (this.nState == WIN_STATE_MIN)
		{
		    if (!this.bIsMDIChild)
		    {
			    if (this.bHasMenuBar)
			    {
				    var oMenubar = this.GetMenuBarPane();
				    oMenubar.style.display = "none";
			    }
			    if (this.bHasToolBar)
			    {
				    var oToolBar = this.GetToolBarPane();
				    oToolBar.style.display = "none";
				    var oBreakImg = this.GetBreakImg();
				    oBreakImg.style.display = "none";
			    }
			}
			var oContentPane = this.GetContentPane();
			oContentPane.style.display = "none";
		}
		else
		{
			this.AdjustSize();
		}
	}
	catch(ex)
	{
		window.status = "PBWindow_RenderContentPane:" + ex.description;
	}
}

function PBWindow_AdjustSize(adjustWindow)
{
	if ((this.strID != DESKTOP) && (this.nState != WIN_STATE_MIN))
	{
		var oWindowPane = this.GetWindowPane();
		var oContentPane = this.GetContentPane();
		var oTitlePane = this.GetTitlePane();
		var oMenubar = this.GetMenuBarPane();
		var childNodes = oWindowPane.children;
		var height = 0;
		var top = 0;
		var titleHeight = TITLE_HEIGHT;
		for (var i = 0; i < childNodes.length; i++)
		{
			var item = childNodes[i];
			if (item != oContentPane)
			{
				if (item == oTitlePane)
				{
					titleHeight = item.offsetHeight;
				}
				
				item.style.display = "none";
				item.style.position = "absolute";
				
				if (g_IE)
				{
					if (item == oMenubar)
					{
				    	item.style.zIndex = 2000;
					}
				    else
				    {
				    	item.style.zIndex = i;
					}
	
				    item.style.width = "100%";
				}
				else
				{
					if (item == oTitlePane)
					{
				    	item.style.zIndex = 2000;
					}
				}

				item.style.display = "block";
				item.style.top = height + "px";
				item.style.display = "block";
				height += item.offsetHeight;
			}
		}
		
		oContentPane.style.top = height + "px";
		
		if (adjustWindow && !this.bAdjusted && childNodes.length > 2)
		{
			oWindowPane.style.display = "none";
			
			var nHeight;
			var mtHieght;

			if (g_IE)
			{
				nHeight = parseInt(oWindowPane.style.height) - titleHeight + height;
				mtHieght = height - titleHeight;
			}
			else
			{
				nHeight = parseInt(oWindowPane.style.height) - titleHeight + height - BORDER_WIDTH * 2;
				mtHieght = height - titleHeight - BORDER_WIDTH * 2;
			}
			
			this.nNormalHeight = nHeight;
			this.SetHFHeight(nHeight);
			this.SetMTHeight(mtHieght);

			oWindowPane.style.height = nHeight + "px";
			oWindowPane.style.display = "block";
			this.bAdjusted = true;
		}
		
		if (g_IE)
		{
			oContentPane.style.width = oWindowPane.clientWidth + "px";
			var nHeight = oWindowPane.clientHeight - height;
			nHeight = nHeight > 0 ? nHeight : 0;
			oContentPane.style.height = nHeight + "px";
		}
		else
		{
			oContentPane.style.width = (oWindowPane.clientWidth - BORDER_WIDTH * 2) + "px";
			var nHeight = oWindowPane.clientHeight - height - BORDER_WIDTH * 2;
			nHeight = nHeight > 0 ? nHeight : 0;
			oContentPane.style.height = nHeight + "px";
		}

		oContentPane.style.display = "block";
	}
}

function PBWindow_GetContentPane()
{
	var oContentPane = document.getElementById(WIN_CONTENTPANE + this.strID);
	return oContentPane;
}

function PBWindow_GetWindowPane()
{
	var oWindowPane = document.getElementById(this.strID);
	return oWindowPane;
}

function PBWindow_GetTabMDIContentPane()
{
	var oMDIContentPane = document.getElementById(this.strTabID + TABPAGE_MDICONTENTPANE_SUFFIX);
	return oMDIContentPane;
}

function PBWindow_GetMDIContentPane()
{
	var oMDIContentPane = document.getElementById(MDICONTENTPANE_PREFIX + this.strID);
	return oMDIContentPane;
}

function PBWindow_GetTitlePane()
{
	var oTitlePane = document.getElementById(WIN_TITLEPANE + this.strID);
	return oTitlePane;
}

function PBWindow_GetStatusBarPane()
{
	var oStatusBarPane = document.getElementById(WIN_STATUSBARPANE + this.strID);
	return oStatusBarPane;
}

function PBWindow_GetMenuBarPane()
{
	var oMenuBarPane = document.getElementById(WIN_MENUBARPANE + this.strID);
	return oMenuBarPane;
}

function PBWindow_GetToolBarPane()
{
	var oToolBarPane = document.getElementById(WIN_TOOLBARPANE + this.strID);
	return oToolBarPane;
}

function PBWindow_SetHFState(nState)
{
	document.getElementsByName(WIN_HF_STATE + this.strID)[0].value = nState;
}

function PBWindow_GetHFPCLeft()
{
	return document.getElementsByName(WIN_HF_PCLEFT + this.strID);
}

function PBWindow_SetHFLeft(nLeft)
{
	var oHFLeft = document.getElementsByName(WIN_HF_LEFT + this.strID);
	oHFLeft[0].value = nLeft;
}

function PBWindow_SetHFTop(nTop)
{
	document.getElementsByName(WIN_HF_TOP + this.strID)[0].value = nTop;
}

function PBWindow_GetHFWidth()
{
	return document.getElementsByName(WIN_HF_WIDTH + this.strID);
}

function PBWindow_SetHFWidth(nWidth)
{
	document.getElementsByName(WIN_HF_WIDTH + this.strID)[0].value = nWidth;
}

function PBWindow_SetHFHeight(nHeight)
{
	document.getElementsByName(WIN_HF_HEIGHT + this.strID)[0].value = nHeight;
}

function PBWindow_SetMTHeight(nHeight)
{
	document.getElementsByName(WIN_MT_HEIGHT + this.strID)[0].value = nHeight;
}

function PBWindow_SetHFPCLeft(nTop)
{
	document.getElementsByName(WIN_HF_PCLEFT + this.strID)[0].value = nTop;
}

function PBWindow_SetHFPCTop(nTop)
{
	document.getElementsByName(WIN_HF_PCTOP + this.strID)[0].value = nTop;
}

function PBWindow_SetHFPCWidth(nWidth)
{
	document.getElementsByName(WIN_HF_PCWIDTH + this.strID)[0].value = nWidth;
}

function PBWindow_SetHFPCHeight(nHeight)
{
	document.getElementsByName(WIN_HF_PCHEIGHT + this.strID)[0].value = nHeight;
}

function PBWindow_SetHFZIndex(nZIndex)
{
	document.getElementsByName(WIN_HF_ZINDEX + this.strID)[0].value = nZIndex;
}

function PBWindow_GetHFZIndex()
{
	return document.getElementsByName(WIN_HF_ZINDEX + this.strID)[0].value;
}

function PBWindow_GetHFPointerX()
{
	return document.getElementsByName(WIN_HF_POINTERX + this.strID)[0].value;
}

function PBWindow_GetHFPointerY()
{
	return document.getElementsByName(WIN_HF_POINTERY + this.strID)[0].value;
}

function PBWindow_SetHFPointerX(nPointX)
{
	document.getElementsByName(WIN_HF_POINTERX + this.strID)[0].value = nPointX;
}

function PBWindow_SetHFPointerY(nPointY)
{
	document.getElementsByName(WIN_HF_POINTERY + this.strID)[0].value = nPointY;
}

function PBWindow_SetFocusObjID(strObjID)
{
	var id;
	if (this.bIsMDIChild)
	{ 
		id = strObjID.replace("_tb", "");
		id = id.replace("MDICTB", "MDIC");
	}
	else
	{
		id = strObjID;
	}
	if (id.substring(0, this.strClientID.length) == this.strClientID || this.bIsMessageBox)
	{
		var element = document.getElementsByName(WIN_HF_FOCUS_ID + this.strID)[0];

		if (element != null)
		{
			element.value = strObjID;
		}
	}
}

function PBWindow_GetFocusObjID()
{
	var element = document.getElementsByName(WIN_HF_FOCUS_ID + this.strID)[0];

    var strFocusObjID = "";
	if (element != null)
	{
		strFocusObjID = element.value;
	}
	return strFocusObjID;
}

function PBWindow_GetBreakImg()
{
	var oBreakImg = document.getElementById(WIN_BREAKIMG + this.strID);
	return oBreakImg;
}

function PBWindow_ShowMDIButtons(bShow)
{
	try
	{
		var btnMin = document.getElementById(BT_MDI_WIN_MIN + this.strParentID);
		var btnNor = document.getElementById(BT_MDI_WIN_NOR + this.strParentID);
		var btnCls = document.getElementById(BT_MDI_WIN_CLS + this.strParentID);

		var oWindow = goWindowManager.Get(this.strID);
		if (bShow) 
		{
			if (oWindow.bMinBox) 
			{
				btnMin.style.display = "block";
				if (oWindow.bMaxBox)
				{
					btnMin.style.right = 38;
				}
				else	
				{
					btnMin.style.right = 20;
				}
			}
			if (oWindow.bMaxBox)
			{
				btnNor.style.display = "block";
			}
			btnCls.style.display = "block";
		}
		else 
		{
			if (oWindow.bMinBox)
			{
				btnMin.style.display = "none";
			}
			if (oWindow.bMaxBox != null)
			{
				btnNor.style.display = "none";
			}
			btnCls.style.display = "none";
		}
	}
	catch(ex)
	{
		window.status = "PBWindow_ShowMDIButtons:" + ex.description;
	}
}

function PBWindow_ShowControlBoxButtons(nState)
{
	var btnMin = document.getElementById(BT_WIN_MIN + this.strID);
	var btnNor = document.getElementById(BT_WIN_NOR + this.strID);
	var btnMax = document.getElementById(BT_WIN_MAX + this.strID);
	var btnCls = document.getElementById(BT_WIN_CLS + this.strID);
	
	if (btnMin != null)
	{
		btnMin.style.visibility = "hidden";
	}
	if (btnNor != null)	
	{
		btnNor.style.visibility = "hidden";
	}
	if (btnMax != null)
	{
		btnMax.style.visibility = "hidden";
	}
		
	if (nState == WIN_STATE_NOR)
	{
		if (btnMax != null)
		{
			btnMax.style.visibility = "visible";
		}
		if (btnMin != null)	
		{
			btnMin.style.visibility = "visible";
		}
	}
	else if (nState == WIN_STATE_MIN)
	{
		if (btnMax != null)
		{
			btnMax.style.visibility = "visible";
		}
		if (btnNor != null) 
		{	
			btnNor.style.visibility = "visible";
			if (btnMax != null)
			{
				btnNor.style.right = 38;
			}
			else
			{
				btnNor.style.right = 20;
			}
		}
	}
	else 
	{
		if (btnMin != null)
		{
			btnMin.style.visibility = "visible";
		}
		if (btnNor != null) 
		{
			btnNor.style.visibility = "visible";
			btnNor.style.right = 20;
		}
	}
}

function PBWindow()
{
	this.strID = "";
	this.MDIChildWindows = new PBSet();
	this.ChildWindows = new PBSet();
	this.PopupWindows = new PBSet();
	this.ResponseWindows = new PBSet();
	this.Controls = new PBMap();
	this.bIsMDIChild = false;
	this.bIsPopup = false;
	this.bIsResponse = false;
	this.bHasMenuBar = true;
	this.bActive = false;
	this.bHasToolBar = true;
	this.nNormalTop = 0;
	this.nNormalLeft = 0;
	this.nNormalWidth = 0;
	this.nNormalHeight = 0;
	this.nMinWinCount = 0;
	this.nMinMDIChildWinCount = 0;
	this.nState = WIN_STATE_NOR;
	this.strParentID = "";
	this.strCancelBtn = null;
	this.strDefaultBtn = null;
	this.strUniqueID = "";
	this.strClientID = "";
	this.nTabIndex = -1;
	this.strTabID = "";
	this.nArrangeType = 0;
	this.strMDIActiveID = "";
	this.bMaxBox = false;
	this.bMinBox = false;
	this.bIsChild = false;
	this.bIsMDI = false;
	this.bIsMessageBox = false;
	this.bMDIHasControl = false;
	this.bSetMDIClient = false;
	this.bHasTitleBar = false;
	this.bResizable = false;
	this.bAdjusted = false;
	this.strWinPaneBorderStyle = "";
	this.strContentPaneBorderStyle = "";
	this.GetContentPane = PBWindow_GetContentPane;
	this.GetWindowPane = PBWindow_GetWindowPane;
	this.GetTitlePane = PBWindow_GetTitlePane;
	this.GetStatusBarPane = PBWindow_GetStatusBarPane;
	this.GetMenuBarPane = PBWindow_GetMenuBarPane;
	this.GetToolBarPane = PBWindow_GetToolBarPane;
	this.GetMDIContentPane = PBWindow_GetMDIContentPane;
	this.GetTabMDIContentPane = PBWindow_GetTabMDIContentPane;
	this.SetHFLeft = PBWindow_SetHFLeft;
	this.SetHFTop = PBWindow_SetHFTop;
	this.SetHFWidth = PBWindow_SetHFWidth;
	this.SetHFHeight = PBWindow_SetHFHeight;
	this.SetMTHeight = PBWindow_SetMTHeight;
	this.SetHFState = PBWindow_SetHFState;
	this.SetHFPCLeft = PBWindow_SetHFPCLeft;
	this.SetHFPCTop = PBWindow_SetHFPCTop;
	this.SetHFPCWidth = PBWindow_SetHFPCWidth;
	this.SetHFPCHeight = PBWindow_SetHFPCHeight;
	this.SetHFZIndex = PBWindow_SetHFZIndex;
	this.GetHFZIndex = PBWindow_GetHFZIndex;
	this.GetBreakImg = PBWindow_GetBreakImg;
	this.ShowControlBoxButtons = PBWindow_ShowControlBoxButtons;
	this.ShowMDIButtons = PBWindow_ShowMDIButtons;
	this.RenderContentPane = PBWindow_RenderContentPane;
	this.SetFocusObjID = PBWindow_SetFocusObjID;
	this.GetFocusObjID = PBWindow_GetFocusObjID;
	this.SetHFPointerX = PBWindow_SetHFPointerX;
	this.SetHFPointerY = PBWindow_SetHFPointerY;
	this.GetHFPointerX = PBWindow_GetHFPointerX;
	this.GetHFPointerY = PBWindow_GetHFPointerY;
	this.AdjustSize = PBWindow_AdjustSize;
	this.GetHFPCLeft = PBWindow_GetHFPCLeft;
	this.GetHFWidth = PBWindow_GetHFWidth;
}

function PBWindowManager_Get(strID)
{
	return this.Windows.Get(strID);
}

function PBWindowManager_Add(strID,	oWindow)
{
	this.Windows.Put(strID, oWindow);
}

function PBWindowManager_RegisterWindow(strParentID)
{
	var windows = this.GetIDs();
	var oParentWin = this.Get(strParentID);
	for (var i = 0; i < windows.Size(); i++)
	{
		var oWinID = windows.Get(i);
		var oWin = goWindowManager.Get(oWinID);
		if (oWin.strParentID == strParentID)
		{
			if (oWin.bIsMDIChild)
			{
				oParentWin.MDIChildWindows.Put(oWin);
			}
			
			if (oWin.bIsChild)
			{
				oParentWin.ChildWindows.Put(oWin);
			}
				
			if (oWin.bIsPopup)
			{
				oParentWin.PopupWindows.Put(oWin);
			}
				
			if (oWin.bIsResponse)
			{
				oParentWin.ResponseWindows.Put(oWin);
			}
		}
	}
}

function PBWindowManager_Open1(strID, strParentID, strUniqueID, nTabIndex, 
	strTabID, bHasMenuBar, bHasToolBar, bIsMDIChild, bClicked, bActive, bIsMDI, 
	bMDIHasControl, nZIndex, strClientID, bRightClicked)
{
	var oNewWindow = new PBWindow();
	oNewWindow.strID = strID;
	oNewWindow.strParentID = strParentID;
	oNewWindow.strUniqueID = strUniqueID;
	oNewWindow.strClientID = strClientID;
	oNewWindow.nTabIndex = nTabIndex;
	oNewWindow.strTabID = strTabID;
	oNewWindow.bHasMenuBar = bHasMenuBar;
	oNewWindow.bHasToolBar = bHasToolBar;
	oNewWindow.bIsMDIChild = bIsMDIChild;
	oNewWindow.bIsMDI = bIsMDI;
	oNewWindow.bClicked = bClicked;
	oNewWindow.bRightClicked = bRightClicked;
	oNewWindow.bActive = bActive;
	oNewWindow.bMDIHasControl = bMDIHasControl;
	oNewWindow.nZIndex = nZIndex;
	var oParentWin = this.Get(strParentID);
	if (bIsMDIChild)
	{
	    oParentWin.MDIChildWindows.Put(oNewWindow);
	}
	
	this.Add(strID, oNewWindow);
	this.RegisterWindow(strID);
	
	if (strID != DESKTOP) 
	{
		oNewWindow.SetHFZIndex(nZIndex);
	}
		
	if (nZIndex > this.nMaxZIndex) 
	{
		this.nMaxZIndex = nZIndex;
	}	
}

function PBWindowManager_Open(strID, bIsMDIChild, bIsPopup, strParentID, nLeft, nTop, 
	nWidth, nHeight, nState, bHasMenuBar, bHasToolBar, nZIndex, bClicked, 
	strUniqueID, bMaxBox, bMinBox, bIsChild, bIsMDI, bMDIHasControl, strClientID, bIsResponse,
	bRightClicked, bHasTitleBar, strWinPaneBorderStyle, strContentPaneBorderStyle,
	bIsMessageBox, bResizable)
{
	var oNewWindow = new PBWindow();
	oNewWindow.strID = strID;
	oNewWindow.bIsMDIChild = bIsMDIChild;
	oNewWindow.bMDIHasControl = bMDIHasControl;
	oNewWindow.bIsMDI = bIsMDI;
	oNewWindow.bIsResponse = bIsResponse;
	oNewWindow.bHasToolBar = bHasToolBar;
	oNewWindow.bIsPopup = bIsPopup;
	oNewWindow.nNormalTop = nTop;
	oNewWindow.nNormalLeft = nLeft;
	oNewWindow.nNormalWidth = nWidth;
	oNewWindow.nNormalHeight = nHeight;
	oNewWindow.nState = nState;
	oNewWindow.strParentID = strParentID;
	oNewWindow.bClicked = bClicked;
	oNewWindow.bRightClicked = bRightClicked;
	oNewWindow.strUniqueID = strUniqueID;
	oNewWindow.strClientID = strClientID;
	oNewWindow.bMaxBox = bMaxBox;
	oNewWindow.bMinBox = bMinBox;
	oNewWindow.bIsChild = bIsChild;
	oNewWindow.bHasMenuBar = bHasMenuBar;
	oNewWindow.bHasToolBar = bHasToolBar;
	oNewWindow.bHasTitleBar = bHasTitleBar;
	oNewWindow.strWinPaneBorderStyle = strWinPaneBorderStyle;
	oNewWindow.strContentPaneBorderStyle = strContentPaneBorderStyle;
	oNewWindow.bIsMessageBox = bIsMessageBox;
	oNewWindow.bResizable = bResizable;
	
	var oParentWin = this.Get(strParentID);
	if (bIsMDIChild)
	{
	    oParentWin.MDIChildWindows.Put(oNewWindow);
	}
	
	if (bIsChild && oParentWin != null)
	{
	    oParentWin.ChildWindows.Put(oNewWindow);
	}
		
	if (bIsPopup)
	{
		oParentWin.PopupWindows.Put(oNewWindow);
	}
		
	if (bIsResponse)
	{
		if (oParentWin != null)
		{
			oParentWin.ResponseWindows.Put(oNewWindow);
		}
		var iframe = document.getElementById(strID + "iframe");
		if (iframe != null)
		{
			iframe.contentWindow.document.oncontextmenu = PB_False;
		}
	}
		
	this.Add(strID, oNewWindow);
	
	if (strID != DESKTOP) 
	{
		oNewWindow.SetHFLeft(nLeft);
		oNewWindow.SetHFTop(nTop);
		oNewWindow.SetHFWidth(nWidth);
		oNewWindow.SetHFHeight(nHeight);
		oNewWindow.SetHFZIndex(nZIndex);
		oNewWindow.SetHFState(nState);
		
		oNewWindow.AdjustSize();
	}
	
	if (nZIndex > this.nMaxZIndex) 
	{
		this.nMaxZIndex = nZIndex;
	}
}

function PBWindowManager_Center(oNewWindow)
{
	if (oNewWindow.nNormalLeft == -1) 
	{
		var oParentCltArea = this.GetParentCltArea(oNewWindow);
		var nLeft = 0;
		var nTop = 0;
		nLeft = parseInt((oParentCltArea.width - oNewWindow.nNormalWidth) / 2);
		if (nLeft < 0) nLeft = 0;
		nTop = parseInt((oParentCltArea.height - oNewWindow.nNormalHeight) / 2);
		if (nTop < 0) nTop = 0;
		oNewWindow.nNormalLeft = nLeft;
		oNewWindow.nNormalTop = nTop;
		var oWindowPane = oNewWindow.GetWindowPane();
		with(oWindowPane.style)
		{
			top = oNewWindow.nNormalTop;
			left = oNewWindow.nNormalLeft;
			width = oNewWindow.nNormalWidth;
			height = oNewWindow.nNormalHeight;
			
			zIndex = oNewWindow.GetHFZIndex();
		}
		oNewWindow.SetHFLeft(nLeft);
		oNewWindow.SetHFTop(nTop);
		oNewWindow.SetHFWidth(oNewWindow.nNormalWidth);
		oNewWindow.SetHFHeight(oNewWindow.nNormalHeight);
	}
}

function PBWindowManager_SetMDIClient(oWin)
{
	if (oWin.bIsMDI)
	{
		var oContent = oWin.GetContentPane();
		var oMDIClient = oContent.children[0];

		var changedByInner = document.getElementsByName("cbi" + WIN_MDICONTENTPANE + oWin.strID)[0].value == "true";

		if (!oWin.bMDIHasControl && changedByInner)
		{
			oWin.bSetMDIClient = true;
		}
		if (oWin.bSetMDIClient)
		{
			if (oMDIClient.id != "")
			{
				oMDIClient.style.top = 0;
				oMDIClient.style.left = 0;
				oMDIClient.style.width = oContent.clientWidth;
				oMDIClient.style.height = oContent.clientHeight;

				document.getElementsByName("width" + WIN_MDICONTENTPANE + oWin.strID)[0].value = oContent.clientWidth;
				document.getElementsByName("height" + WIN_MDICONTENTPANE + oWin.strID)[0].value = oContent.clientHeight;
			}
		}
	}
}

function PBWindowManager_Init(strID, bFirst, nArrangeType, strDefaultBtnID, strCancelBtnID)
{
	var oNewWindow = this.Get(strID);
	oNewWindow.bFirst = bFirst;
	oNewWindow.nArrangeType = nArrangeType;

	if (strCancelBtnID != "")
	{
		oNewWindow.strCancelBtn = document.getElementById(strCancelBtnID);
	}
	if (strDefaultBtnID != "")
	{
		oNewWindow.strDefaultBtn = document.getElementById(strDefaultBtnID);
	}
	
	if (oNewWindow.bHasMenuBar || oNewWindow.bHasToolBar)
	{
		oNewWindow.AdjustSize(true);
	}
}

function PBWindowManager_Init1(strID, strDefaultBtnID, strCancelBtnID)
{
	var oNewWindow = this.Get(strID);
	if (strCancelBtnID != "")
	{
		oNewWindow.strCancelBtn = document.getElementById(strCancelBtnID);
	}
	if (strDefaultBtnID != "")
	{
		oNewWindow.strDefaultBtn = document.getElementById(strDefaultBtnID);
	}
}

function PBWindowManager_GetIDs()
{
	return this.Windows.KeySet();
}

function PBWindowManager_Count()
{
	return this.Windows.Size();
}

function PBWindowManager_Remove(strID)
{
	this.Windows.Remove(strID);
}

function PBWindowManager_RemoveAll()
{
	var windows = goWindowManager.GetIDs();
	var oWinID;
	for (var i = windows.Size() - 1; i > 0; i--)
	{
		oWinID = windows.Get(i);
		this.Remove(oWinID);
	}
}

function PBWindowManager_IsExist(strID)
{
	var oIDs = this.GetIDs();
	return oIDs.Contains(strID) != -1;
}

function PBWindowManager_GetMDIClientAreaRect(strID)
{
	var oRect = new Object();
	try
	{
		var oMDIContentPane = document.getElementById(MDICONTENTPANE_PREFIX + strID);
		if (oMDIContentPane)
		{
			oRect.top = oMDIContentPane.offsetTop + oMDIContentPane.clientTop;
			oRect.left = oMDIContentPane.offsetLeft + oMDIContentPane.clientLeft;
			oRect.width = oMDIContentPane.clientWidth;
			oRect.height = oMDIContentPane.clientHeight;
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_GetMDIClientAreaRect:" + e.description;
	}
	return oRect;

}

function PBWindowManager_GetDesktopClientAreaRect()
{
	var oRect = new Object();
	try
	{
		oRect.clientLeft = document.body.clientLeft ? document.body.clientLeft : 0;
		oRect.clientTop = document.body.clientTop ? document.body.clientTop : 0;
		oRect.top = oRect.clientTop;
		oRect.left = oRect.clientLeft;
		oRect.width = document.body.clientWidth;
		oRect.height = document.body.clientHeight;
	}
	catch(e)
	{
		window.status = "PBWindowManager_GetDesktopClientAreaRect:" + e.description;
	}
	return oRect;
}

function PBWindowManager_ResetChild(evt, strID)
{
	var oParentWin = this.Get(strID);
	var oIDs = this.GetIDs();
	
	try
	{
		oParentWin.nMinWinCount = 0;
		var strParentID;
		for (var i = 0; i < oIDs.Size(); i++)
		{
			var strWinID = oIDs.Get(i);
			var oWin = this.Get(strWinID);
			if (oWin.bIsPopup || oWin.bIsResponse) 
			{
				strParentID = DESKTOP;
			} 
			else 
			{
				strParentID = oWin.strParentID;
			}			
			if (!oWin.bIsMDIChild && strParentID == strID)
			{
				if (oWin.nState == WIN_STATE_MIN)
				{
					this.Min(evt, strWinID);
				}
				else if (oWin.nState == WIN_STATE_MAX)
				{
					this.Max(evt, strWinID);
				}				
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_ResetChild:" + e.description;
	}
}

function PBWindowManager_ResetMDIChild(evt, strID)
{
	var oParentWin = this.Get(strID);
	var oIDs = this.GetIDs();
	
	try
	{
		oParentWin.nMinMDIChildWinCount = 0;
		for (var i = 0; i < oIDs.Size(); i++)
		{
			var strWinID = oIDs.Get(i);
			var oWin = this.Get(strWinID);
			if (oWin.bIsMDIChild && oWin.strParentID == strID)
			{
				if (oWin.nState == WIN_STATE_MIN)
				{
					this.Min(evt, strWinID);
				}
				else if (oWin.nState == WIN_STATE_MAX)
				{
					this.Max(evt, strWinID);
				}
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_ResetMDIChild:" + e.description;
	}
}

function PBWindowManager_ArrangeMDIChild(evt, strID, nArrangeType)
{
	try
	{
		this.SetMDIClient(this.Get(strID));
		switch(nArrangeType)
		{
			case AT_TILE : this.Tile(evt, strID); break;
			case AT_LAYER : this.Layer(evt, strID); break;
			case AT_CASCADE : this.Cascade(evt, strID); break;
			case AT_ICONS : break;
			case AT_TILEHORIZONTAL : this.TileHorizontal(evt, strID); break;
		}
	}
	catch(ex)
	{
		window.status = "PBWindowManager_ArrangeMDIChild:" + ex.description;
	}
}

function PBWindowManager_Normal(evt, strID)
{
	try
	{
		var oWin = this.Get(strID);
		var oWindowPane = oWin.GetWindowPane();
		var oContentPane = oWin.GetContentPane();
		var strParentID;
		if (oWin.bIsPopup || oWin.bIsResponse) 
		{
			strParentID = DESKTOP;
		} 
		else 
		{
			strParentID = oWin.strParentID;
		}
		var oParentWindow = this.Get(strParentID);
		var nState = oWin.nState;
		var oTitlebar = oWin.GetTitlePane();
		with(oWindowPane.style)
		{
			top = oWin.nNormalTop;
			left = oWin.nNormalLeft;
			width = oWin.nNormalWidth;
			height = oWin.nNormalHeight;
		}
		oWin.ShowControlBoxButtons(WIN_STATE_NOR);
		oTitlebar.style.display = "block";
		if (oWin.bIsMDIChild)
		{
			if (oWin.nState == WIN_STATE_MAX)
			{
				oWin.ShowMDIButtons(false);
			}
		}
		this.ShowMDIButtons(strID, true);
		oWindowPane.style.borderStyle = oWin.strWinPaneBorderStyle;
		oContentPane.style.borderStyle = oWin.strContentPaneBorderStyle;
		oWin.nState = WIN_STATE_NOR;
		oWin.SetHFState(WIN_STATE_NOR);
		oWin.RenderContentPane();

		this.SetChildWindowParentClientArea(oWin);
		this.SetMDIClient(oWin);
		if (nState == WIN_STATE_MIN)
		{
			if (oWin.bIsMDIChild)
			{
				oParentWindow.nMinMDIChildWinCount--;
				this.ResetMDIChild(oWin.strParentID);
			}
			else
			{
				oParentWindow.nMinWinCount--;
				this.ResetChild(evt, strParentID);
			}
		}
		if (oWin.bIsMDI)
		{
			this.ResetMDIChild(evt, oWin.strID);
		}
		this.ResetChild(evt, oWin.strID);
	}
	catch(e)
	{
		window.status = "PBWindowManager_Normal:" + e.description;
	}
}

function PBWindowManager_OnDoubleClick(evt, strID)
{
	try
	{
		var oWin = this.Get(strID);
		if (oWin.bHasTitleBar)
		{
			if (oWin.nState == WIN_STATE_NOR && !oWin.bIsResponse)
			{
				this.Max(evt, strID);
			}
			else
			{
				this.Normal(evt, strID);
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_OnDoubleClick:" + e.description;
	}
}

function PBWindowManager_GetWorkSpaceOffset(oWin)
{
	var oContentPane = oWin.GetContentPane();
	var offset = 0;
	if (oContentPane != null)
		 offset = oContentPane.offsetTop;
	return offset;
}

function PBWindowManager_Max(evt, strID)
{
	try
	{
		var oWin = this.Get(strID);
		var strParentID;
		if (oWin.bIsPopup || oWin.bIsResponse) 
		{
			strParentID = DESKTOP;
		} 
		else 
		{
			strParentID = oWin.strParentID;
		}

		var oWindowPane = oWin.GetWindowPane();
		var nState = oWin.nState;
		var oParentWindow = this.Get(strParentID);
		var oParentCltArea = this.GetParentCltArea(oWin);
		if (oParentCltArea.height != 0)
		{
			var oTitlebar = oWin.GetTitlePane();
			this.ShowMDIButtons(strID, true);
			var nWidth;
			var nHeight;
			if (oWin.bIsMDIChild)
			{
				oTitlebar.style.display = "none";
				this.MaxMDIChild(evt, strID);
				return;
			}
			nWidth = oParentCltArea.width;
			oWin.nState = WIN_STATE_MAX;
			oWin.SetHFState(WIN_STATE_MAX);
			oWin.RenderContentPane();
			nHeight = oParentCltArea.height;
			oWindowPane.style.top = "0px";
			oWindowPane.style.left = "0px";
			oWindowPane.style.width = (g_IE ? nWidth : oWin.bIsMDI ? (nWidth - BORDER_WIDTH * 4) : (nWidth - BORDER_WIDTH * 2 - 1)) + "px";
			oWindowPane.style.height = (g_IE ? nHeight : oWin.bIsMDI ? (nHeight - BORDER_WIDTH * 4) : (nHeight - BORDER_WIDTH * 2 - 1)) + "px";

			oWin.AdjustSize();
			
			oWin.ShowControlBoxButtons(WIN_STATE_MAX);
			this.SetMDIClient(oWin);
			this.SetChildWindowParentClientArea(oWin);
			if (nState == WIN_STATE_MIN)
			{
				if (oWin.bIsMDIChild)
				{
					oParentWindow.nMinMDIChildWinCount--;
					this.ResetMDIChild(oWin.strParentID);
				}
				else
				{
					oParentWindow.nMinWinCount--;
					this.ResetChild(evt, oWin.strParentID);
				}		
			}
			if (oWin.bIsMDI)
			{
				this.ResetMDIChild(evt, oWin.strID);
			}
			this.ResetChild(evt, oWin.strID);    
		}
	}
	catch(ex)
	{
		window.status = "PBWindowManager_Max:" + ex.description;
	}
}

function PBWindowManager_GetTabMDICltArea(oParentWindow)
{
	oParentCltArea = new Object();
	var oParentWindowPane = oParentWindow.GetTabMDIContentPane();
	var oPoint = this.GetAbsoluteCoords(oParentWindowPane);
	oParentCltArea.clientLeft = oParentWindowPane.offsetLeft + oParentWindowPane.clientLeft;
	oParentCltArea.clientTop = oParentWindowPane.offsetTop + oParentWindowPane.clientTop;
	oParentCltArea.left = oPoint.x + oParentWindowPane.clientLeft;
	oParentCltArea.top = oPoint.y + oParentWindowPane.clientTop;
	oParentCltArea.width = oParentWindowPane.offsetWidth;
	oParentCltArea.height = oParentWindowPane.offsetHeight + oParentWindowPane.offsetTop;
	return oParentCltArea;
}

function PBWindowManager_GetParentCltArea(oWin)
{
	var oParentCltArea;
	var oParentWin = goWindowManager.Get(oWin.strParentID);
	if (oWin.strParentID == DESKTOP || oWin.bIsPopup || oWin.bIsResponse)
	{
		oParentCltArea = goWindowManager.GetDesktopClientAreaRect();
	}
	else if (oWin.bIsMDIChild) 
	{
		if ( gWindowStyle == WINDOW_STYLE || oWin.strTabID == "")
		{
			oParentCltArea = goWindowManager.GetMDICltArea(oParentWin);
		}
		else
		{
			oParentCltArea = goWindowManager.GetTabMDICltArea(oWin);
		}
	}
	else
	{
		if (oParentWin.bIsMDIChild && gWindowStyle == WEB_STYLE && oParentWin.strTabID != "")
		{
			oParentCltArea = goWindowManager.GetTabMDICltArea(oParentWin);
		}
		else
		{
			oParentCltArea = goWindowManager.GetCltArea(oParentWin);
		}
	}
	return oParentCltArea;
}

function PBWindowManager_GetCltArea(oParentWindow)
{
	oParentCltArea = new Object();
	var oParentWindowPane = oParentWindow.GetContentPane();
	var oPoint = goWindowManager.GetAbsoluteCoords(oParentWindowPane);
	oParentCltArea.clientLeft = oParentWindowPane.offsetLeft + oParentWindowPane.clientLeft;
	oParentCltArea.clientTop = oParentWindowPane.offsetTop + oParentWindowPane.clientTop;
	oParentCltArea.left = oPoint.x + oParentWindowPane.clientLeft;
	oParentCltArea.top = oPoint.y + oParentWindowPane.clientTop;
	oParentCltArea.width = oParentWindowPane.clientWidth;
	oParentCltArea.height = oParentWindowPane.clientHeight;
	return oParentCltArea;
}

function PBWindowManager_GetMDICltArea(oParentWindow)
{
	oParentCltArea = new Object();
	var oParentWindowPane = oParentWindow.GetMDIContentPane();
	var oPoint = goWindowManager.GetAbsoluteCoords(oParentWindowPane);
	oParentCltArea.clientLeft = oParentWindowPane.offsetLeft + oParentWindowPane.clientLeft;
	oParentCltArea.clientTop = oParentWindowPane.offsetTop + oParentWindowPane.clientTop;
	oParentCltArea.left = oPoint.x + oParentWindowPane.clientLeft;
	oParentCltArea.top = oPoint.y + oParentWindowPane.clientTop;
	oParentCltArea.width = oParentWindowPane.clientWidth;
	oParentCltArea.height = oParentWindowPane.clientHeight;
	return oParentCltArea;
}

function PBWindowManager_SetFocus1(evt)
{
	var oActiveWin = this.Get(this.strActiveID);
	var obj = evt.srcElement;
	var oPBTypeObj = this.GetPBTypeObj(obj);
	var testId = obj.id;
	if (oPBTypeObj)
	{
		var pbId = oPBTypeObj.getAttribute("pbid");
		if (pbId)
		{
			testId = pbId;
		}
		else
		{
			testId = oPBTypeObj.id;
		}
	}

	if (!oActiveWin.Controls.Get(testId))
	{
		return;
	}
	var id = obj.id;
	if (!id) id = "";
	if (id != oActiveWin.GetFocusObjID())
	{
	    if (oActiveWin.bIsMDIChild)
	    { 
		    id = id.replace("_tb", "");
		    id = id.replace("MDICTB", "MDIC");
	    }
	    
	    if (!oActiveWin.bIsMessageBox)
	    {
	        while (obj && id != undefined && id != null && id.substring(0, oActiveWin.strClientID.length) != oActiveWin.strClientID)
	        {
	            obj = obj.parentNode;
	            if (obj && obj.id != undefined && obj.id != null)
	            {
	                id = obj.id;
	                if (oActiveWin.bIsMDIChild)
	                { 
		                id = id.replace("_tb", "");
		                id = id.replace("MDICTB", "MDIC");
	                }
	            }
	        }
	    }
	    if (obj && id)
        {
	        id = obj.id;
	        if (oPBTypeObj != null && oPBTypeObj.id != undefined)
	        {
						var newId = oPBTypeObj.getAttribute("pbid");
						if (newId)
						{
							id = newId;
						}
						else
						{
							id = oPBTypeObj.id;
						}
	        }
	        oActiveWin.SetFocusObjID(id);
	    }
	}
	if (!this.HasMinWindow(oActiveWin))
	{
		this.SetFocus(evt, oActiveWin.GetFocusObjID());
	}
}


function PBWindowManager_Max1(strID) {
    try {
        var oWin = this.Get(strID);
        var oWindowPane = oWin.GetWindowPane();
        var oContentPane = oWin.GetContentPane();
        var oParentCltArea;

        oParentCltArea = this.GetParentCltArea(oWin);
        var nOffset = this.GetWorkSpaceOffset(oWin);
        if (oWindowPane != null) {
            oWindowPane.style.left = 0;
            oWindowPane.style.top = 0;

            oWindowPane.style.width = oParentCltArea.width + "px"; ;

             oWindowPane.style.height = oParentCltArea.height + "px";

            if (oParentCltArea.height - nOffset > 0)
                oContentPane.style.height = oParentCltArea.height - nOffset + "px";
        }

        oWin.SetHFWidth(oParentCltArea.width);
        oWin.SetHFHeight(oParentCltArea.height);
        this.SetMDIClient(oWin);
    }
    catch (e) {
        window.status = "PBWindowManager_Max1:" + e.description;
    }
}

function PBWindowManager_MaxMDIChild(evt, strID)
{
	try
	{
		var oWin = this.Get(strID);
		var oWindowPane = oWin.GetWindowPane();
		var nState = oWin.nState;
		var oParentWindow = this.Get(oWin.strParentID);
		var oContentPane = oWin.GetContentPane();
		var oParentCltArea = this.GetMDIClientAreaRect(oWin.strParentID);
		var nWidth;
		var nHeight;
		oWindowPane.style.borderStyle = "none";
		oWindowPane.style.top = 0;
		oWindowPane.style.left = 0;
		oWindowPane.style.width = oParentCltArea.width;
		oWindowPane.style.height = oParentCltArea.height;
		oContentPane.style.top = 0;
		oContentPane.style.left = 0;
		oContentPane.style.width = oParentCltArea.width;
		oContentPane.style.height = oParentCltArea.height;
		oContentPane.style.borderStyle = "none";
		oContentPane.style.display = "inline";
		oWin.SetHFState(WIN_STATE_MAX);
		oWin.nState = WIN_STATE_MAX;
		oWin.ShowMDIButtons(true);
		this.SetChildWindowParentClientArea(oWin);
		this.ResetChild(evt, oWin.strID);
		if (nState == WIN_STATE_MIN)
		{
			oParentWindow.nMinMDIChildWinCount--;
			this.ResetMDIChild(oWin.strParentID);
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_MaxMDIChild:" + e.description;
	}
}

function PBWindowManager_GetActiveMDIChildWinID(oWin)
{
	var nZIndex = 0;
	var strActiveID = oWin.strID;
	var oParentWin = this.Get(oWin.strParentID);
	for (var i = 0; i < oParentWin.MDIChildWindows.Size(); i++)
	{
		var oMDIChildWin = oParentWin.MDIChildWindows.Get(i);
		var nWinZIndex = oMDIChildWin.GetHFZIndex();
		if (oWin.strID != oMDIChildWin.strID && nWinZIndex > nZIndex) 
		{
			nZIndex = nWinZIndex;
			strActiveID = oMDIChildWin.strID;
		}
	}
	return strActiveID;
}

function PBWindowManager_SetWindowZIndex(oWin)
{
	var oWinPane = oWin.GetWindowPane();
	var nZIndex = this.GetMaxZIndex();
	if (oWinPane != null)
	{    
		oWinPane.style.zIndex = nZIndex;
	}
	oWin.SetHFZIndex(nZIndex);
	if (oWin.bIsResponse)
	{
		var oWinDiv = document.getElementById(oWin.strID + "mask");
		oWinDiv.style.zIndex = nZIndex;
		var oIFrame = PB_PopupGetIFrame(oWinDiv);
		if (oIFrame)
		{
			oIFrame.style.zIndex = nZIndex;
		}
	}
	if (oWin.strParentID == DESKTOP)
	{
		var elements = document.getElementsByName("PBMenu_menu0");
		for (var i=0; i< elements.length; i++)
		{
			if (elements[i].getAttribute("pbtopmenu") == "true")
			{
				elements[i].style.zIndex = nZIndex;
				break;
			}
		}
	}
}

function PBWindowManager_Active(evt, strID)
{
	try
	{
	    var oActiveWin = this.Get(this.strActiveID);
	    if (oActiveWin != null)
	    {
			this.DeActive(this.strActiveID);
			
			this.strActiveID = this.ActiveWindow(evt, strID);
    		oActiveWin = this.Get(this.strActiveID);
    		var nZIndex = oActiveWin.GetHFZIndex();
			this.SetActiveWinZIndex(nZIndex);
			
			this.HandleSelectElement();
			
			if (!this.HasMinWindow(oActiveWin))
			{ 
				this.SetFocus(evt, oActiveWin.GetFocusObjID());
			}	
			
			if (this.bSwitchMenu)
			{
				__doPostBack(oActiveWin.strUniqueID, "Active");
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_Active:" + e.description;
	}
}

function PBWindowManager_HasMinWindow(oActiveWin)
{
	var oWin = oActiveWin;
	var bMin = false;
	do
	{
		if (oWin.nState == WIN_STATE_MIN) 
		{	
			bMin = true;
			break;
		}
		oWin = this.Get(oWin.strParentID);
	}
	while (oWin != null && oWin.strID != DESKTOP);
	return bMin;
}

function PBWindowManager_GetRootWin(strID)
{
	var oWin;
	do 
	{
		oWin = this.Get(strID);
		if (oWin.strParentID == DESKTOP) break;
		if (this.Get(oWin.strParentID) == null) break;
		strID = oWin.strParentID;
	}while(true);
	return strID;
}

function PBWindowManager_ActiveTitlePane(oWin)
{
	var oTitlePane;
    oTitlePane = oWin.GetTitlePane();
	if (oTitlePane != null)
	{
		oTitlePane.style.backgroundColor = "activecaption";
	}
	var oWinPane;
    oWinPane = oWin.GetWindowPane();
	if (oWinPane != null)
	{
		oWinPane.style.borderColor = "activecaption";
	}
	var oContentPane;
    oContentPane = oWin.GetContentPane();
	if (oContentPane != null)
	{
		oContentPane.style.borderColor = "activecaption";
	}		
}

function PBWindowManager_ActiveTreeTitlePane(strID)
{
    var oWin, oTitlePane, oWindowPane, oContentPane;
	do 
	{
        oWin = this.Get(strID);
        if (!oWin.bIsChild)
        {
            oTitlePane = oWin.GetTitlePane();
			if (oTitlePane != null)
			{
				oTitlePane.style.backgroundColor = "activecaption";
			}
            oWinPane = oWin.GetWindowPane();
			if (oWinPane != null)
			{
				oWinPane.style.borderColor = "activecaption";
			}
			oContentPane = oWin.GetContentPane();
			if (oContentPane != null)
			{
				oContentPane.style.borderColor = "activecaption";
			}
            if (!oWin.bIsMDIChild) break;
        }   
    	strID = oWin.strParentID;
	}while(strID != DESKTOP);
}

function PBWindowManager_ActiveTree(strID)
{
    var oWin, oTitlePane;
	while (strID != DESKTOP) 
	{
        oWin = this.Get(strID);
        if (oWin != null)
        {
			this.SetWindowZIndex(oWin);
			if (oWin.bIsMDIChild)
			{
				var oParentWin = this.Get(oWin.strParentID);
				if (oParentWin.strMDIActiveID != "" && oParentWin.strMDIActiveID != strID &&
				(oWin.bHasMenuBar || this.Get(oParentWin.strMDIActiveID).bHasMenuBar))
					this.bSwitchMenu = true;
				oParentWin.strMDIActiveID = strID;
			}
			else if (oWin.bIsMDI)
			{
				var oChildWindowIDs = this.GetSortWindowIDs(oWin.ChildWindows);
				this.SetWindowsZIndex(oChildWindowIDs);
			}
    		strID = oWin.strParentID;
    	}
    	else
    	{
    		strID = DESKTOP;
    	}
	}
}

function PBWindowManager_IsChildPopupWindow(oWin, strID)
{
	var oPopupWin;
	var bFound = false;
	
	if (oWin.strID == strID) bFound = true;
	if (!bFound)
	{
		for (var i = 0; i < oWin.PopupWindows.Size(); i++)
		{
			bFound = this.IsChildPopupWindow(oWin.PopupWindows.Get(i), strID);
			if (bFound)	break;
		}
	}
	return bFound;
}

function PBWindowManager_GetSortWindowIDs(oWindows)
{
	var oWindowIDs = new Array();
    var i = 0;
    while (i < oWindows.Size()) {
        var oWindow = oWindows.Get(i);
        if (document.getElementsByName(oWindow.strID).length == 0) {
            oWindows.Remove(oWindow);
        }
        else
            i++;
    }

    var nSize = oWindows.Size();
	for (i = 0; i < nSize; i++)
	{
		oWindowIDs[i] = oWindows.Get(i).strID;
	}
	var nZIndex;
	for (var i = nSize - 1; i > 0; i--)
	{
		for (var j = 0; j < i; j++)
		{
			if (oWindows.Get(j).GetHFZIndex() > oWindows.Get(j + 1).GetHFZIndex())
			{
				nZIndex = oWindowIDs[j];
				oWindowIDs[j] = oWindowIDs[j+1];
				oWindowIDs[j+1] = nZIndex;
			}	
		}
	}
	return oWindowIDs;
}

function PBWindowManager_SetWindowsZIndex(oWindowIDs)
{
	for (var i = 0; i < oWindowIDs.length; i++)
	{
		this.SetWindowZIndex(this.Get(oWindowIDs[i]));
	}
}

function PBWindowManager_GetPopupWindows(oPopupWindows, oWin)
{
	for (var i = 0; i < oWin.PopupWindows.Size(); i++)
	{
		oPopupWindows.Put(oWin.PopupWindows.Get(i));
	}
	for (var i = 0; i < oWin.ResponseWindows.Size(); i++)
	{
		oPopupWindows.Put(oWin.ResponseWindows.Get(i));
	}
	return oPopupWindows;
}

function PBWindowManager_GetPopupWindowsTree(oPopupWindows, strID)
{
	var oWin = this.Get(strID);
	oPopupWindows = this.GetPopupWindows(oPopupWindows, oWin);
	var windows = this.GetIDs();
	for (var i = 0; i < oWin.ChildWindows.Size(); i++)
	{
	    if (windows.Contains(oWin.ChildWindows.Get(i).strID))
	    {
		    oPopupWindows = this.GetPopupWindowsTree(oPopupWindows, oWin.ChildWindows.Get(i).strID);
		}
	}
	return oPopupWindows;
}

function PBWindowManager_ActiveWindow(evt, strID)
{
    var windows = this.GetIDs();
    var oWin = this.Get(strID);
    var strActiveID;
    var strRootWinID;
    
	this.SetWindowZIndex(oWin);
    if (oWin.bIsMDI)
    {
		this.ActiveTitlePane(oWin);
		if (!oWin.bMDIHasControl)
		{
			strActiveID = this.SetActiveSheet(oWin);
		}
		else
		{
			this.SetActiveSheet(oWin);
			strActiveID = strID;
		}
		strRootWinID = strID;
	}
	else if (oWin.bIsMDIChild)
	{
		this.ActiveTitlePane(oWin);
	    var oParentWin = this.Get(oWin.strParentID);
		if (oParentWin.strMDIActiveID != "" && oParentWin.strMDIActiveID != strID &&
		(oWin.bHasMenuBar || this.Get(oParentWin.strMDIActiveID).bHasMenuBar))
			this.bSwitchMenu = true;
	    oParentWin.strMDIActiveID = strID;
	    this.ActiveTitlePane(oParentWin);
	    var oChildWindowIDs = this.GetSortWindowIDs(oParentWin.ChildWindows);
	    this.SetWindowsZIndex(oChildWindowIDs);
		strActiveID = strID;
		strRootWinID = oParentWin.strID;
	}
	else if (oWin.bIsChild)
	{
		this.ActiveTreeTitlePane(strID);
		this.ActiveTree(oWin.strParentID);
		strActiveID = strID;
		strRootWinID = this.GetRootWin(strID);
	}
	else if (oWin.bIsPopup)
	{
		this.ActiveTitlePane(oWin);
		this.ActiveTree(oWin.strParentID);
		strActiveID = strID;
		strRootWinID = this.GetRootWin(strID);
	}
	else if (oWin.bIsResponse)
	{
		this.ActiveTitlePane(oWin);
		this.ActiveTree(oWin.strParentID);
		strActiveID = strID;
		strRootWinID = this.GetRootWin(strID);
	}	
	else
	{
		this.ActiveTitlePane(oWin);
		strActiveID = strID;
		strRootWinID = this.GetRootWin(strID);
	}
	
	this.SetPopupWindowsTree(this.Get(strRootWinID));
	return strActiveID;
}

function PBWindowManager_SetPopupWindowsTree(oWin)
{
	var oPopupWindows = new PBSet();
	oPopupWindows = this.GetPopupWindows(oPopupWindows, oWin);
	if (oWin.bIsMDI)
	{
		for (var i = 0; i < oWin.MDIChildWindows.Size(); i++)
		{
			oPopupWindows = this.GetPopupWindowsTree(oPopupWindows, oWin.MDIChildWindows.Get(i).strID);
		}
	}	
	for (var i = 0; i < oWin.ChildWindows.Size(); i++)
	{
		oPopupWindows = this.GetPopupWindowsTree(oPopupWindows, oWin.ChildWindows.Get(i).strID);
	}
	var oPopupWindowIDs = this.GetSortWindowIDs(oPopupWindows);
	var oPopupWin;
	for (var i = 0; i < oPopupWindowIDs.length; i++)
	{
		oPopupWin = this.Get(oPopupWindowIDs[i]);
		if (oPopupWin)
		{
			this.SetWindowZIndex(oPopupWin);
			this.SetPopupWindowsTree(oPopupWin);
		}
	}	
}

function PBWindowManager_DeActive(strID)
{
	do 
	{
    	var oWin = this.Get(strID);
    	if (oWin != null)
    	{
			var oTitlePane = oWin.GetTitlePane();
			if (oTitlePane != null)
			{
				oTitlePane.style.backgroundColor = "inactivecaption";
			}
			var oWinPane = oWin.GetWindowPane();
			if (oWinPane != null)
			{
				oWinPane.style.borderColor = "inactivecaption";
			}
			var oContentPane = oWin.GetContentPane();
			if (oContentPane != null)
			{
				oContentPane.style.borderColor = "inactivecaption";
			}
			if (oWin.bIsMDI)
			{
				for (var i=0; i<oWin.MDIChildWindows.Size(); i++)
				{
					oTitlePane = oWin.MDIChildWindows.Get(i).GetTitlePane();
					if (oTitlePane != null)
					{
						oTitlePane.style.backgroundColor = "inactivecaption";
					}
					oWinPane = oWin.MDIChildWindows.Get(i).GetWindowPane();
					if (oWinPane != null)
					{
						oWinPane.style.borderColor = "inactivecaption";
					}
					var oContentPane = oWin.MDIChildWindows.Get(i).GetContentPane();
					if (oContentPane != null)
					{
						oContentPane.style.borderColor = "inactivecaption";
					}
				}
			}
		    strID = oWin.strParentID;
		}
		else
		{
			strID = DESKTOP;
		}
	}
    while(strID != DESKTOP);
}

function PBWindowManager_SetActiveSheet(oWin)
{
    var nZIndex = 0;
    var oTopMDIChildWin;
    
	for (var i = 0; i < oWin.MDIChildWindows.Size(); i++)
	{
		var oMDIChildWin = oWin.MDIChildWindows.Get(i);
		var nWinZIndex = oMDIChildWin.GetHFZIndex();
		if (nWinZIndex > nZIndex)
		{
		    nZIndex = nWinZIndex;
		    oTopMDIChildWin = oMDIChildWin;
		}
	}
	
	if (nZIndex > 0)
	{
		if (oWin.strMDIActiveID != "" && oWin.strMDIActiveID != oTopMDIChildWin.strID &&
		(this.Get(oWin.strMDIActiveID).bHasMenuBar || this.Get(oTopMDIChildWin.strID).bHasMenuBar))
			this.bSwitchMenu = true;
		oWin.strMDIActiveID = oTopMDIChildWin.strID;
	    this.ActiveTitlePane(oTopMDIChildWin);
        return oTopMDIChildWin.strID;
    }
    return oWin.strID;
}

function PBWindowManager_TrackMouse(evt)
{
	if (g_maskCount > 0)
	{
		return;
	}
	
	var e = PB_GetEvent(evt);
	var oWin = goWindowManager.Get(goWindowManager.strActiveID);
	if (oWin != null)
	{
		var oPoint = goWindowManager.GetRelativeCoords(oWin);
		oWin.SetHFPointerX(e.clientX - oPoint.x);
		oWin.SetHFPointerY(e.clientY - oPoint.y);
	}
	
	PBWindowManager.mousex = e.clientX;
	PBWindowManager.mousey = e.clientY;
	var obj = PBWindowManager.grabbedObj;
	if (obj != null && PBWindowManager.grabbed) 
	{
		var oWin = goWindowManager.Get(obj.id);
		if (oWin != null)
		{
			var oParentCltArea = goWindowManager.GetParentCltArea(oWin);
			var x = Math.round(parseInt(obj.style.left) + PBWindowManager.mousex - PBWindowManager.lyrx);
			var y = Math.round(parseInt(obj.style.top) + PBWindowManager.mousey - PBWindowManager.lyry);
			var parentRight = oParentCltArea.left + oParentCltArea.width - 1;
			var oPoint = goWindowManager.GetScrollCoords(obj);
			if (PBWindowManager.mousex + document.body.scrollLeft + oPoint.x >= oParentCltArea.left && 
				PBWindowManager.mousex + document.body.scrollLeft + oPoint.x <= parentRight)
			{
				obj.style.left = x + "px";
			}
			
			var parentBottom = oParentCltArea.top + oParentCltArea.height - 1;
			if (PBWindowManager.mousey + document.body.scrollTop + oPoint.y >= oParentCltArea.top + TITLE_HEIGHT/2 && 
				PBWindowManager.mousey + document.body.scrollTop + oPoint.y <= parentBottom - TITLE_HEIGHT/2) 
			{
				obj.style.top = y + "px";
			}

			PBWindowManager.lyrx = PBWindowManager.mousex;
			PBWindowManager.lyry = PBWindowManager.mousey;
		}
	}
	else if (PBWindowManager.resized) 
	{
		var robj = PBWindowManager.resizedObj;
		var oWin = goWindowManager.Get(robj.id);
		if (oWin != null)
		{
			var oParentCltArea = goWindowManager.GetParentCltArea(oWin);
			var nMinWidth = 100;
			var offsetx = PBWindowManager.mousex - PBWindowManager.lyrx;
			var offsety = PBWindowManager.mousey - PBWindowManager.lyry;
			var oPoint = goWindowManager.GetScrollCoords(robj);
			var mousex = PBWindowManager.mousex + document.body.scrollLeft + oPoint.x;
			var mousey = PBWindowManager.mousey + document.body.scrollTop + oPoint.y;
			var width;
			var height;
			var right = oParentCltArea.left + oParentCltArea.width - 1;
			var bottom = oParentCltArea.top + oParentCltArea.height - 1;
			if (PBWindowManager.cursor == "nw-resize" ||
				PBWindowManager.cursor == "w-resize" ||
				PBWindowManager.cursor == "sw-resize") 
			{
				width = Math.round(PBWindowManager.width - offsetx);
				if (mousex >= oParentCltArea.left && width > nMinWidth)
				{
					robj.style.left = Math.round(PBWindowManager.left + offsetx) + "px";
					robj.style.width = width + "px";
				}
			}
			if (PBWindowManager.cursor == "nw-resize" ||
				PBWindowManager.cursor == "n-resize" ||
				PBWindowManager.cursor == "ne-resize") 
			{
				height = Math.round(PBWindowManager.height - offsety);
				if (mousey >= oParentCltArea.top && mousey <= bottom - TITLE_HEIGHT/2 && height > 70)
				{
					robj.style.top = Math.round(PBWindowManager.top + offsety) + "px";
					robj.style.height = height + "px";
				}
			}
			if (PBWindowManager.cursor == "ne-resize" ||
				PBWindowManager.cursor == "e-resize" ||
				PBWindowManager.cursor == "se-resize") 
			{
				width = Math.round(PBWindowManager.width + offsetx);
				if (mousex <= right && width > nMinWidth) 
				{
					robj.style.width = width + "px";
				}
			}
			if (PBWindowManager.cursor == "se-resize" ||
				PBWindowManager.cursor == "s-resize" ||
				PBWindowManager.cursor == "sw-resize") 
			{
				height = Math.round(PBWindowManager.height + offsety);
				if (mousey <= bottom && height > 70)
				{
					robj.style.height = Math.round(PBWindowManager.height + offsety) + "px";
				}
			}
			
			oWin.AdjustSize();
		}
	}
	else 
	{
		var obj = e.srcElement;
		if (obj.id)
		{
			if (obj.id.substring(0, 3) == WIN_PREFIX)
			{
				var oWin = goWindowManager.Get(obj.id);
				if (oWin != null && oWin.nState == WIN_STATE_NOR && oWin.bResizable)
				{
					var cornerWidth = 17;
					var x = PBWindowManager.mousex + document.body.scrollLeft;
					var y = PBWindowManager.mousey + document.body.scrollTop;
					var oPoint = goWindowManager.GetScrollCoords(obj);
					x += oPoint.x;
					y += oPoint.y;
					oPoint = goWindowManager.GetAbsoluteCoords(obj);
					var left = oPoint.x;
					var top = oPoint.y;
					var right = left + parseInt(obj.style.width) - 1;
					var oWin = goWindowManager.Get(obj.id);
					var bottom = top + obj.offsetHeight;
					if (x >= left - cornerWidth && x <= left + cornerWidth)
					{
						if (y >= top - cornerWidth && y <= top + cornerWidth)
						{
							obj.style.cursor = "NW-resize";
						}
						else if (y <= bottom + cornerWidth && y >= bottom - cornerWidth)
						{
							obj.style.cursor = "SW-resize";
						}
						else
						{
							obj.style.cursor = "W-resize";
						}
					}
					else if (x <= right + cornerWidth && x >= right - cornerWidth) 
					{
						if (y >= top - cornerWidth && y <= top + cornerWidth)
						{
							obj.style.cursor = "NE-resize";
						}
						else if (y <= bottom + cornerWidth && y >= bottom - cornerWidth)
						{
							obj.style.cursor = "SE-resize";
						}
						else
						{
							obj.style.cursor = "E-resize";
						}
					}
					else 
					{
						if (y >= top - cornerWidth && y <= top + cornerWidth)
						{
							obj.style.cursor = "N-resize";
						}
						else if (y <= bottom + cornerWidth && y >= bottom - cornerWidth)
						{
							obj.style.cursor = "S-resize";
						}
						else
						{
							obj.style.cursor = "default";
						}
					}
				}
				else 
				{
					obj.style.cursor = "default";
				}
			}
		}
	}
}

function PBWindowManager_GetRelativeCoords(oWin)
{
	var oPoint, oScrollPoint;
	if (oWin.bIsMDIChild && oWin.strTabID != "")
	{
		var oParentClientArea = this.GetTabMDICltArea(oWin);
		oPoint = new Object();
		oPoint.x = oParentClientArea.left;
		oPoint.y = oParentClientArea.top;
		var oParentWindowPane = oWin.GetTabMDIContentPane();
		oScrollPoint = this.GetScrollCoords(oParentWindowPane);
	}
	else
	{
		var oContentPane = oWin.GetContentPane();
		oPoint = this.GetAbsoluteCoords(oContentPane);
		oScrollPoint = this.GetScrollCoords(oContentPane);
	}
	
	oPoint.x -= (document.body.scrollLeft + oScrollPoint.x);
	oPoint.y -= (document.body.scrollTop + oScrollPoint.y);
	
	var oChildWin = oWin;
    if (gWindowStyle == WINDOW_STYLE || oChildWin.bIsPopup || oChildWin.bIsResponse)
    {
		oPoint.x += BORDER_WIDTH * 3;
		oPoint.y += BORDER_WIDTH * 3;
		do 
		{
			if (oChildWin.bIsChild || (oChildWin.bIsMDIChild && oChildWin.nState == WIN_STATE_NOR))
			{
				oPoint.x += BORDER_WIDTH * 2;
				oPoint.y += BORDER_WIDTH * 2;
			}
			if (oChildWin.strParentID == DESKTOP || oChildWin.bIsPopup || oChildWin.bIsResponse) break;
			oChildWin = this.Get(oChildWin.strParentID);
		}
		while(true);
	}
	else
	{
		oPoint.x += BORDER_WIDTH;
		oPoint.y += BORDER_WIDTH;
		if (oChildWin.bIsChild)
		{
			do 
			{
				if (oChildWin.bIsChild)
				{
					oPoint.x += BORDER_WIDTH * 2;
					oPoint.y += BORDER_WIDTH * 2;
				}
				else if (oChildWin.bIsMDIChild && oChildWin.strTabID != "")
				{
					oPoint.x += 2;
					oPoint.y += 2;
				}
				if (oChildWin.strParentID == DESKTOP || oChildWin.bIsPopup || oChildWin.bIsResponse)
				{
					if (oChildWin.bIsPopup || oChildWin.bIsResponse)
					{
						oPoint.x += BORDER_WIDTH * 2;
						oPoint.y += BORDER_WIDTH * 2;
					}
					break;
				}
				oChildWin = this.Get(oChildWin.strParentID);
			}
			while(true);
		}
	}
	return oPoint;
}

function PBWindowManager_GetRightClickWindow(oSrc)
{
	var oWin = null;
	var windows = goWindowManager.GetIDs();
	var nOffsetX = 0;
	var nOffsetY = 0;
	var bFirst = true;
	while (oSrc != null && oSrc.id != undefined) 
	{
		if (oSrc.id.substring(0, 3) == WIN_PREFIX)
		{
			oWin = goWindowManager.Get(oSrc.id);
			oWin.nOffsetX = nOffsetX;
			oWin.nOffsetY = nOffsetY - this.GetWorkSpaceOffset(oWin);
			return oWin;
		}
		else if (oSrc.id.indexOf(TAB_MDICONTENTPANE_SUFFIX) != -1)
		{
			var strTabID = oSrc.id.substring(0, oSrc.id.length - TAB_MDICONTENTPANE_SUFFIX.length);
			for (var i = 0; i < windows.Size(); i++)
			{
				oWin = goWindowManager.Get(windows.Get(i));
				if (oWin.strTabID == strTabID && oWin.bActive) 
				{
					oWin.nOffsetX = nOffsetX;
					oWin.nOffsetY = nOffsetY - 27;
					return oWin; 
				}
			}
		}
		if (bFirst)
		{
			bFirst = false;
		}
		else
		{
			nOffsetX += oSrc.offsetLeft;
			nOffsetY += oSrc.offsetTop;
		}
		oSrc = oSrc.offsetParent;
	}
}

function PBWindowManager_SetPointer(e)
{
	var oWin = this.Get(this.strActiveID);
	var oPoint = this.GetRelativeCoords(oWin);
	oWin.SetHFPointerX(e.clientX - oPoint.x);
	oWin.SetHFPointerY(e.clientY - oPoint.y);
}

function PBWindowManager_Click(evt)
{
	var e = PB_GetEvent(evt);

	if (e.button == 2)
	{
		var srcElem = e.srcElement;
		if(PBDataWindow_ImmediateRButtonDownPostbackIfInDataWindow(e, srcElem))
		{
		}
		else 
		{
			var oPBTypeObj = this.GetPBTypeObj(srcElem);
			if (oPBTypeObj == null) return;
			if (oPBTypeObj.id == undefined) return;
			var oWin;
			if (oPBTypeObj.id.substring(0, 10) == CONTENTWIN_PREFIX)
			{
				oWin = this.GetRightClickWindow(srcElem);
			}
			else
			{
				oWin = this.GetRightClickWindow(oPBTypeObj);
			}
			var oPoint = this.GetRelativeCoords(oWin);
			var pbType = oPBTypeObj.getAttribute("pbtype");
			if (srcElem.id != undefined && pbType != undefined)
			{
				var nLeft = parseInt(oPBTypeObj.offsetLeft) + oPoint.x + oWin.nOffsetX;
				var nRight = nLeft + oPBTypeObj.offsetWidth - 1;
				var nTop = parseInt(oPBTypeObj.offsetTop) + oPoint.y + oWin.nOffsetY;
				var nBottom = nTop + oPBTypeObj.offsetHeight - 1;
				var oObj;
				var strObjID;
				var pbID = oPBTypeObj.getAttribute("pbid");
				if ((pbID != undefined) && (pbType == "radio" || pbType == "checkbox" || pbType == "scb" ||
					pbType == "editmask" || pbType == "pbutton"))
				{
					oObj = oWin.Controls.Get(pbID);
					strObjID = pbID;
				}
				else
				{
					oObj = oWin.Controls.Get(oPBTypeObj.id);
					strObjID = oPBTypeObj.id;
				}
				var offsetLeft = 0;
				var offsetTop = 0;
				
				if (pbType == "scb")
				{
					offsetLeft = parseInt(srcElem.style.left);
					offsetTop = parseInt(srcElem.style.top);
					if (srcElem.className == "ScrollBarArea")
					{
						var sbo = goScrBarMgr.Get(pbID);
						if (sbo.orientation == HORIZONTAL)
							offsetLeft = 0;						
						else
							offsetTop = 0;
					}
				}
				
				if (oObj != null && oObj.bHasRMB && e.clientX >= nLeft && e.clientX <= nRight &&
					e.clientY >= nTop && e.clientY <= nBottom)
				{
					if (oWin.strTabID == "")
					{
						PB_ShowMask();
						__doPostBack(oWin.strUniqueID, "RightClick,"+strObjID+","+(e.clientX-nLeft+offsetLeft)+","+(e.clientY-nTop+offsetTop));
						PB_HideMask();
					}
					else
					{
						
						PB_ShowMask();
						__doPostBack(this.Get(oWin.strParentID).strUniqueID, "RightClickChild," + oWin.strUniqueID +","+strObjID+","+(e.clientX-nLeft+offsetLeft)+","+(e.clientY-nTop+offsetTop ));
						PB_HideMask();
					}
				}
			}
			this.ProcessWindowClick(oWin, e, "RightClick", (e.clientX - oPoint.x), (e.clientY - oPoint.y));
		}
	}
	else if (PB_IsLeftButtonDown(e)) 
	{
		if (typeof(goPictureListBoxManager) != "undefined")
		{
			if (this.nLevel == -1)
			{
				this.nLevel = this.GetWindowLevel(e.srcElement);
			}
			if (this.nLevel == 0)
			{
				this.nLevel = -1;
				goPictureListBoxManager.ClickOutSide();
			}
			else
			{
				this.nLevel--;
			}
		}

		var oWin = this.Get(this.strActiveID);
		var oPoint = this.GetRelativeCoords(oWin);
		var nMouseX = e.clientX - oPoint.x; 
		var nMouseY = e.clientY - oPoint.y;
		oWin.SetHFPointerX(nMouseX);
		oWin.SetHFPointerY(nMouseY);
	
		this.ProcessWindowClick(oWin, e, "Click",nMouseX, nMouseY);
	}
}

function PBWindowManager_ProcessWindowClick(oWin, e, strClickType, nMouseX, nMouseY)
{
	var srcElem = e.srcElement;
	if (srcElem.id != undefined)
	{
		if (srcElem.id != "")
		{
			if (srcElem.id.substring(0, 10) == CONTENTWIN_PREFIX && (strClickType == "Click"?oWin.bClicked:oWin.bRightClicked))
			{
				PB_ShowMask();
				__doPostBack(oWin.strUniqueID, strClickType+",,"+nMouseX+","+nMouseY);
				PB_HideMask();
			}
			else
			{
				var oSrc = srcElem.parentNode.parentNode;
				if (gWindowStyle == WEB_STYLE && oSrc != null && oSrc.id.indexOf(TAB_MDICONTENTPANE_SUFFIX) != -1)
				{
					var strTabID = oSrc.id.substring(0, oSrc.id.length - TAB_MDICONTENTPANE_SUFFIX.length);
					if (strTabID == oWin.strTabID && (strClickType == "Click" ? oWin.bClicked : oWin.bRightClicked))
					{
						PB_ShowMask();
						__doPostBack(this.Get(oWin.strParentID).strUniqueID, strClickType+"Child," + oWin.strUniqueID+",,"+nMouseX+","+nMouseY);
						PB_HideMask();
					}
				}
			}
		}
	}
}

function PBWindowManager_Grab(evt)
{
	var e = PB_GetEvent(evt);

	if (PB_IsLeftButtonDown(e)) 
	{
		PBWindowManager.lyrx = e.clientX;
		PBWindowManager.lyry = e.clientY;
		var oSrc = e.srcElement;
		var oOldSrc = oSrc;
		while (oSrc != null && oSrc.id.substring(0, 3) != WIN_PREFIX) 
		{
			oSrc = oSrc.offsetParent;
		}		
		if (oSrc != null)
		{
			var oWin = this.Get(oSrc.id);
			if (oSrc.id != this.strActiveID) 
			{
				this.Active(evt, oSrc.id);
			}
			
			var id = oOldSrc.parentNode.id;
			if ((oWin.bIsMDIChild && id.substring(0, 5) == BT_WIN_MIN) ||
				id.substring(0, 8) == BT_MDI_WIN_MIN ||
				id.substring(0, 8) == BT_MDI_WIN_NOR)
			{
				if (id.substring(0, 8) == BT_MDI_WIN_MIN)
				{
					strNextID = this.GetActiveMDIChildWinID(this.Get(oWin.strMDIActiveID));
					if (strNextID != oWin.strMDIActiveID)
					{
						this.Active(evt, strNextID);
					}					
				}
				else if (id.substring(0, 8) == BT_MDI_WIN_NOR)
				{
					this.Active(evt, oWin.strMDIActiveID);
				}
				else
				{
					strNextID = this.GetActiveMDIChildWinID(oWin);
					if (strNextID != oWin.strID)
					{
						this.Active(evt, strNextID);
					}
				}
			}
						
			if (oWin.nState != WIN_STATE_MAX)
			{ 
				PBWindowManager.grabbedObj = oSrc;
				if (oWin.bHasTitleBar)
				{
					PBWindowManager.grabbed = true;
				}
				var oTitlePane = oWin.GetTitlePane();
				PB_SetCapture(oTitlePane, PB_UnGrab);
			}
		}
	}
	
	PB_CancelBubble(e);
}

function PB_UnGrab(evt)
{
	goWindowManager.UnGrab(evt);
}

function PBWindowManager_UnGrab(evt)
{
	var e = PB_GetEvent(evt);
	this.lyrx = e.clientX;
	this.lyry = e.clientY;

	var grabbedObj = PBWindowManager.grabbedObj;
	if (grabbedObj != null) 
	{
		var oWin = this.Get(grabbedObj.id);
		if (oWin != null) 
		{
			var oTitlePane = oWin.GetTitlePane();
			PB_ReleaseCapture(oTitlePane, PB_UnGrab);

			var oWinPane = oWin.GetWindowPane();
			if (oWin.nState == WIN_STATE_NOR)
			{
				oWin.nNormalTop = parseInt(oWinPane.style.top);
				oWin.nNormalLeft = parseInt(oWinPane.style.left);
				oWin.SetHFLeft(oWin.nNormalLeft);
				oWin.SetHFTop(oWin.nNormalTop);
			}

			PBWindowManager.grabbed = false;
			PBWindowManager.grabbedObj = null;

		}
	}

	this.SetFocus1(evt);
	PB_CancelBubble(e);
}

function PBWindowManager_SheetTabCallBack(evt, nIndex)
{
	var windows = this.GetIDs();
	var strActiveID;
	for (var i = 0; i < windows.Size(); i++)
	{
		var oWin = this.Get(windows.Get(i));
		if(oWin == null)
		    continue;
		if (oWin.nTabIndex == nIndex)
		{
			strActiveID = oWin.strID;
			break;
		}
	}
	this.Active(evt, strActiveID);
}

function PBWindowManager_MouseDown(evt)
{
	var e = PB_GetEvent(evt);
	if (PB_IsLeftButtonDown(e)) 
	{
		var oSrc = e.srcElement;
		var strActiveID = this.strActiveID;
		while (oSrc != null && oSrc.id != undefined) 
		{
			if (oSrc.id.substring(0, 3) == WIN_PREFIX)
			{
				strActiveID = oSrc.id;
				var oActiveWin = goWindowManager.Get(strActiveID);
				if (oActiveWin.bIsChild || oActiveWin.bIsPopup || oActiveWin.bIsResponse) return;
				break;
			}
			if (oSrc.id.indexOf(TAB_MDICONTENTPANE_SUFFIX) != -1)
			{
				var strTabID = oSrc.id.substring(0, oSrc.id.length - TAB_MDICONTENTPANE_SUFFIX.length);
				var windows = goWindowManager.GetIDs();
				for (var i = 0; i < windows.Size(); i++)
				{
					var oWin = goWindowManager.Get(windows.Get(i));
					if (oWin.strTabID == strTabID && oWin.bActive) 
					{
						strActiveID = oWin.strID;
						break;
					}
				}
				if (strActiveID != "")
					break;
			}
			oSrc = oSrc.offsetParent;
		}
		
		if (strActiveID != this.strActiveID)
		{
			this.Active(evt, strActiveID);
		}
	}
	
	PB_CancelBubble(e);
}

function PBWindowManager_ResizeBegin(evt)
{
	var e = PB_GetEvent(evt);
	if (PB_IsLeftButtonDown(e)) 
	{
		var oSrc = e.srcElement;
		var oOldSrc = oSrc;
		while (oSrc != null && oSrc.id != undefined && oSrc.id.substring(0, 3) != WIN_PREFIX) 
		{
			oSrc = oSrc.offsetParent;
		}
		if (oSrc != null && oSrc.id != undefined)
		{
			var oWin = this.Get(oSrc.id);
			if (oWin.nState == WIN_STATE_NOR)
			{
				PBWindowManager.resizedObj = oOldSrc;
				PBWindowManager.left = parseInt(PBWindowManager.resizedObj.style.left);
				PBWindowManager.top = parseInt(PBWindowManager.resizedObj.style.top);
				PBWindowManager.width = parseInt(PBWindowManager.resizedObj.style.width);
				PBWindowManager.height = parseInt(PBWindowManager.resizedObj.style.height);
				PBWindowManager.resized = true;
				PBWindowManager.lyrx = e.clientX;
				PBWindowManager.lyry = e.clientY;
				PBWindowManager.cursor = PBWindowManager.resizedObj.style.cursor;
			
				if (oOldSrc.id.substring(0, 3) == WIN_PREFIX)
				{
					PB_SetCapture(oSrc, PB_ResizeEnd);
				}
			}
			if (oSrc.id != this.strActiveID)
			{
				this.Active(evt, oSrc.id);
			}
		}
	}

	PB_CancelBubble(e);	
}

function PB_ResizeEnd(evt)
{
	goWindowManager.ResizeEnd(evt);
}

function PBWindowManager_ResizeEnd(evt)
{
	try
	{
	    if (PBWindowManager.resized) 
	    {
		    var oSrc = PBWindowManager.resizedObj;
		    while (oSrc != null && oSrc.id.substring(0, 3) != WIN_PREFIX) 
		    {
			    oSrc = oSrc.offsetParent;
		    }
		    if (oSrc != null)
		    {
			    if (PBWindowManager.resizedObj.id.substring(0, 3) == WIN_PREFIX)
			    {
				    PB_ReleaseCapture(PBWindowManager.resizedObj, PB_ResizeEnd);
			    }
			    var oWin = this.Get(oSrc.id);
			    if (oWin != null) 
			    {
				    var oWinPane = oWin.GetWindowPane();
				    oWin.nNormalTop = parseInt(oWinPane.style.top);
				    oWin.nNormalLeft = parseInt(oWinPane.style.left);
				    oWin.nNormalWidth = parseInt(oWinPane.style.width);
				    oWin.nNormalHeight = parseInt(oWinPane.style.height);
				    oWin.SetHFLeft(oWin.nNormalLeft);
				    oWin.SetHFTop(oWin.nNormalTop);
				    oWin.SetHFWidth(oWin.nNormalWidth);
				    oWin.SetHFHeight(oWin.nNormalHeight);
				    this.SetChildWindowParentClientArea(oWin);
				    this.SetMDIClient(oWin);
				    if (oWin.bIsMDI)
				    {
					    this.ResetMDIChild(evt, oWin.strID);
				    }
				    this.ResetChild(evt, oWin.strID);
				    PBWindowManager.resized = false;
				    PBWindowManager.resizedObj = null;

				    var e = PB_GetEvent(evt);
				    if (e.clientX != PBWindowManager.lyrx || e.clientY != PBWindowManager.lyry)
				    {
					    oWin.AdjustSize();
				    }
			    }
		    }
	    }
	    this.SetFocus1(evt);
    }
	catch(e)
	{
	}
}

function PBWindowManager_Min(evt, strID)
{
	try
	{
		var oWin = this.Get(strID);
		var strParentID;
		
		if (oWin.bIsPopup || oWin.bIsResponse) 
		{
			strParentID = DESKTOP;
		} 
		else 
		{
			strParentID = oWin.strParentID;
		}

		var oParentWindow = this.Get(strParentID);
		var oWindowPane = oWin.GetWindowPane();
		var oParentClientArea = this.GetParentCltArea(oWin);
		var nWidth = oParentClientArea.width;
		var nHeight = oParentClientArea.height;
		if (nHeight != 0)
		{
			var nCols = parseInt(nWidth /(MIN_WIDTH + 2));
			var nMinWinCount;
			if (oWin.bIsMDIChild)
			{
				nMinWinCount = oParentWindow.nMinMDIChildWinCount;
			}
			else
			{
				nMinWinCount = oParentWindow.nMinWinCount;
			}
			var nRow = parseInt(nMinWinCount / nCols);
			var nCol = parseInt(nMinWinCount % nCols);
			var oTitlebar = oWin.GetTitlePane();
			oTitlebar.style.display = "block";
			var nMinimalHeight = TITLE_HEIGHT;
			with(oWindowPane.style)
			{
				top = nHeight - (nMinimalHeight + 4) * (nRow + 1);
				left = (MIN_WIDTH + 2) * nCol;
				width = MIN_WIDTH;
				height = nMinimalHeight;
			}
			if (oWin.bIsMDIChild)
			{
				if (oWin.nState == WIN_STATE_MAX)
				{
					oWin.ShowMDIButtons(false);
					oWindowPane.style.borderStyle = oWin.strWinPaneBorderStyle;
				}
			}
			this.ShowMDIButtons(strID, false);
			oWin.nState = WIN_STATE_MIN;
			oWin.RenderContentPane();
			oWin.ShowControlBoxButtons(WIN_STATE_MIN);
			
			oWin.SetHFState(WIN_STATE_MIN);
			if (oWin.bIsMDIChild)
			{		
				oParentWindow.nMinMDIChildWinCount++;
			}
			else
			{
				oParentWindow.nMinWinCount++;
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_Min:" + e.description;
	}
}

function PBWindowManager_ShowMDIButtons(strID, bShow)
{
	var oParentWin = this.Get(strID);
	var oIDs = this.GetIDs();
	
	try
	{
		for (var i = 0; i < oIDs.Size(); i++)
		{
			var strWinID = oIDs.Get(i);
			var oWin = this.Get(strWinID);
			if (oWin.strParentID == strID && oWin.bIsMDIChild && oWin.nState == WIN_STATE_MAX)
			{
				oWin.ShowMDIButtons(bShow);
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_ShowMDIButtons:" + e.description;
	}	
}

function PBWindowManager_Close1(nTabIndex, strTabID)
{
	var strUniqueID = "";
	var oIDs = this.GetIDs();
	var oWin;
	for (var i = 0; i < oIDs.Size(); i++)
	{
		var strWinID = oIDs.Get(i);
		oWin = this.Get(strWinID);
		var oTab = goTabManager.Get(strTabID);
		if(oWin ==null || oTab == null)
		    continue;
		if (oWin.nTabIndex == oTab.selectedTabIndex) 
		{
			var oParentWin = this.Get(oWin.strParentID);
			strUniqueID = oParentWin.strUniqueID;
			break;
		}
	}
	__doPostBack(strUniqueID, oWin.strUniqueID);
}

function PBWindowManager_Close(strID)
{
	var	oWin = this.Get(strID);
	gbPrompt = false;
	__doPostBack(oWin.strUniqueID, "");
}

function PBWindowManager_FileManager(strID)
{
	var	oWin = this.Get(strID);
	__doPostBack(oWin.strUniqueID, "FileManager");
}

function PBWindowManager_PrintManager(strID)
{
	var	oWin = this.Get(strID);
	__doPostBack(oWin.strUniqueID, "PrintManager");
}

function PBWindowManager_MailProfileManager(strID)
{
	var	oWin = this.Get(strID);
	__doPostBack(oWin.strUniqueID, "MailProfileMgr");
}

function PBWindowManager_ThemeManager(strID)
{
	var	oWin = this.Get(strID);
	__doPostBack(oWin.strUniqueID, "ThemeManager");
}

function PBWindowManager_UploadFiles(files)
{
	var oWin = goWindowManager.Get(goWindowManager.GetIDs().Get(1));
	window.setTimeout("__doPostBack('" + oWin.strUniqueID + "', '" + "UploadFiles," + files + "')", 500);
}

function PBWindowManager_GetScrollCoords(oElement)
{
	var oResPoint = new Object();
	oResPoint.x = 0;
	oResPoint.y = 0;
	try
	{
		while(oElement.tagName != "BODY")
		{
			oResPoint.x = oResPoint.x + oElement.scrollLeft;
			oResPoint.y = oResPoint.y + oElement.scrollTop;
			oElement= oElement.offsetParent;
		}
		
	}
	catch(e)
	{
		window.status = "PBWindowManager_GetScrollCoords:" + e.description;
	}
	return oResPoint;
}

function PBWindowManager_GetAbsoluteCoords(oElement)
{
	var oResPoint = new Object();
	oResPoint.x = 0;
	oResPoint.y = 0;
	try
	{
		while(oElement.tagName != "BODY")
		{
			oResPoint.x = oResPoint.x + oElement.offsetLeft;
			oResPoint.y = oResPoint.y + oElement.offsetTop;
			oElement= oElement.offsetParent;
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_GetAbsoluteCoords:" + e.description;
	}
	return oResPoint;
}

function PBWindowManager_HandleSelectElement()
{
	var selectArray = document.getElementsByTagName('select');
	var oActiveWin = this.Get(this.strActiveID);
	var bInSheetTab = false;
	for(var i = 0; i < selectArray.length; i++)
	{
		var offsetParentObj = selectArray[i].offsetParent;
		while (offsetParentObj.id.substring(0, 3) != WIN_PREFIX)
		{
			if (gWindowStyle == WEB_STYLE &&
				offsetParentObj.id.indexOf(TAB_MDICONTENTPANE_SUFFIX) != -1)
			{
				var strTabID = offsetParentObj.id.substring(0, offsetParentObj.id.length - TAB_MDICONTENTPANE_SUFFIX.length);
				if (oActiveWin.strTabID == strTabID)
				{
					bInSheetTab = true;
					break;
				}
			}
			offsetParentObj = offsetParentObj.offsetParent;
		}
		if (bInSheetTab || offsetParentObj.style.zIndex == this.GetActiveWinZIndex()|| oActiveWin.bIsMessageBox)
		{
			selectArray[i].style.visibility = 'visible';
		}
		else
		{
			selectArray[i].style.visibility = 'hidden';
		}
	}
}

function PBWindowManager_GetMaxZIndex()
{
	return ++this.nMaxZIndex;
}

function PBWindowManager_GetPBTypeObj(obj)
{
	var findIt = false;
	while (obj != null && obj.id != undefined && obj.id.substring(0, 10) != CONTENTWIN_PREFIX)
	{
		if (obj.getAttribute("pbtype") != undefined)
		{
			findIt = true;
			break;
		}
		else
		{
			obj = obj.parentNode;
		}
	}
	
	return (findIt ? obj : null);
}

function PBWindowManager_GetWindowLevel(obj)
{
	var level = 0;
	if (obj != null && obj.id != undefined)
	{
		while (obj != null && obj.id != undefined)
		{
			if (obj.id.substring(0, 3) == WIN_PREFIX)
			{
				level++;
				var oWin = this.Get(obj.id);
				if (oWin != null && oWin.strParentID == DESKTOP) break;
			}
			obj = obj.parentNode;
		}
		level--;
	}
	return level;
}

function PBWindowManager_IsDataWindowObj(obj)
{
	var oPBTypeObj = this.GetPBTypeObj(obj);
	if (oPBTypeObj != null && oPBTypeObj.getAttribute && oPBTypeObj.getAttribute("pbtype") == "datawindow")
	{
		return true;
	}
	else
	{
		return false;
	}
}

function PBWindowManager_IsRichTextEditObj(obj)
{	
	var oPBTypeObj = this.GetPBTypeObj(obj);
	if (oPBTypeObj != null && oPBTypeObj.getAttribute && oPBTypeObj.getAttribute("pbtype") == "richtextedit")
	{
		return true;
	}
	else
	{
		return false;
	}
}

function PBWindowManager_SetFocus(evt, strFocusObjID)
{
	try
	{
		if (strFocusObjID != "")
		{
		    var oFocusObj = document.getElementById(strFocusObjID);
		    if (oFocusObj != null)
		    {
			    this.OnFocusOwn(strFocusObjID);
			    var oPBTypeObj = this.GetPBTypeObj(oFocusObj);
			    if (oPBTypeObj != undefined && oPBTypeObj != null)	
			    {
				    var pbType = oPBTypeObj.getAttribute("pbtype");
				    if (pbType != undefined)
				    {
					    if (pbType == "listview")
					    {
						    //goListViewManager.OnClickOwn(strFocusObjID);
						    goListViewManager.OnClickOwn(oPBTypeObj.id);
					    }
					    else if (pbType == "datawindow")
					    {
					    }
					    else if (pbType == "editmask")
					    {
						    goEditMaskManager.SetFocus(evt, strFocusObjID);
					    }
							else if (pbType == "richtextedit")
							{
								goRichEditManager.SetFocus(evt, strFocusObjID);
							}
				        else if (pbType == "textbox")
					    {
						    goTextBoxMgr.SetFocus(strFocusObjID);
					    }
					    else if (pbType == "tab")
					    {
						    goTabManager.SetFocus(strFocusObjID);
					    }
					    else if (pbType == "checkbox")
					    {
								PBCheckBoxSetFocus(evt, strFocusObjID);
					    }
					    else if (pbType == "radio")
					    {
								PB_RadioButtonSetFocus(evt, strFocusObjID);
					    }
					    else if (pbType == "treeview")
					    {
								oFocusObj.focus();
					    }
					    else if (pbType == "dropdownlistbox" || pbType == "listbox")
					    {
								goPictureListBoxManager.SetFocus(strFocusObjID);
					    }
					    else
					    {
								if (oFocusObj.tagName != 'SELECT' && !oFocusObj.disabled)
								{
									oFocusObj.focus();
								}				    
					    }
					  }
			    }
			    else
			    {
					if (oFocusObj.tagName != 'SELECT' && !oFocusObj.disabled)
				    {
					    oFocusObj.focus();
				    }
			    }
		    }
		}
	    else
	    {
		    var oActiveWin = this.Get(this.strActiveID);
		    var oWindowPane = oActiveWin.GetWindowPane();
		    if (oWindowPane != null)
		    {
				oWindowPane.focus();
			}
	    }		
	}
	catch(ex)
	{
		window.status = "PBWindowManager_SetFocus:" + ex.description;
	}
}

function PBWindowManager_OnFocusOwn(strID)
{
	strID = this.GetPBTypeObjectID(strID);
	var oWin = this.Get(this.strActiveID);
	
	if (oWin != null)
	{
		oWin.SetFocusObjID(strID);
	}
	PBDataWindow_OnGlobalChangeFocus();
	if (this.strFocusObjID != "" && this.strFocusObjID != strID)
	{
	    var oFocusObj = document.getElementById(this.strFocusObjID);
		this.strFocusObjID = strID;
	    var oPBTypeObj = this.GetPBTypeObj(oFocusObj);
	    if (oPBTypeObj != undefined &&  oPBTypeObj != null && oFocusObj != null)
	    {
		    var pbType = oPBTypeObj.getAttribute("pbtype");
			if (pbType == "editmask")
			{
				goEditMaskManager.OnChange(oFocusObj);
			}
			else if (pbType == "textbox")
			{
				goTextBoxMgr.OnChange(oFocusObj);
			}
			else if (pbType == "dropdownlistbox" || pbType == "listbox")
			{
				goPictureListBoxManager.LostFocus(oFocusObj.id);
			}
			else if (pbType == "tab")
			{
				goTabManager.LostFocus(oFocusObj.id);
			}
			else
			{
				// do nothing
			}			
		}
	}
	else
	{
		this.strFocusObjID = strID;
	}
}

function PBWindowManager_OnFocusOwn1(evt, strID)
{
	this.OnFocusOwn(strID);
}

function PBWindowManager_OnFocus(evt, oFocus)
{
	if (oFocus.disabled)
	{
		return;
	}
	var oWin = this.Get(this.strActiveID);
	if (oWin != null && oFocus.id.substring(0, 3) != WIN_PREFIX)
	{
		if (oFocus.getAttribute("pbtype") == "editmask") 
		{
			while(oFocus.tagName != "DIV")
			{
				oFocus = oFocus.parentNode;
			}
		}
		oWin.SetFocusObjID(oFocus.id);
	}
	PBDataWindow_OnGlobalChangeFocus();
	if (this.strFocusObjID != "" && this.strFocusObjID != oFocus.id)
	{
		var oFocusObj = document.getElementById(this.strFocusObjID);
		this.strFocusObjID = oFocus.id;
	    var oPBTypeObj = this.GetPBTypeObj(oFocusObj);
	    if (oFocusObj != null && oPBTypeObj != null)
	    {
	    	var pbType = oPBTypeObj.getAttribute("pbtype");
			if (pbType == "editmask")
			{
				goEditMaskManager.OnChange(oFocusObj);
			}
			else if (pbType == "textbox")
			{
				goTextBoxMgr.OnChange(oFocusObj);
			}
			else if (pbType == "dropdownlistbox" || pbType == "listbox")
			{
				goPictureListBoxManager.LostFocus(oFocusObj.id);
			}
			else if (pbType == "tab")
			{
				goTabManager.LostFocus(oFocusObj.id);
			}
			else
			{
				// do nothing
			}			
		}
	}
	else
	{
		this.strFocusObjID = oFocus.id;
	}		
}

function PBWindowManager_Cascade(evt, strID)
{
	try
	{
		var nCnt = 0;
		var oParentCltArea = this.GetMDIClientAreaRect(strID);
		var oMDIWin = this.Get(strID);
		for (var i = 0; i < oMDIWin.MDIChildWindows.Size(); i++)
		{
			var oWin = oMDIWin.MDIChildWindows.Get(i);
			if (oWin.nState != WIN_STATE_MIN) 
			{
				if (nCnt == 10) 
				{
					nCnt = 0;
				}
				var oWindowPane = oWin.GetWindowPane();
				oWin.nNormalTop = nCnt * 25;
				oWin.nNormalLeft = nCnt * 20;
				oWin.nNormalWidth = Math.floor(oParentCltArea.width * 4 / 5);
				oWin.nNormalHeight = Math.floor(oParentCltArea.height * 4 / 5);
				oWin.SetHFLeft(oWin.nNormalLeft);
				oWin.SetHFTop(oWin.nNormalTop);
				oWin.SetHFWidth(oWin.nNormalWidth);
				oWin.SetHFHeight(oWin.nNormalHeight);
				this.Normal(evt, oWin.strID);
				nCnt++;
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_Cascade:" + e.description;
	}
}

function PBWindowManager_Layer(evt, strID)
{
	try
	{
		var oParentCltArea = this.GetMDIClientAreaRect(strID);
		var oMDIWin = this.Get(strID);
		var nOffset = 0;
        
		for (var i = 0; i < oMDIWin.MDIChildWindows.Size(); i++)
		{
			var oWin = oMDIWin.MDIChildWindows.Get(i);
			if (oWin.nState != WIN_STATE_MIN) 
			{
				var oWinPane = oWin.GetWindowPane();
				oWin.nNormalTop = 0;
				oWin.nNormalLeft = 0;
				oWin.nNormalWidth = oParentCltArea.width;
				oWin.nNormalHeight = oParentCltArea.height - TITLE_HEIGHT;
				oWin.SetHFLeft(oWin.nNormalLeft);
				oWin.SetHFTop(oWin.nNormalTop);
				oWin.SetHFWidth(oWin.nNormalWidth);
				oWin.SetHFHeight(oWin.nNormalHeight);
				this.Normal(evt, oWin.strID);
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_Layer:" + e.description;
	}
}

function PBWindowManager_GetN(nCount)
{
	var n = 1;
	while (nCount > (n * (n + 2)))
	{
		n++;
	}
	return n;
}

function PBWindowManager_CountChildWin(strID)
{
	var oMDIWin = this.Get(strID);
	var nCnt = 0;
	for (var i = 0; i < oMDIWin.MDIChildWindows.Size(); i++)
	{
		var oWin = oMDIWin.MDIChildWindows.Get(i);
		if (oWin.nState != WIN_STATE_MIN) 
		{	
			nCnt++;
		}
	}
	return nCnt;
}

function PBWindowManager_HasActiveChildWin(strID)
{
	var oMDIWin = this.Get(strID);
	var bHas = false;
	for (var i = 0; i < oMDIWin.MDIChildWindows.Size(); i++)
	{
		var oWin = oMDIWin.MDIChildWindows.Get(i);
		if (oWin.strID == this.strActiveID) 
        {	
			bHas = true;
			break;
		}
	}
	return bHas;
}

function PBWindowManager_GetN2(nCount, nN)
{
	var n = 0;
	while (nCount > (nN * (nN + n)))
	{
		n++;
	}
	return nN + n;
}

function PBWindowManager_GetN3(nCount, nN)
{
	var n = 0;
	while (nCount >= (nN * (nN + n)))
	{
		n++;
	}
	return nN + n - 1;
}

function PBWindowManager_GetTileBottom(strID)
{
	var oWin = this.Get(strID);
	var oWindowPane = oWin.GetWindowPane();
	var oClientArea = this.GetMDIClientAreaRect(strID);
	var nHeight = oClientArea.height;
	var nWidth = oClientArea.width;
	var nCols = parseInt(nWidth / (MIN_WIDTH + 2));
	var nRow = parseInt(oWin.nMinMDIChildWinCount / nCols);
	var nMinimalHeight = TITLE_HEIGHT;
	if (oWin.nMinMDIChildWinCount == 0)
	{
		return nHeight;
	}
	else
	{
		return nHeight - (nMinimalHeight + 2) * (nRow + 1);
	}
}

function PBWindowManager_TileHorizontal(evt, strID)
{
	try
	{
		var oParentCltArea = this.GetMDIClientAreaRect(strID);
		var oMDIWin = this.Get(strID);
		var nOffset = 0;
		var nChild = this.CountChildWin(strID);
		var nMaxCol = this.GetN(nChild);
		var nMaxRow = this.GetN2(nChild, nMaxCol);
		var nMaxCol1 = nMaxCol - (nChild - (nMaxRow - 1) * nMaxCol);
		var nCol=0;
		var nRow=0;
		var nWidth = oParentCltArea.width;
		var nHeight = this.GetTileBottom(strID);
		var nTop = 0;
		var nColWidth = Math.floor(nWidth / nMaxCol);
		var nColHeight1 = Math.floor(nHeight / nMaxRow) - TITLE_HEIGHT;
		var nColHeight2 = Math.floor(nHeight / (nMaxRow - 1)) - TITLE_HEIGHT;
    	for (var i = 0; i < oMDIWin.MDIChildWindows.Size(); i++)
	    {
		    var oWin = oMDIWin.MDIChildWindows.Get(i);
			if (oWin.nState != WIN_STATE_MIN) 
			{
				var oWinPane = oWin.GetWindowPane();
				oWin.nNormalTop = nTop;
				oWin.nNormalLeft = nCol * nColWidth;
				oWin.nNormalWidth = nColWidth;
				if (nCol < nMaxCol1)
				{
					oWin.nNormalHeight = nColHeight2;
				}
				else
				{
					oWin.nNormalHeight = nColHeight1;
				}
				oWin.SetHFLeft(oWin.nNormalLeft);
				oWin.SetHFTop(oWin.nNormalTop);
				oWin.SetHFWidth(oWin.nNormalWidth);
				oWin.SetHFHeight(oWin.nNormalHeight);
				this.Normal(evt, oWin.strID);
				nRow++;
				if (nCol < nMaxCol1)
				{
					if (nRow == nMaxRow - 1) 
					{
						nCol++;
						nTop = 0;
						nRow = 0;
					}
					else
					{
						nTop += nColHeight2 + TITLE_HEIGHT;
					}
				}
				else 
				{
					if (nRow == nMaxRow) 
					{
						nCol++;
						nTop = 0;
						nRow = 0;
					}
					else
					{
						nTop += nColHeight1 + TITLE_HEIGHT;
					}
				}
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_TileHorizontal:" + e.description;
	}
}

function PBWindowManager_Tile(evt, strID)
{
	try
	{
		var oParentCltArea = this.GetMDIClientAreaRect(strID);
		var oMDIWin = this.Get(strID);
		var nOffset = 0;
		var nChild = this.CountChildWin(strID);
		var nMaxRow = this.GetN(nChild);
		var nMaxCol = this.GetN3(nChild, nMaxRow);
		var nMaxCol1 = nMaxCol - (nChild - nMaxCol * nMaxRow);
		var nCol = 0;
		var nRow = 0;
		var nWidth = oParentCltArea.width;
		var nHeight = this.GetTileBottom(strID);
		var nTop = 0;
		var nColWidth = Math.floor(nWidth / nMaxCol);
		var nColHeight1 = Math.floor(nHeight / nMaxRow) - TITLE_HEIGHT;
		var nColHeight2 = Math.floor(nHeight / (nMaxRow + 1)) - TITLE_HEIGHT;
    	for (var i = 0; i < oMDIWin.MDIChildWindows.Size(); i++)
	    {
		    var oWin = oMDIWin.MDIChildWindows.Get(i);
			if (oWin.nState != WIN_STATE_MIN) 
			{
				var oWinPane = oWin.GetWindowPane();
				oWin.nNormalTop = nTop;
				oWin.nNormalLeft = nCol * nColWidth;
				oWin.nNormalWidth = nColWidth;
				if (nCol < nMaxCol1)
				{
					oWin.nNormalHeight = nColHeight1;
				}
				else
				{
					oWin.nNormalHeight = nColHeight2;
				}
				oWin.SetHFLeft(oWin.nNormalLeft);
				oWin.SetHFTop(oWin.nNormalTop);
				oWin.SetHFWidth(oWin.nNormalWidth);
				oWin.SetHFHeight(oWin.nNormalHeight);
				this.Normal(evt, oWin.strID);
				nRow++;
				if (nCol < nMaxCol1)
				{
					if (nRow == nMaxRow) {
						nCol++;
						nTop = 0;
						nRow = 0;
					}
					else
					{
						nTop += nColHeight1 + TITLE_HEIGHT;
					}
				}
				else 
				{
					if (nRow == nMaxRow+1) 
					{
						nCol++;
						nTop = 0;
						nRow = 0;
					}
					else
					{
						nTop += nColHeight2+TITLE_HEIGHT;
					}
				}
			}
		}
	}
	catch(e)
	{
		window.status = "PBWindowManager_Tile:" + e.description;
	}
}

function PBWindowManager_BodyKeyDown(evt)
{
	if(document.readyState != 'complete') return;
	
	var bShortCut = this.ProcessShortCutKey(evt);
	
	if (!bShortCut && this.strActiveID != "")
	{
		var e = PB_GetEvent(evt);
		var oWin = this.Get(this.strActiveID);
		if (e.keyCode == 116)
		{
			gbF5 = true;
		}
		else if ((e.keyCode == 13 || e.keyCode == 108) && !e.ctrlKey && !e.altKey)
		{
			this.ProcessDefaultButton(evt, oWin);
		}
		else if (e.keyCode == 9 && !e.ctrlKey && !e.altKey && !e.shiftKey)
		{
			this.ProcessTab(evt, oWin);
		}
		else if (e.keyCode == 9 && !e.ctrlKey && !e.altKey && e.shiftKey)
		{
			this.ProcessShiftTab(evt, oWin);
		}
		else if (e.keyCode == 27 && !e.ctrlKey && !e.altKey)
		{
			e.returnValue = false;
		}
		else if (e.keyCode == 8)
		{
		    e.keyCode = 0;
		}
		else 
		{
			this.ProcessAcceleratorKey(evt, oWin);
		}
	}
}

function PBWindowManager_ProcessDefaultButton(evt, oWin)
{
    var id = oWin.GetFocusObjID();
    var oFocusObj = null;
    if (id != "")
    {
		oFocusObj = document.getElementById(id);
    }
    var oPBTypeObj = this.GetPBTypeObj(oFocusObj);
    if ( oPBTypeObj == null) 
       return ;

    var e = PB_GetEvent(evt);
    var pbType = oPBTypeObj.getAttribute("pbtype");
    var pbutton = (oFocusObj != null && pbType == "pbutton");
    var button = (oFocusObj != null && pbType == "button");
    var rtc = this.IsRichTextEditObj(e.srcElement);
    var mle = e.srcElement.tagName.toLowerCase() == "textarea";
    var IDB = e.srcElement.IDB == "true";
	if (!(button || (mle && IDB) || pbutton || rtc))
	{
		if (oFocusObj != null && pbType == "editmask")
		{
			if (oWin.strDefaultBtn != null)
			{
				this.OnFocusOwn(oWin.strDefaultBtn.id);
			}		
			goEditMaskManager.OnChange(oFocusObj);
			if (oWin.strDefaultBtn != null)
			{
				oWin.strDefaultBtn.click();
			}
		}
		else if (oWin.strDefaultBtn != null)
		{
			this.OnFocusOwn(oWin.strDefaultBtn.id);
			oWin.strDefaultBtn.click();
		}
	}
	else if (pbutton || button)
	{
		oFocusObj.click();
	}
	if (!(mle && (IDB || (!IDB && oWin.strDefaultBtn == null)) || rtc))
	{
		e.returnValue = false;
	}
}

function PBWindowManager_ProcessCancelButton(evt)
{
	if (this.strActiveID != "")
	{
	    var e = PB_GetEvent(evt);
	    var oWin = this.Get(this.strActiveID);  
	    var id = oWin.GetFocusObjID();  
	    var oFocusObj = null;
		if (id != "")
		{
			oFocusObj = document.getElementById(id);
		}
					    
		var oPBTypeObj = this.GetPBTypeObj(oFocusObj);
		if (oPBTypeObj == null)
		    return ;
		  
		if (!this.IsRichTextEditObj(e.srcElement))
		{
			if (oWin.strCancelBtn != null)
			{
				this.OnFocusOwn(oWin.strCancelBtn.id);
				oWin.strCancelBtn.click();
			}
		}
	}
}

function PBWindowManager_ProcessTab(evt, oWin)
{
    var e = PB_GetEvent(evt);
    var strFocusObjID = oWin.GetFocusObjID();
	if (strFocusObjID != "")
	{
		var oIDs = oWin.Controls.KeySet();
		var oFocusObj = oWin.Controls.Get(strFocusObjID);
		var nIndex;
		var nCurrentIndex = oIDs.IndexOf(strFocusObjID);
		
		if(oFocusObj == undefined || oFocusObj == null)
		    return;
		    
		if (oFocusObj.nTabIndex == -1)
		{
			var bSetIndex = false;
			if (oFocusObj.nType == CTL_RadioButton)
			{
				var obj = document.getElementById(strFocusObjID+"_div");
				var pbGrpName = obj.getAttribute("pbgrpname");
				if (pbGrpName != "")
				{
					obj = document.getElementById(pbGrpName);
					if (obj != null)
					{
						oFocusObj = oWin.Controls.Get(obj.id);
						if(oFocusObj == null)
						    return;
						if (oFocusObj.nTabIndex != -1)
						{
							nIndex = oIDs.IndexOf(obj.id) + 1;
							bSetIndex = true;
						}
					}
				}
			}
			if (!bSetIndex)
			{
				nIndex = 0;
			}
		}
		else
		{
			nIndex = nCurrentIndex+1;
		}
		var nCount = 0;
		do
		{
			if (nIndex == oIDs.Size())
			{
				nIndex = 0;
			}		
			strFocusObjID = oIDs.Get(nIndex);
			oFocusObj = oWin.Controls.Get(strFocusObjID);
			
			if(oFocusObj == null)
			{
			    nIndex++;
			    nCount++;			
			    continue;
			}
			    
			if (oFocusObj.nTabIndex != -1) break;
			nIndex++;
			nCount++;
		}while(nCount != oIDs.Size());
		if (nCount != oIDs.Size())
		{
			if (strFocusObjID != "")
			{
				var oFocusObj2 = document.getElementById(strFocusObjID);
				if (oFocusObj2 != null && this.IsDataWindowObj(oFocusObj2))
				{
					this.OnFocusOwn(strFocusObjID);
					var oPBTypeObj = this.GetPBTypeObj(oFocusObj2);
					if (oPBTypeObj == null)
						return;
					PBDataWindowSetFocus(oPBTypeObj.dwobj);
					e.returnValue = false;
					return;
				}
				var nType;
				var bRadio = false;
				var pbRadioBtn = oFocusObj2.getAttribute("pbradiobtn");
				if (oFocusObj.nType == CTL_GroupBox && pbRadioBtn != "")
				{
					oFocusObj2 = document.getElementById(pbRadioBtn);
					if (!PB_HasDisabledRadioButtonInGroup(oFocusObj2.name))
					{
						this.SetFocus(evt, oFocusObj2.id);
						nType = CTL_RadioButton;
						bRadio = true;
					}
				}
				if (!bRadio)
				{
					nType = oFocusObj.nType;
					this.SetFocus(evt, strFocusObjID);
				}
				if (nType == CTL_RadioButton && !oFocusObj2.checked) 
				{	
					oFocusObj2.click();
				}
			}
		}
	}
	e.returnValue = false;
}

function PBWindowManager_ProcessShiftTab(evt, oWin)
{
    var e = PB_GetEvent(evt);
    var strFocusObjID = oWin.GetFocusObjID();
	if (strFocusObjID != "")
	{
		var oIDs = oWin.Controls.KeySet();
		var oFocusObj = oWin.Controls.Get(strFocusObjID);
		var nIndex;
		var nCurrentIndex = oIDs.IndexOf(strFocusObjID);
		
		if(oFocusObj == null)
		    return;
		    
		if (oFocusObj.nTabIndex == -1)
		{
			var bSetIndex = false;
			if (oFocusObj.nType == CTL_RadioButton)
			{
				var obj = document.getElementById(strFocusObjID+"_div");
				var pbGrpName = obj.getAttribute("pbgrpname");
				if (pbGrpName != "")
				{
					obj = document.getElementById(pbGrpName);
					if (obj != null)
					{
						oFocusObj = oWin.Controls.Get(obj.id);
						
						if(oFocusObj == null)
						    return;
						if (oFocusObj.nTabIndex != -1)
						{
							nIndex = oIDs.IndexOf(obj.id) - 1;
							bSetIndex = true;
						}
					}
				}
			}
			if (!bSetIndex)
			{
				nIndex = 0;
			}		
		}
		else
		{
			nIndex = nCurrentIndex-1;
		}
		var nCount = 0;
		do
		{
			if (nIndex < 0)
			{
				nIndex = oIDs.Size()-1;
			}
			strFocusObjID = oIDs.Get(nIndex);
			oFocusObj = oWin.Controls.Get(strFocusObjID);
			if(oFocusObj == null)
			{
			    nIndex--;
			    nCount++;			
			    continue;
			}
			    
			if (oFocusObj.nTabIndex != -1) break;
			nIndex--;
			nCount++;
		}while(nCount != oIDs.Size());
		if (nCount != oIDs.Size())
		{
			if (strFocusObjID != "")
			{
				var oFocusObj2 = document.getElementById(strFocusObjID);
				if (oFocusObj2 != null && this.IsDataWindowObj(oFocusObj2))
				{
					this.OnFocusOwn(strFocusObjID);
					var oPBTypeObj = this.GetPBTypeObj(oFocusObj2);
					if (oPBTypeObj == null)
						return;
					PBDataWindowSetFocus(oPBTypeObj.dwobj);
					e.returnValue = false;
					return;
				}
				var nType;
				var bRadio = false;
				var pbRadioBtn = oFocusObj2.getAttribute("pbradiobtn");
				if (oFocusObj.nType == CTL_GroupBox && pbRadioBtn != "")
				{
					oFocusObj2 = document.getElementById(pbRadioBtn);
					if (!PB_HasDisabledRadioButtonInGroup(oFocusObj2.name))
					{
						this.SetFocus(evt, oFocusObj2.id);
						nType = CTL_RadioButton;
						bRadio = true;
					}
				}
				if (!bRadio)
				{
					nType = oFocusObj.nType;
					this.SetFocus(evt, strFocusObjID);
				}				
				if (nType == CTL_RadioButton && !oFocusObj2.checked) 
				{	
					oFocusObj2.click();
				}
			}
		}
	}
	e.returnValue = false;
}

function PBWindowManager_ProcessObjClick(strFocusObjID, nType)
{
	var obj = document.getElementById(strFocusObjID);	
	switch(nType)
	{
		case CTL_Button : 
		case CTL_PictureButton : 
		case CTL_CheckBox : obj.click(); break;
		case CTL_RadioButton : if (!obj.checked) obj.click(); break;
		case CTL_StaticText :  
		case CTL_StaticHyperLink : goStaticManager.OnClick(strFocusObjID, true); break;
	} 
}

function PBWindowManager_GetShiftKeyCode(nCode)
{
	return goShiftKey.Get(String.fromCharCode(nCode));
}

function PBWindowManager_ProcessAcceleratorKey(evt, oWin)
{
	var oFoucsObj;
	var e = PB_GetEvent(evt);
	var oIDs = oWin.Controls.KeySet();
	var i, nSize = oIDs.Size();
	var strCode = null;
	if (e.shiftKey)
	{
		strCode = this.GetShiftKeyCode(e.keyCode);
	}
	if (strCode == null)
	{
		strCode = String.fromCharCode(e.keyCode);
	}	
	for (i=0; i<nSize; i++)
	{
		strFocusObjID = oIDs.Get(i);
		oFoucsObj = oWin.Controls.Get(strFocusObjID);

		if (strCode == oFoucsObj.strAccelerator &&
		e.altKey && e.ctrlKey) 
		{
			break;
		}
	}
	if (i != nSize)
	{
		this.SetFocus(evt, strFocusObjID);
		this.ProcessObjClick(strFocusObjID, oFoucsObj.nType);
		e.returnValue = false;
	}
}

function PBWindowManager_ProcessShortCutKey(evt)
{
	var bShortCut;
	if (this.bHasMenu)
	{
		bShortCut = !aspmenu_onkeydown(evt);
		if (bShortCut)
		{
			var e = PB_GetEvent(evt);
			e.returnValue = false;
		}
	}
	return bShortCut;
}

function PBWindowManager_BodyKeyUp(evt)
{
	var e = PB_GetEvent(evt);
	if (e.keyCode == 27 && !e.ctrlKey && !e.altKey)
	{
		this.ProcessCancelButton(evt);
		e.returnValue = false;
	}
}

function PB_ClearTimeout()
{
	if (goYield != null)
	{
		window.clearTimeout(goYield);
		goYield = null;
	}
	if (goIdle != null)
	{
		window.clearTimeout(goIdle);
		goIdle = null;
	}
	if (goTimer != null)
	{
		window.clearTimeout(goTimer);
		goTimer = null;
	}
	if (goTimeChild != null)
	{
		window.clearTimeout(goTimeChild);
		goTimeChild = null;
	}
	
	gbYield = false;
	gbIdle = false;			
}

function PBWindowManager_Timer(strID, nTimeout)
{
	if (document.readyState == 'complete')
	{
		var	oWin = this.Get(strID);
		goTimer = window.setTimeout("__doPostBack('" + oWin.strUniqueID + "','Timer')", nTimeout);
	}
	else
	{
		goTimer = window.setTimeout("goWindowManager.Timer('" + strID + "'," + nTimeout + ")", 1000);
	}
}

function PBWindowManager_TimerChild(strChildID,	strID, nTimeout)
{
	if (document.readyState == 'complete')
	{
		var childWindow = this.Get(strChildID);
		if (childWindow)
		{
			var	oWin = this.Get(strID);
			goTimerChild = window.setTimeout("__doPostBack('" + oWin.strUniqueID + "','TimerChild," + childWindow.strUniqueID + "')", nTimeout);
		}
	}
	else
	{
		goTimerChild = window.setTimeout("goWindowManager.TimerChild('" + strChildID + "','" + strID + "'," + nTimeout + ")", 1000);
	}
}

function PBWindowManager_SetActiveWinZIndex(nZIndex)
{
	document.getElementsByName(PB_ACTIVE_WIN_ZINDEX)[0].value = nZIndex;
}

function PBWindowManager_GetActiveWinZIndex()
{
	return document.getElementsByName(PB_ACTIVE_WIN_ZINDEX)[0].value;
}

function PBWindowManager_GetActiveWinZIndexID()
{
	var oIDs = this.GetIDs();
	for (var i = 0; i < oIDs.Size(); i++)
	{
		var strWinID = oIDs.Get(i);
		if (strWinID != DESKTOP) 
		{
			var oWin = this.Get(strWinID);
			if (oWin.GetHFZIndex() == this.GetActiveWinZIndex()) 
			{
				return strWinID;
			}
		}
	}

	return "";
}

function PBWindowManager_GetMDIActiveID()
{
	var oWin = this.Get(this.strActiveID);
	return oWin.strMDIActiveID;
}

function PBWindowManager_IsActiveWindowHasDefaultButton()
{
	var oWin = this.Get(this.strActiveID);
	if (oWin.strDefaultBtn != null)
	{
		return true;
	}
	else
	{
	   return false;
	}
}

function PBWindow_SetFocus1(evt)
{
	goWindowManager.SetFocus1(evt);
}

function PBWindowManager_AddMaskIFrame(strMaskID)
{
	var oIFrame = PB_PopupAddIFrame(document.getElementById(strMaskID));
	if (oIFrame)
	{
		oIFrame.onfocus = PBWindow_SetFocus1;
	}
}

function PBWindowManager_MouseMoveOnCloseButton(id, theme)
{
    var clsBtn = document.getElementById(id);
    var imgName = "images/xp_close.gif";
   
     if (CLASSIC == theme)
        imgName = "images/classic_close.gif";
        
     clsBtn.src = imgName;        
}

function PBWindowManager_MouseOutFromCloseButton(id, theme)
{
     var clsBtn = document.getElementById(id);
      
      if (CLASSIC == theme)
        clsBtn.src     = "images/classic_web_close.gif";
      else
        clsBtn.src     = "images/xp_web_close.gif";
}

function PBWindowManager()
{
	this.bYield = false;
	this.bIdle = false;
	this.bSwitchMenu = false;
	this.bHasMenu = false;
	this.nMaxZIndex = 0;
	this.nLevel = -1;
	this.strActiveID = "";
	this.strFocusObjID = "";
	this.Windows = new PBMap();
	this.Get = PBWindowManager_Get;
	this.Add = PBWindowManager_Add;
	this.Open = PBWindowManager_Open;
	this.GetIDs = PBWindowManager_GetIDs;
	this.IsExist = PBWindowManager_IsExist;
	this.Remove = PBWindowManager_Remove;
	this.RemoveAll = PBWindowManager_RemoveAll;
	this.Count = PBWindowManager_Count;
	this.GetDesktopClientAreaRect = PBWindowManager_GetDesktopClientAreaRect;
	this.GetMDIClientAreaRect = PBWindowManager_GetMDIClientAreaRect;
	this.Min = PBWindowManager_Min;
	this.Normal = PBWindowManager_Normal;
	this.Max = PBWindowManager_Max;
	this.Close = PBWindowManager_Close;
	this.FileManager = PBWindowManager_FileManager;
	this.MailProfileManager = PBWindowManager_MailProfileManager;
	this.ThemeManager = PBWindowManager_ThemeManager;
	this.PrintManager = PBWindowManager_PrintManager;
	this.UploadFiles = PBWindowManager_UploadFiles;
	this.ResetChild = PBWindowManager_ResetChild;
	this.MaxMDIChild = PBWindowManager_MaxMDIChild;
	this.TrackMouse = PBWindowManager_TrackMouse;
	this.ResizeBegin = PBWindowManager_ResizeBegin;
	this.ResizeEnd = PBWindowManager_ResizeEnd;
	this.UnGrab = PBWindowManager_UnGrab;
	this.Grab = PBWindowManager_Grab;
	this.GetMaxZIndex = PBWindowManager_GetMaxZIndex;
	this.SetActiveWinZIndex = PBWindowManager_SetActiveWinZIndex;
	this.GetActiveWinZIndex = PBWindowManager_GetActiveWinZIndex;
	this.GetActiveWinZIndexID = PBWindowManager_GetActiveWinZIndexID;
	this.GetMDIActiveID = PBWindowManager_GetMDIActiveID;
	this.HandleSelectElement = PBWindowManager_HandleSelectElement;
	this.GetAbsoluteCoords = PBWindowManager_GetAbsoluteCoords;
	this.Active = PBWindowManager_Active;
	this.ArrangeMDIChild = PBWindowManager_ArrangeMDIChild;
	this.SetFocus = PBWindowManager_SetFocus;
	this.OnFocus = PBWindowManager_OnFocus;
	this.OnFocusOwn = PBWindowManager_OnFocusOwn;
	this.OnFocusOwn1 = PBWindowManager_OnFocusOwn1;
	this.OnDoubleClick = PBWindowManager_OnDoubleClick;
	this.Cascade = PBWindowManager_Cascade;
	this.Layer = PBWindowManager_Layer;
	this.Tile = PBWindowManager_Tile;
	this.TileHorizontal = PBWindowManager_TileHorizontal;
	this.GetN = PBWindowManager_GetN;
	this.GetN2 = PBWindowManager_GetN2;
	this.GetN3 = PBWindowManager_GetN3;
	this.CountChildWin = PBWindowManager_CountChildWin;
	this.GetTileBottom = PBWindowManager_GetTileBottom;
	this.BodyKeyDown = PBWindowManager_BodyKeyDown;
	this.BodyKeyUp = PBWindowManager_BodyKeyUp;
	this.Click = PBWindowManager_Click;
	this.Init = PBWindowManager_Init;
	this.Timer = PBWindowManager_Timer;
	this.TimerChild = PBWindowManager_TimerChild;
	this.Open1 = PBWindowManager_Open1;
	this.Init1 = PBWindowManager_Init1;
	this.Close1 = PBWindowManager_Close1;
	this.Max1 = PBWindowManager_Max1;
	this.HasActiveChildWin = PBWindowManager_HasActiveChildWin;
	this.ShowMDIButtons = PBWindowManager_ShowMDIButtons;
	this.SetActiveSheet = PBWindowManager_SetActiveSheet;
	this.GetRootWin = PBWindowManager_GetRootWin;
    this.ActiveTitlePane = PBWindowManager_ActiveTitlePane;
    this.DeActive = PBWindowManager_DeActive;
    this.GetActiveMDIChildWinID = PBWindowManager_GetActiveMDIChildWinID;
    this.GetWorkSpaceOffset = PBWindowManager_GetWorkSpaceOffset;
    this.SetWindowZIndex = PBWindowManager_SetWindowZIndex;
    this.SetFocus1 = PBWindowManager_SetFocus1;
    this.IsDataWindowObj = PBWindowManager_IsDataWindowObj;
	this.GetRelativeCoords = PBWindowManager_GetRelativeCoords;
	this.IsRichTextEditObj = PBWindowManager_IsRichTextEditObj;
	this.MouseDown = PBWindowManager_MouseDown;
	this.GetTabMDICltArea = PBWindowManager_GetTabMDICltArea;
	this.GetMDICltArea = PBWindowManager_GetMDICltArea;
	this.GetCltArea = PBWindowManager_GetCltArea;
	this.GetParentCltArea = PBWindowManager_GetParentCltArea;
	this.ResetMDIChild = PBWindowManager_ResetMDIChild;
	this.SetPopupWindowsTree = PBWindowManager_SetPopupWindowsTree;
	this.ActiveWindow = PBWindowManager_ActiveWindow;
	this.GetPopupWindowsTree = PBWindowManager_GetPopupWindowsTree;
	this.GetPopupWindows = PBWindowManager_GetPopupWindows;
	this.SetWindowsZIndex = PBWindowManager_SetWindowsZIndex;
	this.GetSortWindowIDs = PBWindowManager_GetSortWindowIDs;
	this.ActiveTreeTitlePane = PBWindowManager_ActiveTreeTitlePane;
	this.IsChildPopupWindow = PBWindowManager_IsChildPopupWindow;
	this.SetMDIClient = PBWindowManager_SetMDIClient;
	this.Center = PBWindowManager_Center;
	this.SetParentClientArea = PBWindowManager_SetParentClientArea;
	this.SetChildWindowParentClientArea = PBWindowManager_SetChildWindowParentClientArea;
	this.WindowStyleInitChildWindow = PBWindowManager_WindowStyleInitChildWindow;
	this.WebStyleInitChildWindow = PBWindowManager_WebStyleInitChildWindow;
	this.SheetTabCallBack = PBWindowManager_SheetTabCallBack;
	this.ActiveTree = PBWindowManager_ActiveTree;
	this.HasMinWindow = PBWindowManager_HasMinWindow;
	this.ProcessShortCutKey = PBWindowManager_ProcessShortCutKey;
	this.ProcessAcceleratorKey = PBWindowManager_ProcessAcceleratorKey;
	this.ProcessDefaultButton = PBWindowManager_ProcessDefaultButton;
	this.ProcessCancelButton = PBWindowManager_ProcessCancelButton;
	this.ProcessShiftTab = PBWindowManager_ProcessShiftTab;
	this.ProcessTab = PBWindowManager_ProcessTab;
	this.GetScrollCoords = PBWindowManager_GetScrollCoords;
	this.ProcessWindowClick = PBWindowManager_ProcessWindowClick;
	this.GetPBTypeObj = PBWindowManager_GetPBTypeObj;
	this.GetRightClickWindow = PBWindowManager_GetRightClickWindow;
	this.IsActiveWindowHasDefaultButton = PBWindowManager_IsActiveWindowHasDefaultButton;
	this.GetPBTypeObjectID = PBWindowManager_GetPBTypeObjectID;
	this.ProcessObjClick = PBWindowManager_ProcessObjClick;
	this.SetPointer = PBWindowManager_SetPointer;
	this.GetShiftKeyCode = PBWindowManager_GetShiftKeyCode;
	this.AddMaskIFrame = PBWindowManager_AddMaskIFrame;
	this.GetWindowLevel = PBWindowManager_GetWindowLevel;
	this.RegisterWindow = PBWindowManager_RegisterWindow;
	this.MouseMoveOnCloseButton= PBWindowManager_MouseMoveOnCloseButton;
	this.MouseOutFromCloseButton = PBWindowManager_MouseOutFromCloseButton;
}

var	goWindowManager	= new PBWindowManager();
goWindowManager.Open(DESKTOP, false, false, null, 0, 0, 0, 0, -1, false, false, 
-1, false, null, 0, 0, false, false, false, false, false, null, false, false, false);
document.onmousemove = goWindowManager.TrackMouse;
var goShiftKey = new PBMap();
InitShiftKey();

function PB_WindowEventResizeHandler(evt)
{
   	PB_SetupWindows(gWindowStyle, goWindowManager.strActiveID, gbShowExitMessage, gstrExitMessage);
}

function PB_WindowEventOnLoadHandler(evt)
{
	PB_SetupWindows(gWindowStyle, goWindowManager.strActiveID, gbShowExitMessage, gstrExitMessage);
}

function PB_SetupWindowEventHandlers()
{
	window.onresize = PB_WindowEventResizeHandler;
	window.onload = PB_WindowEventOnLoadHandler;

	window.onbeforeunload = PB_BeforeUnloadHandler;
	window.onunload = PB_UnloadHandler;
}

var g_newSessionCookieTimeout = null;
function PB_BeforeUnloadHandler(evt)
{
	var e = PB_GetEvent(evt);
	var showMessage = (gbPrompt && !gbSubmit);
	gbUnloadPage = false;

	if (gbCloseByError)
	{
		gbCloseByError = false;
		showMessage = false;
		gbUnloadPage = true;
	}
	else if (gbF5)
	{
		gbF5 = false;
		gbUnloadPage = true;
	}
	else if (typeof(e.clientX) == "undefined" || typeof(e.clientY) == "undefined")
	{
		gbUnloadPage = g_IE;
	}
	else if (e.clientX < 0 || e.clientY < 0)
	{
		gbUnloadPage = true;
	}
	
	if (gbUnloadPage)
	{
		PB_SetNewSessionCookie(1000000);
		g_newSessionCookieTimeout = window.setTimeout("PB_SetNewSessionCookie(-10000000)", 500);

		if (gbShowExitMessage && showMessage)
		{
			if (g_IE)
			{
				e.returnValue = gstrExitMessage;
			}
			else
			{
				return gstrExitMessage;
			}
		}
	}
}

function PB_SetNewSessionCookie(addTimes)
{
	var expDate = new Date();
	expDate.setTime(expDate.getTime() + addTimes);
	document.cookie = "PBNewSession=true; path=/; expires=" + expDate.toGMTString();
}

function PB_Pause(numberMillis)
{
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true)
	{
		now = new Date();
		if (now.getTime() > exitTime)
			return;
	}
}

function PB_UnloadHandler(evt)
{
	try
	{
		if (gbUnloadPage)
		{
			window.clearTimeout(g_newSessionCookieTimeout);

			var windows = goWindowManager.GetIDs();
			if (windows)
			{
				if (windows.Size() > 1)
				{
					var oWin = goWindowManager.Get(goWindowManager.GetIDs().Get(1));
					gbPrompt = false;
					__doPostBack(oWin.strUniqueID, "ApplicationClose");
					PB_Pause(300);
				}
			}
		}
	}
	catch(ex)
	{
	}
}

function PBWindowManager_WebStyleInitChildWindow(evt, oWin)
{
	if (oWin.bIsChild || oWin.bIsPopup || oWin.bIsResponse) 
	{
		if (oWin.nState == WIN_STATE_MAX)
		{
			this.Max(evt, oWin.strID);
			oWin.nMinWinCount = 0;
		}
	}
	else //if (oWin.strTabID == "")
	{
    	this.Max1(oWin.strID);
	}
	for (var i = 0; i < oWin.MDIChildWindows.Size(); i++)
	{
		var oMDIChildWin = oWin.MDIChildWindows.Get(i);
		this.WebStyleInitChildWindow(evt, oMDIChildWin);
	}
	for (var i = 0; i < oWin.ChildWindows.Size(); i++)
	{
		var oChildWin = oWin.ChildWindows.Get(i);
		this.WebStyleInitChildWindow(evt, oChildWin);
	}
	
	if ((oWin.bIsChild || oWin.bIsPopup || oWin.bIsResponse) && oWin.nState == WIN_STATE_MIN) 
	{
		this.Min(evt, oWin.strID);
	}
}

function PBWindowManager_WindowStyleInitChildWindow(evt, oWin)
{
	if (oWin.nState == WIN_STATE_MAX) 
	{
		this.Max(evt, oWin.strID);
		oWin.nMinWinCount = 0;
		oWin.nMinMDIChildWinCount = 0;
	}
	for (var i = 0; i < oWin.MDIChildWindows.Size(); i++)
	{
		var oMDIChildWin = oWin.MDIChildWindows.Get(i);
		this.WindowStyleInitChildWindow(evt, oMDIChildWin);
	}
	for (var i = 0; i < oWin.ChildWindows.Size(); i++)
	{
		var oChildWin = oWin.ChildWindows.Get(i);
		this.WindowStyleInitChildWindow(evt, oChildWin);
	}
	if (oWin.bIsMDI)
	{
		this.ArrangeMDIChild(evt, oWin.strID, oWin.nArrangeType);
	}
	if (oWin.nState == WIN_STATE_MIN) 
	{
		this.Min(evt, oWin.strID);
	}
}

function PB_ClearSelection()
{
	var sele;
	if(document.selection && document.selection.empty)
	{
		document.selection.empty() ;
	}
	else if(window.getSelection) 
	{
		sele = window.getSelection();
		if(sele && sele.collapse)
		{
			if (g_IE)
			{
				sele.collapse();
			}
			else
			{
				sele.collapse(document.body, 0);
			}
		}
	}
}

function PB_SetupWindows(nWindowStyle, strID, bShowExitMessage, strExitMessage)
{
	goEditMaskManager.bChanged = false;
	goWindowManager.strActiveID = strID;
	gWindowStyle = nWindowStyle;
	gbShowExitMessage = bShowExitMessage;
	gstrExitMessage = strExitMessage;
	gbUnloadPage = false;
	gbSubmit = false;
	gbPrompt = true;
	gbCloseByError = false;
	goWindowManager.bHasMenu = false;
	goWindowManager.GetMaxZIndex();
	var windows = goWindowManager.GetIDs();
	var oWinID;
	for (var i = 0; i < windows.Size(); i++)
	{
		oWinID = windows.Get(i);
		var oWin = goWindowManager.Get(oWinID);
		oWin.nMinMDIChildWinCount = 0;
		oWin.nMinWinCount = 0;
		if (oWinID != DESKTOP)
		{
			var oTitlePane = oWin.GetTitlePane();
			if (oTitlePane != null)
			{
				oTitlePane.style.backgroundColor = "inactivecaption";
			}
			var oWinPane = oWin.GetWindowPane();
			if (oWinPane != null)
			{
				oWinPane.style.borderColor = "inactivecaption";
			}
			var oContentPane = oWin.GetContentPane();
			if (oContentPane != null)
			{
				oContentPane.style.borderColor = "inactivecaption";
			}			
			if (oWin.bHasMenuBar)
			{
				goWindowManager.bHasMenu = true;
			}
		}
	}
	
	var removedWindows = new PBSet();
	for (var i = 0; i < windows.Size(); i++)
	{
		oWinID = windows.Get(i);
		if (oWinID != DESKTOP)
		{
			var oWin = goWindowManager.Get(oWinID);
			if (oWin.GetHFWidth().length == 0)
			{
			    removedWindows.Put(oWinID);
			}
		}
	}

	for (var i = 0; i < windows.Size(); i++)
	{
		oWinID = windows.Get(i);
		if (removedWindows.Contains(oWinID))
		{
			goWindowManager.Remove(oWinID);
		}
	}

	for (var i = 0; i < windows.Size(); i++)
	{
		oWinID = windows.Get(i);
		if (oWinID != DESKTOP)
		{
			var oWin = goWindowManager.Get(oWinID);
			goWindowManager.Center(oWin);
			goWindowManager.SetMDIClient(oWin);
			if (gWindowStyle == WINDOW_STYLE)
			{
				if (oWin.bIsPopup || oWin.bIsResponse || oWin.strParentID == DESKTOP)
				{
				    goWindowManager.WindowStyleInitChildWindow(g_dummyWindowEvent, oWin);
				}
			}
			else
			{
				if (oWin.bIsPopup || oWin.bIsResponse || oWin.strParentID == DESKTOP)
				{
				    goWindowManager.WebStyleInitChildWindow(g_dummyWindowEvent, oWin);
				}
			}
			if (oWin.GetHFPCLeft().length != 0)
			{
			    goWindowManager.SetParentClientArea(oWin);
			}
		}
	}

	goWindowManager.Active(g_dummyWindowEvent, goWindowManager.strActiveID);
}

function PBWindowManager_SetChildWindowParentClientArea(oWin)
{
	for (var i = 0; i < oWin.ChildWindows.Size(); i++)
	{
        var oChildWin = oWin.ChildWindows.Get(i);
        this.SetParentClientArea(oChildWin);
    }
}

function PBWindowManager_SetParentClientArea(oWin)
{
	var oParentCltArea = this.GetParentCltArea(oWin);
	oWin.SetHFPCLeft(oParentCltArea.clientLeft);
	oWin.SetHFPCTop(oParentCltArea.clientTop);
	oWin.SetHFPCWidth(oParentCltArea.width);
	oWin.SetHFPCHeight(oParentCltArea.height);
}

function PB_EventOnContextMenuHandler(evt)
{
	var e = PB_GetEvent(evt);
	var srcElem = e.srcElement;
	if (srcElem.tagName != null)
	{
		var tagName = srcElem.tagName.toUpperCase();

		if (tagName == "TEXTAREA")
		{
			return true;
		}
		else if (tagName == "INPUT")
		{
			var oPBTypeObj = goWindowManager.GetPBTypeObj(srcElem);
			if (oPBTypeObj != null)
			{
				var oType = srcElem.type.toUpperCase();
				var pbType = oPBTypeObj.getAttribute("pbtype");
				var pbShowContextMenu = srcElem.getAttribute("pbscm");
				if (pbShowContextMenu)
				{
					pbShowContextMenu = (pbShowContextMenu.toLowerCase() != "false");
				}
				else
				{
					pbShowContextMenu = true;
				}
				if (pbShowContextMenu && oType == "TEXT" && pbType != "editmask" && pbType != "datawindow")
				{
					return true;
				}
			}
		}
	}

	return false;
}

function CanSubmit()
{
	if (!gbSubmit)
	{
		gbSubmit = true;
		return true;
	}
	else
	{
		return false;
	}
}

function PBWindowManager_GetPBTypeObjectID(strObjID)
{
	var oFocusObj = document.getElementById(strObjID);
	var oPBTypeObj = this.GetPBTypeObj(oFocusObj);
	if (oPBTypeObj != null && oPBTypeObj.getAttribute("pbtype") == "datawindow")
	{
		return oPBTypeObj.id;
	}
	else
	{
		return strObjID;
	}
}

function UserObjectHandling(evt, strClientID, strUniqueID)
{
	var e = PB_GetEvent(evt);
	var element = e.srcElement;
	while (element.id == "")
	{
		element = element.parentNode;
	}
	if (element.id == strClientID)
	{
		__doPostBack(strUniqueID, 'lbuttondown');
	}
}

function Yield(strUniqueID, nTimeout)
{
	if (document.readyState == 'complete')
	{
		if (!gbYield)
		{
			goYield = window.setTimeout("__doPostBack('" + strUniqueID + "','Yield')", nTimeout);
		}
		gbYield = true;
	}
	else
	{
		goYield = window.setTimeout("Yield('" + strUniqueID + "'," + nTimeout + ")", 500);
	}
}

function Idle(strUniqueID, nTimeout)
{
	if (document.readyState == 'complete')
	{
		if (!gbIdle)
		{
			goIdle = window.setTimeout("__doPostBack('" + strUniqueID + "','Idle')", nTimeout);
		}
		gbIdle = true;
	}
	else
	{
		goIdle = window.setTimeout("Idle('" + strUniqueID + "'," + nTimeout + ")", 1000);
	}
}

function PB_SetAjaxWaitMessageInfo(ajaxWaitMsg, ajaxWaitMsgBoxWidth, ajaxWaitMsgBoxHeight, ajaxWaitMsgFontName, ajaxWaitMsgFontSize, ajaxWaitMsgBoxPosition)
{
	g_ajaxWaitMsg = ajaxWaitMsg; 
	g_ajaxWaitMsgBoxWidth = ajaxWaitMsgBoxWidth;
	g_ajaxWaitMsgBoxHeight = ajaxWaitMsgBoxHeight; 
	g_ajaxWaitMsgFontName = ajaxWaitMsgFontName; 
	g_ajaxWaitMsgFontSize = ajaxWaitMsgFontSize;
	g_ajaxWaitMsgBoxPosition = ajaxWaitMsgBoxPosition;
}

function InitAjaxWaitingMessageBox()
{
	var wmo = $get('AWMOD');
	var wmi = $get('AWMID');
	if (g_ajaxWaitMsg == "")
	{
		wmo.style.visibility = 'hidden';
		wmi.style.visibility = 'hidden';
	}
	else
	{
		wmo.style.display = 'list-item';
		wmi.style.display = 'list-item';
		wmi.style.visibility = 'visible';
		wmo.style.visibility = 'visible';
		
	  var l = 3;
		var t = 3;
		
		var dw  = parseInt(document.body.clientWidth);
		var dh  = parseInt(document.body.clientHeight);

		if (g_ajaxWaitMsgBoxPosition == TOPLEFT)
		{
      		l = 3;
	      	t = 3;
		}
		else if(g_ajaxWaitMsgBoxPosition == TOPRIGHT)
		{
			t = 3;
			l = dw - g_ajaxWaitMsgBoxWidth ;
		}
		else if(g_ajaxWaitMsgBoxPosition == BOTTOMLEFT)
		{
			t = dh - g_ajaxWaitMsgBoxHeight;
			l = 3;
		}
		else if(g_ajaxWaitMsgBoxPosition == BOTTOMRIGHT)
		{
			t = dh - g_ajaxWaitMsgBoxHeight;
			l = dw - g_ajaxWaitMsgBoxWidth ;
		}
		else
		{
			l = (dw / 2) - parseInt(g_ajaxWaitMsgBoxWidth)/2;
			t = (dh / 2) - parseInt(g_ajaxWaitMsgBoxHeight)/2;
		}

		if (l < 0) l = 0;
		if (t < 0) t = 0;
		
		wmo.style.position = "absolute";
		wmo.style.left =l;
		wmo.style.top = t;
		wmo.style.width = g_ajaxWaitMsgBoxWidth;
		wmo.style.height = g_ajaxWaitMsgBoxHeight;
		wmo.style.fontFamily = g_ajaxWaitMsgFontName;
		wmo.style.fontSize = g_ajaxWaitMsgFontSize +"pt";
		wmi.style.fontFamily = g_ajaxWaitMsgFontName;
		wmi.style.fontSize = g_ajaxWaitMsgFontSize +"pt";
		wmi.style.width = g_ajaxWaitMsgBoxWidth;
		wmi.style.height = g_ajaxWaitMsgBoxHeight;
		wmi.value = g_ajaxWaitMsg;
	}
}
	
function HideAjaxWaitingMessageBox()
{
	$get('AWMOD').style.display = 'none';
	$get('AWMID').style.display = 'none';
	$get('AWMOD').visibility = 'hidden';
	$get('AWMID').visibility = 'hidden';
}

function PB_HandleError(message, URI, line)
{
	alert("Unexpected error was thrown, the browser will be closed!\nPlease report the error to administrator.\n\nError: "
		+ message + "\nLine: " + line);
	gbCloseByError = true;
	top.close();
	return true;
}

window.onerror = PB_HandleError;

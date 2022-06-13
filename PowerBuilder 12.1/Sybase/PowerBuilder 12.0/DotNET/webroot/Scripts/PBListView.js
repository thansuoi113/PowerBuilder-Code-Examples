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

var LISTVIEW_LARGEICON = 0;
var LISTVIEW_REPORT = 1;
var LISTVIEW_SMALLICON = 2;
var LISTVIEW_LIST = 3;

var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_HOME = 36;
var KEY_END = 35;
var KEY_PAGE_UP = 33;
var KEY_PAGE_DOWN = 34;

var LISTVIEW_HF_ROW = "row";
var LISTVIEW_HF_COL = "col";
var LISTVIEW_HF_INPUT = "input";

function PBListView()
{
	this.bFullRowSelect = false;
	this.bExtendedSelect = false;
	this.bEditLabel = false;
	this.bCanEditLabel = false;
	this.nEndRow = -1;
	this.nEndCol = -1;
	this.nRow = -1;
	this.nCol = -1;
	this.nType = -1;
	this.strUniqueID = "";
	this.timeoutID = 0;
}

function PBListViewManager_KeyLeft(evt)
{
	this.OnClick(evt, this.strID, this.nRow, this.nCol - 1, false);
}

function PBListViewManager_KeyRight(evt)
{
	this.OnClick(evt, this.strID, this.nRow, this.nCol + 1, false);
}

function PBListViewManager_KeyHome(evt)
{
	if (this.bFullRowSelect && this.nType == LISTVIEW_REPORT)
	{
		this.OnRowClick(evt, this.strID, 0, false);
	}
	else
	{
		this.OnClick(evt, this.strID, 0, 0, false);
	}
}

function PBListViewManager_KeyEnd(evt)
{
	if (this.bFullRowSelect && this.nType == LISTVIEW_REPORT)
	{
		this.OnRowClick(evt, this.strID, this.nEndRow, false);
	}
	else
	{
		this.OnClick(evt, this.strID, this.nEndRow, this.nEndCol, false);
	}
}

function PBListViewManager_KeyUp(evt)
{
	if (this.bFullRowSelect && this.nType == LISTVIEW_REPORT)
	{
		this.OnRowClick(evt, this.strID, this.nRow - 1, false);
	}
	else
	{
		this.OnClick(evt, this.strID, this.nRow - 1, this.nCol, false);
	}
}

function PBListViewManager_KeyArrowDown(evt)
{
	if (this.bFullRowSelect && this.nType == LISTVIEW_REPORT)
	{
		this.OnRowClick(evt, this.strID, this.nRow + 1, false);
	}
	else
	{
		this.OnClick(evt, this.strID, this.nRow + 1, this.nCol, false);
	}
}

function PBListViewManager_KeyPageUp(evt)
{
}

function PBListViewManager_KeyPageDown(evt)
{
}

function PBListViewManager_KeyDown(evt, strID)
{
	this.GetData(strID);
	
	if (!this.bEditLabel) 
	{
	    var e = PB_GetEvent(evt);
	    switch (e.keyCode) 
		{
			case KEY_LEFT : this.KeyLeft(evt); break;
			case KEY_RIGHT : this.KeyRight(evt); break; 
			case KEY_HOME : this.KeyHome(evt); break;
			case KEY_END : this.KeyEnd(evt); break;
			case KEY_DOWN : this.KeyArrowDown(evt); break;
			case KEY_UP : this.KeyUp(evt); break;
			case KEY_PAGE_DOWN : this.KeyPageDown(evt); break;
			case KEY_PAGE_UP : this.KeyPageUp(evt); break;
		}
	}
}

function PBListViewManager_LostFocus(evt, strID)
{
	if (!this.bFullRowSelect) 
	{
		var oTD = this.GetTDId(this.nRow, this.nCol);
		if (oTD != null)
		{
			oTD.className = "listviewitem";
		}
	}
	else 
	{
		var oTR = this.GetTRId(this.nRow);
		if (oTR != null)
			oTR.className = "listviewitem";
	}
}

function PBListViewManager_SetFocus(evt, strID)
{
	this.GetData(strID);
	if (this.strID == strID)
	{
		if (!this.bFullRowSelect)
		{
			var oTD = this.GetTDId(this.nRow, this.nCol);
			if (oTD != null)
			{
				oTD.className = "selectedlistviewitem";
			}
		}
		else 
		{			
			var oTR = this.GetTRId(this.nRow);
			if (oTR != null)
			{
				oTR.className = "selectedlistviewitem";
			}
		}
	}
	goWindowManager.OnFocusOwn(strID);
}

function PBListViewManager_OnClickOwn(strID)
{
	this.GetData(strID);
    this.SetHFRow(this.nRow);
    this.SetHFCol(this.nCol);
    
    if (!(this.nType == LISTVIEW_REPORT && this.bFullRowSelect)) 
    {		
	    var oTD = this.GetTDId(this.nRow,this.nCol);
	    if (oTD != null)
	    {
				oTD.className = "selectedlistviewitem";		
	    }
    }
    else 
    {
	    var oTR = this.GetTRId(this.nRow);
	    if (oTR != null)
	    {
		    oTR.className = "selectedlistviewitem";
	    }
    }
    	
	if (!this.bEditLabel) 
	{
	    var oDiv = document.getElementById(strID);
	    oDiv.children[0].focus();
	}
}

function PBListViewManager_OnClick(evt, strID, nRow, nCol, bMouse)
{
	this.GetData(strID);
	if (!this.bEnabled)
	{
		return;
	}

	if (!g_IE)
	{
		this.SetFocus(evt, strID);
	}
	
	if (!this.bCheck)
	{ 
		var bSelect = false;
		if (this.nType != LISTVIEW_REPORT || nCol == 0) 
		{
			bSelect = true;
		}
		if (bSelect)
		{
			oTD = this.GetTDId(nRow,nCol);
			if (oTD != null) 
			{
				oTD.className = "selectedlistviewitem";		
				oTD = this.GetTDId(this.nRow, this.nCol);
				if (oTD != null) 
				{
					if (!(this.nRow == nRow && this.nCol == nCol)) 
					{
						if (this.bEditLabel) 
						{
							this.SetHFRow(nRow);
							this.SetHFCol(nCol);
							__doPostBack(this.strUniqueID, "editlabelend," + nRow + "," + nCol);
						}
						else 
						{
							oTD.className = "listviewitem";
							if (bMouse)
							{
								this.SetHFRow(nRow);
								this.SetHFCol(nCol);
								__doPostBack(this.strUniqueID, "clicked," + nRow + "," + nCol);
							}
						}
					}
					else 
					{
						if (this.bCanEditLabel) 
						{
							if (!this.bEditLabel)
							{
								__doPostBack(this.strUniqueID, "editlabel," + nRow + "," + nCol);
							}
						}
						else 
						{
							if (bMouse) 
							{
								this.SetHFRow(nRow);
								this.SetHFCol(nCol);
								__doPostBack(this.strUniqueID, "clicked," + nRow + "," + nCol);
							}
						}
					}		
				}
				else 
				{
					if (bMouse) 
					{
						this.SetHFRow(nRow);
						this.SetHFCol(nCol);
						__doPostBack(this.strUniqueID, "clicked," + nRow + "," + nCol);
					}
				}
				this.nRow = nRow;
				this.nCol = nCol;
				oListView = this.Get(strID);
				oListView.nRow = nRow;
				oListView.nCol = nCol;
				this.SetHFRow(this.nRow);
				this.SetHFCol(this.nCol);
			}
		}
	}
	else
	{
		this.bCheck = false;
	}
}

function PBListViewManager_OnClickTimeout(evt, strID, nRow, nCol, bMouse) 
{
	var oListView = this.Get(strID);
	oListView.timeoutID = window.setTimeout("goListViewManager.OnClick(event, '"
		+ strID + "', " + nRow + ", " + nCol + ", " + bMouse + ")", 300);
}

function PBListViewManager_GetTDId(nRow, nCol)
{
	return document.getElementById(this.strID + "_row_" + nRow + "_col_" + nCol);
}

function PBListViewManager_GetTRId(nRow)
{
	return document.getElementById(this.strID + "_row_" + nRow);
}

function PBListViewManager_GetData(strID)
{
	this.strID = strID;
	var oListView = this.Get(strID);
	this.nType = oListView.nType;
	this.bFullRowSelect = oListView.bFullRowSelect;
	this.nEndRow = oListView.nEndRow;
	this.nEndCol = oListView.nEndCol;
	this.nRow = oListView.nRow;
	this.nCol = oListView.nCol;
	this.bEditLabel = oListView.bEditLabel;
	this.bCanEditLabel = oListView.bCanEditLabel;
	this.strUniqueID = oListView.strUniqueID;
	this.bEnabled = oListView.bEnabled;
}

function PBListViewManager_OnRowClick(evt, strID, nRow, bMouse)
{
	this.GetData(strID);
	if (!this.bEnabled)
	{
		return;
	}

    if (!g_IE)
    {
    	this.SetFocus(evt, strID);
	}

	if (!this.bCheck) 
	{
		var oTR = this.GetTRId(nRow);
		if (oTR != null) 
		{
			oTR.className = "selectedlistviewitem";
			oTR = this.GetTRId(this.nRow);
			if (oTR != null) 
			{
				if (this.nRow != nRow) 
				{
					if (this.bEditLabel) 
					{
						this.SetHFRow(nRow);
						__doPostBack(this.strUniqueID, "editlabelend," + nRow + "," + this.nCol);
					}
					else 
					{
						oTR.className = "listviewitem";
						if (bMouse)
						{
							this.SetHFRow(nRow);
							this.SetHFCol(this.nCol);
							__doPostBack(this.strUniqueID, "clicked," + nRow + "," + this.nCol);
						}						
					}
				}
				else 
				{
					if (this.bCanEditLabel)
					{
						if (!this.bEditLabel)
						{
							__doPostBack(this.strUniqueID, "editlabel," + nRow + "," + this.nCol);
						}
					}
					else
					{
						if (bMouse) 
						{
							this.SetHFRow(nRow);
							this.SetHFCol(this.nCol);
							__doPostBack(this.strUniqueID, "clicked," + nRow + "," + this.nCol);
						}					
					}
				}
			}
			else
			{
				if (bMouse) 
				{
					this.SetHFRow(nRow);
					this.SetHFCol(this.nCol);
					__doPostBack(this.strUniqueID, "clicked," + nRow + "," + this.nCol);
				}			
			}			
			this.nRow = nRow;
			oListView = this.Get(strID);
			oListView.nRow = nRow;
			this.SetHFRow(this.nRow);
			this.SetHFCol(this.nCol);
		}
	}
	else
	{
		this.bCheck = false;
	}
}

function PBListViewManager_Get(strID)
{
	return this.ListViews.Get(strID);
}

function PBListViewManager_Add(strID, oListView)
{
	this.ListViews.Put(strID, oListView);
}

function PBListViewManager_GetIDs()
{
	return this.ListViews.KeySet();
}

function PBListViewManager_Count() 
{
	return this.ListViews.Size();
}

function PBListViewManager_Register(strID, nType, bFullRowSelect, bExtendedSelect,
	nEndRow, nEndCol, nRow, nCol, bEditLabel, bCanEditLabel, strUniqueID, bEnabled)
{
	var oListView = new PBListView();
	oListView.nType = nType;
	oListView.bFullRowSelect = bFullRowSelect;
	oListView.bExtendedSelect = bExtendedSelect;
	oListView.nEndRow = nEndRow;
	oListView.nEndCol = nEndCol;
	oListView.nRow = nRow;
	oListView.nCol = nCol;
	oListView.bEditLabel = bEditLabel;
	oListView.bCanEditLabel = bCanEditLabel;
	oListView.strUniqueID = strUniqueID;
	oListView.bEnabled = bEnabled;
	this.Add(strID, oListView);
}

function PBListViewManager_FixColumnHeaderHeight(strID)
{
	var strColumnHearderID = strID + "_colh_";
	var oColumnHeaderTD;
	var i = 0;
	var nColumnMaxHeight = 0;
	do 
	{
		oColumnHeaderTD = document.getElementById(strColumnHearderID + i);
		if (oColumnHeaderTD != null && oColumnHeaderTD.offsetHeight > nColumnMaxHeight)
		{
			nColumnMaxHeight = oColumnHeaderTD.offsetHeight;
		}
		i++;
	}
	while(oColumnHeaderTD != null)
	
	for (var j = 0; j < i-1; j++)
	{
		oColumnHeaderTD = document.getElementById(strColumnHearderID + j);
		oColumnHeaderTD.style.pixelHeight = nColumnMaxHeight;
	}
}

function PBListViewManager_ClickBox(evt, strID, nRow, nCol)
{
	this.GetData(strID);
	
	this.bCheck = true;
	var oCheck = document.getElementById(this.strID + "_row_" + nRow + "_col_" + nCol + "_check");
	this.SetHFCheck(nRow,nCol,oCheck.checked);
}

function PBListViewManager_SetHFRow(nRow) 
{
	document.getElementsByName(LISTVIEW_HF_ROW + this.strID)[0].value = nRow;
}

function PBListViewManager_SetHFCol(nCol) 
{
	document.getElementsByName(LISTVIEW_HF_COL + this.strID)[0].value = nCol;
}

function PBListViewManager_SetHFInput(sInput) 
{
	document.getElementsByName(LISTVIEW_HF_INPUT + this.strID)[0].value = sInput;
}

function PBListViewManager_SetHFCheck(nRow, nCol, bCheck) 
{
	document.getElementsByName(this.strID + "_row_" + nRow + "_col_" + nCol + "_checkh")[0].value = bCheck;
}

function PBListViewManager_InputBox(evt, strID, nRow, nCol)
{
	var oInput = document.getElementById(strID + "_row_" + nRow + "_col_" + nCol + "_input");
	if (oInput != null)
	{
		this.SetHFInput(oInput.value);
	}
}

function PBListViewManager_ColumnClick(evt, strID, nColumn)
{
	this.GetData(strID);
	__doPostBack(this.strUniqueID, "columnclick," + nColumn);
}

function PBListViewManager_Click(strID)
{
	this.GetData(strID);
	__doPostBack(this.strUniqueID, "clicked,-1,-1");
}

function PBListViewManager_DoubleClick(evt, strID, nRow, nCol)
{
	this.GetData(strID);
	this.SetHFRow(nRow);
	this.SetHFCol(nCol);
	__doPostBack(this.strUniqueID, "doubleclick," + nRow + "," + nCol);
}

function PBListViewManager_DoubleClickTimeout(evt, strID, nRow, nCol) 
{
	var oListView = this.Get(strID);
	window.clearTimeout(oListView.timeoutID);
	oListView.timeoutID = 0;

	this.DoubleClick(evt, strID, nRow, nCol);
}

function PBListViewManager()
{
	this.strID = "";
	this.nRow = -1;
	this.nCol = -1;
	this.nEndRow = -1;
	this.nEndCol = -1;
	this.nType = -1;
	this.bFullRowSelect = false;
	this.bExtendedSelect = false;
	this.bCheck = false;
	this.bIn = false;
	this.strUniqueID = "";
	this.ListViews = new PBMap();
	this.Get = PBListViewManager_Get;
	this.Add = PBListViewManager_Add;
	this.GetIDs = PBListViewManager_GetIDs;
	this.Count = PBListViewManager_Count;
	this.Register = PBListViewManager_Register;
	this.FixColumnHeaderHeight = PBListViewManager_FixColumnHeaderHeight;
	this.KeyDown = PBListViewManager_KeyDown;
	this.KeyUp = PBListViewManager_KeyUp;
	this.KeyArrowDown = PBListViewManager_KeyArrowDown;
	this.KeyPageUp = PBListViewManager_KeyPageUp;
	this.KeyPageDown = PBListViewManager_KeyPageDown;
	this.KeyLeft = PBListViewManager_KeyLeft;
	this.KeyRight = PBListViewManager_KeyRight;
	this.KeyHome = PBListViewManager_KeyHome;
	this.KeyEnd = PBListViewManager_KeyEnd;
	this.OnClick = PBListViewManager_OnClick;
	this.OnClickTimeout = PBListViewManager_OnClickTimeout;
	this.OnRowClick = PBListViewManager_OnRowClick;
	this.GetTDId = PBListViewManager_GetTDId;
	this.GetTRId = PBListViewManager_GetTRId;
	this.LostFocus = PBListViewManager_LostFocus;
	this.SetFocus = PBListViewManager_SetFocus;
	this.ClickBox = PBListViewManager_ClickBox;
	this.GetData = PBListViewManager_GetData;
	this.OnClickOwn = PBListViewManager_OnClickOwn;
	this.SetHFCol = PBListViewManager_SetHFCol;
	this.SetHFRow = PBListViewManager_SetHFRow;
	this.SetHFInput = PBListViewManager_SetHFInput;
	this.InputBox = PBListViewManager_InputBox;
	this.SetHFCheck = PBListViewManager_SetHFCheck;
	this.DoubleClick = PBListViewManager_DoubleClick;
	this.DoubleClickTimeout = PBListViewManager_DoubleClickTimeout;
	this.ColumnClick = PBListViewManager_ColumnClick;
	this.Click = PBListViewManager_Click;
}

var goListViewManager = new PBListViewManager();

PB_AjaxJsLoaded();

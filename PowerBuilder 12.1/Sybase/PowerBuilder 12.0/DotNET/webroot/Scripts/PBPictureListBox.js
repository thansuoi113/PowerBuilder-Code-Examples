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

var SELECTED_LISTBOX_ITEM = "1px dotted #A9A9A9";

function PBPictureListBox()
{
	var nBoxHeight = -1;
	var sLayerStyle = "";
	var nLayerWidth = -1;
	var nLayerHeight = -1;
	var nEventFlag = 0;
	var oSelectIndexs = null;
	var bMutiSelect = false;
	var bEnabled = true;
	var sFontColor = "";
	var sBackColor = "";
	var nItem = -1;
	var bAllowEdit = false;
	var bDropDown = false;
}

function PBPictureListBoxManager_Get(strID)
{
	return this.ListBoxs.Get(strID);
}

function PBPictureListBoxManager_Add(strID, oListBox)
{
	this.ListBoxs.Put(strID, oListBox);
}

function PBPictureListBoxManager_GetIDs()
{
	return this.ListBoxs.KeySet();
}

function PBPictureListBoxManager_Count() 
{
	return this.ListBoxs.Size();
}

function PBPictureListBoxManager_Register(strID, nBoxHeight, sLayerStyle, nLayerWidth,
	nLayerHeight, sUniqueID, sSelectedValue, sSelectedText, nEventFlag, nItems, bMutiSelect,
	bEnabled, sFontColor, sBackColor, bAllowEdit, bDropDown)
{
    var oListBox = new PBPictureListBox();
    oListBox.nBoxHeight = nBoxHeight;
    oListBox.sLayerStyle = sLayerStyle;
    oListBox.nLayerWidth = nLayerWidth;
    oListBox.nLayerHeight = nLayerHeight;
    oListBox.sUniqueID = sUniqueID;
    oListBox.nEventFlag = nEventFlag;
    oListBox.bMutiSelect = bMutiSelect;
    oListBox.oSelectIndexs = new PBSet();
    oListBox.bEnabled = bEnabled;
    oListBox.sFontColor = sFontColor;
    oListBox.sBackColor = sBackColor;
    oListBox.nItem = nItems;
    oListBox.bAllowEdit = bAllowEdit;
    oListBox.bDropDown = bDropDown;
    
    var oBox = document.getElementById(strID + '_box');
    if (oBox == null)
    {
			for (var i = 0; i < nItems; i++) 
			{
				if (document.getElementById("item" + i + strID).style.backgroundColor == 'highlight')
				{
					oListBox.oSelectIndexs.Put(i);
				}
			}
			var sSelectIndex = "";
			for (var i = 0; i < oListBox.oSelectIndexs.Size(); i++) 
			{
				 sSelectIndex += oListBox.oSelectIndexs.Get(i);
				 if (i != oListBox.oSelectIndexs.Size() - 1)
					sSelectIndex += ";";
			}
			document.getElementsByName("val" + strID)[0].value = sSelectIndex;
		}
 
    this.Add(strID, oListBox);
    if (sSelectedText == "<")
    {
			sSelectedText = "&lt;"
    }
    
    if (oBox!= null && !bAllowEdit)
    {
			oBox.innerHTML = "<nobr>"+sSelectedText+"</nobr>";
		}
		
		document.getElementById(strID).value = sSelectedValue;
}

function PBPictureListBoxManager_ClickOutSide(evt)
{
	if (goPictureListBoxManager.bFirst || goPictureListBoxManager.oListBoxDiv == null)
	{
		goPictureListBoxManager.bFirst = false;
		return;
	}

	var e = PB_GetEvent(evt);
	var srcElem = e.srcElement;
	if (srcElem == goPictureListBoxManager.oListBoxDiv ||
		srcElem == goPictureListBoxManager.oPopupDiv)
	{
		return;
	}
	
	goPictureListBoxManager.HideDropDown(evt, true);
}

function PBPictureListBoxManager_HideDropDown(evt, force)
{
	var closeIt = false;
	if (this.oPopupDiv != null)
	{
		closeIt = true;
		if (!force)
		{
			closeIt = false;
	
			var e = PB_GetEvent(evt);
			if (e.toElement)
			{
				if ((e.fromElement != e.toElement)
					&& this.oPopupDiv.contains(e.fromElement)
					&& !this.oPopupDiv.contains(e.toElement))
				{
					closeIt = true;
				}
			}
		}
	
		if (closeIt)
		{
			var oIFrame = PB_PopupGetIFrame(this.oPopupDiv);
			document.getElementsByTagName("body")[0].removeChild(this.oPopupDiv);
			if (oIFrame)
			{
				document.getElementsByTagName("body")[0].removeChild(oIFrame);
			}
			this.oPopupDiv = null;
			this.oListBoxDiv = null;
		}
	}
	return closeIt;
}

function PBPictureListBoxManager_UnselectItems(evt, strID)
{
	var oListBox = this.Get(strID);
	for (var i = 0; i < oListBox.nItem; i++) 
	{
		document.getElementById("item" + i + strID).style.backgroundColor = oListBox.sBackColor;
		document.getElementById("item" + i + strID).style.color = oListBox.sFontColor;
	}
}

function PBPictureListBoxManager_ShowDropDown(evt, strID, strBorderColor, nPicHeight)
{
	var e = PB_GetEvent(evt);

  var oListBox = this.Get(strID);
  var closeIt = this.HideDropDown(evt, true);
  
  if (goPictureListBoxManager.currentLBID != null && goPictureListBoxManager.currentLBID == strID && closeIt) return;
  
  goPictureListBoxManager.currentLBID = strID;
      
  if (oListBox.bEnabled && e != null && PB_IsLeftButtonDown(e)) 
  {
		goWindowManager.OnFocusOwn(strID);
		var oListBoxDiv = document.getElementById(strID + '_box');
		oListBoxDiv.style.backgroundColor = oListBox.sBackColor;
		oListBoxDiv.style.color = oListBox.sFontColor;
		oListBoxDiv.style.border = "";
		for (var i = 0; i < oListBox.nItem; i++) 
		{
			document.getElementById("item" + i + strID).style.backgroundColor = oListBox.sBackColor;
			document.getElementById("item" + i + strID).style.color = oListBox.sFontColor;
		}		
		var sSelectIndex = document.getElementsByName("val" + strID)[0].value;
		if (sSelectIndex != "")
		{
			var oSelectedItem = document.getElementById("item" + sSelectIndex + strID);
			oSelectedItem.style.backgroundColor = 'highlight';
			oSelectedItem.style.color = "white";
		}
      
		goPictureListBoxManager.bFirst = true;

		var oSrc = document.getElementById(strID);
		var sPopUpHtml = document.getElementById(strID + 'outer').innerHTML;
		var nWidth = oListBox.nLayerWidth;
		var nHeight = oListBox.nLayerHeight;
		
		var sTxtStyle = "margin: 0; border:1px solid " + strBorderColor
			+ "; text-Align: left; " + oListBox.sLayerStyle;
        
		var oPopupDiv = document.createElement("div");
		this.oPopupDiv = oPopupDiv;
		this.oListBoxDiv = oListBoxDiv;
		oPopupDiv.id = strID + "_popup";
		oPopupDiv.style.border = "solid 1px";
		oPopupDiv.style.width = nWidth + "px";
		oPopupDiv.style.height = nHeight + "px";
		oPopupDiv.style.overflowY = "scroll";
		oPopupDiv.style.backgroundColor = oListBox.sBackColor;
		var sLayerStyle = oListBox.sLayerStyle.split(";");
		for (var i = 0; i < sLayerStyle.length; i++)
		{
	    if (sLayerStyle[i] == "overflow-x: hidden")
	    {
        oPopupDiv.style.overflowX = "hidden";
        break;
	    }
		}

		PB_SetPopupPosition(oListBoxDiv, oPopupDiv, -1, 0);

		document.getElementsByTagName("body")[0].appendChild(oPopupDiv);

		oPopupDiv.innerHTML = sPopUpHtml;
		
		PB_PopupAddIFrame(oPopupDiv, false);

    if (sSelectIndex != "" && sSelectIndex != "0")
    {
    	var oDivs = oPopupDiv.getElementsByTagName("DIV");
    	for (var i = 0; i < oDivs.length; ++i)
    	{
    		if (oDivs[i].id == "item" + sSelectIndex + strID)
    		{
    			oDivs[i].scrollIntoView();
				}
			}
		}
  }
}

function PBPictureListBoxManager_ClickItem(evt, strID, nIndex)
{
	var e = PB_GetEvent(evt);
	var oListBox = this.Get(strID);
	if (oListBox.bEnabled && e != null && PB_IsLeftButtonDown(e))
	{
		var oSrc = document.getElementById(strID);
		oSrc.focus();
		
		var oSelectItem = document.getElementById("item" + nIndex + strID);
		var oListBoxDiv = document.getElementById(strID + '_box');
		if (oListBoxDiv == null) 
		{
			if (oListBox.oSelectIndexs.IndexOf(nIndex) != -1)
			{
				if (oListBox.bMutiSelect == true)
				{
					oListBox.oSelectIndexs.Remove(nIndex);
					oSelectItem.style.backgroundColor = oListBox.sBackColor;
					oSelectItem.style.color = oListBox.sFontColor;
					oSelectItem.bkcolor = oListBox.sBackColor;
					for (var i = 0; i < oListBox.nItem; i++)
					{
						document.getElementById("item" + i + strID).style.border = "";
					}					
				}
			}
			else 
			{
				for (var i = 0; i < oListBox.nItem; i++)
				{
					document.getElementById("item" + i + strID).style.border = "";
				}
				if (oListBox.bMutiSelect != true)
				{
					if (oListBox.oSelectIndexs.Size() != 0)
					{
						var nIndexOld = oListBox.oSelectIndexs.Get(0);
						oListBox.oSelectIndexs.Remove(nIndexOld);
						document.getElementById("item" + nIndexOld + strID).style.backgroundColor = oListBox.sBackColor;
						document.getElementById("item" + nIndexOld + strID).style.color = oListBox.sFontColor;
						document.getElementById("item" + nIndexOld + strID).bkcolor = oListBox.sBackColor;
					}
				}
				oListBox.oSelectIndexs.Put(nIndex);
				oSelectItem.style.backgroundColor = 'highlight';
				oSelectItem.style.color = "white";
				oSelectItem.style.border = SELECTED_LISTBOX_ITEM;
			}
			var sSelectIndex = "";
			for (var i = 0; i < oListBox.oSelectIndexs.Size(); i++) 
			{
				sSelectIndex += oListBox.oSelectIndexs.Get(i);
				if (i != oListBox.oSelectIndexs.Size() - 1)
				{
					sSelectIndex += ";";
				}
			}
			document.getElementsByName("val" + strID)[0].value = sSelectIndex;
			document.getElementsByName("focus" + strID)[0].value = nIndex;
			goWindowManager.OnFocusOwn(strID);
			if (oListBox.nEventFlag & 0x1 || oListBox.nEventFlag & 0x4)
			{
				__doPostBack(oListBox.sUniqueID, "selchange," + nIndex);
			}
		}
		else
		{
			if (oListBox.bAllowEdit)
			{
				if (oSelectItem.children.length > 1)
				{
					oListBoxDiv.value = PB_DecodeHtmlString(oSelectItem.children[1].innerHTML);
				}
				else
				{
					oListBoxDiv.value = PB_DecodeHtmlString(oSelectItem.children[0].innerHTML);
				}
			}

			if (oListBox.nEventFlag & 0x1 || oListBox.nEventFlag & 0x4)
			{
				goWindowManager.OnFocusOwn(strID);
				this.HideDropDown(evt, true);
				__doPostBack(oListBox.sUniqueID, "selchange," + nIndex);
			}
			else
			{
				if (!oListBox.bAllowEdit)
				{
					oListBoxDiv.innerHTML = oSelectItem.innerHTML;
				}

				document.getElementsByName("val" + strID)[0].value = nIndex;
				goWindowManager.OnFocusOwn(strID);
				this.HideDropDown(evt, true);
				
				if (oListBox.bDropDown)
				{
					oListBoxDiv.focus();
					if (oListBoxDiv.select)
					{
						oListBoxDiv.select();
					}
					else
					{
						oListBoxDiv.style.border = SELECTED_LISTBOX_ITEM;
					}
				}
				else
				{
					oListBoxDiv.style.backgroundColor = 'highlight';
					oListBoxDiv.style.color = "white";
					oListBoxDiv.style.border = SELECTED_LISTBOX_ITEM;
				}
			}
		}
	}
}

function PBPictureListBoxManager_LostFocus(strID)
{
	var oListBox = this.Get(strID);
	if (oListBox != null && oListBox.bEnabled) 
	{
		var oListBoxDiv = document.getElementById(strID + '_box');
		if (oListBoxDiv !=  null)
		{
			if (!oListBox.bDropDown)
			{
				oListBoxDiv.style.backgroundColor = oListBox.sBackColor;
				oListBoxDiv.style.color = oListBox.sFontColor;
			}
			
			if (!oListBoxDiv.select)
			{
				oListBoxDiv.style.border = "";
			}
		}
		else
		{
			for (var i = 0; i < oListBox.nItem; i++)
			{
				document.getElementById("item" + i + strID).style.border = "";
			}		
		}
	}
}

function PBPictureListBoxManager_SetFocus(strID)
{
	var oListBox = this.Get(strID);
	if (oListBox.bEnabled) 
	{
		var oSrc = document.getElementById(strID);
		var oListBoxDiv = document.getElementById(strID + '_box');
		if (oListBoxDiv != null)
		{
			if (oListBox.bDropDown)
			{
				oListBoxDiv.focus();
				if (oListBoxDiv.select)
				{
					oListBoxDiv.select();
				}
				else
				{
					oListBoxDiv.style.border = SELECTED_LISTBOX_ITEM;
				}
			}
			else
			{
				oSrc.focus();
				oListBoxDiv.style.backgroundColor = 'highlight';
				oListBoxDiv.style.color = "white";
				oListBoxDiv.style.border = SELECTED_LISTBOX_ITEM;
			}
		}
		else
		{
			oSrc.focus();
			var nIndexOld = document.getElementsByName("focus" + strID)[0].value;
			if (nIndexOld != "" && oListBox.nItem > 0)
			{
				document.getElementById("item" + nIndexOld + strID).style.border = SELECTED_LISTBOX_ITEM;
			}
			else
			{
				if (oListBox.nItem > 0)
				{
					document.getElementById("item0" + strID).style.border = SELECTED_LISTBOX_ITEM;
					document.getElementsByName("focus" + strID)[0].value = 0;
				}
			}
		}
	}
}

function PBPictureListBoxManager_OnFocus(evt, widgetID)
{
	goWindowManager.OnFocusOwn(widgetID);
}

function PBPictureListBoxManager()
{
	var oPopupDiv = null;
	var oListBoxDiv = null;
	var bFirst = false;
	var currentLBID = null;
	this.ListBoxs = new PBMap();
	this.Get = PBPictureListBoxManager_Get;
	this.Add = PBPictureListBoxManager_Add;
	this.GetIDs = PBPictureListBoxManager_GetIDs;
	this.Count = PBPictureListBoxManager_Count;
	this.Register = PBPictureListBoxManager_Register;
	this.ShowDropDown = PBPictureListBoxManager_ShowDropDown;
	this.HideDropDown = PBPictureListBoxManager_HideDropDown;
	this.ClickItem = PBPictureListBoxManager_ClickItem;
	this.SetFocus = PBPictureListBoxManager_SetFocus;
	this.LostFocus = PBPictureListBoxManager_LostFocus;
	this.UnselectItems = PBPictureListBoxManager_UnselectItems;
	this.ClickOutSide = PBPictureListBoxManager_ClickOutSide;
	this.OnFocus = PBPictureListBoxManager_OnFocus;
}

var goPictureListBoxManager = new PBPictureListBoxManager();

PB_AjaxJsLoaded();

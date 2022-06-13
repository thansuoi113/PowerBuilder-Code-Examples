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

var PBDataWindow_ClickTimeout = 750;

var PBDataWindow_CurrentDW = null;

var PBDataWindow_Submitting = false;

function PBDataWindow_SetTextBoxClickEvent(dwName)
{
	var oTextBox = document.getElementById(dwName + "_toppageno");
	if (oTextBox)
	{
		oTextBox.onclick = PBDataWindow_TextBoxClickEvent;
		oTextBox.onfocus = PBDataWindow_TextBoxFocusEvent;
	}

	oTextBox = document.getElementById(dwName + "_bottompageno");
	if (oTextBox)
	{
		oTextBox.onclick = PBDataWindow_TextBoxClickEvent;
		oTextBox.onfocus = PBDataWindow_TextBoxFocusEvent;
	}
}

function PBDataWindow_TextBoxFocusEvent(evt)
{
	var e = PB_GetEvent(evt);
	goWindowManager.OnFocusOwn(e.srcElement.id);
}

function PBDataWindow_OnDropDownDDDW(sender)
{
	goWindowManager.OnFocusOwn(sender.dwControlId);
}

function PBDataWindow_TextBoxClickEvent(evt)
{
	var e = PB_GetEvent(evt);
	e.srcElement.focus();
}

function PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName)
{
	PBDataWindow_CurrentDW = sender;
	PBDataWindow_EraseRejectedText(sender);
	goWindowManager.OnFocusOwn(sender.dwControlId);
	PBDataWindow_CurrentDW = null;
}

var PBDataWindow_PendingDW = null;

function PBDataWindow_RecordRejectedText(sender, rowNumber, columnName, newValue)
{
	if(sender.rejectedRow.value != rowNumber || sender.rejectedColumn.value != sender.currCol)
	{
		sender.rejectedValue.value = newValue;
		sender.rejectedRow.value = rowNumber;
		sender.rejectedColumnName.value = columnName;
		sender.rejectedColumn.value = sender.currCol;
		PBDataWindow_PendingDW = sender;
	}
}

function PBDataWindow_EraseRejectedText(sender)
{
	PBDataWindow_PendingDW = null;
	if(sender == null)
		return;
	if(sender.rejectedValue +"" == "undefined")
		return;
	if(sender.rejectedValue == null)
		return;
	sender.rejectedValue.value = "";
	sender.rejectedRow.value = -1;
	sender.rejectedColumnName.value = "";
	sender.rejectedColumn.value = -1;
}

function PBDataWindow_DelayedPendingDataPostback()
{
	if(PBDataWindow_CurrentDW != null)
	{
		PB_ShowMask();
		PBDataWindow_Submitting = true;
		if (!PBDataWindow_CurrentDW.submit())
		{
			PBDataWindow_Submitting = false;
		}
		PB_HideMask();
	}
	else 	
	{
		PB_ShowMask();
		if((PBDataWindow_PendingDW + "" != "undefined") && (PBDataWindow_PendingDW != null))
		{
			PBDataWindow_Submitting = true;
			if (!PBDataWindow_PendingDW.submit())
			{
				PBDataWindow_Submitting = false;
			}
		}
		PB_HideMask();
	}
	PBDataWindow_PendingDW = null;
}

var PBDataWindow_PendingSubmitTimeout;

function PBDataWindow_OnGlobalChangeFocus()
{
	if(PBDataWindow_PendingDW != null)
		if(PBDataWindow_PendingDW != PBDataWindow_CurrentDW)
		{
			clearTimeout(PBDataWindow_PendingSubmitTimeout);
			PBDataWindow_PendingSubmitTimeout=setTimeout("PBDataWindow_DelayedPendingDataPostback()",1500);
		}
}

function PBNETData_submit(sender)
{
	PB_ShowMask();
	PBDataWindow_EraseRejectedText(sender);
	sender.action = sender.oPBNETData.getAction();
	PBDataWindow_Submitting = true;
	this.bSubmitted = sender.submit();
	PBDataWindow_Submitting = this.bSubmitted;
	PB_HideMask();
}

function PBNETData_submit2(sender)
{
	PBDataWindow_EraseRejectedText(sender);
	sender.action = sender.oPBNETData.getAction();
	PBDataWindow_Submitting = true;
	this.bSubmitted = sender.submit();
	PBDataWindow_Submitting = this.bSubmitted;
}


function PBNETData_submitEmpty(sender)
{
	PB_ShowMask();	
	sender.action = "";
	PBDataWindow_Submitting = true;
	this.bSubmitted = sender.submit();
	PBDataWindow_Submitting = this.bSubmitted;
	PB_HideMask();
}


function PBNETData_getAction()
{
	var action = "genericpostback";
	action = action + "|" + this.nOutOfFocusRow;//-----------------1
	action = action + "|" + this.nOutOfFocusCol;//-----------------2
	action = action + "|" + this.strOutOfFocusObjName;//-----------3
	action = action + "|" + this.nInFocusRow;//--------------------4
	action = action + "|" + this.nInFocusCol;//--------------------5
	action = action + "|" + this.strInFocusObjName;//--------------6
	action = action + "|" + this.newValue;//-----------------------7
	if(this.bNewValueIsNull)//-------------------------------------8
		action = action + "|1";
	else
		action = action + "|0";
	action = action + "|" + this.nXpos;//--------------------------9
	action = action + "|" + this.nYpos;//-------------------------10
	if(this.bIsButton)//------------------------------------------11
		action = action + "|1";
	else
		action = action + "|0";
	if(!this.bIsButton&&this.bIsChangeFocus)//--------------------12
		action = action + "|1";
	else
		action = action + "|0";
	if(this.bIsItemError)//---------------------------------------13
		action = action + "|1";
	else
		action = action + "|0";	
	if(this.bIsItemChanged)//-------------------------------------14
		action = action + "|1";
	else
		action = action + "|0";

	if(this.bIncludesClick)//-------------------------------------15
		action = action + "|1";
	else
		action = action + "|0";
	action = action + "|" + this.strButtonAction;//---------------16

	action = action + "|" + this.secondNewValue;//----------------17

	if(this.bIsSecondItemChanged)//-------------------------------18
		action = action + "|1";
	else
		action = action + "|0";
	if(this.bIncludesDblClick)//----------------------------------19
		action = action + "|1";
	else
		action = action + "|0";
	action = action + "|" + this.nClickedRow;//-------------------20
	if(this.bIsRButtonDown)//-------------------------------------21
		action = action + "|1";
	else
		action = action + "|0";
	if(this.bIsSelect)//------------------------------------------22
		action = action + "|1";
	else
		action = action + "|0";
	action = action + "|" + this.nGraphXpos;//--------------------23
	action = action + "|" + this.nGraphYpos;//--------------------24
	action = action + "|" + this.nNonDetailRow;//-----------------25
	action = action + "|" + this.strRawNewValue;//----------------26
	action = action + "|" + this.strLastEvent;//------------------27

	action = action + "|" + this.strLog;
	
	action = action + "|" + this.nOutOfFocusTabSeq;//------------------29
	action = action + "|" + this.nInFocusTabSeq;//------------------30

	return action;
}

function PBNETData()
{
	this.nOutOfFocusRow = -1;
	this.nOutOfFocusCol = -1;
	this.strOutOfFocusObjName = "";
	this.nInFocusRow = -1;
	this.nInFocusCol = -1;
	this.strInFocusObjName = "";
	this.newValue = "";
	this.bNewValueIsNull = false;
	this.nXpos = -1;
	this.nYpos = -1;
	this.bIsButton = false;
	this.bIsChangeFocus = false;
	this.bIsItemError = false;
	this.bIsItemChanged=false;
	this.bIncludesClick=false;
	this.strButtonAction="";
	this.secondNewValue = "";
	this.bIsSecondItemChanged = false;
	this.bIncludesDblClick = false;
	this.nClickedRow = -1;
	this.bIsRButtonDown = false;
	this.bIsSelect = false;
	this.nGraphXpos = -1;
	this.nGraphYpos = -1;
	this.nNonDetailRow = 0;
	this.strRawNewValue = "";
	this.strLastEvent = "";

	this.getAction = PBNETData_getAction;
	this.submit = PBNETData_submit;
	this.submit2 = PBNETData_submit2;
	this.submitEmpty = PBNETData_submitEmpty;

	this.strLog="";

	this.bSubmitted=false;
	this.bAfterFocusChanged=false;
	this.controlInFocus=null;

    this.nOutOfFocusTabSeq = -1;
    this.nInFocusTabSeq = -1;
}

function PBDataWindow_ImmediateRButtonDownPostbackIfInDataWindow(e, element)
{
	if (element.getAttribute)
	{
		if(element.getAttribute("pbtype") == "datawindow" && element.getAttribute("pbenabled") == "1")
		{
			var sender = eval(element.dwobj);
			var dwElement = document.getElementById(sender.name + "_datawindow");

			if (sender.eventImplemented)
			{
				if (sender.eventImplemented("RButtonDown") && (dwElement == null || dwElement.onmousedown == null))
				{
					PBDataWindow_ImmediateRButtonDownPostback(e, sender, element);
					return true;
				}
			}

			return false;
		}
	}
	if(element.parentNode == null)
		return false;
	return PBDataWindow_ImmediateRButtonDownPostbackIfInDataWindow(e, element.parentNode);
}

function PBDataWindow_ImmediateRButtonDownPostback(e, sender, element)
{
	PBDataWindow_EraseRejectedText(sender);
	sender.action = "rbuttondown|" + (e.clientX - element.offsetLeft) + "|" + (e.clientY - element.offsetTop);
	PBDataWindow_Submitting = true;
	this.bSubmitted = sender.submit();
	PBDataWindow_Submitting = this.bSubmitted;
}

function PBDataWindow_GetDW_X(element)
{
    var e = PB_GetEvent();
	if(element==null)
		return e.clientX;
	if (element.getAttribute)
	{
		if(element.getAttribute("pbtype") == "datawindow")
		{
			return (e.clientX - element.offsetLeft);
		}
	}
	if(element.parentNode == null)
		return (e.clientX - element.offsetLeft);
	return PBDataWindow_GetDW_X(element.parentNode);
}

function PBDataWindow_GetDW_Y(element)
{
    var e = PB_GetEvent();
	if(element==null)
		return e.clientY;
	if (element.getAttribute)
	{
		if(element.getAttribute("pbtype") == "datawindow")
		{
			return (e.clientY - element.offsetTop);
		}
	}
	if(element.parentNode == null)
		return (e.clientY - element.offsetTop);
	return PBDataWindow_GetDW_Y(element.parentNode);
}

function PBDataWindow_OnShareDataRefresh_Postback(sender)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	if(sender.oPBNETData.bSubmitted)
		return;
	sender.oPBNETData.submitEmpty(sender);
}

function PBDataWindow_ClickedDifferentRow(sender, rowNumber, objectName)
{
    var e = PB_GetEvent();
	var oSource = e.srcElement;
	var tagName = oSource.tagName.toUpperCase();

	var canContinue = false;
	if (oSource.readOnly + "" != "undefined")
	{					
		if (oSource.readOnly)
		{
			canContinue = true;
		}
	}
	if(tagName == "SPAN")
	{
		canContinue = true;
	}

	if(!canContinue)
		return;

	if(rowNumber==sender.currRow+1)
	{
		return;
	}

	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();

	if(sender.oPBNETData.bSubmitted)
		return;

	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_Clicked";

	sender.oPBNETData.nClickedRow = rowNumber;
	sender.oPBNETData.bIncludesClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.nGraphXpos = e.offsetX;
	sender.oPBNETData.nGraphYpos = e.offsetY;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.strInFocusObjName = objectName;
	sender.oPBNETData.nInFocusCol = sender.getColNum(objectName);
	sender.oPBNETData.bIsChangeFocus = true;
	sender.oPBNETData.nNonDetailRow = sender.nNonDetailRow;
	if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
			sender.oPBNETData.bIsSelect = true;

	sender.oPBNETData.submit(sender);
}

function PBDataWindow_DelayedClickedDifferentRow(sender, rowNumber, objectName)
{
    var e = PB_GetEvent();
	var oSource = e.srcElement;
	var tagName = oSource.tagName.toUpperCase();

	var canContinue = false;
	if (oSource.readOnly + "" != "undefined")
	{					
		if (oSource.readOnly)
		{
			canContinue = true;
		}
	}
	if(tagName == "SPAN")
	{
		canContinue = true;
	}

	if(!canContinue)
		return;

	if(rowNumber==sender.currRow+1)
	{
		return;
	}

	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();


	if(sender.oPBNETData.bSubmitted)
		return;

	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_Clicked";

	sender.oPBNETData.nClickedRow = rowNumber;
	sender.oPBNETData.bIncludesClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.nGraphXpos = e.offsetX;
	sender.oPBNETData.nGraphYpos = e.offsetY;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.strInFocusObjName = objectName;
	sender.oPBNETData.nInFocusCol = sender.getColNum(objectName);
	sender.oPBNETData.bIsChangeFocus = true;

	PBDataWindow_ControlWithPendingPostback = sender;
	clearTimeout(PBDataWindow_DoubleClickedTimeout);
	PBDataWindow_DoubleClickedTimeout=setTimeout("PBDataWindow_DelayedClickedPostback()",PBDataWindow_ClickTimeout);
}

function PBDataWindow_Clicked(sender, rowNumber, objectName)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();

	if(sender.oPBNETData.bSubmitted)
		return;

    var e = PB_GetEvent();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_Clicked";

	sender.oPBNETData.nClickedRow = rowNumber;
	sender.oPBNETData.bIncludesClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.nGraphXpos = e.offsetX;
	sender.oPBNETData.nGraphYpos = e.offsetY;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.strInFocusObjName = objectName;
	sender.oPBNETData.nInFocusCol = sender.getColNum(objectName);
	sender.oPBNETData.nNonDetailRow = sender.nNonDetailRow;

	if(sender.bSelectClicked != null)
		if(sender.bSelectClicked)
			sender.oPBNETData.bIsSelect = true;

	if (sender.eventImplemented("ItemFocusChanged"))
	{
		if(sender.oPBNETData.nOutOfFocusRow<=-1)
			sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
		if(sender.oPBNETData.nOutOfFocusCol<=-1)
			sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	}

	var oSource = e.srcElement;
	var tagName = oSource.tagName.toUpperCase();
	var tagType = oSource.type;

	var bDontWaitForFocusChanged = false;
	if(sender.eventImplemented("ItemFocusChanged"))
	{
		var tmp = sender["ItemFocusChanged"] + "";
		var tmp2 = "function PBDataWindow_ItemFocusChangedClientProcess(";
		if(tmp.substring(0,tmp2.length)==tmp2)
			bDontWaitForFocusChanged = true;	
		if(!bDontWaitForFocusChanged && !sender.oPBNETData.bIsItemChanged)
		{
			tmp2 = "function PBDataWindow_ItemFocusChanged_AND_ItemChanged(";
			if(tmp.substring(0,tmp2.length)==tmp2)
				bDontWaitForFocusChanged = true;	
		}		
		if(!bDontWaitForFocusChanged && !sender.oPBNETData.bIsItemChanged)
		{
			tmp2 = "function PBDataWindow_ItemFocusChanged_AND_ItemError(";
			if(tmp.substring(0,tmp2.length)==tmp2)
				bDontWaitForFocusChanged = true;	
		}
	}

	if (!bDontWaitForFocusChanged&&sender.eventImplemented("ItemFocusChanged")&&!oSource.isDisabled && ((tagName == "INPUT")
		|| (tagName == "SELECT")
		|| (tagName == "TEXTAREA")))
	{
		var oType = oSource.type.toUpperCase();
		if (oType != "HIDDEN")
		{
			var backToServer = false;
			if (oSource.readOnly + "" != "undefined")
			{					
				if (oSource.readOnly)
				{
					backToServer = true;
				}
			}

			if (oSource.tabIndex + "" != "undefined")
			{
				if (oSource.tabIndex < 0)
				{
					backToServer = true;
				}
			}

			if (!backToServer)
			{
				return 0;
			}
		}
	}

	if(tagName == "SELECT")
		if(oSource.onmouseup == null )
			return 0;
	
	var bFullPostback = true;
	if (sender.eventImplemented("BrowserEventClicked"))
	{
		var result;
                if(sender.autoEventBind)			
			result = _evtDefault(sender.BrowserEventClicked(rowNumber, objectName));		
		else						
			result = _evtDefault(sender.BrowserEventClicked(sender, rowNumber, objectName));
		if(result == 0)
		{
			sender.oPBNETData = null; 
			return 0;			
		}
		if(result == 1)
		{
			sender.oPBNETData = null; 
			return 1;			
		}
		if(result == 2)
		{
			bFullPostback = false;
		}
	}

	if (sender.eventImplemented("ItemFocusChanged"))
	{
		if(sender.oPBNETData.nInFocusCol!=sender.oPBNETData.nOutOfFocusCol)
			sender.oPBNETData.bIsChangeFocus = true;
		if(sender.oPBNETData.nInFocusRow!=sender.oPBNETData.nOutOfFocusRow)
			sender.oPBNETData.bIsChangeFocus = true;
	}

	sender.oPBNETData.strLastEvent = "Clicked";	

	if(bFullPostback)
	{
		if(tagName == "BUTTON")
			return;
		
		if(tagName == "INPUT")
			if(tagType == "button" || tagType == "image")
				return;

		var bReadOnlyControl = false;
		var bNegativeTabIndexControl;
		if (sender.clickedControl + "" != "undefined")
		{
 			if (sender.clickedControl.readOnly + "" != "undefined")
			{
				bReadOnlyControl = sender.clickedControl.readOnly;
			}
			if (sender.clickedControl.tabIndex + "" != "undefined")
			{
				if(sender.clickedControl.tabIndex < 0 )
					bNegativeTabIndexControl = true;
			}

			if(sender.clickedControl.onfocus != null && !bNegativeTabIndexControl && !bReadOnlyControl )
			{
				sender.indicatorRow = rowNumber - 1;
			}
			else if(sender.allColumnsAreProtected+ "" != "undefined" && sender.allColumnsAreProtected == true )
			{
				sender.indicatorRow = rowNumber - 1;
			}
		}
		sender.oPBNETData.submit(sender);
	}
	else
	{
		sender.eventsCallback();
		sender.oPBNETData = null;
		return sender.eventCallbackResult;
	}
}

function PBDataWindow_RButtonDown(sender, rowNumber, objectName)
{
    var e = PB_GetEvent();
	var oSource = e.srcElement;
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_RButtonDown";

	if(sender.oPBNETData.nOutOfFocusRow<=-1)
		sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
	if(sender.oPBNETData.nOutOfFocusCol<=-1)
		sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;

	sender.oPBNETData.nClickedRow = rowNumber;
	sender.oPBNETData.nXpos = PBDataWindow_GetDW_X(oSource);
	sender.oPBNETData.nYpos = PBDataWindow_GetDW_Y(oSource);
	sender.oPBNETData.nGraphXpos = e.offsetX;
	sender.oPBNETData.nGraphYpos = e.offsetY;
	sender.oPBNETData.bIsRButtonDown = true;
	sender.oPBNETData.nNonDetailRow = sender.nNonDetailRow;

	if(sender.oPBNETData.bSubmitted)
		return;

	if(objectName == "datawindow")
	{
		if(oSource != null)
		{
			var gobName = oSource.getAttribute("gobname");
			if(gobName)
				objectName = gobName;
		}
	}

	if(objectName == "datawindow")
	{
		if(oSource != null)
		{
			if(oSource.childNodes != null)
			{
				var childNodes = oSource.children;
				if (childNodes.length >= 1)
				{
					var gobName = childNodes[0].getAttribute("gobname");
					if(gobName != null)
						objectName = gobName;
				}
			}
		}
	}
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.strInFocusObjName = objectName;

	sender.oPBNETData.nInFocusCol = sender.getColNum(objectName);

	goWindowManager.SetPointer(e);
	sender.oPBNETData.submit2(sender);
}

var PBDataWindow_ControlWithPendingPostback = null;

var PBDataWindow_DoubleClickedTimeout;

function PBDataWindow_DelayedClickedPostback()
{
	if(PBDataWindow_ControlWithPendingPostback!=null && PBDataWindow_ControlWithPendingPostback.oPBNETData!=null)
	{
		PBDataWindow_ControlWithPendingPostback.oPBNETData.submit(PBDataWindow_ControlWithPendingPostback);	
		PBDataWindow_ControlWithPendingPostback = null;	
	}
}

function PBDataWindow_DelayedClicked(sender, rowNumber, objectName)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();

	if(sender.oPBNETData.bSubmitted)
		return;

    var e = PB_GetEvent();
	var oSource = e.srcElement;

	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_DelayedClicked";

	sender.oPBNETData.nClickedRow = rowNumber;
	sender.oPBNETData.bIncludesClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.nGraphXpos = e.offsetX;
	sender.oPBNETData.nGraphYpos = e.offsetY;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.strInFocusObjName = objectName;
	sender.oPBNETData.nInFocusCol = sender.getColNum(objectName);
	if(sender.bSelectClicked != null)
		if(sender.bSelectClicked)
			sender.oPBNETData.bIsSelect = true;

	if (sender.eventImplemented("ItemFocusChanged"))
	{
		if(sender.oPBNETData.nOutOfFocusRow<=-1)
			sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
		if(sender.oPBNETData.nOutOfFocusCol<=-1)
			sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	}

	var tagName = oSource.tagName.toUpperCase();

	var bItemFocusChangedClientProcess = false;
	if(sender.eventImplemented("ItemFocusChanged"))
	{
		var tmp = sender["ItemFocusChanged"] + "";
		var tmp2 = "function PBDataWindow_ItemFocusChangedClientProcess(";
		if(tmp.substring(0,tmp2.length)==tmp2)
			bItemFocusChangedClientProcess = true;			
	}

	if (!bItemFocusChangedClientProcess&&sender.eventImplemented("ItemFocusChanged")&&!oSource.isDisabled && ((tagName == "INPUT")
		|| (tagName == "SELECT")
		|| (tagName == "TEXTAREA")))
	{
		var oType = oSource.type.toUpperCase();
		if (oType != "HIDDEN")
		{
			var backToServer = false;
			if (oSource.readOnly + "" != "undefined")
			{					
				if (oSource.readOnly)
				{
					backToServer = true;
				}
			}

			if (oSource.tabIndex + "" != "undefined")
			{
				if (oSource.tabIndex < 0)
				{
					backToServer = true;
				}
			}

			if (!backToServer)
			{
				return 0;
			}
		}
	}

	if(tagName == "SELECT")
		if(oSource.onmouseup == null )
			return 0;

	if (sender.eventImplemented("ItemFocusChanged"))
	{
		if(sender.oPBNETData.nInFocusCol!=sender.oPBNETData.nOutOfFocusCol)
			sender.oPBNETData.bIsChangeFocus = true;
		if(sender.oPBNETData.nInFocusRow!=sender.oPBNETData.nOutOfFocusRow)
			sender.oPBNETData.bIsChangeFocus = true;
	}


	var bReadOnlyControl = false;
	var bNegativeTabIndexControl;
	if (sender.clickedControl + "" != "undefined")
	{
		if (sender.clickedControl.readOnly + "" != "undefined")
		{
			bReadOnlyControl = sender.clickedControl.readOnly;
		}
		if (sender.clickedControl.tabIndex + "" != "undefined")
		{
			if(sender.clickedControl.tabIndex < 0 )
				bNegativeTabIndexControl = true;
		}

		if(sender.clickedControl.onfocus != null && !bNegativeTabIndexControl && !bReadOnlyControl )
		{
			sender.indicatorRow = rowNumber - 1;
		}
		else if(sender.allColumnsAreProtected+ "" != "undefined" && sender.allColumnsAreProtected == true )
		{
			sender.indicatorRow = rowNumber - 1;
		}
	}
	PBDataWindow_ControlWithPendingPostback = sender;
	clearTimeout(PBDataWindow_DoubleClickedTimeout);
	PBDataWindow_DoubleClickedTimeout=setTimeout("PBDataWindow_DelayedClickedPostback()",PBDataWindow_ClickTimeout);
}



function PBDataWindow_DoubleClicked(sender, rowNumber, objectName)
{
	PBDataWindow_ControlWithPendingPostback = null;
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_DoubleClicked";
	if(sender.oPBNETData.bSubmitted)
		return;

    var e = PB_GetEvent();

	sender.oPBNETData.nClickedRow = rowNumber;
	sender.oPBNETData.bIncludesDblClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.nGraphXpos = e.offsetX;
	sender.oPBNETData.nGraphYpos = e.offsetY;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.strInFocusObjName = objectName;
	sender.oPBNETData.nInFocusCol = sender.getColNum(objectName);
	sender.oPBNETData.nNonDetailRow = sender.nNonDetailRow;

    if(!sender.oPBNETData.bIsChangeFocus)
    {
        if(sender.oPBNETData.nOutOfFocusCol <=0 || sender.oPBNETData.nOutOfFocusRow <=0 )
        {
            sender.oPBNETData.nOutOfFocusCol = sender.oPBNETData.nInFocusCol;
            sender.oPBNETData.nOutOfFocusRow = sender.oPBNETData.nInFocusRow;
        }
    }
    
	sender.oPBNETData.submit(sender);
}

function PBDataWindow_ButtonClicking(sender, rowNumber, buttonName)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ButtonClicking";
	if(sender.oPBNETData.bSubmitted)
		return;

    var e = PB_GetEvent();

	sender.oPBNETData.bIncludesClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.bIsButton = true;
	sender.oPBNETData.strInFocusObjName = buttonName;
	sender.oPBNETData.nInFocusRow = rowNumber;
	if(sender.oPBNETData.nInFocusCol<=-1) 
		sender.oPBNETData.nInFocusCol = sender.currCol;
	sender.oPBNETData.bIsChangeFocus = false;
	if(sender.action!=null)
	{
		if(sender.action!="") 
		{
			if (sender.AcceptText() != 1)         			
				return 1;			
			sender.oPBNETData.strButtonAction = sender.action;	
			sender.oPBNETData.submit(sender);
			return 1;
		}
	}
}

function PBDataWindow_ButtonClicked(sender, rowNumber, buttonName)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ButtonClicked";
	if(sender.oPBNETData.bSubmitted)
		return;

    var e = PB_GetEvent();

	sender.oPBNETData.bIncludesClick=true;
	sender.oPBNETData.nXpos = e.clientX;
	sender.oPBNETData.nYpos = e.clientY;
	sender.oPBNETData.bIsButton = true;
	sender.oPBNETData.strInFocusObjName = buttonName;
	sender.oPBNETData.nInFocusRow = rowNumber;
	if(sender.oPBNETData.nInFocusCol<=-1) 
		sender.oPBNETData.nInFocusCol = sender.currCol;
	sender.oPBNETData.bIsChangeFocus = false;
	sender.oPBNETData.submit(sender);
}

function PBDataWindow_ItemFocusChanged(sender,rowNumber,columnName)
{
    var nOutOfFocusTabSeq = sender.nOutOfFocusTabSeq;
    var nInFocusTabSeq = sender.nInFocusTabSeq;
    sender.nOutOfFocusTabSeq = -1;
    sender.nInFocusTabSeq = -1;
    
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	if(sender.oPBNETData.controlInFocus==this.currentControl)
	{
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	sender.oPBNETData.controlInFocus=this.currentControl;
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemFocusChanged";
	sender.oPBNETData.bAfterFocusChanged=true;
	if(sender.oPBNETData.bSubmitted)
		return;
	if(sender.oPBNETData.nOutOfFocusRow<=-1)
		sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
	if(sender.oPBNETData.nOutOfFocusCol<=-1)
		sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.nInFocusCol = sender.currCol;
	sender.oPBNETData.strInFocusObjName = columnName;
	sender.oPBNETData.bIsChangeFocus = true;
	if (nOutOfFocusTabSeq>0)
	    sender.oPBNETData.nOutOfFocusTabSeq = nOutOfFocusTabSeq;
	if (nInFocusTabSeq>0)
	    sender.oPBNETData.nInFocusTabSeq = nInFocusTabSeq;

	if(sender.currentControl.type == "checkbox" ||	sender.currentControl.type == "radio" )
		if(sender.eventImplemented("ItemChanged"))		
		{
			PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
			if (sender.currentControl.bTabPressed == true)
			{
			    sender.currentControl.bTabPressed == false;
			    sender.oPBNETData.submit(sender);
			}
			return;
		}

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
	{
		if(sender.currentControl.options.length<1)
			sender.setDDDWVisible(columnName,false);
			
		if (nOutOfFocusTabSeq>0 && nInFocusTabSeq>0)
	        sender.oPBNETData.bIsSelect = false;
		else
            sender.oPBNETData.bIsSelect = true;		
	}
	
	if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
	{
		if (nOutOfFocusTabSeq>0 && nInFocusTabSeq>0)
	        sender.oPBNETData.bIsSelect = false;
		else
            sender.oPBNETData.bIsSelect = true;
	}

	if(sender.currentControl.gob.bDDCalendar)
		sender.oPBNETData.bIsSelect = true;
    
	PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
    
	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
	{
		if(sender.oPBNETData.nOutOfFocusRow == sender.oPBNETData.nInFocusRow && sender.oPBNETData.nOutOfFocusCol == sender.oPBNETData.nInFocusCol)
		{
			PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
			return; 
		}
	}

	var bFullPostback = true;
	if (sender.eventImplemented("BrowserEventItemFocusChanged"))
	{
		var result;
		if(sender.autoEventBind)			
			result = _evtDefault(sender.BrowserEventItemFocusChanged(rowNumber, columnName));		
		else			
			result = _evtDefault(sender.BrowserEventItemFocusChanged(sender, rowNumber, columnName));
		if(result == 0)
		{
			sender.oPBNETData = null; 
			return 0;			
		}
		if(result == 1)
		{
			bFullPostback = false;
		}
	}
	sender.oPBNETData.strLastEvent = "ItemFocusChanged";	
	if(bFullPostback)
	{
		if (sender.eventImplemented("Clicked"))
		{
			if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
	        {
		        if (nOutOfFocusTabSeq>0 && nInFocusTabSeq>0)
	                sender.oPBNETData.bIsSelect = false;
		        else
                    sender.oPBNETData.bIsSelect = true;
	        }				
			PBDataWindow_ControlWithPendingPostback = sender;
			clearTimeout(PBDataWindow_DoubleClickedTimeout);
			PBDataWindow_DoubleClickedTimeout=setTimeout("PBDataWindow_DelayedClickedPostback()",PBDataWindow_ClickTimeout);
		}
		else if(sender.eventImplemented("DoubleClicked")) 
		{
			if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
	        {
		        if (nOutOfFocusTabSeq>0 && nInFocusTabSeq>0)
	                sender.oPBNETData.bIsSelect = false;
		        else
                    sender.oPBNETData.bIsSelect = true;
	        }				
			PBDataWindow_ControlWithPendingPostback = sender;
			clearTimeout(PBDataWindow_DoubleClickedTimeout);
			PBDataWindow_DoubleClickedTimeout=setTimeout("PBDataWindow_DelayedClickedPostback()",PBDataWindow_ClickTimeout);
		}
		else
		{
			sender.oPBNETData.submit(sender);
		}
	}
	else
	{
		sender.eventsCallback();
		sender.oPBNETData = null;
		return sender.eventCallbackResult;
	}
}

function PBDataWindow_ItemFocusChanged_AND_ItemError(sender,rowNumber,columnName)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	if(sender.oPBNETData.controlInFocus==this.currentControl)
	{
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	sender.oPBNETData.controlInFocus=this.currentControl;
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemFocusChanged_AND_ItemError";
	sender.oPBNETData.bAfterFocusChanged=true;
	if(sender.oPBNETData.bSubmitted)
		return;
	if(!sender.oPBNETData.bIsItemError)
	{
		if(PBDataWindow_ControlWithPendingPostback==null)
			sender.oPBNETData = null;
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	if(sender.oPBNETData.nOutOfFocusRow<=-1)
		sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
	if(sender.oPBNETData.nOutOfFocusCol<=-1)
		sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.nInFocusCol = sender.currCol;
	sender.oPBNETData.strInOfFocusObjName = columnName;
	sender.oPBNETData.bIsChangeFocus = true;

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
		if(sender.currentControl.options.length<1)
			sender.setDDDWVisible(columnName,false);

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
		sender.oPBNETData.bIsSelect = true;
	if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
		sender.oPBNETData.bIsSelect = true;
	if(sender.currentControl.gob.bDDCalendar)
		sender.oPBNETData.bIsSelect = true;


	PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
    
	sender.oPBNETData.submit(sender);
}

function PBDataWindow_ItemFocusChanged_AND_ItemChanged(sender,rowNumber,columnName)
{
    var nOutOfFocusTabSeq = sender.nOutOfFocusTabSeq;
    var nInFocusTabSeq = sender.nInFocusTabSeq;
    sender.nOutOfFocusTabSeq = -1;
    sender.nInFocusTabSeq = -1;
    
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	if(sender.oPBNETData.controlInFocus==this.currentControl)
	{
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	sender.oPBNETData.controlInFocus=this.currentControl;
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemFocusChanged_AND_ItemChanged";
	sender.oPBNETData.bAfterFocusChanged=true;
	if(sender.oPBNETData.bSubmitted)
		return;
	if(!sender.oPBNETData.bIsItemChanged)
	{
		if(PBDataWindow_ControlWithPendingPostback==null)
			sender.oPBNETData = null;
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	if(sender.oPBNETData.nOutOfFocusRow<=-1)
		sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
	if(sender.oPBNETData.nOutOfFocusCol<=-1)
		sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.nInFocusCol = sender.currCol;
	sender.oPBNETData.strInFocusObjName = columnName;
	sender.oPBNETData.bIsChangeFocus = true;
	if (nOutOfFocusTabSeq>0)
	    sender.oPBNETData.nOutOfFocusTabSeq = nOutOfFocusTabSeq;
	if (nInFocusTabSeq>0)
	    sender.oPBNETData.nInFocusTabSeq = nInFocusTabSeq;	    
	if(sender.currentControl.type == "checkbox" ||sender.currentControl.type == "radio")
	{
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
		if(sender.currentControl.options.length<1)
			sender.setDDDWVisible(columnName,false);

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
	{
		if (nOutOfFocusTabSeq>0 && nInFocusTabSeq>0)
	        sender.oPBNETData.bIsSelect = false;
		else
            sender.oPBNETData.bIsSelect = true;
	}

	if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
	{
		if (nOutOfFocusTabSeq>0 && nInFocusTabSeq>0)
	        sender.oPBNETData.bIsSelect = false;
		else
            sender.oPBNETData.bIsSelect = true;
	}

	if(sender.currentControl.gob.bDDCalendar)
		sender.oPBNETData.bIsSelect = true;

	PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
    
	sender.oPBNETData.submit(sender);
}

function PBDataWindow_ItemFocusChanged_AND_ItemChanged_OR_ItemError(sender,rowNumber,columnName)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	if(sender.oPBNETData.controlInFocus==this.currentControl)
	{
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	sender.oPBNETData.controlInFocus=this.currentControl;
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemFocusChanged_AND_ItemChanged_OR_ItemError";
	sender.oPBNETData.bAfterFocusChanged=true;
	if(sender.oPBNETData.bSubmitted)
		return;
	if(!sender.oPBNETData.bIsItemChanged&&!sender.oPBNETData.bIsItemError)
	{
		if(PBDataWindow_ControlWithPendingPostback==null)
			sender.oPBNETData = null;
		PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
		return;
	}
	if(sender.oPBNETData.nOutOfFocusRow<=-1)
		sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
	if(sender.oPBNETData.nOutOfFocusCol<=-1)
		sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.nInFocusCol = sender.currCol;
	sender.oPBNETData.strInFocusObjName = columnName;
	sender.oPBNETData.bIsChangeFocus = true;

	if(sender.currentControl.type == "checkbox" ||	sender.currentControl.type == "radio" )
		if(sender.eventImplemented("ItemChanged"))		
		{
			PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
			return;
		}

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
		if(sender.currentControl.options.length<1)
			sender.setDDDWVisible(columnName,false);

	if(sender.currentControl.tagName.toUpperCase() == "SELECT")
		sender.oPBNETData.bIsSelect = true;

	if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
		sender.oPBNETData.bIsSelect = true;

	if(sender.currentControl.gob.bDDCalendar)
		sender.oPBNETData.bIsSelect = true;

	PBDataWindow_ItemFocusChangedClientProcess(sender,rowNumber,columnName);
    
	sender.oPBNETData.submit(sender);
}

function PBDataWindow_RowFocusChanged(sender,rowNumber)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_RowFocusChanged";
	if(sender.oPBNETData.bSubmitted)
		return;
	if(sender.oPBNETData.nOutOfFocusRow<=-1)
		sender.oPBNETData.nOutOfFocusRow = sender.nOutOfFocusRow+1;
	if(sender.oPBNETData.nOutOfFocusCol<=-1)
		sender.oPBNETData.nOutOfFocusCol = sender.nOutOfFocusCol;
	sender.oPBNETData.nInFocusRow = rowNumber;
	sender.oPBNETData.nInFocusCol = sender.currCol;
	if (sender.cols[sender.currCol] != undefined)
		sender.oPBNETData.strInFocusObjName = sender.cols[sender.currCol].name;
	sender.oPBNETData.bIsChangeFocus = true;

	if (sender.eventImplemented("Clicked"))
	{
		if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
			sender.oPBNETData.bIsSelect = true;
		PBDataWindow_ControlWithPendingPostback = sender;
		clearTimeout(PBDataWindow_DoubleClickedTimeout);
		PBDataWindow_DoubleClickedTimeout=setTimeout("PBDataWindow_DelayedClickedPostback()",PBDataWindow_ClickTimeout);
	}
	else if(sender.eventImplemented("DoubleClicked")) 
	{
		if(sender.currentControl != null && sender.currentControl.isdddw + "" == "1")
			sender.oPBNETData.bIsSelect = true;
		PBDataWindow_ControlWithPendingPostback = sender;
		clearTimeout(PBDataWindow_DoubleClickedTimeout);
		PBDataWindow_DoubleClickedTimeout=setTimeout("PBDataWindow_DelayedClickedPostback()",PBDataWindow_ClickTimeout);
	}
	else
	{
		sender.oPBNETData.submit(sender);
	}
}

function PBDataWindow_ItemChangedReject(sender, rowNumber, columnName, newValue)
{
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemChangedReject";
	if(sender.oPBNETData.bSubmitted)
		return 2;
	PBDataWindow_RecordRejectedText(sender, rowNumber, columnName, newValue);

    var e = PB_GetEvent();

	if(!sender.oPBNETData.bAfterFocusChanged)
	{
		sender.oPBNETData.bIsItemChanged = true;
		sender.oPBNETData.nOutOfFocusRow = rowNumber;
		sender.oPBNETData.nOutOfFocusCol = sender.currCol;
		sender.oPBNETData.strOutOfFocusObjName = columnName;
		sender.oPBNETData.newValue = newValue;
		sender.oPBNETData.strRawNewValue = sender.strRawNewValue;
		//if(sender.currentControl.type == "radio")
		//{
		//	if(sender.rows[rowNumber][sender.currCol]==newValue)
		//	{
		//		sender.oPBNETData.bIsItemChanged = false;
		//		sender.oPBNETData.newValue = "";
		//		return 0;
		//	}
		//}
	}
	else
	{
		sender.oPBNETData.bIsSecondItemChanged = true;
		sender.oPBNETData.secondNewValue = newValue;
	}

	var control = sender.currentControl;
	if (control != null && control.gob != null && control.gob.bNilIsNull && newValue == "")
		sender.oPBNETData.bNewValueIsNull = true;
	if(sender.currentControl!=null)
		if(
			sender.currentControl.type == "checkbox" ||
			sender.currentControl.type == "radio" ||
			sender.currentControl.tagName.toUpperCase() == "SELECT" ||
			sender.currentControl.isdddw + "" == "1" ||
			sender.currentControl.gob.bDDCalendar ||
			(  (sender.currentControl.bTabPressed + "" != "undefined") && (sender.currentControl.bTabPressed) )                 
		)
		{
			if(sender.currentControl.tagName.toUpperCase() == "SELECT")
				sender.oPBNETData.bIsSelect = true;
			if(sender.currentControl.isdddw + "" == "1")
				sender.oPBNETData.bIsSelect = true;
			if(sender.currentControl.gob.bDDCalendar)
				sender.oPBNETData.bIsSelect = true;

			if(sender.oPBNETData.nInFocusCol<=-1) 
			{
				sender.oPBNETData.nInFocusCol = sender.currCol;
				sender.oPBNETData.strInFocusObjName = columnName;
			}
			if(sender.oPBNETData.nInFocusRow<=-1) 
				sender.oPBNETData.nInFocusRow = sender.currRow+1;
			if(sender.currentControl.type == "checkbox")
			{
				sender.oPBNETData.bIncludesClick = true;
				sender.oPBNETData.nXpos = e.clientX;
				sender.oPBNETData.nYpos = e.clientY;
			}
			if(sender.currentControl.type == "radio")
			{
				sender.oPBNETData.bIncludesClick = true;
				sender.oPBNETData.nXpos = e.clientX;
				sender.oPBNETData.nYpos = e.clientY;
			}
			sender.oPBNETData.submit(sender);
		}
	return 2;
}

function PBDataWindow_ItemError(sender, rowNumber, columnName, newValue)
{
	//PBDataWindow_RecordPendingText(sender, rowNumber, columnName, newValue);
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemError";
	if(sender.oPBNETData.bSubmitted)
		return 3;
	if(sender.oPBNETData.bIsItemChanged)
		return 3;
	if(sender.oPBNETData.bIsSecondItemChanged)
		return 3;
	sender.oPBNETData.nOutOfFocusRow = rowNumber;
	sender.oPBNETData.nOutOfFocusCol = sender.currCol;
	sender.oPBNETData.strOutOfFocusObjName = columnName;
	sender.oPBNETData.newValue = newValue;
	sender.oPBNETData.bIsItemError = true;
	var control = sender.currentControl;
	if (control != null && control.gob != null && control.gob.bNilIsNull && newValue == "")
		sender.oPBNETData.bNewValueIsNull = true;
	if(sender.currentControl!=null)
		if(
			sender.currentControl.type == "checkbox" ||
			sender.currentControl.type == "radio" ||
			sender.currentControl.tagName.toUpperCase() == "SELECT"
		)
		{
			if(sender.oPBNETData.nInFocusCol<=-1) 
				sender.oPBNETData.nInFocusCol = sender.currCol;
			if(sender.oPBNETData.nInFocusRow<=-1) 
				sender.oPBNETData.nInFocusRow = sender.currRow+1;
			sender.oPBNETData.submit(sender);
		}
	return 3;
}

function PBDataWindow_ItemErrorNoPostback(sender, rowNumber, columnName, newValue)
{
	//PBDataWindow_RecordPendingText(sender, rowNumber, columnName, newValue);
	if(sender.oPBNETData==null)
		sender.oPBNETData = new PBNETData();
	sender.oPBNETData.strLog = sender.oPBNETData.strLog + ",PBDataWindow_ItemError";
	if(sender.oPBNETData.bSubmitted)
		return 3;
	if(sender.oPBNETData.bIsItemChanged)
		return 3;
	if(sender.oPBNETData.bIsSecondItemChanged)
		return 3;
}

function PBDataWindow_Collapsed(sender, rowNumber, groupLevel)
{
    var e = PB_GetEvent();

	if (e != null && e.type == "click")
	{
		sender.action = "collapsed|" + rowNumber + "|" + groupLevel + "|" + sender.xmlRenderer.treeBandAffected;
		PBDataWindow_Submitting = true;
		this.bSubmitted = sender.submit();
		PBDataWindow_Submitting = this.bSubmitted;
	}
}

function PBDataWindow_Expanded(sender, rowNumber, groupLevel)
{
    var e = PB_GetEvent();

	if (e != null && e.type == "click")
	{
		sender.action = "expanded|" + rowNumber + "|" + groupLevel + "|" + sender.xmlRenderer.treeBandAffected;
		PBDataWindow_Submitting = true;
		this.bSubmitted = sender.submit();
		PBDataWindow_Submitting = this.bSubmitted;
	}
}

function PBDataWindow_TreeNodeSelected(sender, rowNumber, groupLevel)
{
    var e = PB_GetEvent();

	if (e != null && e.type == "click")
	{
		sender.action = "treenodeselected|" + rowNumber + "|" + groupLevel;
		PBDataWindow_Submitting = true;
		this.bSubmitted = sender.submit();
		PBDataWindow_Submitting = this.bSubmitted;
	}
}

var PBDataWindow_ControlWithProgrammaticFocus = null;

var PBDataWindow_ResetControlWithProgrammaticFocusTimeout;

function PBDataWindow_DelayedResetControlWithProgrammaticFocus()
{
	if(PBDataWindow_ControlWithProgrammaticFocus!=null)
		PBDataWindow_ControlWithProgrammaticFocus.bSuppressItemGainFocusCallback = false;		
}

function PBDataWindowFocusAndDropDown(dw_name,row,col)
{
	var dw = null;
	var isObject = eval('typeof ' + dw_name);
	if(isObject != "object")
		return;
	dw = eval(dw_name);
	if(dw == null)
		return;
	if(row<=-1)
		return;
	dw.currRow = row;
	dw.nOutOfFocusRow = row;
	dw.nOutOfFocusCol = col;
	if(col<=-1)
		return;
	var control = null; 	
	var controlId = 'dw.dataForm.' + dw.name + '_' + row + '_' + col;
	var controlExists = eval('typeof ' + controlId);
	if (controlExists == "object") 	{
		control = eval(controlId);	          
		dw.bSuppressItemGainFocusCallback = true;
        if(dw.oPBNETData==null)
            dw.oPBNETData=new PBNETData();
		if(control.length!=null && control.length >= 1)
		{
			if(control[0].type=="radio")
			{
                		var i;
				for(i=0; i<control.length; ++i)
					if(control[i].type=="radio")
						if(control[i].checked)
						{
							control[i].focus();
                            			dw.oPBNETData.controlInFocus=control[i];							  
	                                    goWindowManager.OnFocusOwn(dw.dwControlId);
						}
			}
			else
			{
				control[0].focus();
                		dw.oPBNETData.controlInFocus=control[0];							  
                        goWindowManager.OnFocusOwn(dw.dwControlId);
			}
		}
		else
		{
			if(control.isdddw != "1")
				control.focus();
            	dw.oPBNETData.controlInFocus=control;							  
                  goWindowManager.OnFocusOwn(dw.dwControlId);
		}
		dw.currRow = row;
		if(dw.oPBNETData.controlInFocus.onmouseup != null )
			dw.oPBNETData.controlInFocus.onmouseup();
	}
	dw.nOutOfFocusRow = row;
	dw.nOutOfFocusCol = col;
	PBDataWindow_ControlWithProgrammaticFocus = dw;
	clearTimeout(PBDataWindow_ResetControlWithProgrammaticFocusTimeout);
	PBDataWindow_ResetControlWithProgrammaticFocusTimeout=setTimeout("PBDataWindow_DelayedResetControlWithProgrammaticFocus()",300);
}

function PBDataWindowFocusAndDropDownNoMouseUp(dw_name,row,col)
{
	var dw = null;
	var isObject = eval('typeof ' + dw_name);
	if(isObject != "object")
		return;
	dw = eval(dw_name);
	if(dw == null)
		return;
	if(row<=-1)
		return;
	dw.currRow = row;
	dw.nOutOfFocusRow = row;
	dw.nOutOfFocusCol = col;
	if(col<=-1)
		return;
	var control = null; 	
	var controlId = 'dw.dataForm.' + dw.name + '_' + row + '_' + col;
	var controlExists = eval('typeof ' + controlId);
	if (controlExists == "object") 	{
		control = eval(controlId);	          
		dw.bSuppressItemGainFocusCallback = true;
        if(dw.oPBNETData==null)
            dw.oPBNETData=new PBNETData();
		if(control.length!=null && control.length >= 1)
		{
			if(control[0].type=="radio")
			{
                		var i;
				for(i=0; i<control.length; ++i)
					if(control[i].type=="radio")
						if(control[i].checked)
						{
							control[i].focus();
                            			dw.oPBNETData.controlInFocus=control[i];							  
	                                    goWindowManager.OnFocusOwn(dw.dwControlId);
						}
			}
			else
			{
				control[0].focus();
                		dw.oPBNETData.controlInFocus=control[0];							  
                        goWindowManager.OnFocusOwn(dw.dwControlId);
			}
		}
		else
		{
			if(control.isdddw + "" == "undefined" && control.iscalendar + "" == "undefined")
			{
				control.focus();
				if(dw.selectControlContent + "" !="undefined" && dw.selectControlContent!=null)
				    dw.selectControlContent(control);
			}			
			else
			{
				if(control.onfocus != null )
				{
					dw.bSuppressItemGainFocusCallback = true;
					if(control.iscalendar + "" == "1")
						control.bSetByCal = true;
					control.onfocus();
					if(control.iscalendar + "" == "1")
						control.bSetByCal = true;
				}
			}	
	            dw.oPBNETData.controlInFocus=control;							  
      	      goWindowManager.OnFocusOwn(dw.dwControlId);
			if(control.iscalendar + "" == "1")
				control.blur();							
		}
		dw.currRow = row;
	}
	dw.nOutOfFocusRow = row;
	dw.nOutOfFocusCol = col;
	PBDataWindow_ControlWithProgrammaticFocus = dw;
	clearTimeout(PBDataWindow_ResetControlWithProgrammaticFocusTimeout);
	PBDataWindow_ResetControlWithProgrammaticFocusTimeout=setTimeout("PBDataWindow_DelayedResetControlWithProgrammaticFocus()",300);
}


function PBDataWindowFocus(dw_name,row,col)
{
	var dw = null;
	var isObject = eval('typeof ' + dw_name);
	if(isObject != "object")
		return;
	dw = eval(dw_name);
	if(dw == null)
		return;
	if(row<=-1)
		return;
	dw.currRow = row;
	dw.nOutOfFocusRow = row;
	dw.nOutOfFocusCol = col;
	if(col<=-1)
		return;
	if(dw.dataForm + "" == "undefined")
		return;
	if(dw.dataForm == null)
		return;
	var control = null; 	
	var controlId = 'dw.dataForm.' + dw.name + '_' + row + '_' + col;
	var controlExists = eval('typeof ' + controlId);
	if (controlExists == "object")
	{
		control = eval(controlId);	          
        if(dw.oPBNETData==null)
            dw.oPBNETData=new PBNETData();
		if(control.length!=null && control.length >= 1)
		{
			if (control.type == "select-one") {
				dw.bSuppressItemGainFocusCallback = true;
				control.focus();
                dw.oPBNETData.controlInFocus=control[i];			        
		    }
		    else if(control[0].type=="radio")
			{
                		var i;
				for(i=0; i<control.length; ++i)
					if(control[i].type=="radio")
						if(control[i].checked && !control[i].disabled)
						{
							control[i].focus();
                            dw.oPBNETData.controlInFocus=control[i];							  
						}
			}
			else if (!control[0].disabled)
			{
				control[0].focus();
                dw.oPBNETData.controlInFocus=control[0];							  
			}
		}
		else
		{
			if (!control.disabled)
			{
				if(control.isdddw + "" == "undefined")
				{
					try	
					{
						dw.bSuppressItemGainFocusCallback = true;
					    control.focus();
					}
					catch(err){}
				    if(dw.selectControlContent + "" !="undefined" && dw.selectControlContent!=null)
				        dw.selectControlContent(control);
				}
				else
				{
					if(control.onfocus != null)
					{
						dw.bSuppressItemGainFocusCallback = true;
						control.onfocus();
					}
				}	
			}
            dw.oPBNETData.controlInFocus=control;
		}
		dw.currRow = row;
	}
	PBDataWindow_ControlWithProgrammaticFocus = dw;
	clearTimeout(PBDataWindow_ResetControlWithProgrammaticFocusTimeout);
	PBDataWindow_ResetControlWithProgrammaticFocusTimeout=setTimeout("PBDataWindow_DelayedResetControlWithProgrammaticFocus()",300);
}

function PBDataWindowFocusNoRowChange(dw_name,row,col)
{
	var dw = null;
	var isObject = eval('typeof ' + dw_name);
	if(isObject != "object")
		return;
	dw = eval(dw_name);
	if(dw == null)
		return;
	if(row<=-1)
		return;
	dw.nOutOfFocusRow = row;
	dw.nOutOfFocusCol = col;
	if(col<=-1)
		return;
	var control = null; 	
	var controlId = 'dw.dataForm.' + dw.name + '_' + row + '_' + col;
	var controlExists = eval('typeof ' + controlId);
	if (controlExists == "object") 	{
		control = eval(controlId);	          
        if(dw.oPBNETData==null)
            dw.oPBNETData=new PBNETData();
		if(control.length!=null && control.length >= 1)
		{
			if(control[0].type=="radio")
			{
                		var i;
				for(i=0; i<control.length; ++i)
					if(control[i].type=="radio")
						if(control[i].checked)
						{
							control[i].focus();
                            			dw.oPBNETData.controlInFocus=control[i];							  
						}
			}
			else
			{
				control[0].focus();
                		dw.oPBNETData.controlInFocus=control[0];							  
			}
		}
		else
		{
			control.focus();
            	dw.oPBNETData.controlInFocus=control;							  
		}
	}
}

function PBDataWindowSetFocus(dw_name)
{
	var dw = null;
	var isObject = eval('typeof ' + dw_name);
	if(isObject != "object")
		return;
	var dw = eval(dw_name);
	if(dw == null)
		return;
	var row = dw.currRow;
	if(row<=-1)
		row = 0;
	var col = 1;
	var focusCol = 1;
	var focusTabIndex = 65536;
	if(dw.dataForm + "" == "undefined")
		return;
	if(dw.dataForm == null)
		return;
	for (col=1; col<=dw.cols.length; col++)
	{
		var control = null; 	
		var controlId = 'dw.dataForm.' + dw.name + '_' + row + '_' + col;
		var controlExists = eval('typeof ' + controlId);
		if ( (controlExists + "" != "undefined") && (controlExists == "object") )
		{
			control = eval(controlId);
			if(control.length!=null && control.length >= 1) {
			    if (control.type == "select-one")
			        tabIndex = control.tabIndex;
			    else
				    tabIndex = control[0].tabIndex;
			}
			else
				tabIndex = control.tabIndex;
			
			if (tabIndex>0 && tabIndex<focusTabIndex)
			{
				focusTabIndex = tabIndex;
				focusCol = col;
			}
		}

	}
	PBDataWindowFocus(dw_name,row,focusCol);
}

function PBDataWindowProcessTab(dw_name,row,outTab,inTab,outRow)
{
    if (outTab<0 || outRow<0)
        return null;
        
    if (row>outRow+1)
        return null;
        
    var dw = document.getElementById(dw_name + "_datawindow");
    if (dw == null)
        return null;
    
    var nextElement = null;
    var nextElementFound = false; 
       
    var oldSeq = outTab;
    var nextSeq = inTab;
    if (row == outRow + 1)
        nextSeq = 9999;
    
    var curRow = outRow;
    
    while (oldSeq < nextSeq)
    {
        var inputs = dw.getElementsByTagName("INPUT");
        i = 0;
        while (objElement = inputs.item(i++))
        {
            if (objElement.rowno != curRow)
                continue;
            tabSeq = parseInt(objElement.tabseq);
		    if (tabSeq == null || tabSeq <= 0)
			    continue;
		    else if (tabSeq > oldSeq && tabSeq <= nextSeq)
		    {
			    nextSeq = tabSeq;
			    nextElement = objElement;
		    }
        } 	

	    var selects = dw.getElementsByTagName("SELECT");
	    i = 0;
	    while (objElement = selects.item(i++))
	    {
            if (objElement.rowno != curRow)
                continue;
		    tabSeq = parseInt(objElement.tabseq);
		    if (tabSeq == null || tabSeq <= 0)
			    continue;
		    else if (tabSeq > oldSeq && tabSeq <= nextSeq)
		    {
			    nextSeq = tabSeq;
			    nextElement = objElement;
		    }
	    }

	    var textareas = dw.getElementsByTagName("TEXTAREA");
	    i = 0;
	    while (objElement = textareas.item(i++))
	    {
            if (objElement.rowno != curRow)
                continue;
		    tabSeq = parseInt(objElement.tabseq);
		    if (tabSeq == null || tabSeq <= 0)
			    continue;
		    else if (tabSeq > oldSeq && tabSeq <= nextSeq)
		    {
			    nextSeq = tabSeq;
			    nextElement = objElement;
		    }
	    }
	    
	    oldSeq = nextSeq;	    
	    if (row == outRow + 1 && nextElement == null)
	    {
	       oldSeq = 0;
	       nextSeq = inTab;
	       curRow = row;
	    }
	}
	
    if (nextElement != null)
        return nextElement;
    return null;
}

function PBDataWindowFocusAfterTab(dw_name,row,col,outTab,inTab,outRow)
{
    var obj = PBDataWindowProcessTab(dw_name,row,outTab,inTab,outRow);
    if (obj != null)
    {
		if (obj.parentDW != null)
		{
			obj.parentDW.bProcessingTab = false;
		}
        row = parseInt(obj.rowno);
        col = parseInt(obj.colno);
    }
    PBDataWindowFocus(dw_name,row,col);
}

function PBDataWindow_ResetAjax()
{
	window.clearTimeout(PBDataWindow_PendingSubmitTimeout);
	window.clearTimeout(PBDataWindow_ResetControlWithProgrammaticFocusTimeout);
	window.clearTimeout(PBDataWindow_DoubleClickedTimeout);

	PBDataWindow_PendingDW = null;
}

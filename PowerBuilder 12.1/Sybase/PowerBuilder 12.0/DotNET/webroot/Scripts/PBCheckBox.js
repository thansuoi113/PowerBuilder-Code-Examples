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

function PB3StateCheckBoxOnClick(evt, widgetID, imageID, imageUnchecked,
	imageChecked, imageIndeterminate)
{
	if (!PB_IsLeftButtonDown(PB_GetEvent(evt)))
	{
		return;
	}

	PBCheckBoxFocus(evt, widgetID);

	var el=document.getElementById(widgetID); 
	var im=document.getElementById(imageID);
	
	if (el.value==1)
	{
		el.value=2;
		im.src=imageIndeterminate;
	} 
	else if (el.value==2)
	{
		el.value=0;
		im.src=imageUnchecked;
	}
	else
	{
		el.value=1;
		im.src=imageChecked;
	}
}

function PB2StateCheckBoxOnClick(evt, widgetID, imageID, imageUnchecked, imageChecked)
{
	if (!PB_IsLeftButtonDown(PB_GetEvent(evt)))
	{
		return;
	}

	PBCheckBoxFocus(evt, widgetID);

	var el=document.getElementById(widgetID); 
	var im=document.getElementById(imageID);
	
	if (el.value==1)
	{
		el.value=0;
		im.src=imageUnchecked;
	}
	else
	{
		el.value=1;
		im.src=imageChecked;
	}
}

function PBCheckBoxFocus(evt, widgetID)
{
	PBCheckBoxSetFocus(evt, widgetID);
	goWindowManager.OnFocusOwn(widgetID);
}

function PBCheckBoxOnFocus(evt, widgetID)
{
	goWindowManager.OnFocusOwn(widgetID);

	var divLabel = document.getElementById(widgetID+"_div");
	if (divLabel)
	{
		g_oldPBBorderStyle = divLabel.style.borderStyle;
		g_oldPBBorderWidth = divLabel.style.borderWidth;
		g_oldPBBorderColor = divLabel.style.borderColor;

		divLabel.style.borderStyle = "dotted";
		divLabel.style.borderWidth = "1px";
		divLabel.style.borderColor = "#A9A9A9";
	}
}

function PBCheckBoxOnBlur(evt, divLabel)
{
	divLabel.style.borderStyle = g_oldPBBorderStyle;
	divLabel.style.borderWidth = g_oldPBBorderWidth;
	divLabel.style.borderColor = g_oldPBBorderColor;
}

function PBCheckBoxSetFocus(evt, widgetID)
{
	var divLabel = document.getElementById(widgetID+"_div");
	if (divLabel)
	{
		divLabel.focus();
	}
	else
	{
		var tdObj = document.getElementById(widgetID+"_td");
		if (tdObj)
		{
			tdObj.focus();
		}
	}
}

function PBCheckBoxKeyUp(evt, c)
{
	var e = PB_GetEvent(evt);
	if (e.keyCode == 32)
	{
		e = document.createEventObject();
		PB_SetLeftButtonDown(e);
		
		if (document.all)
		{
			c.fireEvent("onmouseup", e);
		}
		else
		{
			e.initEvent('mouseup', true, false);
            c.dispatchEvent(e);
		}
	}
}

PB_AjaxJsLoaded();

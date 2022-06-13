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

var g_calendarDiv = null;
var g_calendar = null;
var g_calendarButton = null;
var g_calendarAfterNav = false;

function PB_RadDateSelected(oCalendar, args)
{
	var selectedDates = oCalendar.GetSelectedDates();
	if (selectedDates.length == 0)
	{
		oCalendar.SelectDate(args.Date);
	}

	oCalendar.AutoPostBack = 1;
	
	PB_ResetDatePicker();
}

function PB_ResetDatePicker()
{
	document.detachEvent("onclick", PB_DatePickerClick);

	g_calendarDiv = null;
	g_calendar = null;
	g_calendarButton = null;
	g_calendarAfterNav = false;
}

function PB_HideDatePicker(evt, force)
{
	if (g_calendarDiv != null)
	{
		var closeIt = true;
		if (!force)
		{
			closeIt = false;

			var e = PB_GetEvent(evt);
			if (e)
			{
				if (e.toElement)
				{
					if ((e.fromElement != e.toElement) && g_calendarDiv.contains(e.fromElement)
						&& !g_calendarDiv.contains(e.toElement))
					{
						closeIt = true;
					}
				}
			}
		}

		if (closeIt)
		{
			if (g_calendar != null)
			{
				if (g_calendarAfterNav)
				{
					g_calendarAfterNav = false;
					return;
				}
				
				var fastNavPopupDiv = document.getElementById(g_calendar.ClientID + "_FastNavPopup");
				if (fastNavPopupDiv)
				{
					return;
				}
			}

			var oIFrame = PB_PopupGetIFrame(g_calendarDiv);
			if (oIFrame)
			{
				oIFrame.style.visibility = "hidden";
			}
			g_calendarDiv.style.display = "none";
			
			PB_ResetDatePicker();
		}
	}
}

function PB_DatePickerClick(evt)
{
	if (g_calendarAfterNav)
	{
		return;
	}

	var e = PB_GetEvent(evt);
	var srcElem = e.srcElement;
	
	if (g_calendarDiv != null && g_calendarButton != null)
	{
		if (srcElem == g_calendarDiv || g_calendarDiv.contains(srcElem) || srcElem == g_calendarButton)
		{
			return;
		}
	}
	
	PB_HideDatePicker(evt, true);
}

function PB_ShowDatePicker(evt, divID, srcID, nTop, calendarID, btnID)
{
	try
	{
		var e = PB_GetEvent(evt);
		if (e)
		{
			e.cancelBubble = true;
		}

		if (g_calendarDiv != null)
		{
			PB_HideDatePicker(evt, true);
			return;
		}

		g_calendarButton = document.getElementById(btnID);
		var oDiv = document.getElementById(divID);
		var oSrc = document.getElementById(srcID);
		
		if (calendarID)
		{
			g_calendar = calendarID;
		}
		else
		{
			g_calendar = null;
		}
		
		PB_SetPopupPosition(oSrc, oDiv, 0, nTop);
		oDiv.onmouseout = PB_HideDatePicker;
		if (g_calendar)
		{
			if (g_calendar.GetSelectedDates)
			{
				goEditMaskManager.GetData(oSrc);
				
				if (goEditMaskManager.nYear != 0 && goEditMaskManager.nMonth != 0 && goEditMaskManager.nDay != 0)
				{
					var dayKeyIn = [goEditMaskManager.nYear, goEditMaskManager.nMonth, goEditMaskManager.nDay];
					var navToDayKeyIn = true;
					var selectedDates = g_calendar.GetSelectedDates();
					if (selectedDates.length > 0)
					{
						if (dayKeyIn[0] == selectedDates[0][0]
							&& dayKeyIn[1] == selectedDates[0][1]
							&& dayKeyIn[2] == selectedDates[0][2])
						{
							navToDayKeyIn = false;

							g_calendar.NavigatePrev();
							g_calendar.NavigateToDate(selectedDates[0]);
			            }
					}
					
					if (navToDayKeyIn)
					{
						g_calendar.SelectDate(dayKeyIn);
						g_calendar.NavigateToDate(dayKeyIn);
					}
				}
				else
				{
					var selectedDates = g_calendar.GetSelectedDates();
					if (selectedDates.length > 0)
					{
						g_calendar.NavigatePrev();
						g_calendar.NavigateToDate(selectedDates[0]);
					}
					else
					{
						var today = new Date();
						g_calendar.NavigateToDate([today.getFullYear(), today.getMonth() + 1, today.getDate()]);
					}
				}
				PB_RadStyleReset(g_calendar.ClientID);
				g_calendarAfterNav = false;
			}

			window.setTimeout("document.attachEvent('onclick', PB_DatePickerClick);", 300);
		}

		oDiv.style.display = "block";
		
		g_calendarDiv = oDiv;
		PB_PopupAddIFrame(oDiv);

		goWindowManager.OnFocusOwn(srcID);
		goWindowManager.OnFocusOwn(oSrc.getAttribute("pbid"));
		oSrc.focus();
	}
	catch(ex)
	{
	}
}

PB_AjaxJsLoaded();

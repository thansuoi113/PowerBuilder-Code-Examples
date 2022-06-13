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

var STRINGMASK = 1;
var	NUMERICMASK = 2;
var DATEMASK = 3;
var	TIMEMASK = 4;
var DATETIMEMASK = 5;
var	DECIMALMASK = 6;

var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_DELETE= 46;
var KEY_BACKSPACE = 8;
var KEY_HOME = 36;
var KEY_END = 35;
var KEY_A = 65;
var KEY_P = 80;
var KEY_a = 97;
var KEY_p = 112;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_DIGHT_START = 0x30;	
var KEY_DIGHT_END = 0x39;
var KEY_UPPER_CASE_ALPHA_START = 0x41;
var KEY_UPPER_CASE_ALPHA_END = 0x5A; 
var KEY_LOWER_CASE_ALPHA_START = 0x61;
var KEY_LOWER_CASE_ALPHA_END = 0x7A;
var KEY_PRINT_START = 0x20;
var KEY_PRINT_END = 0x7E;
	
function InitMonth()
{
	goMonth.Put("JAN");
	goMonth.Put("FEB");
	goMonth.Put("MAR");
	goMonth.Put("APR");
	goMonth.Put("MAY");
	goMonth.Put("JUN");
	goMonth.Put("JUL");
	goMonth.Put("AUG");
	goMonth.Put("SEP");
	goMonth.Put("OCT");
	goMonth.Put("NOV");
	goMonth.Put("DEC");
}

function PBEditMask()
{
	this.strID = "";
    this.strMask = "";
    this.strUniqueID = "";
    this.nMaskType = 0;
    this.nYearOffset = -1;
    this.nMonthOffset = -1;
    this.nDayOffset = -1;
    this.nJulianDayOffset = -1;
    this.nAM_PMOffset = -1;
    this.nHourOffset = -1;
    this.nMinuteOffset = -1;
    this.nSecondOffset = -1;
    this.nFractionalSecondOffset = -1;
    this.nYearNumber = 0;
    this.nMonthNumber = 0;
    this.bPostBack = false;
    this.strMaskUniqueID = "";
    this.bHasNonMask = false;
    this.bServerChanged = false;
    this.decimalChar = '.';
    this.thousandsChar = ',';
    this.currencyChar = '$';
    this.tailChar = "%";
    this.datePickerID = "";
}

function InitMaskChar()
{
	goStringTypeMaskChar.Put('!');
	goStringTypeMaskChar.Put('^');
	goStringTypeMaskChar.Put('#');
	goStringTypeMaskChar.Put('a');
	goStringTypeMaskChar.Put('x');
	
	goDateTypeMaskChar.Put('y');
	goDateTypeMaskChar.Put('m');
	goDateTypeMaskChar.Put('d');
	goDateTypeMaskChar.Put('j');

	goTimeTypeMaskChar.Put('h');
	goTimeTypeMaskChar.Put('m');
	goTimeTypeMaskChar.Put('s');
	goTimeTypeMaskChar.Put('f');
	goTimeTypeMaskChar.Put('a');

	goDateTimeTypeMaskChar.Put('y');
	goDateTimeTypeMaskChar.Put('m');
	goDateTimeTypeMaskChar.Put('d');
	goDateTimeTypeMaskChar.Put('j');
	goDateTimeTypeMaskChar.Put('h');
	goDateTimeTypeMaskChar.Put('s');
	goDateTimeTypeMaskChar.Put('f');
	goDateTimeTypeMaskChar.Put('a');
	
	goNumericTypeMaskChar.Put('0');
	goNumericTypeMaskChar.Put('#');
}

function PBEditMaskManager_Get(strID)
{
	return this.EditMasks.Get(strID);
}

function PBEditMaskManager_Add(strID, oEditMask)
{
	this.EditMasks.Put(strID, oEditMask);
}

function PBEditMaskManager_GetIDs()
{
	return this.EditMasks.KeySet();
}

function PBEditMaskManager_Count() 
{
	return this.EditMasks.Size();
}

function PBEditMaskManager_Register(strID, strMask, nMaskType, strUniqueID, bPostBack, strMaskUniqueID, strMaskClientID, 
	bHasNonMask, bServerChanged, decimalChar, thousandsChar, currencyChar, tailChar, datePickerID)
{
    var oEditMask = new PBEditMask();
    oEditMask.strID = strMaskClientID;
    if (nMaskType == DATEMASK || nMaskType == DATETIMEMASK || nMaskType == TIMEMASK )
    {
		oEditMask.strMask = strMask.toLowerCase().replace("am/pm", "am");
	}
	else if (nMaskType == NUMERICMASK || nMaskType == DECIMALMASK)
	{
		var oCurrencyChar = this.GetArray(currencyChar);
		var oMask = this.GetArray(strMask);
		if (bHasNonMask)
		{
			oEditMask.strMask = strMask;
		}
		else
		{
			if (oMask[0] == oCurrencyChar[0])
			{
				oEditMask.strMask = currencyChar + "-" + strMask.substr(currencyChar.length);
			}
			else
			{
				oEditMask.strMask = "-" + strMask;
			}
		}
	}
	else
	{
		oEditMask.strMask = strMask;
	}
	
    oEditMask.nMaskType = nMaskType;
    oEditMask.strUniqueID = strUniqueID;
    oEditMask.bPostBack = bPostBack;
    oEditMask.strMaskUniqueID = strMaskUniqueID;
    oEditMask.bHasNonMask = bHasNonMask;
    oEditMask.bServerChanged = bServerChanged;
    oEditMask.decimalChar = decimalChar;
    oEditMask.thousandsChar = thousandsChar;
    oEditMask.currencyChar = currencyChar;
    oEditMask.tailChar = tailChar;
    oEditMask.datePickerID = datePickerID;
    this.ParserOffset(oEditMask.strMask, nMaskType, oEditMask);
    this.Add(strID, oEditMask);
}

function PBEditMaskManager_Init()
{
}

function PBEditMaskManager_ParserOffset(strMask, nMaskType, oEditMask)
{
	if (nMaskType == DATEMASK || nMaskType == DATETIMEMASK) 
	{
		oEditMask.nYearOffset = strMask.indexOf("yyyy");
		if (oEditMask.nYearOffset == -1) 
		{
			oEditMask.nYearOffset = strMask.indexOf("yy");
			if (oEditMask.nYearOffset != -1)
			{
				oEditMask.nYearNumber = 2;
			}
		}
		else
		{
			oEditMask.nYearNumber = 4;
		}
		oEditMask.nMonthOffset = strMask.indexOf("mmm");
		if (oEditMask.nMonthOffset == -1) 
		{
			oEditMask.nHourOffset = strMask.indexOf("hh");
			var nMMOffset = strMask.indexOf("mm");
			if (oEditMask.nHourOffset == -1 || oEditMask.nHourOffset > nMMOffset)
			{
				oEditMask.nMonthOffset = nMMOffset;
				if (oEditMask.nMonthOffset != -1)
				{
					oEditMask.nMonthNumber = 2;
				}
			}
		}
		else
		{
			oEditMask.nMonthNumber = 3;
		}
		oEditMask.nDayOffset = strMask.indexOf("dd");
		oEditMask.nJulianDayOffset = strMask.indexOf("jjj");
	}
	if (nMaskType == TIMEMASK || nMaskType == DATETIMEMASK) 
	{
		oEditMask.nHourOffset = strMask.indexOf("hh");
		if (oEditMask.nMonthNumber)
		{
			oEditMask.nMinuteOffset = strMask.indexOf("mm", oEditMask.nMonthOffset + oEditMask.nMonthNumber);
		}
		else	
		{
			oEditMask.nMinuteOffset = strMask.indexOf("mm");
		}
		oEditMask.nSecondOffset = strMask.indexOf("ss");
		oEditMask.nFractionalSecondOffset = strMask.indexOf("f");
		oEditMask.nAM_PMOffset = strMask.indexOf("am");
	}
}

function PBEditMaskManager_ToNumber(strNumber)
{
	var nNumber = 0;
	for (var i=0; i<strNumber.length; i++)
	{
		nNumber += (strNumber.charAt(i) - '0') * Math.pow(10, i);
	}
	return nNumber;
}

function PBEditMaskManager_IsValidYear(cKeyCode)
{
	var bValid;
	do {
		if (!(bValid = this.IsDigit(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
		var nYear = this.ToNumber(this.Reverse(this.ConcatArray(this.nYearOffset, this.nYearNumber)));
		var bLeap = this.IsLeapYear(nYear);
		this.oText[this.nEndPos] = cCodeOld;
		if ((this.nMonth == 2 && this.nDay == 29) || this.nJulianDay == 366)
		{
			bValid = bLeap;
		}
		break;
	} 
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidMonth(cKeyCode)
{
	var bValid;
	do 
	{
		if (this.nMonthNumber == 2) 
		{
			if (!(bValid = this.IsDigit(cKeyCode))) break;
			var cCodeOld = this.oText[this.nEndPos];
			this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
			var nMonth = this.ToNumber(this.Reverse(this.ConcatArray(this.nMonthOffset, this.nMonthNumber)));
			if (!(nMonth >=0 && nMonth <= 12))
			{
				bValid = false;
			}
			else
			{
				if (nMonth == 2)
				{
					if (this.nDayOffset != -1)
					{
						var nDay = this.ToNumber(this.Reverse(this.ConcatArray(this.nDayOffset, 2)));
						if (nDay > 28)
						{
							if (this.nYearOffset != -1)
							{
								var nYear = this.ToNumber(this.Reverse(this.ConcatArray(this.nYearOffset, this.nYearNumber)));
								var bLeap = this.IsLeapYear(nYear);
								if (!(bLeap && nDay == 29))
								{
									bValid = false;
								}
							}
							else
							{
								bValid = false;
							}
						}
					}
				}
			}
			this.oText[this.nEndPos] = cCodeOld;
		}
		else
		{
			bValid = this.IsValidMMM(cKeyCode);
		}
		break;
	} 
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidDay(cKeyCode)
{
	var bValid;
	do 
	{
		if (!(bValid = this.IsDigit(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
		var nDay = this.ToNumber(this.Reverse(this.ConcatArray(this.nDayOffset, 2)));
		this.oText[this.nEndPos] = cCodeOld;
		if (this.nMonth == 0 || this.nMonth == 1 ||
			this.nMonth == 3 || this.nMonth == 5 ||
			this.nMonth == 7 || this.nMonth == 8 ||
			this.nMonth == 10 || this.nMonth == 12) 
		{
			if (!(nDay >= 0 && nDay <= 31)) 
			{
				bValid = false;
			}
		}
		else if (this.nMonth == 4 || this.nMonth == 6 ||
				this.nMonth == 9 || this.nMonth == 11)
		{
			if (!(nDay >= 0 && nDay <= 30)) 
			{
				bValid = false;
			}
		}
		else 
		{
			if (this.IsLeapYear(this.nYear)) 
			{
				if (!(nDay >= 0 && nDay <= 29)) 
				{
					bValid = false;
				}
			}
			else if (!(nDay >= 0 && nDay <= 28)) 
			{
				bValid = false;
			}
		}
		break;
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidJulianDay(cKeyCode)
{
	var bValid;
	do 
	{
		if (!(bValid = this.IsDigit(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
		var nJulianDay = this.ToNumber(this.Reverse(this.ConcatArray(this.nJulianDayOffset, 3)));
		this.oText[this.nEndPos] = cCodeOld;
		if (this.IsLeapYear(this.nYear)) 
		{
			if (!(nJulianDay >=0 && nJulianDay <= 366)) 
			{
				bValid = false;
			}
		}
		else if (!(nJulianDay >=0 && nJulianDay <= 365)) 
		{
			bValid = false;
		}
		break;	
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidMMM(cKeyCode)
{
	var bValid;
	do {
		if (!(bValid = this.IsAlpha(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetUpperKeyString(cKeyCode);
		var strMonth;
		if (this.nEndPos == this.nMonthOffset)
		{
			strMonth = this.GetUpperKeyString(cKeyCode);
		}
		else 
		{
			if (this.nEndPos == this.nMonthOffset + 1 &&
				this.oText[this.nMonthOffset] == 'A' &&
				this.oText[this.nMonthOffset+1] == 'U')
			{
				this.oText[this.nMonthOffset+2] = 'G';
			}
			strMonth = this.ConcatArray(this.nMonthOffset, 3);
		}
		this.oText[this.nEndPos] = cCodeOld;
		var strMonthTrim = "";
		var bFirst = true;
		for (var i = strMonth.length - 1; i >= 0; i--)
		{
			if (strMonth.charAt(i) != ' ' || !bFirst)
			{
				strMonthTrim += strMonth.charAt(i);
				bFirst = false;
			}
		}
		strMonth = this.Reverse(strMonthTrim);
		for (var i = 0; i<goMonth.Size(); i++)
		{
			if (goMonth.Get(i).substring(0,strMonth.length) == strMonth) 
			{
				break;
			}
		}
		if (i == goMonth.Size()) 
		{
			bValid = false;
		}
		else 
		{
			this.oText[this.nMonthOffset] = goMonth.Get(i).charAt(0);
			this.oText[this.nMonthOffset + 1] = goMonth.Get(i).charAt(1);
			this.oText[this.nMonthOffset + 2] = goMonth.Get(i).charAt(2);	
		}
		break;
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidMinute(cKeyCode)
{
	var bValid;
	do 
	{
		if (!(bValid = this.IsDigit(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
		var nMinute = this.ToNumber(this.Reverse(this.ConcatArray(this.nMinuteOffset, 2)));
		this.oText[this.nEndPos] = cCodeOld;
		if (!(nMinute >= 0 && nMinute <= 59))
		{
			bValid = false;
		}
		break;
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_Reverse(strValue)
{
	var strReverse = "";
	for (var i = strValue.length - 1; i >= 0; i--)
	{
		strReverse += strValue.charAt(i);
	}
	return strReverse;
}

function PBEditMaskManager_IsValidHour(cKeyCode)
{
	var bValid;
	do 
	{
		if (!(bValid = this.IsDigit(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
		var nHour = this.ToNumber(this.Reverse(this.ConcatArray(this.nHourOffset, 2)));
		this.oText[this.nEndPos] = cCodeOld;
		if (this.nAM_PMOffset != -1) 
		{
			if (!(nHour >= 0 && nHour <= 12)) 
			{
				bValid = false;
			}
		}
		else
		{
			if (!(nHour >= 0 && nHour <= 23)) 
			{
				bValid = false;
			}
		}
		break;	
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidSecond(cKeyCode)
{
	var bValid;
	do
	{
		if (!(bValid = this.IsDigit(cKeyCode))) break;
		var cCodeOld = this.oText[this.nEndPos];
		this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
		var nSecond = this.ToNumber(this.Reverse(this.ConcatArray(this.nSecondOffset, 2)));
		this.oText[this.nEndPos] = cCodeOld;
		if (!(nSecond >= 0 && nSecond <= 59)) 
		{
			bValid = false;
		}
		break;
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidFractionalSecond(cKeyCode)
{
	return this.IsDigit(cKeyCode);
}

function PBEditMaskManager_IsValidAM_PM(cKeyCode)
{
	return cKeyCode == KEY_A || cKeyCode == KEY_P || cKeyCode == KEY_a || cKeyCode == KEY_p;
}

function PBEditMaskManager_IsLeapYear(nYear)
{
	return (nYear) % 4 == 0 && (nYear) % 100 != 0 || (nYear) % 400 == 0
}

function PBEditMaskManager_IsValidChar(cMask, cKeyCode)
{
	var bValid;
	switch (this.nMaskType) 
	{
		case STRINGMASK:  bValid = this.IsValidStringChar(cMask, cKeyCode); break;
		case DECIMALMASK: 
		case NUMERICMASK: bValid = this.IsValidNumericChar(cMask, cKeyCode); break;
		case DATEMASK: bValid = this.IsValidDateChar(cMask, cKeyCode); break;
		case TIMEMASK: bValid = this.IsValidTimeChar(cMask, cKeyCode); break;
		case DATETIMEMASK: bValid = this.IsValidDateTimeChar(cMask, cKeyCode); break;
	}
	return bValid;	
}

function PBEditMaskManager_IsValidNumericChar(cMask, cKeyCode)
{
   return this.IsDigit(cKeyCode);
}

function PBEditMaskManager_IsValidTimeChar(cMask, cKeyCode)
{
    var bValid;
	switch (cMask) 
	{
		case 'h': bValid = this.IsValidHour(cKeyCode); break;
		case 'm': if (this.nEndPos >= this.nMinuteOffset && this.nEndPos < this.nMinuteOffset + 2)
				  {
					bValid = this.IsValidMinute(cKeyCode); 
				  }
				  break;
		case 's': bValid = this.IsValidSecond(cKeyCode); break;
		case 'f': bValid = this.IsValidFractionalSecond(cKeyCode); break;
		case 'a': bValid = this.IsValidAM_PM(cKeyCode); break;
	}
	return bValid;
}

function PBEditMaskManager_IsValidDateTimeChar(cMask, cKeyCode)
{
	var bValid;
	do 
	{
		if (bValid = this.IsValidDateChar(cMask, cKeyCode)) break;
		bValid = this.IsValidTimeChar(cMask, cKeyCode);
		break; 
	}
	while(1);
	return bValid;
}

function PBEditMaskManager_IsValidDateChar(cMask, cKeyCode)
{
    var bValid = false;
	switch (cMask) 
	{
		case 'y': bValid = this.IsValidYear(cKeyCode); break;
		case 'm': if (this.nEndPos >= this.nMonthOffset && this.nEndPos < this.nMonthOffset + this.nMonthNumber) 
				  { 	
					bValid = this.IsValidMonth(cKeyCode); 
				  }
				  break;
		case 'd': bValid = this.IsValidDay(cKeyCode); break;
		case 'j': bValid = this.IsValidJulianDay(cKeyCode); break;
	}
	return bValid;
}
	
function PBEditMaskManager_IsValidStringChar(cMask, cKeyCode)
{
    var bValid = true;
	switch (cMask) 
	{
		case '#':
			bValid = this.IsDigit(cKeyCode); break;
		case 'a':
			bValid = this.IsAlphaNumeric(cKeyCode); break;
		case '!': 
		case '^': 
		case 'x':
			bValid = this.IsPrint(cKeyCode); break;
	}
	return bValid;
}

function PBEditMaskManager_IsAlphaNumeric(cKeyCode)
{
	return (cKeyCode >= KEY_UPPER_CASE_ALPHA_START && cKeyCode <= KEY_UPPER_CASE_ALPHA_END) ||
		(cKeyCode >= KEY_LOWER_CASE_ALPHA_START && cKeyCode <= KEY_LOWER_CASE_ALPHA_END) ||
		(cKeyCode >= KEY_DIGHT_START && cKeyCode <= KEY_DIGHT_END);
}

function PBEditMaskManager_IsDigit(cKeyCode)
{
	return cKeyCode >= KEY_DIGHT_START && cKeyCode <= KEY_DIGHT_END;
}

function PBEditMaskManager_IsAlpha(cKeyCode)
{
	return this.IsAlphaUpperCase(cKeyCode) || this.IsAlphaLowerCase(cKeyCode);
}

function PBEditMaskManager_IsAlphaUpperCase(cKeyCode)
{
	return cKeyCode >= KEY_UPPER_CASE_ALPHA_START && cKeyCode <= KEY_UPPER_CASE_ALPHA_END;
}

function PBEditMaskManager_IsAlphaLowerCase(cKeyCode)
{
	return cKeyCode >= KEY_LOWER_CASE_ALPHA_START && cKeyCode <= KEY_LOWER_CASE_ALPHA_END;
}

function PBEditMaskManager_IsPrint(cKeyCode)
{
	return cKeyCode >= KEY_PRINT_START && cKeyCode <= KEY_PRINT_END;
}

function PBEditMaskManager_KeyPress(evt, oControl)
{
	var e = PB_GetEvent(evt);
	if (!(this.nMaskType == STRINGMASK && this.strMask == "")) 
	{
		if (!oControl.readOnly)
		{
		    this.KeyChar(e.keyCode);
			e.returnValue = false;
		}
	}
	else
	{
		this.bChanged = true;
		this.SetChanged();
	}
}

function PBEditMaskManager_OnChange(oControl)
{
  var oEditMask = document.getElementById(oControl.id + "_tx");
  if (oEditMask == null)
  {
		oEditMask = document.getElementById(oControl.id + "_dtp_tx");
		
		if (oEditMask == null)
		{
			oEditMask = goWindowManager.GetPBTypeObj(oControl);
		}
	}
	var oEditMaskObj = this.GetData(oEditMask);
	if ((this.bChanged || this.bServerChanged) && this.bPostBack)
	{
		var showDatePicker = "";
		if (this.datePickerID != "")
		{
			var oDatePicker = document.getElementById(this.datePickerID);
			if (oDatePicker)
			{
				if (oDatePicker.style.display == "block")
				{
					showDatePicker = "1";
	            }
	            var calendar = window[oControl.id + "_dtp_cal"];
	            if (calendar) {
	                var tmp = [goEditMaskManager.nYear, goEditMaskManager.nMonth, goEditMaskManager.nDay];
	                calendar.SelectDate(tmp);
	                calendar.NavigateToDate(tmp);
	            }
			}
		}
		
		oEditMaskObj.bServerChanged = false;
		__doPostBack(this.strMaskUniqueID, "textchanged," + showDatePicker);
	}
}

function PBEditMaskManager_KeyDown(evt, oControl)
{
	var e = PB_GetEvent(evt);
	var k = e.keyCode;
	this.GetData(oControl);
	if (!(this.nMaskType == STRINGMASK && this.strMask == "")) 
	{
		switch (k) 
		{
			case KEY_LEFT: this.KeyLeft(); break;
			case KEY_RIGHT: this.KeyRight(); break;
			case KEY_DELETE: this.KeyDelete(); break;
			case KEY_BACKSPACE: this.KeyBackspace(); break;
			case KEY_HOME: this.KeyHome(); break;
			case KEY_END: this.KeyEnd(); break;
			case KEY_DOWN: this.KeyArrowDown(); break;
			case KEY_UP: this.KeyUp(); break;
		}
		if (k == KEY_LEFT || k == KEY_RIGHT || k == KEY_DELETE ||
			k == KEY_BACKSPACE || k == KEY_HOME || k == KEY_END ||
			k == KEY_DOWN || k == KEY_UP || e.ctrlKey)
		{
			e.returnValue = false;
		}
	}
	else
	{
		if (e.ctrlKey)
		{
			e.returnValue = false;
		}
	}
}

function PBEditMaskManager_SetText(strMask, oControl)
{
	this.nMaskPointIndex = strMask.indexOf(this.decimalChar);
	var oText = this.GetArray(oControl.value);
	var nStartPos = 0;
	var nEndPos = oText.length;
	this.oText = this.GetArray(strMask);
	for (var i = 0; i < this.oText.length; i++)
	{
		this.oText[i] = '';
	}
	var oCurrencyChar = this.GetArray(this.currencyChar);
	if (this.oMask[0] == oCurrencyChar[0])
	{
		for (var i = 0; i < this.currencyChar.length; i++)
		{
			this.oText[i] = oCurrencyChar[i];
			nStartPos++;
		}
	}
	var oTailChar = this.GetArray(this.tailChar);
	if (this.oMask[this.oMask.length - 1] == oTailChar[this.tailChar.length - 1])
	{
		for (var i = 0; i < this.tailChar.length; i++)
		{
			this.oText[this.oMask.length - 1 - i] = oTailChar[this.tailChar.length - 1 - i];
			nEndPos--;
		}
	}
	if (oText[nStartPos] == '-')
	{
		this.oText[nStartPos] = oText[nStartPos];
		nStartPos++;
	}
	if (nStartPos < nEndPos)
	{
		var nStartMaskPos =this.GetMaskPos(nStartPos);
		var nEndMaskPos = this.GetMaskPos(nEndPos);
		for (var i = nStartPos; i<nEndPos; i++)
		{
			this.oText[nStartMaskPos +i-nStartPos] = oText[i];
		}
	}
}

function PBEditMaskManager_GetData(oControl)
{
  var oEditMask = null;
  if (oControl.getAttribute("pbtype"))
    oEditMask = this.Get(oControl.id);
	else
	  oEditMask = this.Get(oControl.dwname + "_" + oControl.gobname);
	  
	if(oEditMask == null)
	    return;
	    	  
	this.oMask = this.GetArray(oEditMask.strMask);
	this.strMask = oEditMask.strMask;
	this.strUniqueID = oEditMask.strUniqueID;
	this.strMaskUniqueID = oEditMask.strMaskUniqueID;
	this.bPostBack = oEditMask.bPostBack;
	this.strID = oEditMask.strID;
	this.bServerChanged = oEditMask.bServerChanged;
	this.oControl = oControl;
	this.bHasNonMask = oEditMask.bHasNonMask;
  this.decimalChar = oEditMask.decimalChar;
  this.thousandsChar = oEditMask.thousandsChar;
  this.currencyChar = oEditMask.currencyChar;
  this.tailChar = oEditMask.tailChar;
  this.datePickerID = oEditMask.datePickerID;
  this.bChanged = this.GetChanged(oEditMask.strID);
	
	if (oEditMask.nMaskType == NUMERICMASK || oEditMask.nMaskType == DECIMALMASK)
	{
		this.SetText(oEditMask.strMask, oControl);
	}
	else
	{
		this.oText = this.GetArray(oControl.value);
	}
  this.nMaskType = oEditMask.nMaskType;
  if (this.nMaskType == DATEMASK || this.nMaskType == DATETIMEMASK) 
  {
		this.nYearOffset = oEditMask.nYearOffset;
		this.nYearNumber = oEditMask.nYearNumber;		
		if (this.nYearOffset != -1)
		{
			this.nYear = this.ToNumber(this.Reverse(this.ConcatArray(this.nYearOffset, this.nYearNumber)));
			if (this.nYearNumber == 2) 
			{
				if (this.nYear >= 50) 
				{
					this.nYear += 1900;
				}
				else 
				{
					this.nYear += 2000;
				}
			}
		}
		else
		{
			this.nYear = 0;
		}
		this.nMonthOffset = oEditMask.nMonthOffset;
		this.nMonthNumber = oEditMask.nMonthNumber;
		if (this.nMonthOffset != -1) 
		{
			if (this.nMonthNumber == 2)
			{
				this.nMonth = this.ToNumber(this.Reverse(this.ConcatArray(this.nMonthOffset, this.nMonthNumber)));
			}
			else 
			{	
				var strMonth = this.ConcatArray(this.nMonthOffset, this.nMonthNumber);
				for (var i = 0; i < goMonth.Size(); i++)
				{
					if (goMonth.Get(i) == strMonth) 
					{
						break;
					}
				}
				if (i == goMonth.Size()) 
				{
					this.nMonth = 0;
				}
				else 
				{
					this.nMonth = i + 1;
				}
			}
		}
		else 
		{
			this.nMonth = 0;
		}
		this.nDayOffset = oEditMask.nDayOffset;
		if (this.nDayOffset != -1)
		{
			this.nDay = this.ToNumber(this.Reverse(this.ConcatArray(this.nDayOffset, 2)));
		}
		else
		{
			this.nDay = 0;
		}
		this.nJulianDayOffset = oEditMask.nJulianDayOffset;
		if (this.nJulianDayOffset != -1)
		{
			this.nJulianDay = this.ToNumber(this.Reverse(this.ConcatArray(this.nJulianDayOffset, 3)));
		}
		else
		{
			this.nJulianDay = 0;
		}
	}
	if (this.nMaskType == TIMEMASK || this.nMaskType == DATETIMEMASK) 
	{
		this.nAM_PMOffset = oEditMask.nAM_PMOffset;
		this.nHourOffset = oEditMask.nHourOffset;
		if (this.nHourOffset != -1)
		{
			this.nHour = this.ToNumber(this.Reverse(this.ConcatArray(this.nHourOffset, 2)));
		}
		else
		{
			this.nHour = 0;
		}
		this.nMinuteOffset = oEditMask.nMinuteOffset;
		if (this.nMinuteOffset != -1)
		{
			this.nMinute = this.ToNumber(this.Reverse(this.ConcatArray(this.nMinuteOffset, 2)));
		}
		else
		{
			this.nMinute = 0;
		}
		this.nSecondOffset = oEditMask.nSecondOffset;
		if (this.nSecondOffset != -1)
		{
			this.nSecond = this.ToNumber(this.Reverse(this.ConcatArray(this.nSecondOffset, 2)));
		}
		else
		{
			this.nSecond = 0;
		}
		this.nFractionalSecondOffset = oEditMask.nFractionalSecondOffset;
		this.nAM_PMOffset = oEditMask.nAM_PMOffset;
	}
	
	return oEditMask;
}

function PBEditMaskManager_OnClickHelper(oControl, nPos, bStart)
{
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK) 
	{
		var oTailChar = this.GetArray(this.tailChar);
		var oCurrencyChar = this.GetArray(this.currencyChar);
		if (this.oMask[this.oMask.length - 1] == oTailChar[this.tailChar.length - 1] &&
			nPos == oControl.value.length)
		{
			if (bStart)
			{
				this.nStartPos = this.oMask.length;
			}
			else
			{
				this.nEndPos = this.oMask.length;
			}
		}
		else if (this.oMask[0] == oCurrencyChar[0] && nPos == 0)
		{
			if (bStart)
			{
				this.nStartPos = 0;
			}
			else
			{
				this.nEndPos = 0;
			}
		}
		else
		{			
			if (this.nMaskPointIndex != -1)
			{
				var nPointIndex = oControl.value.indexOf(this.decimalChar);
				if (bStart)
				{
					this.nStartPos = nPos + this.nMaskPointIndex - nPointIndex;
				}
				else
				{
					this.nEndPos = nPos + this.nMaskPointIndex - nPointIndex;
				}
			}
			else 
			{
				if (bStart)
				{
					this.nStartPos = nPos + this.oMask.length - oControl.value.length;
				}
				else
				{
					this.nEndPos = nPos + this.oMask.length - oControl.value.length;
				}
			}
		}
	}
	else
	{
		if (bStart)
		{	
			this.nStartPos = nPos;
		}
		else
		{
			this.nEndPos = nPos;
		}
	}
	if (bStart)
	{
		this.SetStartPos(nPos);
	}
	else
	{
		this.SetEndPos(nPos);
	}
}

function PBEditMaskManager_OnMouseDown(evt, oControl)
{
	this.GetData(oControl);
	this.PutCaretPos(0, 0);
}

function PBEditMaskManager_OnClick(evt, oControl, bSetCaret)
{
	this.GetData(oControl);
	var nEndPos;
	var nStartPos;
	if (bSetCaret)
	{
		nStartPos = this.GetSelectionStart(oControl);
		nEndPos = this.GetSelectionEnd(oControl);
	}
	else
	{
		nStartPos = this.GetStartPos();
		nEndPos = this.GetEndPos();
		if (nStartPos == -1)
		{
			nStartPos = 0;
			nEndPos = 0;
		}
	}
	this.OnClickHelper(oControl, nStartPos, true);
	this.OnClickHelper(oControl, nEndPos, false);
	this.PutCaretPos(nStartPos, nEndPos);

    if (oControl.getAttribute("pbtype"))
    {
	    while (oControl.tagName != "DIV")
	    {
		    oControl = oControl.parentNode;
		    
		    if (!oControl)
		    {
		    	break;
			}
	    }
    	
        goWindowManager.OnFocusOwn(oControl.id);
    }
}

function PBEditMaskManager_GetNextMaskCharPos(nPos)
{
	var nNextPos = -1;
	while (nPos + 1 < this.oMask.length)
	{
		if (this.IsMaskChar(this.oMask[++nPos]))
		{
			nNextPos = nPos;
			break;
		}
	}
	return nNextPos;
}

function PBEditMaskManager_GetPrevMaskCharPos(nPos)
{
	var nPrevPos = -1;
	var nOldPos = nPos;
	while (nPos - 1 >= 0)
	{
		if (this.IsMaskChar(this.oMask[--nPos]))
		{
			if (nPos == nOldPos - 1)
			{
				nPrevPos = nPos;
			}
			else
			{
				nPrevPos = nPos + 1;
			}
			break;
		}
	}
	return nPrevPos;
}

function PBEditMaskManager_GetCaretPos(nPos)
{
	var nCaretPos;
	if (this.nMaskPointIndex != -1)
	{
		var nPointIndex = this.oControl.value.indexOf(this.decimalChar);
		nCaretPos = nPos - (this.nMaskPointIndex - nPointIndex);
	}
	else 
	{
		nCaretPos = nPos - (this.oMask.length - this.oControl.value.length);
	}
	return nCaretPos;
}

function PBEditMaskManager_GetMaskPos(nPos)
{
	var nMaskPos;
	if (this.nMaskPointIndex != -1)
	{
		var nPointIndex = this.oControl.value.indexOf(this.decimalChar);
		nMaskPos = nPos + this.nMaskPointIndex - nPointIndex;
	}
	else 
	{
		nMaskPos = nPos + this.oMask.length - this.oControl.value.length;
	}
	return nMaskPos;
}

function PBEditMaskManager_GetNextMaskPos()
{
    if (this.nEndPos == this.oMask.length)
    {
		return this.nEndPos;
	}
    var nNextMaskPos = this.nEndPos;
    var bFirst = true;
    do
    {
		if (!this.IsMaskChar(this.oMask[nNextMaskPos]))
		{
			nNextMaskPos++;
			bFirst = false;
			if (nNextMaskPos == this.oMask.length)
			{
				break;
			}
		}
		else 
		{
			if (bFirst) 
			{
				nNextMaskPos++;
				while (nNextMaskPos != this.oMask.length && !this.IsMaskChar(this.oMask[nNextMaskPos]))
				{
					nNextMaskPos++;	
				}
			}
			break;	
		}
	}
	while(1);
	return nNextMaskPos;
}

function PBEditMaskManager_GetPreviousMaskPos()
{
    if (this.nEndPos == 0)
    {
		return this.nEndPos;
	}
    var nPreviousMaskPos = this.nEndPos;
    do
    {
		if (!this.IsMaskChar(this.oMask[nPreviousMaskPos - 1]))
		{
			nPreviousMaskPos--;
			if (nPreviousMaskPos == 0)
			{
				break;
			}
		}
		else {
			nPreviousMaskPos--;
			break;	
		}
	}
	while(1);
	return nPreviousMaskPos;
}

function PBEditMaskManager_IsMaskChar(cChar)
{
    var oMaskChar;
	switch (this.nMaskType) 
	{
		case STRINGMASK:  oMaskChar = goStringTypeMaskChar; break;
		case NUMERICMASK: 
		case DECIMALMASK: oMaskChar = goNumericTypeMaskChar;break;
		case DATEMASK: oMaskChar = goDateTypeMaskChar; break;
		case TIMEMASK: oMaskChar = goTimeTypeMaskChar; break;
		case DATETIMEMASK: oMaskChar = goDateTimeTypeMaskChar; break;
	}
	return oMaskChar.Contains(cChar);
}

function PBEditMaskManager_GetNextCharPos()
{
	var nIndex = -1;
	if (this.nMaskPointIndex == -1 || this.nMaskPointIndex != -1 && this.nEndPos <= this.nMaskPointIndex)
	{
		var i;
		for (i = this.nEndPos - 1; i >= 0; i--)
		{
			if (this.oText[i] == ' ')
			{
				break;
			}
		}
		nIndex = i;
	}
	return nIndex;
}

function PBEditMaskManager_GetChanged(strID)
{
    if (document.getElementsByName(strID + "changed").length > 0)
    	return (document.getElementsByName(strID + "changed")[0].value == "1");
    else
    	return false;
}

function PBEditMaskManager_SetChanged()
{
    if (document.getElementsByName(this.strID + "changed").length > 0)
    	document.getElementsByName(this.strID + "changed")[0].value = 1;
}

function PBEditMaskManager_SetCaret(pos)
{
    if (document.getElementsByName(this.strID + "caret").length > 0)
    	document.getElementsByName(this.strID + "caret")[0].value = pos;
}

function PBEditMaskManager_GetCaret()
{
    if (document.getElementsByName(this.strID + "caret").length > 0)
	    return parseInt(document.getElementsByName(this.strID + "caret")[0].value);
}

function PBEditMaskManager_SetStartPos(pos)
{
    if (document.getElementsByName(this.strID + "startpos").length > 0)
	    document.getElementsByName(this.strID + "startpos")[0].value = pos;
	    
	this.nSelectionStartPos = pos;
}

function PBEditMaskManager_GetStartPos()
{
    if (document.getElementsByName(this.strID + "startpos").length > 0)
	    return parseInt(document.getElementsByName(this.strID + "startpos")[0].value);
	else
	    return this.nSelectionStartPos;
}

function PBEditMaskManager_SetEndPos(pos)
{
    if (document.getElementsByName(this.strID + "endpos").length > 0)
	    document.getElementsByName(this.strID + "endpos")[0].value = pos;

	this.nSelectionEndPos = pos;
}

function PBEditMaskManager_GetEndPos()
{
    if (document.getElementsByName(this.strID + "endpos").length > 0)
	    return parseInt(document.getElementsByName(this.strID + "endpos")[0].value);
	else
	    return this.nSelectionEndPos;
}

function PBEditMaskManager_KeyChar(cKeyCode)
{
	if (this.nStartPos != this.nEndPos)
	{
		this.KeyBackspace();
	}
	this.KeyCharHelper(cKeyCode);
}

function PBEditMaskManager_KeyCharHelper(cKeyCode)
{
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK) 
	{
		if (this.oMask[this.nEndPos] == this.decimalChar && this.GetKeyString(cKeyCode) == this.decimalChar)
		{
			this.nEndPos++;
			this.nStartPos++;
			var nCaret = this.GetEndPos();
			nCaret++;
			this.PutCaretPos(nCaret, nCaret);
			this.SetStartPos(nCaret);
			this.SetEndPos(nCaret);
		}
		else
		{
			var bPointLeft = false;
			var nCaret = this.GetEndPos();
			var nStartPos = 0;
			var oCurrencyChar = this.GetArray(this.currencyChar);
			if (this.oMask[0] == oCurrencyChar[0] && nCaret < this.currencyChar.length)
			{
				return;
			}	
			if (this.oMask[0] == oCurrencyChar[0])
			{
				nStartPos+=this.currencyChar.length;
			}
			if (this.oMask[nCaret] == '-')
			{
				if (this.GetKeyString(cKeyCode) == '-')
				{
					if (this.oText[nCaret] != '-')
					{
						this.oText[nCaret] = '-';
						this.oControl.value = this.ConcatArray(0, this.oText.length);
						this.bChanged = true;
						this.SetChanged();
					}
					nCaret++;
					this.nEndPos = this.GetMaskPos(nCaret);
					this.nStartPos = this.nEndPos;
					this.PutCaretPos(nCaret, nCaret);
					this.SetStartPos(nCaret);
					this.SetEndPos(nCaret);
					return;
				}
				else
				{
					if (this.oText[nCaret] == '-')
					{
						return;
					}
				}
			}
			else
			{
				if (this.oText[nStartPos] == '-')
				{
					nStartPos++;
				}
			}
			var nPos = this.GetMaskPos(nStartPos);
			var nMaskPos = this.GetPrevMaskCharPos(nPos);
			if (this.nMaskPointIndex != -1)
			{
				if (this.nEndPos <= this.nMaskPointIndex && nMaskPos != -1)
				{
					bPointLeft = true;
				}
			}			
			else
			{
				var oTailChar = this.GetArray(this.tailChar);
				if (nMaskPos != -1 && this.oMask[this.nEndPos - 1] != oTailChar[this.tailChar.length - 1])
				{
					bPointLeft = true;
				}
			}
			if (bPointLeft)
			{
			    //regarding to CR537932,I think this check is to avoid left-shifting the zeros defined by the Mask.
			    //for example , Mask:"#,000" numver : "00|0" , we can't left-shift the zeros. '|' means the inpur position.
			    //but this is just needed at the first number.
				if (this.oMask[nPos] == 0 && this.oText[nPos] == 0)
				{
				}
				else if (this.oMask[nPos - 1] == this.thousandsChar)
				{
					this.oText[nPos - 1] = this.thousandsChar;
					this.oText[nPos - 2] = this.oText[nPos];
				}
				else
				{
					this.oText[nPos - 1] = this.oText[nPos];
				}
			
				for (var i = nPos + 1; i < this.nEndPos; i++)
				{
					if (this.oMask[i] != this.thousandsChar)
					{
						if (this.oMask[i - 1] == this.thousandsChar)
						{
							this.oText[i - 2] = this.oText[i];
						}
						else
						{
							this.oText[i - 1] = this.oText[i];
						}
					}
				}
				if (this.oMask[this.nEndPos - 1] == this.thousandsChar)
				{
					nPos = this.nEndPos - 2;
				}
				else
				{
					nPos = this.nEndPos - 1;
				}
				if (this.IsValidChar(this.oMask[nPos], cKeyCode))
				{
					this.oText[nPos] = this.GetKeyString(cKeyCode);
					var nLength = this.oControl.value.length;
					this.oControl.value = this.ConcatArray(0, this.oText.length);
					nCaret = nCaret + this.oControl.value.length - nLength;
					this.PutCaretPos(nCaret, nCaret);
					this.SetStartPos(nCaret);
					this.SetEndPos(nCaret);
					this.bChanged = true;
					this.SetChanged();
				}
			}
			else
			{
				var nPos;
				if (this.IsMaskChar(this.oMask[this.nEndPos]))
				{
					nPos = this.nEndPos;
				}
				else
				{	
					nPos = this.GetNextMaskCharPos(this.nEndPos);
					for (var i = this.nEndPos; i < nPos; i++)
					{
						this.oText[i] = this.oMask[i];
					}
				}
				if (nPos != -1 && this.IsValidChar(this.oMask[nPos], cKeyCode))
				{
					this.oText[nPos] = this.GetKeyString(cKeyCode);
					this.oControl.value = this.ConcatArray(0, this.oText.length);
					nPos++;
					nCaret = nCaret + nPos - this.nEndPos;
					this.PutCaretPos(nCaret, nCaret);
					this.nEndPos = nPos;
					this.nStartPos = nPos;
					this.SetStartPos(nCaret);
					this.SetEndPos(nCaret);
					this.bChanged = true;
					this.SetChanged();
				}			
			}
		}
	}
	else
	{
		var bValid = true;
		var bMask = this.IsMaskChar(this.oMask[this.nEndPos]);
		if (!bMask)
		{
			this.KeyRight();
			bMask = this.IsMaskChar(this.oMask[this.nEndPos]);
		}
		if (bMask) 
		{
			bValid = this.IsValidChar(this.oMask[this.nEndPos], cKeyCode);
			if (bValid) 
			{
				this.bChanged = true;
				this.SetChanged();
				if (this.nMaskType == STRINGMASK) 
				{
					if (this.oMask[this.nEndPos] == '!')
					{
						this.oText[this.nEndPos] = this.GetUpperKeyString(cKeyCode);
					}
					else if (this.oMask[this.nEndPos] == '^')
					{
						this.oText[this.nEndPos] = this.GetLowerKeyString(cKeyCode);
					}
					else
					{
						this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
					}
				}
				else if (this.nMaskType == DATEMASK || this.nMaskType == DATETIMEMASK || this.nMaskType == TIMEMASK) 
				{
					if ((this.oMask[this.nEndPos] == 'm' && this.nEndPos >= this.nMonthOffset 
						&& this.nEndPos < this.nMonthOffset + this.nMonthNumber && this.nMonthNumber == 3) ||
						this.oMask[this.nEndPos] == 'a')
					{
						this.oText[this.nEndPos] = this.GetUpperKeyString(cKeyCode);
					}
					else	
					{
						this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
					}
				}
				else
				{
					this.oText[this.nEndPos] = this.GetKeyString(cKeyCode);
				}
				this.oControl.value = this.ConcatArray(0, this.oText.length);
			}
		}
		if (bValid)
		{
			this.KeyRight();
		}
	}
}

function PBEditMaskManager_GetArray(strValue)
{
	return strValue.split("");
}

function PBEditMaskManager_ConcatArray(nStart,nCount)
{
	var strText = "";
	for (var i = 0; i < nCount; i++) {
		if (this.nMaskType == DECIMALMASK || this.nMaskType == NUMERICMASK) 
		{
			if (this.oText[nStart+i] + "" != "undefined" && this.oText[nStart+i] != ' ') 
			{
				if (this.oText[nStart + i] == this.thousandsChar && this.oText[nStart + i - 1] != ' ' || this.oText[nStart + i] != this.thousandsChar)
				{
					strText += this.oText[nStart + i];
				}
			}
			else
			{
				var oTailChar = this.GetArray(this.tailChar);
				if (this.tailChar.length > 1 && this.oText[nStart+i+1] == oTailChar[this.tailChar.length - 1])
				{
					strText += this.oText[nStart + i];
				}
			}
		}
		else
		{
			strText += this.oText[nStart + i];
		}
	}
	return strText;	
}

function PBEditMaskManager_GetFirstMaskPos(nPos)
{
	var nMaskPos;
	if (this.IsMaskChar(this.oMask[nPos]) ||
		(this.oMask[nPos] == this.decimalChar && nPos - 1 > 0 && this.IsMaskChar(this.oMask[nPos - 1])))
	{
		nMaskPos = nPos;
	}
	else
	{
		nMaskPos = this.GetNextMaskCharPos(nPos);
	}
	return nMaskPos;
}

function PBEditMaskManager_KeyHome()
{
	var nCaret = 0;
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)	
	{
		var oCurrencyChar = this.GetArray(this.currencyChar);
		if (this.oMask[0] == oCurrencyChar[0])
		{
			nCaret+=this.currencyChar.length;
		}
		if (this.oText[nCaret] == '-')
		{
			this.nEndPos = nCaret;
		}
		else
		{
			var nPos = this.GetMaskPos(nCaret);
			var nMaskPos = this.GetFirstMaskPos(nPos);
			if (nMaskPos != -1)
			{
				nCaret += nMaskPos - nPos;	
				this.nEndPos = nMaskPos;
			}
			else
			{
				this.nEndPos = nPos;
			}
		}
	}
	else 
	{
		this.nEndPos = nCaret;
	}
	this.nStartPos = this.nEndPos;
	this.PutCaretPos(nCaret, nCaret);
	this.SetStartPos(nCaret);
	this.SetEndPos(nCaret);
}

function PBEditMaskManager_KeyEnd()
{
	var nCaret = this.oControl.value.length;
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)	
	{
		var oTailChar = this.GetArray(this.tailChar);
		if (this.oMask[this.oMask.length - 1] == oTailChar[this.tailChar.length - 1])
		{

			nCaret -= this.tailChar.length;
		}
		var nPos = this.GetMaskPos(nCaret);
		var nMaskPos = this.GetPrevMaskCharPos(nPos);
		if (nMaskPos != -1)
		{
			if (nMaskPos + 1 == nPos)
			{
				this.nEndPos = nPos;
			}
			else
			{
				nCaret -= nPos - nMaskPos;
				this.nEndPos = nMaskPos;
			}
		}		
	}
	else 
	{
		this.nEndPos = nCaret;
	}
	this.nStartPos = this.nEndPos;
	this.PutCaretPos(nCaret, nCaret);
	this.SetStartPos(nCaret);
	this.SetEndPos(nCaret);
}

function PBEditMaskManager_KeyLeft()
{
	var nPrevPos = -1;
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)	
	{
		var nPos = this.nEndPos;
		var oTailChar = this.GetArray(this.tailChar);
		if (nPos == this.oMask.length && this.oMask[this.oMask.length - 1] == oTailChar[this.tailChar.length - 1])
		{
			this.KeyEnd();
			return;
		}   
		else
		{
			while (nPos - 1 >= 0)
			{
				if (this.IsMaskChar(this.oMask[--nPos]))
				{
					if (nPos == this.nEndPos - 1)
					{
						nPrevPos = nPos;
					}
					else
					{
						nPrevPos = nPos + 1;
					}
					break;
				}
			}
		}
		
		var oCurrencyChar = this.GetArray(this.currencyChar);
		if (nPrevPos != -1)
		{
			var nStartPos = 0;
			if (this.oMask[0] == oCurrencyChar[0])
			{
				nStartPos+=this.currencyChar.length;
			}
			nStartPos = this.GetMaskPos(nStartPos);
			if (nPrevPos >= nStartPos)
			{
				var nCaret = this.GetEndPos();
				nCaret -= (this.nEndPos - nPrevPos);
				this.PutCaretPos(nCaret,nCaret);
				this.SetStartPos(nCaret);
				this.SetEndPos(nCaret);
				this.nEndPos = nPrevPos;
				this.nStartPos = this.nEndPos;
			}
		}
		else
		{
			var nCaret = 0;
			if (this.oMask[0] == oCurrencyChar[0])
			{
				nCaret = this.currencyChar.length;
			}	
			if (this.oText[nCaret] == '-')
			{
				this.PutCaretPos(nCaret,nCaret);
				this.SetStartPos(nCaret);
				this.SetEndPos(nCaret);
				this.nEndPos = nCaret;
				this.nStartPos = nCaret;
			}	
		}			
	}
	else
	{
		nPrevPos = this.GetPrevMaskCharPos(this.nEndPos);
		if (nPrevPos != -1)
		{
			this.PutCaretPos(nPrevPos,nPrevPos);
			this.nEndPos = nPrevPos;
			this.nStartPos = nPrevPos;
			this.SetStartPos(nPrevPos);
			this.SetEndPos(nPrevPos);
		}
		else
		{
			var nCaret = this.GetEndPos();
			this.PutCaretPos(nCaret,nCaret);
		}
	}	
}

function PBEditMaskManager_KeyRight()
{
	var nNextPos = -1;
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)	
	{

		var nPos = this.nEndPos;
		var oCurrencyChar = this.GetArray(this.currencyChar);
		if (nPos == 0 && this.oMask[0] == oCurrencyChar[0])
		{
			this.KeyHome();
			return;
		}
		else if (nPos == this.currencyChar.length && 
			this.oMask[this.currencyChar.length] == '-')
		{
			nPos++;
			this.PutCaretPos(nPos, nPos);
			this.SetStartPos(nPos);
			this.SetEndPos(nPos);
			this.nEndPos = nPos;
			this.nStartPos = nPos;
		}
		else if (this.IsMaskChar(this.oMask[nPos]))
		{
			nNextPos = nPos + 1;
		}
		else
		{
			while (nPos + 1 < this.oMask.length)
			{
				if (this.IsMaskChar(this.oMask[++nPos]))
				{
					nNextPos = nPos;
					break;
				}
			}
		}
		
		if (nNextPos != -1)
		{
			var nEndPos = this.oControl.value.length;
			var oTailChar = this.GetArray(this.tailChar);
			if (this.oMask[this.oMask.length - 1] == oTailChar[this.tailChar.length - 1])
			{
				nEndPos-=this.tailChar.length;
			}
			nEndPos = this.GetMaskPos(nEndPos);
			if (nNextPos <= nEndPos)
			{
				var nCaret = this.GetEndPos();
				nCaret += nNextPos - this.nEndPos;
				this.PutCaretPos(nCaret, nCaret);
				this.SetStartPos(nCaret);
				this.SetEndPos(nCaret);
				this.nEndPos = nNextPos;
				this.nStartPos = nNextPos;
			}			
		}
	}
	else
	{
		if (this.IsMaskChar(this.oMask[this.nEndPos]))
		{
			this.nEndPos++;
			this.PutCaretPos(this.nEndPos,this.nEndPos);
			this.nStartPos = this.nEndPos;
			this.SetStartPos(this.nEndPos);
			this.SetEndPos(this.nEndPos);
		}	
		else
		{
			nNextPos = this.GetNextMaskCharPos(this.nEndPos);
			if (nNextPos != -1)
			{
				this.PutCaretPos(nNextPos, nNextPos);
				this.nEndPos = nNextPos;
				this.nStartPos = nNextPos;
				this.SetStartPos(nNextPos);
				this.SetEndPos(nNextPos);
			}
		}
	}
}

function PBEditMaskManager_KeyDelete()
{
	if (this.nStartPos != this.nEndPos)
	{
		this.KeyBackspace();
	}
	else
	{
		this.KeyDeleteHelper();
	}
}

function PBEditMaskManager_KeyDeleteHelper()
{
	var oValue = this.oControl.value;
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)	
	{
		var bPointLeft = true;
		var nCaret = this.GetEndPos();
		var nFirstPos = 0;
		var oCurrencyChar = this.GetArray(this.currencyChar);
		if (this.oMask[0] == oCurrencyChar[0] && nCaret < this.currencyChar.length)
		{
			return;
		}
		if (this.oMask[0] == oCurrencyChar[0])
		{
			nFirstPos+=this.currencyChar.length;
		}
		if (this.oMask[nCaret] == '-')
		{
			if (this.oText[nCaret] == '-')
			{
				this.oText[nCaret] = '';
				this.oControl.value = this.ConcatArray(0, this.oText.length);
				this.PutCaretPos(nCaret, nCaret);
				this.nStartPos = this.GetMaskPos(nCaret);
				this.nEndPos = this.nStartPos;
				this.SetStartPos(nCaret);
				this.SetEndPos(nCaret);
				this.bChanged = true;
				this.SetChanged();
				return;
			}
		}
		else
		{
			if (this.oText[nFirstPos] == '-')
			{
				nFirstPos++;
			}
		}
		var nStartPos = this.GetMaskPos(nFirstPos);
		var nPos;
		if (!this.IsMaskChar(this.oMask[this.nEndPos]))
		{
			nPos = this.GetNextMaskCharPos(this.nEndPos);
		}
		else
		{
			nPos = this.nEndPos;
		}
		if (nPos != -1)
		{
			if (this.bHasNonMask)
			{
				this.oText[nPos] = '0';
				nPos++;
				this.PutCaretPos(nPos, nPos);
				this.SetStartPos(nPos);
				this.SetEndPos(nPos);
				this.nEndPos = nPos;
				this.nStartPos = nPos;
			}
			else
			{
				if (this.nMaskPointIndex != -1 && nPos > this.nMaskPointIndex)
				{
					bPointLeft = false;
				}			
				if (bPointLeft)
				{
					for (var i = nPos - 1; i >= nStartPos; i--)
					{
						if (this.oMask[i] != this.thousandsChar)
						{
							if (this.oText[i+1] == this.thousandsChar)
							{
								this.oText[i+2] = this.oText[i];
							}
							else
							{
								this.oText[i+1] = this.oText[i];
							}
						}
					}
					if (this.oMask[nStartPos] == '0')
					{
						this.oText[nStartPos] = '0';
					}
					else
					{
						this.oText[nStartPos] = '';
						if (this.oMask[nStartPos + 1] == this.thousandsChar)
						{
							this.oText[nStartPos + 1] = '';
							if (nStartPos == nPos)
							{
								nPos++;
							}
						}
					}
					this.nEndPos = nPos + 1;
				}
				else
				{
					if (this.oMask[nPos] == '0')
					{
						this.oText[nPos] = '0';
						this.nEndPos = nPos + 1;
					}
					else
					{
						var nEndPos = this.oControl.value.length;
						var oTailChar = this.GetArray(this.tailChar);
						if (this.oMask[this.oMask.length -1] == oTailChar[this.tailChar.length - 1])
						{
							nEndPos-=this.tailChar.length;
						}
						var nEndPos = this.GetMaskPos(nEndPos);
						if (nPos < nEndPos)
						{
							for (var i = nPos + 1; i < nEndPos; i++)
							{
								this.oText[i-1] = this.oText[i];
							}
							this.oText[nEndPos - 1] = '';
						}
						this.nEndPos = nPos;
					}
				}
			}
			this.oControl.value = this.ConcatArray(0, this.oText.length);
			nCaret = this.GetCaretPos(this.nEndPos);
			this.PutCaretPos(nCaret, nCaret);
			this.SetStartPos(nCaret);
			this.SetEndPos(nCaret);
			this.nStartPos = this.nEndPos;
		}
	}
	else 
	{
		if (this.IsMaskChar(this.oMask[this.nEndPos]) && this.oText[this.nEndPos] != 'M')
		{
			this.SetDefaultChar(this.nEndPos);
		}
		this.oControl.value = this.ConcatArray(0, this.oText.length);
		this.KeyRight();
	}
	if (oValue != this.oControl.value)
	{
		this.bChanged = true;
		this.SetChanged();
	}
}

function PBEditMaskManager_KeyBackspace()
{
	if (this.nStartPos != this.nEndPos)
	{
		var nNumber;
		if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)
		{
			nNumber = 0;
			for (var i = this.nStartPos; i < this.nEndPos; i++)
			{
				if (this.IsMaskChar(this.oMask[i]) || this.oMask[i] == ',')
				{
					nNumber++;
				}
			}
			
			for (var i = 0; i < nNumber; i++)
			{
				this.KeyBackspaceHelper();
			}			
		}
		else
		{
			nNumber = this.nEndPos - this.nStartPos;
			for (var i = 0; i < nNumber; i++)
			{
				this.KeyBackspaceHelper();
			}
		}
	}
	else
	{
		this.KeyBackspaceHelper();
	}
}

function PBEditMaskManager_KeyBackspaceHelper()
{
	var oValue = this.oControl.value;
	if (this.nMaskType == NUMERICMASK || this.nMaskType == DECIMALMASK)
	{
		var bPointLeft = true;
		var nCaret = this.GetEndPos();
		var nFirstPos = 0;
		var oTailChar = this.GetArray(this.tailChar);
		if (this.oMask[this.oMask.length-1] == oTailChar[this.tailChar.length-1] && nCaret == this.oControl.value.length)
		{
			this.KeyEnd();
			nCaret = this.GetEndPos(); 
		}	
		var oCurrencyChar = this.GetArray(this.currencyChar);
		if (this.oMask[0] == oCurrencyChar[0])
		{
			nFirstPos+=this.currencyChar.length;
		}
		if (this.oText[nFirstPos] == '-')
		{
			nFirstPos++;
		}		
		var nStartPos = this.GetMaskPos(nFirstPos);
		var nPos;
		if (this.nEndPos != nStartPos)
		{
			if (!this.IsMaskChar(this.oMask[this.nEndPos-1]))
			{
				nPos = this.GetPrevMaskCharPos(this.nEndPos);
			}
			else
			{
				nPos = this.nEndPos;
			}
			if (nPos != -1 && nPos != nStartPos)
			{
				if (this.bHasNonMask)
				{
					this.oText[nPos-1] = '0';
					nPos--;
					this.PutCaretPos(nPos, nPos);
					this.SetStartPos(nPos);
					this.SetEndPos(nPos);
					this.nEndPos = nPos;
					this.nStartPos = nPos;
				}
				else
				{
					if (this.nMaskPointIndex != -1 && nPos > this.nMaskPointIndex)
					{
						bPointLeft = false;
					}			
					if (bPointLeft)
					{
						for (var i = nPos - 2; i >= nStartPos; i--)
						{
							if (this.oMask[i] != this.thousandsChar)
							{
								if (this.oText[i+1] == this.thousandsChar)
								{
									this.oText[i+2] = this.oText[i];
								}
								else
								{
									this.oText[i+1] = this.oText[i];
								}
							}
						}
						if (this.oMask[nStartPos] == '0')
						{
							this.oText[nStartPos] = '0';
						}
						else
						{
							this.oText[nStartPos] = '';
							if (this.oMask[nStartPos + 1] == this.thousandsChar)
							{
								this.oText[nStartPos + 1] = '';
								if (nStartPos == nPos - 1)
								{
									nPos++;
								}
							}
						}
						this.nEndPos = nPos;
					}
					else
					{
						if (this.oMask[nPos - 1] == '0')
						{
							this.oText[nPos - 1] = '0';
							this.nEndPos = nPos - 1;
						}
						else
						{
							var nEndPos = this.oControl.value.length;
							var oTailChar = this.GetArray(this.tailChar);
							if (this.oMask[this.oMask.length -1] == oTailChar[this.tailChar.length-1])
							{
								nEndPos-=this.tailChar.length;
							}
							var nEndPos = this.GetMaskPos(nEndPos);
							if (nPos <= nEndPos)
							{
								this.oText[nPos - 1] = '';
								this.nEndPos = nPos - 1;
							}
						}
					}
				}
				this.oControl.value = this.ConcatArray(0, this.oText.length);
				nCaret = this.GetCaretPos(this.nEndPos);
				this.PutCaretPos(nCaret, nCaret);
				this.SetStartPos(nCaret);
				this.SetEndPos(nCaret);
				this.nStartPos = this.nEndPos;
			}
		}
		else
		{
			if (this.oText[nFirstPos - 1] == '-')
			{
				this.oText[nFirstPos - 1] = '';
				this.oControl.value = this.ConcatArray(0, this.oText.length);
				if (this.oMask[0] == oCurrencyChar[0])
				{
					nCaret = this.currencyChar.length;
				}
				else
				{
					nCaret = 0;
				}
				this.PutCaretPos(nCaret, nCaret);
				this.SetStartPos(nCaret);
				this.SetEndPos(nCaret);
				this.nEndPos = this.GetMaskPos(nCaret);
				this.nStartPos = this.nEndPos;
			}
		}		
	}
	else 
	{
		if (this.IsMaskChar(this.oMask[this.nEndPos - 1]) && this.oText[this.nEndPos - 1] != 'M')
		{
			this.SetDefaultChar(this.nEndPos - 1);
		}
		this.oControl.value = this.ConcatArray(0, this.oText.length);
		this.KeyLeft();
	}
	if (oValue != this.oControl.value)
	{
		this.bChanged = true;
		this.SetChanged();
	}	
}

function PBEditMaskManager_KeyUp()
{
}

function PBEditMaskManager_KeyArrowDown()
{
}

function PBEditMaskManager_GetKeyString(g)
{
	return String.fromCharCode(g);
}

function PBEditMaskManager_GetUpperKeyString(g)
{
	if (this.IsAlphaLowerCase(g))
	{
		g -= 32;
	}
	return this.GetKeyString(g);
}

function PBEditMaskManager_GetLowerKeyString(g)
{
	if (this.IsAlphaUpperCase(g))
	{
		g += 32;
	}
	return this.GetKeyString(g);
}

function PBEditMaskManager_PutCaretPos(nStartPos, nEndPos)
{
	if (nEndPos != -1)
	{
		if (g_IE)
		{
			var range = this.oControl.createTextRange();
			range.move('character', nStartPos);	
			range.moveEnd('character', nEndPos - nStartPos);	
			range.select();
		}
		else
		{
			this.oControl.setSelectionRange(nStartPos, nEndPos);
		}
	}
}

function PBEditMaskManager_GetSelectionStart(oControl)
{
	if (g_IE)
	{
		var k = document.selection.createRange().duplicate();
		for (var i = 0; i < oControl.value.length; i++)
		{
			if (k.text == k.htmlText) 
			{
				k.moveEnd("character", 1);
			}
			else 
			{
				break;
			}
		}
		
		return oControl.value.lastIndexOf(k.text);
	}
	else
	{
		return oControl.selectionStart;
	}
}

function PBEditMaskManager_GetSelectionEnd(oControl)
{
	if (g_IE)
	{
		var	k = document.selection.createRange().duplicate();
		for (var i = 0; i < oControl.value.length; i++)
		{
			if (k.text == k.htmlText) 
			{
				k.moveStart("character", -1);
			}
			else 
			{
				break;
			}
		}

		return k.text.length;
	}
	else
	{
		return oControl.selectionEnd;
	}
}

function PBEditMaskManager_DefaultChar()
{
	switch (this.nMaskType){
		case STRINGMASK:  cDefaultChar = ' '; break;
		case NUMERICMASK: break;
		case DECIMALMASK: break;
		case DATEMASK: 
		case TIMEMASK: 
		case DATETIMEMASK:cDefaultChar = '0'; break; 
	}
	return cDefaultChar;
}

function PBEditMaskManager_SetDefaultChar(nPos)
{
	if (!((this.nMaskType == DATETIMEMASK || this.nMaskType == TIMEMASK) && this.oMask[nPos]== 'a')) 
	{
		if (this.nMonthNumber == 3 && nPos >= this.nMonthOffset && nPos < this.nMonthOffset + this.nMonthNumber)
		{
			this.oText[nPos] = ' ';
		}
		else
		{
			this.oText[nPos] = this.DefaultChar();
		}
	}
}

function PBEditMaskManager_SetFocus(evt, strID)
{
    var oEditMask = document.getElementById(strID + "_tx");
    if (oEditMask == null)
    {
		oEditMask = document.getElementById(strID + "_dtp_tx");
	}

    if (oEditMask == null)
    {
		oEditMask = document.getElementById(strID);
	}

	if (oEditMask)
	{
	    this.OnClick(evt, oEditMask, false);
	}
}

function PBEditMaskManager_InitGlobalEMVars()
{
    this.bChanged = false;
}

function PBEditMaskManager()
{
    this.EditMasks = new PBMap();
	this.oMask = null;
	this.oText = null;
    this.strMask = "";
    this.strUniqueID = "";
    this.strID = "";
    this.nMaskType = 0;
    this.nStartPos = -1;
    this.nEndPos = -1;
    this.nSelectionStartPos = -1;
    this.nSelectionEndPos = -1;
    this.oControl = null;
    this.nYearOffest = -1;
    this.nMonthOffest = -1;
    this.nDayOffest = -1;
    this.nJulianDayOffest = -1;
    this.nHourOffest = -1;
    this.nMinuteOffest = -1;
    this.nSecondOffest = -1;
    this.nAM_PMOffset = -1;
    this.nFractionalSecondOffset = -1;
    this.nYear = 0;
    this.nMonth = 0;
    this.nDay = 0;
    this.nHour = 0;
    this.nMinute = 0;
    this.nSecond = 0;
    this.nYearNumber = 0;
    this.nMonthNumber = 0;
    this.nMaskPointIndex = -1;
    this.bPostBack = false;
    this.bChanged = false;
    this.decimalChar = '.';
    this.thousandsChar = ',';
    this.currencyChar = '$';
    this.tailChar = "%";
    this.datePickerID = "";
    this.bCurrencyCharFirst = true;
    this.Get = PBEditMaskManager_Get;
    this.Add = PBEditMaskManager_Add;
    this.GetIDs = PBEditMaskManager_GetIDs;
    this.Count = PBEditMaskManager_Count;
    this.Register = PBEditMaskManager_Register;
    this.KeyPress = PBEditMaskManager_KeyPress;
    this.KeyDown = PBEditMaskManager_KeyDown;
    this.OnClick = PBEditMaskManager_OnClick;
    this.OnChange = PBEditMaskManager_OnChange;
    this.IsValidYear = PBEditMaskManager_IsValidYear;
    this.IsValidMonth = PBEditMaskManager_IsValidMonth;
    this.IsValidDay = PBEditMaskManager_IsValidDay;
    this.IsValidJulianDay = PBEditMaskManager_IsValidJulianDay;
    this.IsValidMMM = PBEditMaskManager_IsValidMMM;
    this.IsValidMinute = PBEditMaskManager_IsValidMinute;
    this.IsValidHour = PBEditMaskManager_IsValidHour;
    this.IsValidSecond = PBEditMaskManager_IsValidSecond;
    this.IsValidFractionalSecond = PBEditMaskManager_IsValidFractionalSecond;
    this.IsValidAM_PM = PBEditMaskManager_IsValidAM_PM;
    this.IsLeapYear = PBEditMaskManager_IsLeapYear;
    this.IsValidChar = PBEditMaskManager_IsValidChar;
    this.IsValidStringChar = PBEditMaskManager_IsValidStringChar;
    this.IsValidDateChar = PBEditMaskManager_IsValidDateChar;
    this.IsValidTimeChar = PBEditMaskManager_IsValidTimeChar;
    this.IsValidDateTimeChar = PBEditMaskManager_IsValidDateTimeChar;
    this.IsAlphaNumeric = PBEditMaskManager_IsAlphaNumeric;
    this.IsDigit = PBEditMaskManager_IsDigit;
	this.IsAlphaUpperCase = PBEditMaskManager_IsAlphaUpperCase;
	this.IsAlpha = PBEditMaskManager_IsAlpha;
	this.IsAlphaLowerCase = PBEditMaskManager_IsAlphaLowerCase;
	this.IsValidNumericChar = PBEditMaskManager_IsValidNumericChar;
	this.IsPrint = PBEditMaskManager_IsPrint;
    this.KeyChar = PBEditMaskManager_KeyChar;
    this.KeyDelete = PBEditMaskManager_KeyDelete;
    this.KeyEnd = PBEditMaskManager_KeyEnd;
    this.KeyHome = PBEditMaskManager_KeyHome;
    this.KeyBackspace = PBEditMaskManager_KeyBackspace;
    this.KeyLeft = PBEditMaskManager_KeyLeft;
    this.KeyRight = PBEditMaskManager_KeyRight;
    this.KeyArrowDown = PBEditMaskManager_KeyArrowDown;
    this.KeyUp = PBEditMaskManager_KeyUp;
    this.GetKeyString = PBEditMaskManager_GetKeyString;
    this.GetUpperKeyString = PBEditMaskManager_GetUpperKeyString;
    this.GetLowerKeyString = PBEditMaskManager_GetLowerKeyString;
	this.PutCaretPos = PBEditMaskManager_PutCaretPos;
	this.GetSelectionStart = PBEditMaskManager_GetSelectionStart;
	this.GetSelectionEnd = PBEditMaskManager_GetSelectionEnd;
	this.GetArray = PBEditMaskManager_GetArray;
    this.ConcatArray = PBEditMaskManager_ConcatArray;
	this.Init = PBEditMaskManager_Init;
	this.GetNextMaskPos = PBEditMaskManager_GetNextMaskPos;
	this.GetPreviousMaskPos = PBEditMaskManager_GetPreviousMaskPos;
	this.IsMaskChar = PBEditMaskManager_IsMaskChar;
	this.ParserOffset = PBEditMaskManager_ParserOffset;
	this.GetData = PBEditMaskManager_GetData;
	this.ToNumber = PBEditMaskManager_ToNumber;
	this.SetDefaultChar = PBEditMaskManager_SetDefaultChar;
	this.Reverse = PBEditMaskManager_Reverse;
	this.DefaultChar = PBEditMaskManager_DefaultChar;
	this.SetText = PBEditMaskManager_SetText;
	this.GetNextCharPos = PBEditMaskManager_GetNextCharPos;
	this.SetFocus = PBEditMaskManager_SetFocus;
	this.GetChanged = PBEditMaskManager_GetChanged;
	this.SetChanged = PBEditMaskManager_SetChanged;
	this.SetCaret = PBEditMaskManager_SetCaret;
	this.GetNextMaskCharPos = PBEditMaskManager_GetNextMaskCharPos;
	this.GetPrevMaskCharPos = PBEditMaskManager_GetPrevMaskCharPos;
	this.GetCaret = PBEditMaskManager_GetCaret;
	this.GetMaskPos = PBEditMaskManager_GetMaskPos;
	this.GetFirstMaskPos = PBEditMaskManager_GetFirstMaskPos;
	this.GetCaretPos = PBEditMaskManager_GetCaretPos;
	this.OnClickHelper = PBEditMaskManager_OnClickHelper;
	this.KeyDeleteHelper = PBEditMaskManager_KeyDeleteHelper;
	this.KeyCharHelper = PBEditMaskManager_KeyCharHelper;
	this.KeyBackspaceHelper = PBEditMaskManager_KeyBackspaceHelper;
	this.SetEndPos = PBEditMaskManager_SetEndPos;
	this.GetEndPos = PBEditMaskManager_GetEndPos;
	this.SetStartPos = PBEditMaskManager_SetStartPos;
	this.GetStartPos = PBEditMaskManager_GetStartPos;
	this.OnMouseDown = PBEditMaskManager_OnMouseDown;
	this.InitGlobalEMVars = PBEditMaskManager_InitGlobalEMVars;
}

var goMonth = new PBSet();
InitMonth();
var goStringTypeMaskChar = new PBSet(); 
var goDateTypeMaskChar = new PBSet(); 
var goTimeTypeMaskChar = new PBSet(); 
var goDateTimeTypeMaskChar = new PBSet(); 
var goNumericTypeMaskChar = new PBSet(); 
InitMaskChar();

var goEditMaskManager = new PBEditMaskManager();

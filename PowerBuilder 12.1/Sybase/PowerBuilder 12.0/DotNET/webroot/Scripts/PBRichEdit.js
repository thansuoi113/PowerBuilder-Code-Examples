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

var DIALOG_STYLE = "resizable: yes; help: no; status: no; scroll: no; ";
var NORMAL_MODE = 1;
var HTML_MODE = 2;
var gstrWebAppDir;

function PBRichEdit()
{
    this.nMode = NORMAL_MODE;
    this.bDisplayOnly = false;
}

/*function PBRichEditManager_WaitRegister(strID, strValue, bRTF)
{
	if (document.readyState != "complete") 
	{
      setTimeout("goRichEditManager.WaitRegister('" + strID + "','" + strValue + "'," + bRTF + ")", 50);
      return;
    }
    this.Register(strID, strWinID, strValue, bRTF); 
}*/
      
function PBRichEditManager_Register(strID, strValue, strWebAppDir, strCurrentDir, bDisplayOnly)
{
	gstrWebAppDir = strWebAppDir;
	gstrCurrentDir = strCurrentDir;
    var oRichEdit = new PBRichEdit();
    oRichEdit.bDisplayOnly = bDisplayOnly;
    this.Add(strID, oRichEdit);
	this.GetData(strID);
	this.oEditor.innerHTML = unescape(strValue);
	document.getElementsByName("input" + this.strID)[0].value = escape(this.oEditor.innerHTML);
}

function PBRichEditManager_InsertString(strID,strValue)
{
	this.GetData(strID);
	this.oEditor.focus();
	var sel = this.oEditor.document.selection.createRange();
	sel.pasteHTML(strValue);
	this.SetRTFText(strID);
}
		
function PBRichEditManager_InsertTable(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{
   		var obj = new Object(); 
   		obj.win = window;
   		obj.ID = strID;
		showModalDialog("insert_table.html", obj, DIALOG_STYLE);
	}	
}

function PBRichEditManager_InsertImage(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{
   		var obj = new Object(); 
   		obj.win = window;
   		obj.ID = strID;
   		obj.webappdir = gstrWebAppDir;
   		obj.currentdir = gstrCurrentDir;
		showModalDialog("insert_image.html", obj, DIALOG_STYLE);
	}	
}

function PBRichEditManager_SetFont(evt, strID, strFont)
{
    if (strFont != "Font")
    {
		this.GetData(strID);
		if (!this.bDisplayOnly)
		{
			this.ExecCommand('fontname', strFont);
		}
	}	
	else
	{
		this.oEditor.focus();
	}
}

function PBRichEditManager_SetFontSize(evt, strID, strFontSize)
{
    if (strFontSize != "Size")
    {
		this.GetData(strID);
		if (!this.bDisplayOnly)
		{
			this.ExecCommand('fontsize', strFontSize);
		}
	}	
	else
	{
		this.oEditor.focus();
	}
}

function PBRichEditManager_SetStyle(evt, strID, strStyle)
{
    if (strStyle != "Style")
    {
		this.GetData(strID);
		if (!this.bDisplayOnly)
		{
			this.ExecCommand('formatblock', strStyle);
		}
	}	
	else
	{
		this.oEditor.focus();
	}	
}

function PBRichEditManager_InsertDate(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{
		var oCurrentDate = new Date();
		this.InsertString(strID, oCurrentDate.toLocaleDateString() + " " + oCurrentDate.toLocaleTimeString());	
	}
}

function PBRichEditManager_Get(strID)
{
	return this.RichEdits.Get(strID);
}

function PBRichEditManager_Add(strID, oRichEdit)
{
	this.RichEdits.Put(strID, oRichEdit);
}
	
function PBRichEditManager_GetIDs()
{
	return this.RichEdits.KeySet();
}

function PBRichEditManager_Count() 
{
	return this.RichEdits.Size();
}

function PBRichEditManager_GetData(strID)
{
	this.strID = strID;
	this.oEditor = this.GetEditor(strID);
	var oRichEdit= this.Get(strID);
	this.nMode = oRichEdit.nMode;
	this.bDisplayOnly = oRichEdit.bDisplayOnly;
}

function PBRichEditManager_GetEditor(strID)
{
	var oEditor = document.getElementById(strID + "editor");
	return oEditor;
}

function PBRichEditManager_Cut(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{
		this.ExecCommand("Cut", null);
	}		
}

function PBRichEditManager_Copy(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("Copy", null);
	}		
}

function PBRichEditManager_Paste(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("Paste", null);
	}		
}

function PBRichEditManager_SetBold(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("Bold", null);
	}
}

function PBRichEditManager_SetItalic(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("Italic", null);
	}		
}

function PBRichEditManager_SetUnderline(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("underline", null);
	}		
}

function PBRichEditManager_AlignLeft(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("JustifyLeft", null);
	}		
}

function PBRichEditManager_AlignCenter(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("JustifyCenter", null);
	}
}

function PBRichEditManager_AlignRight(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("JustifyRight", null);
	}		
}

function PBRichEditManager_AlignJustify(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("JustifyFull", null);
	}
}

function PBRichEditManager_InsertNumbering(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("InsertOrderedList", null);
	}
}

function PBRichEditManager_InsertBulletes(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("InsertUnorderedList", null);
	}
}

function PBRichEditManager_InsertIndent(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("Indent", null);
	}		
}

function PBRichEditManager_InsertOutdent(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("Outdent", null);
	}
}

function PBRichEditManager_ChooseColor(strID, strColor)
{
	strColor = document.getElementById("dlgHelper_" + strID).ChooseColorDlg(strColor);
	
	strColor = strColor.toString(16);
	if (strColor.length < 6) 
	{
		var strTemp = "000000".substring(0, 6 - strColor.length);
		strColor = strTemp.concat(strColor);
	}
	return strColor;
}

function PBRichEditManager_SetFgcolor(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		var strColor = this.ChooseColor(strID, "#000000");
		this.ExecCommand("ForeColor", strColor);
	}
}

function PBRichEditManager_SetBgcolor(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		var strColor = this.ChooseColor(strID,"#FFFFFF");
		this.ExecCommand("BackColor", strColor);
	}
}

function PBRichEditManager_InsertLink(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		this.ExecCommand("CreateLink", null);
	}
}

function PBRichEditManager_ExecCommand(strCmd, strValue)
{
	this.oEditor.focus();
	if (strValue != null)
	{
		this.oEditor.document.execCommand(strCmd, false, strValue);
	}
	else
	{
		this.oEditor.document.execCommand(strCmd);
	}
	this.SetRTFText(this.strID);
}

function PBRichEditManager_SwitchMode(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{	
		var oRichEdit = new PBRichEdit();
		if (this.nMode == HTML_MODE)
		{
			this.nMode = NORMAL_MODE;
			this.oEditor.innerHTML = this.oEditor.innerText;
			this.oEditor.contentEditable = true;
			oRichEdit.nMode = NORMAL_MODE;
		}
		else 
		{
			this.nMode = HTML_MODE;
			this.oEditor.innerText = this.oEditor.innerHTML; 
			this.oEditor.contentEditable = false;
			oRichEdit.nMode = HTML_MODE;
		}
		this.Add(strID, oRichEdit);
	}
}

function PBRichEditManager_KeyUp(evt, strID)
{
	this.GetData(strID);
	if (!this.bDisplayOnly)
	{
		this.SetRTFText(this.strID);
	}
}

function PBRichEditManager_SetRTFText(strID)
{
	document.getElementsByName("input" + this.strID)[0].value = escape(this.oEditor.innerHTML);
}	

function PBRichEditManager_SetFocus(evt, strID)
{
	var e = PB_GetEvent(evt);
	var oFocusObj = document.getElementById(strID+"editor");
   	if (e == null || (e.srcElement != null && e.srcElement.getAttribute("pbtype") != "rtetoolbar"))
   	{
   		if (!oFocusObj.disabled)
   		{
				goWindowManager.OnFocusOwn(strID);
				oFocusObj.focus();
   		}
	}
}

function PBRichEditManager()
{
    this.strID = "";
    this.nMode = NORMAL_MODE;
    this.bDisplayOnly = false;
    this.oEditor = null;
    this.RichEdits = new PBMap();
    this.Get = PBRichEditManager_Get;
    this.Add = PBRichEditManager_Add;
    this.GetIDs = PBRichEditManager_GetIDs;
    this.Count = PBRichEditManager_Count;
    this.Register = PBRichEditManager_Register;
    this.SetFont = PBRichEditManager_SetFont;
    this.SetFontSize = PBRichEditManager_SetFontSize;
    this.SetStyle = PBRichEditManager_SetStyle;
    this.InsertDate = PBRichEditManager_InsertDate;
    this.InsertString = PBRichEditManager_InsertString;
    this.InsertTable = PBRichEditManager_InsertTable;
    this.InsertImage = PBRichEditManager_InsertImage;
    this.InsertLink = PBRichEditManager_InsertLink;
    this.GetEditor = PBRichEditManager_GetEditor;
    this.ExecCommand = PBRichEditManager_ExecCommand;
    this.Cut = PBRichEditManager_Cut;
    this.Copy = PBRichEditManager_Copy;
    this.Paste = PBRichEditManager_Paste;
    this.SetBold = PBRichEditManager_SetBold;
    this.SetItalic = PBRichEditManager_SetItalic;
    this.SetUnderline = PBRichEditManager_SetUnderline;
    this.AlignLeft = PBRichEditManager_AlignLeft;
    this.AlignCenter = PBRichEditManager_AlignCenter;
    this.AlignRight = PBRichEditManager_AlignRight;
    this.AlignJustify = PBRichEditManager_AlignJustify;
    this.InsertNumbering = PBRichEditManager_InsertNumbering;
    this.InsertBulletes = PBRichEditManager_InsertBulletes;
    this.InsertIndent = PBRichEditManager_InsertIndent;
    this.InsertOutdent = PBRichEditManager_InsertOutdent;
    this.SetFgcolor = PBRichEditManager_SetFgcolor;
    this.SetBgcolor = PBRichEditManager_SetBgcolor;
    this.GetData = PBRichEditManager_GetData;
    this.ChooseColor = PBRichEditManager_ChooseColor;
    this.SwitchMode = PBRichEditManager_SwitchMode;
    this.KeyUp = PBRichEditManager_KeyUp;
    this.SetRTFText = PBRichEditManager_SetRTFText; 
//    this.WaitRegister = PBRichEditManager_WaitRegister;
    this.SetFocus = PBRichEditManager_SetFocus;
}

var goRichEditManager = new PBRichEditManager();

PB_AjaxJsLoaded();

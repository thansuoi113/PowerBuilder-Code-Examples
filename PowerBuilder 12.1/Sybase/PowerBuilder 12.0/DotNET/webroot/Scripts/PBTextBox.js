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
var KEY_ENTER = 13;
var KEY_DELETE = 46;
var KEY_BACKSPACE = 8;
var KEY_ESC = 27;
var KEY_TAB = 9;

var SELECTED_TEXT_LENGTH_SUFFIX = "_stl";
var CARET_POSITION_SUFFIX = "_cp";
var TEXT_CHANGED = "_tc";

var g_clipboardTextData = null;
var PB_ERR_FF_CLIPBOARD = "This operation is denied by Firefox!\nPlease key in 'about:config' in address bar of Firefox and press enter key, then set [signed.applets.codebase_principal_support] = 'true'";

// TextBox Class defination
function PBTextBox() 
{
   var widgetID;
   var isMouseDown = false; 
   var isMouseMove = false; 
   var doAutoPostBack = true;
   var selectionRangeObject = null; //IE only
   var selTextStartIndex;
   var selTextLen;
   var isFocusLost = true;
   var bPostBack = false;
   var text = "";
   var uniqueID = "";
   
}
// TextBoxManager Class defination, Maintains all the TextBoxs in a Page
function PBTextBoxMgr()
{	
    this.bPostBack = false;
    this.TextBoxs = new PBMap();
    this.Get = PBTextBoxMgr_Get;
    this.Add = PBTextBoxMgr_Add;
    this.GetIDs = PBTextBoxMgr_GetIDs;
    this.Count = PBTextBoxMgr_Count;
    this.KeyUp = PBTextBoxMgr_KeyUp;
    this.MousDown = PBTextBoxMgr_MousDown;
    this.MousMove = PBTextBoxMgr_MousMove;
    this.MousUp = PBTextBoxMgr_MousUp;
	this.GetCaretPosition = PBTextBoxMgr_GetCaretPosition;
	this.ContextMenu = PBTextBoxMgr_ContextMenu;
	this.Register = PBTextBoxMgr_Register;
	this.KeyDown = PBTextBoxMgr_KeyDown;
	this.CheckLimit = PBTextBoxMgr_CheckLimit;
	this.OnPasteData = PBTextBoxMgr_OnPasteData;
	this.SetFocus = PBTextBoxMgr_SetFocus;
	this.LostFocus = PBTextBoxMgr_LostFocus;
	this.KeyPressed = PBTextBoxMgr_KeyPressed;
	this.OnChange = PBTextBoxMgr_OnChange;
	this.SetCaretPosition = PBTextBoxMgr_SetCaretPosition;
	this.StoreCaretPosition = PBTextBoxMgr_StoreCaretPosition;
	this.IsReadOnly = PBTextBoxMgr_IsReadOnly;
	this.StoreSelectedTextInfo = PBTextBoxMgr_StoreSelectedTextInfo;
	this.SetTextChanged = PBTextBoxMgr_SetTextChanged;
	this.IsContentChanged = PBTextBoxMgr_IsContentChanged;
	this.GainFocus = PBTextBoxMgr_GainFocus;
}

var goTextBoxMgr = new PBTextBoxMgr();

function PBTextBoxMgr_Get(widgetID)
{
	return this.TextBoxs.Get(widgetID);
}

function PBTextBoxMgr_Add(widgetID, oTextBox)
{
	this.TextBoxs.Put(widgetID, oTextBox);
}

function PBTextBoxMgr_GetIDs()
{
	return this.TextBoxs.KeySet();
}

function PBTextBoxMgr_Count() 
{
	return this.TextBoxs.Size();
}
 
function PBTextBoxMgr_MousDown(evt, widgetID) 
{
	try
  	{ 	    
	    var tbo = this.Get(widgetID);	    
	    tbo.isMouseDown = true;
	    tbo.isFocusLost = true;
	} catch(ex){}
}

function PBTextBoxMgr_OnChange(oControl)
{
	var wID = oControl.id;
	var txtObject = this.Get(wID);
	this.StoreCaretPosition(wID);
	var uniqueID = txtObject.uniqueID;
	if (this.IsContentChanged(wID) && txtObject.bPostBack && txtObject.doAutoPostBack)
	{
		txtObject.isFocusLost = true;
		document.getElementsByName(wID + TEXT_CHANGED)[0].value = "1";// make sure set the flag
		__doPostBack(uniqueID, "textchanged");		
	}
}

function PBTextBoxMgr_SetTextChanged(widgetID)
{
	document.getElementsByName(widgetID + TEXT_CHANGED)[0].value = "1";
    this.StoreCaretPosition(widgetID);
    this.StoreSelectedTextInfo(widgetID);
}

function PBTextBoxMgr_KeyPressed(evt, widgetID, textCase)
{	  
	if (this.IsReadOnly(widgetID))
		return false;
	
	//clear the selection
	var sTHF = document.getElementsByName(widgetID + SELECTED_TEXT_LENGTH_SUFFIX)[0];	   
	sTHF.value = 0;
	
	var e = PB_GetEvent(evt);
	var keyCode = e.keyCode;
    if (keyCode != KEY_ESC)
    {
		if ((keyCode != null) && (textCase > 0) && !(e.altKey || e.ctrlKey))
		{
			e.keyCode = (textCase == 1) ?
				String.fromCharCode(keyCode).toUpperCase().charCodeAt(0) :
				String.fromCharCode(keyCode).toLowerCase().charCodeAt(0);
		}
		
		this.SetTextChanged(widgetID);
	}

	var tbo = this.Get(widgetID);			
}

function PBTextBoxMgr_MousMove(evt, widgetID) 
{
	try
  	{
        var tbo = this.Get(widgetID);
        if(tbo.isMouseDown)
		    tbo.isMouseMove = true;
	}		
	catch (ex){}
}

function PBTextBoxMgr_StoreCaretPosition(widgetID)
{
	var caretPos = this.GetCaretPosition(widgetID);
	
	 var tbo = this.Get(widgetID);
	 tbo.selTextStartIndex = caretPos + 1;	 
	 var caretPositiontHiddenField =
		 document.getElementsByName(widgetID + CARET_POSITION_SUFFIX)[0];			
	 if(caretPositiontHiddenField == null) 
		return;
	 caretPositiontHiddenField.value = caretPos;
}

function PBTextBoxMgr_IsContentChanged(widgetID)
{
	 var tbo = this.Get(widgetID);
	 	
	 oTBC = document.getElementById(widgetID);	   
	 if (tbo.text != oTBC.value)
		 return true;
	 else
		return false;  
}

function PBTextBoxMgr_LostFocus(evt, widgetID)
{	
	 this.StoreCaretPosition(widgetID);
	 var tbo = this.Get(widgetID);
	 tbo.isFocusLost = false;	 	   
     if (this.IsContentChanged(widgetID))
     {
		this.SetTextChanged(widgetID);
     }	 	   
}

function PBTextBoxMgr_StoreSelectedTextInfo(widgetID)
{
	var tbo = this.Get(widgetID);
	var oIDs = this.GetIDs();
    var i;
	
    for (i = 0; i < oIDs.Size(); i++) 
    {
	    var textBoxControlID = oIDs.Get(i);
	    var sTHF = document.getElementsByName(widgetID + SELECTED_TEXT_LENGTH_SUFFIX)[0];	   
	    sTHF.value = 0;   	
	    var tempTextBoxObject = this.Get(textBoxControlID);
	    
	    if (tempTextBoxObject.widgetID !=  widgetID) 
	    {
		    var sTLHF =  document.getElementsByName(tempTextBoxObject.widgetID +	
				SELECTED_TEXT_LENGTH_SUFFIX)[0];				    
		    if(sTLHF == null) 
		        continue;
		    else
		        sTLHF.value = 0;
	    }
    }
	
	var sTL;
	if (g_IE)
	{
	    var textRange = document.selection.createRange().duplicate();				
		sTL = document.selection.createRange().text.length;	
	}
	else
	{
		var textBoxControl =  document.getElementById(widgetID);		
		sTL = textBoxControl.selectionEnd - textBoxControl.selectionStart + 1;
	}
    
	var sTHF = document.getElementsByName(widgetID + SELECTED_TEXT_LENGTH_SUFFIX)[0];	   
	sTHF.value = sTL;
    tbo.selTextLen = sTL;			
}

function PBTextBoxMgr_MousUp(evt, widgetID) 
{
	try
	{
		goWindowManager.OnFocusOwn(widgetID);
		
	    var tbo = this.Get(widgetID);
		
		if (g_IE)
		{	          
	    	tbo.selectionRangeObject = document.selection.createRange();
		}		       
	    
		var caretPos = this.GetCaretPosition(widgetID);	    
	    if (tbo.isMouseMove)
	    {			
			this.StoreSelectedTextInfo(widgetID);  		 
		}

	    tbo.isMouseMove = false;
	    
	    var cPHF = document.getElementsByName(widgetID + CARET_POSITION_SUFFIX)[0];  	
	    if(cPHF == null) 
			return;
    	
	    cPHF.value = caretPos;
	    tbo.selTextStartIndex = caretPos + 1;
	  }
	  catch (ex){}	  	 		  
}

function PBTextBoxMgr_SetCaretPosition(textBoxID)
{
	var textBoxControl =  document.getElementById(textBoxID);		
	var textBoxObject = this.Get(textBoxID);
	
	textBoxControl.focus();

	if (g_IE)
	{
		var range = textBoxControl.createTextRange();
		/* The caret position, includes for each line one character more.
		 * So, find no.of lines and subtract.
		 */
		var textUpToCaret = textBoxControl.value.substr(0, textBoxObject.selTextStartIndex - 1);
		var parseList = textUpToCaret.split("\r\n");
		var linesInSelText = (textBoxControl.value.substr(textBoxObject.selTextStartIndex - 1,
		                      textBoxObject.selTextLen)).split("\r\n");		
		var l =  parseList.length;
		   
		var lines = linesInSelText.length;	
		//PB counts newline as 2 chars.
		if(lines > 0)
			lines--; 		
		range.move('character', textBoxObject.selTextStartIndex - l);		
		range.moveEnd('character', textBoxObject.selTextLen - lines);		
		range.select();
		//Store the selection range
		textBoxObject.selectionRangeObject = range;	
	}
}			

function PBTextBoxMgr_GainFocus(evt, widgetID)
{
	try
  	{		
		textBoxObject = this.Get(widgetID);
		var tBC = document.getElementById(widgetID);				
		textBoxObject.text = tBC.value; 	
	}
	catch (ex){}
}

function PBTextBoxMgr_SetFocus(textBoxID)
{
	try
  	{		
		textBoxObject = this.Get(textBoxID);								
		var tBC = document.getElementById(textBoxID);	
		textBoxObject.text = tBC.value; 			
		this.SetCaretPosition(textBoxID);	
	}
	catch (ex){}	
}

function PBTextBoxMgr_Register(widgetID, uniqueID, selTextStartIndex, selTextLen, bPostBack, doAutoPostBack)
{
    try
  	{
        var tBO = new PBTextBox();   	
        tBO.widgetID = widgetID; 
        tBO.uniqueID = uniqueID;
        tBO.selTextStartIndex = selTextStartIndex;
        tBO.selTextLen = selTextLen;
        tBO.bPostBack = bPostBack; 
        tBO.doAutoPostBack = doAutoPostBack;      
		tBO.text = document.getElementById(widgetID).value;
        this.Add(widgetID, tBO);         
        var cPHF = document.getElementsByName(widgetID + CARET_POSITION_SUFFIX)[0];	        		   
	    if(cPHF == null) 
			return;
		
		cPHF.value = selTextStartIndex - 1;			
		var selHF = document.getElementsByName(widgetID + SELECTED_TEXT_LENGTH_SUFFIX)[0];	   	    
	    if(selHF == null) 
			return;
    	
	    selHF.value =  selTextLen;       
	 }
	 catch(e){}
}

function PBTextBoxMgr_IsReadOnly(widgetID)
{
	var tBC = document.getElementById(widgetID);		
	if (tBC.readOnly == true)
		return true;		
	else
		return false;			
}

function PBTextBoxMgr_KeyUp(evt, widgetID)
{  
	if (this.IsReadOnly(widgetID))
		return false;
	
	var tBO = this.Get(widgetID);
	
	if (g_IE)
	{
		tBO.selectionRangeObject = document.selection.createRange();
	}
	
	var e = PB_GetEvent(evt);
	if (e.keyCode == 16)
	{
	    this.StoreCaretPosition(widgetID);
	    this.StoreSelectedTextInfo(widgetID);
	}
}

function PBTextBoxMgr_GetCaretPosition(textBoxCtrlID)
{	
	try
	{
		var oTextBoxObject = this.Get(textBoxCtrlID);
		var textBoxCtrl = document.getElementById(textBoxCtrlID);
		
		if (textBoxCtrl == null) 
			return false;     
		
		if (g_IE)
		{
			var duplicateSelectionRange = null;
			var caretPosition = 0;
			
			try
			{
				duplicateSelectionRange = oTextBoxObject.selectionRangeObject.duplicate();
				duplicateSelectionRange.moveToElementText(textBoxCtrl);
			}
			catch(e)
			{
				duplicateSelectionRange = textBoxCtrl.createTextRange();
			}
			
			duplicateSelectionRange.setEndPoint("EndToStart", oTextBoxObject.selectionRangeObject);
			
			var caretPosition = duplicateSelectionRange.text.length;
			
			if(caretPosition > textBoxCtrl.value.length)
				return 1;
			else
				return caretPosition;   			
		}
		else
		{
			return textBoxCtrl.selectionStart;
		}
	}
	catch (ex) {}  		  
}

function PBTextBoxMgr_ContextMenu(evt)
{
	return true;
}

function PBTextBoxMgr_CheckLimit(evt, oControl) 
{       
	var nLimit = parseInt(oControl.getAttribute("limit"));
	if (nLimit <= 0) //from PB no limit return true(accept character)
		return true;
    
    var sKey_Code, aKey_Special, bResult, oTextarea_TxtRng; 

    aKey_Special = [8, 17, 18, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 114]; 
    bResult = true; 
	var e = PB_GetEvent(evt);
    sKey_Code = e.keyCode; 
    
    if ( sKey_Code == 86 )     
        if (e.ctrlKey) 
            bResult = this.OnPasteData(evt, oControl); 

    if (oControl.value.length >= nLimit) 
    {       
        bResult = false; 
        
        var selectLength;
        var bOverWrite;
        if (g_IE)
        {
		    oTextarea_TxtRng = oControl.createTextRange(); 
        	bOverWrite = oTextarea_TxtRng.queryCommandState('OverWrite');

	        var textRange = document.selection.createRange().duplicate();
	        selectLength = textRange.text.length;
		}
		else
		{
        	bOverWrite = oControl.queryCommandState('OverWrite');
			selectLength = oControl.selectionEnd - oControl.selectionStart + 1;
		}

        if (bOverWrite && (oControl.value.length == nLimit)) 
        {      
            bResult = true;    
        } 
        else if(selectLength > 0)
        {
            bResult = true;
        }
        else 
        { 
            for (i = 0; i < aKey_Special.length; i++) 
            {       
                if (sKey_Code == aKey_Special[i])      
                {
                    bResult = true; 
                    break;
                } 
            } 
        } 
    } 

    return bResult; 
}

function PB_GetClipboardTextData()
{
	if (g_IE)
	{
		return(window.clipboardData.getData('Text'));
	}
	else
	{
		try
		{  
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
		}  
		catch (ex)  
		{  
			alert(PB_ERR_FF_CLIPBOARD);
			return null;  
		}  

		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip) 
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		clip.getData(trans,clip.kGlobalClipboard);
		var str = new Object();
		var len = new Object();
		try
		{
			trans.getTransferData('text/unicode',str,len);
		}
		catch (ex)
		{
			return null;
		}
		
		if (str)
		{
			if (Components.interfaces.nsISupportsWString)
				str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
			else if (Components.interfaces.nsISupportsString)
				str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
			else
				str = null;
		}
		
		if (str)
		{
			return(str.data.substring(0, len.value / 2));
		}
	}

	return null;
}

function PB_SetClipboardTextData(textData)
{
	if (g_IE)
	{
		window.clipboardData.setData("Text", textData);
	}
	else
	{
		try
		{  
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
		}  
		catch (ex)  
		{  
			alert(PB_ERR_FF_CLIPBOARD);
			return false;  
		}  

		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);  
		if (!clip)  
			return false;  
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);  
		if (!trans)
			return false;  
		trans.addDataFlavor('text/unicode');
		var str = new Object();  
		var len = new Object();  
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);  
		var copytext = textData; 
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length * 2);  
		var clipid = Components.interfaces.nsIClipboard;  
		if (!clip)
			return false;  
		clip.setData(trans, null, clipid.kGlobalClipboard);  
	}
	
	return true;
}

function PB_SetClipboardTextDataBack()
{
	if (g_clipboardTextData != null)
	{
		if (PB_SetClipboardTextData(g_clipboardTextData))
		{
			g_clipboardTextData = null;
		}
	}
}

function PBTextBoxMgr_OnPasteData(evt, oControl) 
{       			     	 
	var ret = true;

	var textCase = parseInt(oControl.getAttribute("textcase"));
	var cbText = PB_GetClipboardTextData();
	if (cbText != null)
	{
		if (textCase == 1)
		{
			g_clipboardTextData = cbText;
			cbText = cbText.toUpperCase();
			PB_SetClipboardTextData(cbText);
			setTimeout("PB_SetClipboardTextDataBack()", 500);
		}
		else if (textCase == 2)
		{
			g_clipboardTextData = cbText;
			cbText = cbText.toLowerCase();
			PB_SetClipboardTextData(cbText);
			setTimeout("PB_SetClipboardTextDataBack()", 500);
		}
	}

	var nLimit = parseInt(oControl.getAttribute("limit"));
	if (nLimit > 0)
	{
		var len;
		if (g_IE)
		{
	        var htext = document.selection.createRange().duplicate();
	        len = htext.text.length;
		}
		else
		{
			len = oControl.selectionEnd - oControl.selectionStart + 1;
		}

        var replText = "";
        var text = oControl.value;
		
		if (nLimit <= 0)
		{
			ret = true;		
		}
		else if (nLimit == text.length && len == 0)
		{
			ret = false;
		}
		else
		{			
			var caretPos = this.GetCaretPosition(oControl.id);			
			var substrIndex = len;
			if (cbText.length > 1)
			{
				var remLen = nLimit - text.length;
						
				if (cbText.length > len)
					replText = cbText.substr(0, len + remLen);
				else
					replText = cbText;
				
				oControl.value = text.substr(0, caretPos) + replText 
				                 + text.substr(caretPos + substrIndex, 
				                 (text.length - caretPos) + substrIndex); 								
				ret = false;				
				var cntId = oControl.id;
				var textBoxObj = this.Get(cntId);
				var cphf = document.getElementsByName(cntId + CARET_POSITION_SUFFIX)[0];
				caretPos = caretPos + len + remLen;		
				if(cphf == null) 
					return;
				cphf.value = caretPos;				
				textBoxObj.selTextStartIndex = caretPos  + 1;
				textBoxObj.selTextLen = 0;				
				this.SetCaretPosition(cntId);
			}
		}
	}
	 
	if (ret) 
		this.SetTextChanged(oControl.id);

	return ret;
}
 
function PBTextBoxMgr_KeyDown(evt, oControl)
{
	if (this.IsReadOnly(oControl.id))
		return false;
	
	var e = PB_GetEvent(evt);
	var keyCode = e.keyCode;	
	if (keyCode == 86 && e.ctrlKey) 
	{    
		var bResult = this.OnPasteData(evt, oControl); 
		e.returnValue = bResult;	           
		return false;
	}
	
	// The keypress event doesn't count the delete and backspace keys. 
	// So check here. 
	if( keyCode == KEY_DELETE || keyCode == KEY_BACKSPACE)
	{
		this.SetTextChanged(oControl.id);
	}
	
	try
	{
		if (oControl.type.toLowerCase() == "textarea" && keyCode == KEY_ENTER)
		{
			if ( goWindowManager.IsActiveWindowHasDefaultButton() == true &&
				oControl.getAttribute("IDB") != "true") //IDB = ignore_default_button
			{
				e.returnValue = false;
			}
		}
		else
		{
			if ((oControl.type.toLowerCase() == "text"
			    || oControl.type.toLowerCase() == "password")
			    && keyCode == KEY_ENTER)
			    {
					this.SetTextChanged(oControl.id);
					this.OnChange(oControl);
				}
		}
		        
		e.returnValue = this.CheckLimit(evt, oControl);	
		
		if (e.keyCode == KEY_TAB && !e.ctrlKey && !e.altKey && !e.shiftKey)
			this.LostFocus(evt, oControl.id); 
			return true;
	}
	catch (ex){}
}

PB_AjaxJsLoaded();

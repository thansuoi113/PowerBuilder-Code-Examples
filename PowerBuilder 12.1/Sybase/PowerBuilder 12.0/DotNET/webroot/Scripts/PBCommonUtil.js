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

var g_oldPBRadioBorderStyle;
var g_oldPBRadioBorderWidth;
var g_oldPBRadioBorderColor;

var PB_pictureButtonDown = false;
var PB_pictureButtonOver = false;

var g_maskCount = 0;
var g_inErrorPage = false;

var g_dummyWindowEvent = new Object();

function PB_FixPrototypeForGecko()
{
	HTMLElement.prototype.__defineGetter__
	(
		"runtimeStyle",
		function()
		{
			return this.style;
		}
	);

    HTMLElement.prototype.__defineGetter__
    (
        "currentStyle",
        function()
        {
			return this.ownerDocument.defaultView.getComputedStyle(this, null);
        }
    );

	HTMLElement.prototype.__defineGetter__
	(
		"children",
		function()
		{
			var result = [];
			var node;
			var j = 0;
			for (var i = 0; i< this.childNodes.length; i++)
			{
				node = this.childNodes[i];
				if (node.nodeType == 1)
				{
					result[j++] = node;
					if(node.name)
					{
						if (!result[node.name])
						{
							result[node.name] = node;
							continue;
						}
						else if(result[node.name].constructor != Array)
						{
							result[node.name] = [result[node.name]];
						}

						result[node.name].push(node);
					}

					if (node.id)
					{
						if (!result[node.id])
						{
							result[node.id] = node;
						}
						else if (node.id == node.name)
						{
							result[node.id] = result[node.name];
						}
					}
				}
			}

			return result;
		}
	);

    HTMLElement.prototype.__defineGetter__
    (
         "parentElement",
          function()
          {
                  if(this.parentNode == this.ownerDocument){
                          return null;
                  }
                  return this.parentNode;
          }
    
    );
    
    HTMLElement.prototype.__defineSetter__
    (
            "innerText",
            function (value) 
            {
                    this.innerHTML = "";
                    var sText = String(value);
                    var textS = sText.split("\n");
                    var hCount = textS.length - 1;
                    for(var i=0; i <= hCount ; i++)
                    {
                            var txtNode = null;
                            var retNode = null;
                            if(textS[i].length)
                            {
                                    txtNode = document.createTextNode(textS[i]);
                            }
                            if(i < hCount)
                            {
                                    retNode = document.createElement("BR");
                            }
                            if(txtNode)
                            {
                                    this.appendChild(txtNode);
                            }
                            if(retNode)
                            {
                                    this.appendChild(retNode);
                            }
                    }
                    this.innerHTML = this.innerHTML.replace(/\s*$/g,"").replace(/\s/g," ");
                    return value;
            }
    );
    HTMLElement.prototype.__defineGetter__
    (
            "innerText",
            function () 
            {
                    var innerText = "";
                    var childS = this.childNodes;
                    for(var i=0; i < childS.length ; i++)
                    {
                            if(childS[i].nodeType==1)
                            {
                                    innerText += childS[i].tagName=="BR" ? '\n' : childS[i].innerText;
                            }
                            else if(childS[i].nodeType==3)
                            {
                                    innerText += childS[i].nodeValue;
                            }
                    }
                    return innerText;
            }
    );

	if (!window.attachEvent && window.addEventListener)
	{
	    window.attachEvent = HTMLDocument.prototype.attachEvent =
		HTMLElement.prototype.attachEvent = function(eventName, handler)
	    {
	        var eType = eventName.substring(2, eventName.length);
	        this.addEventListener(eType, handler, true);
	    };
	
	    window.detachEvent = HTMLDocument.prototype.detachEvent =
	    HTMLElement.prototype.detachEvent = function(eventName, handler)
	    {
	        var eType = eventName.substring(2, eventName.length);
	        this.removeEventListener(eType, handler, true);
	    };
    }

	HTMLElement.prototype.contains = function(ele)
	{
		do
		{
			if (ele)
			{
				if (ele == this)
				{
					return true;
				}
			}
			else
			{
				return false;
			}
		}
		while (ele = ele.parentNode);

		return false;
	};

	if (!g_Safari)
	{
		window.constructor.prototype.__defineGetter__("event", PB_SearchEvent);
	}
	
	Event.prototype.__defineGetter__
	(
		"srcElement",
		function()
		{
			return this.target;
		}
	);

    Event.prototype.__defineGetter__
    (
		"fromElement",
		function()
		{
			var node;
			if (this.type == "mouseover")
			{
				node = this.relatedTarget;
			}
			else if (this.type == "mouseout")
			{
				node = this.target;
			}
		
			if (!node)
			{
				return null;
			}
		
			while (node.nodeType != 1)
			{
				node = node.parentNode;
				if (!node)
				{
					return null;
				}
			}

			return node;
		}
    );

    Event.prototype.__defineGetter__
    (
		"toElement",
		function()
		{
			var node;
			if(this.type=="mouseout")
			{
				node = this.relatedTarget;
			}
			else if (this.type == "mouseover")
			{
				node = this.target;
			}

			if (!node)
			{
				return null;
			}
			
			while (node.nodeType != 1)
			{
				node = node.parentNode;
				if (!node)
				{
					return null;
				}
			}

			return node;
		}
    );
	
	Event.prototype.__defineGetter__
	(
		"keyCode",
		function()
		{
			return this.which;
		}
	);
	
	Event.prototype.__defineSetter__
	(
		"keyCode",
		function(v)
		{
			this.which = v;
		}
	);

	Event.prototype.__defineSetter__
	(
		"returnValue",
		function(v)
		{ 
			if(!v)
			{
				this.preventDefault();
			}

			return v;
		}
	);

	Event.prototype.__defineSetter__
	(
		"cancelBubble",
		function(v)
		{
			if (v)
			{
				this.stopPropagation();
			}

			return v;
		}
	);

	Event.prototype.__defineGetter__
	(
		"offsetX",
		function()
		{
			return this.layerX;
		}
	);

	Event.prototype.__defineGetter__
	(
		"offsetY",
		function()
		{
			return this.layerY;
		}
	);

	Event.prototype.__defineGetter__
	(
		"clientX",
		function()
		{
			return this.pageX;
		}
	);

	Event.prototype.__defineGetter__
	(
		"clientY",
		function()
		{
			return this.pageY;
		}
	);

	CSSStyleSheet.prototype.__defineGetter__
	(
		"owningElement",
		function()
		{
			return this.ownerNode;
		}
	);
	
    Node.prototype.__defineGetter__
    (
            "text",
            function()
            {
                    return this.textContent;
            }
    );
    Node.prototype.__defineSetter__
    (
            "text",
            function(value)
            {
                    this.textContent = value;
                    return value;
            }
    );
	
	enableDWCustomAttributeForFirefox();
	
}

function enableCustomAttributeForFirefox(attributeName, bDoEval)
{
   if (bDoEval)
   { 
       HTMLElement.prototype.__defineGetter__
       (
    	    attributeName,
		    function()
    	    {
	    	    return eval(this.getAttribute(attributeName));
		    }
	    );
    }
    else
    {
       HTMLElement.prototype.__defineGetter__
       (
    	    attributeName,
		    function()
    	    {
	    	    return this.getAttribute(attributeName);
		    }
	    );
    }
    
    HTMLElement.prototype.__defineSetter__
    (
            attributeName,
            function(value)
            {
                  this.setAttribute(attributeName, value);
                  return value;
            }
    )
}

function enableDWCustomAttributeForFirefox()
{
    var DWCustomAttributeNames = new Array(
        new Array("bIsInit", true),
        new Array("dwname", false),
        new Array("rowno", false),
        new Array("iRowNo",true),
        new Array("colno", false),
        new Array("iColNo", true),
        new Array("bandid", false),
        new Array("iBandId", true),
        new Array("grouplevel", false),
        new Array("iGroup", true),
        new Array("autoselect",  false),
        new Array("iAutoSelect",  true),
        new Array("gobname", false),
        new Array("dwaction", false),
        new Array("casetype", false),
        new Array("isdddw", false),
        new Array("pbtype", false),
        new Array("iscomp", false),
        new Array("pbnetreadonly", false)
    );
    for(i = 0; i < DWCustomAttributeNames.length; i++)
        enableCustomAttributeForFirefox(DWCustomAttributeNames[i][0], DWCustomAttributeNames[i][1]);
        
    //Special treatment for attribute "parentDW" and "gobobj", because the attribute value is a user defined object.
    //For "parentDW"
    HTMLElement.prototype.__defineGetter__
    (
	    "parentDW",
        function()
        {
	   	    return eval(this.getAttribute("dwname"));
	    }
	);
	
    HTMLElement.prototype.__defineSetter__
    (
            "parentDW",
            function(value)
            {
                  return "";   //the setter function actually will be of no use.
            }
    )
 
    //For "gobobj"
    HTMLElement.prototype.__defineGetter__
    (
	    "gobobj",
        function()
        {
            var dwname, gobname;
            dwname = this.getAttribute("dwname");
            gobname = this.getAttribute("gobname");
            //Refer to function "HTDW_initElement" in "dwcommon.js" for how "gobobj" will be defined.
            try
            {
                return eval(dwname + ".gobs." + gobname);  
            }
            catch(e)
            {
                return null;
            }
	    }
	);
	
    HTMLElement.prototype.__defineSetter__
    (
            "gobobj",
            function(value)
            {
                  return "";  //the setter function actually will be of no use.
            }
    )
     
}

function PB_SearchEvent()
{
	//IE
	if (document.all)
		return window.event;
		
	var func = PB_SearchEvent.caller;
	while (func != null)
	{
		var arg0 = func.arguments[0];
		if (arg0)
		{
			if ( arg0.constructor == Event || arg0.constructor == MouseEvent)
				return arg0;
		}

		func = func.caller;
	}

	return null;
}

function PB_GetEvent(evt)
{
    return (evt ? evt : (g_Safari ? PB_SearchEvent() : window.event));
}

var g_Safari = navigator.userAgent.indexOf(' Safari/') > -1;
var g_IE = true;
if (window.addEventListener)
{
	PB_FixPrototypeForGecko();
	g_IE = false;
}

function PB_SetCapture(o, handler)
{
	if(o.setCapture)
	{
		o.setCapture();
	}
	else if(window.captureEvents)
	{
		window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.addEventListener("mouseup", handler, false);
	}
}

function PB_ReleaseCapture(o, handler)
{
	if(o.releaseCapture)
	{
		o.releaseCapture();
	}
	else if(window.releaseEvents)
	{
		window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.removeEventListener("mouseup", handler, false); 
	}
}

function PB_CancelBubble(e)
{
	if (document.all)
	{
		e.cancelBubble = true;
	}
	else if(e.stopPropagation)
	{
		e.stopPropagation();
	}
}

function PB_IsLeftButtonDown(e)
{
	if (document.all)
	{
		return (e.button == 1);
	}
	else
	{
		return (e.button == 0);
	}
}

function PB_SetLeftButtonDown(e)
{
	if (document.all)
	{
		e.button = 1;
	}
	else
	{
		e.button = 0;
	}
}

function PB_GetPosition(o)
{
	var left = o.offsetLeft;
	var top = o.offsetTop;
	var scrollLeft = o.scrollLeft;
	var scrollTop = o.scrollTop;
	
	while (o = o.offsetParent)
	{
		left += o.offsetLeft;
		top += o.offsetTop;
		scrollLeft += o.scrollLeft;
		scrollTop += o.scrollTop;
	}
	
	return {x:left, y:top, scrollX:scrollLeft, scrollY:scrollTop};
}

function PB_SetPopupPosition(oSrc, oPopup, nLeft, nTop)
{
	var pos = PB_GetPosition(oSrc);
	
	var leftP = pos.x;
	var topP = pos.y;
	
	if (!nLeft)
	{
		nLeft = 0;
	}

	if (!nTop)
	{
		nTop = parseInt(oSrc.style.height);
	}
	
	oPopup.style.position = "absolute";
	oPopup.style.left = leftP + "px";
	oPopup.style.top = topP + "px";

	if ((document.body.clientWidth - (pos.x + oSrc.offsetWidth - document.body.scrollLeft)) > oPopup.offsetWidth)
	{
		leftP = pos.x - pos.scrollX + nLeft;
	}
	else
	{
	    leftP = pos.x - pos.scrollX + nLeft;
		// leftP = pos.x + (oSrc.offsetWidth / 2) - oPopup.offsetWidth - pos.scrollX - 4 + nLeft;
	}
	
	if (leftP < 0)
	{
		leftP = 0;
	}

	if ((document.body.clientHeight - (pos.y + oSrc.offsetHeight - document.body.scrollTop)) < oPopup.offsetHeight)
	{
		topP = pos.y - oPopup.offsetHeight - pos.scrollY;
	}
	else
	{
		topP = pos.y + nTop - pos.scrollY;
	}
	
	if (topP < 0)
	{
		topP = 0;
	}
  
	oPopup.style.left = leftP + "px";
	oPopup.style.top = topP + "px";
	oPopup.style.zIndex = 31566;
}

function PB_False()
{
	return false;
}

function PB_PopupGetIFrame(oPopupDiv)
{
		var findIt = false;
		var oIFrame = oPopupDiv.previousSibling;
		while (oIFrame)
		{
			if (oIFrame.nodeType == 1)
			{
				if (oIFrame.tagName.toLowerCase() == "iframe")
				{
					if (oIFrame.src == "")
					{
						findIt = true;
						break;
					}
				}
			}
			
			oIFrame = oIFrame.previousSibling;
		}
		
		if (findIt)
		{
			return oIFrame;
		}
		else
		{
			return null;
		}
}

function PB_PopupAddIFrame(oPopupDiv, transparency)
{
	if (g_IE)
	{
		if (transparency == null)
			transparency = true;

		var oIFrame = PB_PopupGetIFrame(oPopupDiv);
		if (oIFrame == null)
		{
			oIFrame = document.createElement("iframe");
			oIFrame.frameborder = "0";
			oIFrame.border = "0";
			oIFrame.style.border = "0px";
			oIFrame.style.position = "absolute";
			oIFrame.style.left = oPopupDiv.style.left;
			oIFrame.style.top = oPopupDiv.style.top;
			oIFrame.style.width = oPopupDiv.offsetWidth + "px";
			oIFrame.style.height = oPopupDiv.offsetHeight + "px";
			oIFrame.style.zIndex = oPopupDiv.style.zIndex;
			oIFrame.allowTransparency = true;
			if (transparency)
			{
				oIFrame.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
			}
			oIFrame.style.visibility = "visible";

			oPopupDiv.insertAdjacentElement("BeforeBegin", oIFrame);
			oIFrame.contentWindow.document.oncontextmenu = PB_False;
			oIFrame.allowTransparency = false;
		}
		
		return oIFrame;
	}
	else
	{
		return null;
	}
}

function ClearRegisterControl(strWinID)
{
    var oWin = goWindowManager.Get(strWinID);
    if (oWin)
    {
	    oWin.Controls.Keys = new PBSet();
	    oWin.Controls.Values = new Array();
	}
}

function RegisterControl(nType, strID, strWinID, strAccelerator, nTabIndex, bHasRMB)
{
    var oNewControl = new PBControl();
    oNewControl.nType = nType;
	oNewControl.strAccelerator = strAccelerator.toUpperCase();
    oNewControl.nTabIndex = nTabIndex;
    oNewControl.bHasRMB = bHasRMB;
	
	var oFocusObj = document.getElementById(strID);	
	if (oFocusObj != null && oFocusObj.accessKey != "")
	{
		oFocusObj.accessKey = "";
	}
    var oWin = goWindowManager.Get(strWinID);
	oWin.Controls.Put(strID, oNewControl);
}

function ToNumber(strNumber)
{
	var nNumber = 0;
	for (var i = 0; i < strNumber.length; i++)
		nNumber += (strNumber.charAt(i) - '0') * Math.pow(10, strNumber.length - i - 1);
	return nNumber;
}

function PBResize(destName, srcName, addWidth, addHeight)
{
	var srcObj = document.getElementById(srcName);
	var destObj = document.getElementById(destName);

	if (srcObj && destObj)
	{
		destObj.style.pixelWidth = srcObj.offsetWidth + addWidth;
		destObj.style.pixelHeight = srcObj.offsetHeight + addHeight;
	}
}

function PB_EncodeJavaScriptString(s)
{
	s = s.replace("\\", "\\\\");
	s = s.replace("\n", "\\n");
	s = s.replace("\r", "\\r");
	s = s.replace("\f", "\\f");
	s = s.replace("\t", "\\t");
	s = s.replace("\b", "\\b");
	s = s.replace("\v", "\\v");
	s = s.replace("\'", "\\\'");
	s = s.replace("\"", "\\\"");

	return s;
}

function PB_ShowMask()
{
	g_maskCount++;
	
	if (g_maskCount > 1)
	{
		return;
	}

	var oMask = document.getElementById(PB_MASK__DIV);
	if (oMask)
	{
		if (oMask.style.visibility == "hidden")
		{
			oMask.style.cursor = "wait";
			oMask.style.visibility = "visible";
		}

		var oIFrame = PB_PopupGetIFrame(oMask);
		if (oIFrame)
		{
			if (oIFrame.style.visibility == "hidden")
			{
				oIFrame.style.visibility = "visible";
			}
		}
	}
	else
	{
		oMask = document.createElement("div");
		oMask.oncontextmenu = PB_False;
		oMask.id = PB_MASK__DIV;
		oMask.style.zIndex = 60000;
		oMask.style.position = "absolute";
		oMask.style.cursor = "wait";
		oMask.style.left = "0px";
		oMask.style.top = "0px";
		oMask.style.border = "none";
		oMask.style.width = document.body.clientWidth + "px";
		var height = document.documentElement.scrollHeight - 4;
		if (height < 0)
		{
			height = 0;
		}
		oMask.style.height = height + "px";
		document.getElementsByTagName("body")[0].appendChild(oMask);
		PB_PopupAddIFrame(oMask);
	}
}

function PB_HideMask(force)
{
	if (g_inErrorPage)
	{
		return;
	}
	
	if (force)
	{
		g_maskCount = 0;
	}
	else if (g_maskCount > 0)
	{
		g_maskCount--;
	}
	
	if (g_maskCount == 0)
	{
		var oMask = document.getElementById(PB_MASK__DIV);
		if (oMask)
		{
			oMask.style.cursor = "";
			oMask.style.visibility = "hidden";
			var oIFrame = PB_PopupGetIFrame(oMask);
			if (oIFrame)
			{
				oIFrame.style.visibility = "hidden";
			}
		}
	}
}

function PB_ShowExecuteFail(isClose)
{
	g_inErrorPage = true;

	var oMask = document.getElementById(PB_MASK__DIV);
	if (oMask)
	{
		var url = "execute_error.htm";
		if (isClose)
		{
			url += "?isClose";
		}

		var oIFrame = PB_PopupGetIFrame(oMask);
		if (oIFrame)
		{
			oIFrame.allowTransparency = false;
			oIFrame.style.filter = "";
			oIFrame.src = url;
		}
		else
		{
			window.location = url;
		}
	}
}

function PB_PictureButtonDown(evt, tableTag)
{
	PB_pictureButtonDown = true;
	tableTag.style.borderColor = "darkgray";
	tableTag.style.borderStyle = "window-inset";
	tableTag.style.borderWidth = "2px";
}

function PB_PictureButtonUp(evt, tableTag, flatStyle)
{
	PB_pictureButtonDown = false;
	if (PB_pictureButtonOver)
	{
		tableTag.style.borderColor = "#fcca69";
		tableTag.style.borderWidth = "1px";
		tableTag.style.borderStyle = "outset";
	}
	else
	{
		if (flatStyle)
		{
			tableTag.style.borderStyle = "none";
			tableTag.parentNode.style.borderColor = "black";
		}
		else
		{
			tableTag.style.borderColor = "white";
			tableTag.style.borderWidth = "1px";
			tableTag.style.borderStyle = "outset";
		}
	}
}

function PB_PictureButtonOver(evt, tableTag, flatStyle)
{
	PB_pictureButtonOver = true;
	if (PB_pictureButtonDown)
	{
		tableTag.style.borderColor = "darkgray";
	}
	else
	{
		tableTag.style.borderColor = "#fcca69";
	}

	if (flatStyle)
	{
		tableTag.parentNode.style.borderColor = "darkblue";
		tableTag.style.borderStyle = "outset";
		tableTag.style.borderWidth = "1px";
		tableTag.style.borderLeftColor = "white";
	}
}

function PB_PictureButtonOut(evt, tableTag, flatStyle)
{
	PB_pictureButtonOver = false;

	if (flatStyle)
	{
		tableTag.style.borderStyle = "none";
		tableTag.parentNode.style.borderColor = "black";
	}
	else
	{
		tableTag.style.borderColor = "white";
		tableTag.style.borderStyle = "outset";
		tableTag.style.borderWidth = "1px";
	}
}

function PB_PictureButtonClick(evt, inputTagTagName, tableTagClientName)
{
	goWindowManager.OnFocusOwn(tableTagClientName);
	var inputTag = document.getElementById(inputTagTagName);
	if (inputTag)
	{
		inputTag.focus();
		inputTag.click();
	}
}

function PB_PictureButtonOnFocus(evt, inputTagTagName)
{
	var inputTag = document.getElementById(inputTagTagName);
	if (inputTag)
	{
		g_oldPBBorderStyle = inputTag.style.borderStyle;
		g_oldPBBorderWidth = inputTag.style.borderWidth;
		g_oldPBBorderColor = inputTag.style.borderColor;

		inputTag.style.borderStyle = "dotted";
		inputTag.style.borderWidth = "1px";
		inputTag.style.borderColor = "#A9A9A9";
	}
}

function PB_PictureButtonOnBlur(evt, inputTagTagName)
{
	var inputTag = document.getElementById(inputTagTagName);
	if (inputTag)
	{
		inputTag.style.borderStyle = g_oldPBBorderStyle;
		inputTag.style.borderWidth = g_oldPBBorderWidth;
		inputTag.style.borderColor = g_oldPBBorderColor;
	}
}

function PB_OpenUrl(url)
{
	window.open(url);
}

function PB_ShowCloseWindowUrl(lvlStr)
{
	document.write("<a href='" + lvlStr + "/'>Home Page</a>");

	if (window.opener)
	{
		document.write("&nbsp;&nbsp;<a href='javascript:window.close()'>Close</a>");
	}
}

function PB_HasDisabledRadioButtonInGroup(groupName)
{
	var bHasDisabled = true;
	var rbList = document.getElementsByName(groupName);
	if (rbList)
	{
		if (rbList.length)
		{
			for (var i = 0; i < rbList.length; i++)
			{
				if (rbList[i].disabled) break;
			}
			if (i == rbList.length)
			{
				bHasDisabled = false;
			}
		}
	}
	return bHasDisabled;
}

function PB_ResetOtherRadioButtons(evt, groupName, radioThis)
{
	var rbList = document.getElementsByName(groupName);
	if (rbList)
	{
		if (rbList.length)
		{
			for (var i = 0; i < rbList.length; i++)
			{
				if (rbList[i] != radioThis)
				{
					rbList[i].checked = false;
				}
			}
		}
		else
		{
			if (rbList != radioThis)
			{
				rbList.checked = false;
			}
		}
	}
}

function PB_RadioButtonSetFocus(evt, widgetID)
{
	var radioTag = document.getElementById(widgetID);
	radioTag.focus();
	goWindowManager.OnFocusOwn(widgetID);
}

function PB_RadioButtonOnFocus(evt, widgetID)
{
	goWindowManager.OnFocusOwn(widgetID);

	var lblTag = document.getElementById(widgetID+"_lbl");
	if (lblTag)
	{
		g_oldPBRadioBorderStyle = lblTag.style.borderStyle;
		g_oldPBRadioBorderWidth = lblTag.style.borderWidth;
		g_oldPBRadioBorderColor = lblTag.style.borderColor;

		lblTag.style.borderStyle = "dotted";
		lblTag.style.borderWidth = "1px";
		lblTag.style.borderColor = "#A9A9A9";
		
		var divTag = document.getElementById(widgetID+"_div");
		if (divTag)
		{
			var pbGrpName = divTag.getAttribute("pbgrpname");
			if (pbGrpName != "")
			{
				var radioTag = document.getElementById(widgetID);
				var group = document.getElementById(pbGrpName);
				if (group && radioTag.checked)
				{
					group.setAttribute("pbradiobtn", widgetID);
				}
			}
		}
	}
}

function PB_RadioButtonOnBlur(evt, widgetID)
{
	var lblTag = document.getElementById(widgetID+"_lbl");
	if (lblTag)
	{
		lblTag.style.borderStyle = g_oldPBRadioBorderStyle;
		lblTag.style.borderWidth = g_oldPBRadioBorderWidth;
		lblTag.style.borderColor = g_oldPBRadioBorderColor;
	}
}

function PB_RadioButtonFireClick(evt, widgetID)
{
	var radioTag = document.getElementById(widgetID);
	if (radioTag)
	{
		radioTag.click();
	}
}

function RadToolbar_SetPBStyle(tlbID, backColor, textColor, bGradient, isContemporary)
{
	var tlbElement = document.getElementById(tlbID);
	if (tlbElement == null) return;
	RadControl_SetIcon(tlbElement);
	var tbls = tlbElement.getElementsByTagName("TABLE");;
	for (var i=0;i<tbls.length;i++) 
	{
		tbls[i].style.borderWidth = "1px";
		tbls[i].style.borderStyle = "outset";
		tbls[i].style.backgroundColor = backColor;
	}
	if (isContemporary)
	{
		var tds = tlbElement.getElementsByTagName("TD");;
		for (var i=0;i<tds.length;i++) 
		{
			if (tds[i].className.indexOf("pbcontemporary_radtoolbar_left") != -1)
			{
				var oImg = document.createElement("IMG");
				oImg.src = "./images/RadToolbarLeft_c.bmp";
				oImg.style.filter = "Chroma(Color = #c0c0c0)";
				oImg.style.backgroundRepeat = "no-repeat";
				tds[i].appendChild(oImg);
			}
			tds[i].style.color = textColor;
			if (bGradient)
				tds[i].style.filter = "progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=#ffffff,endColorStr="+backColor+")";
			else
				tds[i].style.backgroundColor = backColor;
		}
	}
}

function RadMenuClass(isContemporary, fontFamily, fontSize, fontWeight, fontItalic, fontUnderline, backColor, foreColor, highlightColor, bitmapBackColor, gradient)
{
	this.isContemporary = isContemporary;
	this.fontFamily = fontFamily;
	this.fontSize = fontSize;
	this.fontWeight = fontWeight;
	this.fontItalic = fontItalic;
	this.fontUnderline = fontUnderline;
	this.backColor = backColor;
	this.foreColor = foreColor;
	this.highlightColor = highlightColor;
	this.bitmapBackColor = bitmapBackColor;
	this.gradient = gradient;
}

function RadMenu_SetPBStyle(menuID)
{
	var menuElement = document.getElementById(menuID);
	var radMenu = RadMenuMap.Get(menuID);
	if (radMenu.isContemporary)
		RadMenu_SetPBStyleContemporary(menuElement,radMenu);
	RadMenu_SetSelected(menuElement,radMenu);
}

function RadMenu_SetSelected(menuElement,radMenu)
{
	var links = menuElement.getElementsByTagName("a");
	for (var i=0;i<links.length;i++) 
	{
		if (links[i].className.indexOf("selected")!=-1)
		{
			var imgs = links[i].getElementsByTagName("img");
			if (imgs.length>0)
				imgs[0].style.border = "solid 1px #316AC5";
			else
			{
				var oImg = document.createElement("IMG");
				oImg.src = "./images/checkbox_1_2.jpg";
				oImg.style.position = "absolute";
				oImg.style.left = "6px";
				oImg.style.top = "4px";
				oImg.style.border = "none";
				oImg.style.backgroundRepeat = "no-repeat";
				links[i].insertBefore(oImg, null);
			}
		}
	}
}

function RadMenu_ItemNode(itemElement)
{
	this.item = itemElement;
	this.link = null;
	this.img = null;
	this.text = null;
	this.isSelected = false;
	this.isSeparator = false;
}
function RadMenu_InitItemNode(node)
{
	if (node.item.className.indexOf("separator")!=-1)
	{
		node.isSeparator=true;
		return;
	}
	var itemChildren=node.item.children;
	for (var i=0;i<itemChildren.length;i++)
	{
		if (itemChildren[i].nodeName=="A")
		{
			node.link=itemChildren[i];
			if (node.link.className.indexOf("selected")!=-1)
				node.isSelected=true;
			var nodes=itemChildren[i].children;
			for (var n=0;n<nodes.length;n++)
			{
				if (nodes[n].nodeName=="IMG")
					node.img=nodes[n];
				if (nodes[n].nodeName=="SPAN")
					node.text=nodes[n];
			}
		}
	}
}
function RadMenu_SetPBStyleContemporary(menuElement,radMenu)
{
	RadControl_SetIcon(menuElement);
	var divs = menuElement.getElementsByTagName("div");
	if (divs!=null)
	{
		for (var i=0;i<divs.length;i++) 
			if (divs[i].className.indexOf("PBContemporary")!=-1)
				divs[i].style.backgroundColor = radMenu.backColor;
	}
	var itemHeight = parseInt(radMenu.fontSize)*96/72;
	if (itemHeight<16) itemHeight=16;
	var menus = menuElement.getElementsByTagName("ul");
	for (var i=0;i<menus.length;i++) 
	{
		var menu=menus[i];
		if (menu.className.indexOf("group")!=-1)
			menu.style.backgroundColor = radMenu.backColor;
		var items=menu.children;
		for (var j=0;j<items.length;j++)
		{
			var item=items[j];
			var node=new RadMenu_ItemNode(item);
			RadMenu_InitItemNode(node);
			text=node.text;
			if (text!=null)
			{
				text.style.color = radMenu.foreColor;
				text.style.fontFamily = radMenu.fontFamily;
				text.style.fontSize = radMenu.fontSize;
				if ( radMenu.fontWeight >0)
					text.style.fontWeight = radMenu.fontWeight;
				if (radMenu.fontItalic)
					text.style.fontStyle = "italic";
				if (radMenu.fontUnderline)
					text.style.textDecoration = "underline";
				text.style.lineHeight = itemHeight+"px";
				if (menu.className.indexOf("rootGroup")!=-1)
				{
					text.style.fontSize="8pt";
					text.style.lineHeight="8pt";
				}
			}
			
			if (menu.className.indexOf("vertical")!=-1)
			{
		 	  if( !((j == items.length -1) && (item.className.indexOf("separator")!=-1))) 
		      {
				var oSpan = document.createElement("SPAN");
				oSpan.className = "bitmapBack";
				oSpan.style.position = "absolute";
				oSpan.style.left = "0px";
				oSpan.style.top = "1px";
				if (node.isSeparator)
					oSpan.style.top = "-1px";
				oSpan.style.width = "26px";
				var height = itemHeight;
				//if (node.img!=null&&itemHeight<16)
				if (itemHeight<16)
					height = 16;
				if (node.isSelected)
					height = height+2;
				if (item.className.indexOf("last")!=-1)
					oSpan.style.height = (height+4)+"px";
				else
					oSpan.style.height = (height+6)+"px";
				oSpan.style.lineHeight = oSpan.style.height;
				if (radMenu.gradient)
					oSpan.style.filter = "progid:DXImageTransform.Microsoft.Gradient(gradientType=1,startColorStr=#ffffff,endColorStr="+radMenu.bitmapBackColor+")";
				else
					oSpan.style.backgroundColor = radMenu.bitmapBackColor;
				oSpan.style.zIndex = "-100";
				item.appendChild(oSpan);
			  }
			}
		}
	}
}

function RadMenu_OnClientContextShowing(sender, eventArgs)
{
	return false;
}

function RadMenu_OnMouseOut(sender, eventArgs)
{
    element = document.getElementById(eventArgs.Item.ID);
    for (i=0; i < element.children.length; i++)
        if (element.children[i].id == 'glass') {
            element.children[i].parentNode.removeChild(element.children[i]);
        }

    element.style.borderColor = "transparent";
}

function RadMenu_OnMouseOver(sender, eventArgs)
{
    menu = document.getElementById(sender.ID);
    var radMenu = RadMenuMap.Get(menu.parentNode.id);
    if (radMenu)
    {
        element = document.getElementById(eventArgs.Item.ID);
        
        newEl = document.createElement('div');
        newEl.id = 'glass';
        newEl.style.position = 'absolute';
        newEl.style.background = radMenu.highlightColor;
        newEl.style.top = 1;
        newEl.style.left = 1;
        newEl.style.filter = "alpha(opacity=50)";
        newEl.style.opacity = 0.5;
        newEl.style.mozOpacity = 0.5;
        newEl.style.width = element.offsetWidth;
        newEl.style.height = element.offsetHeight;
        
        element.appendChild(newEl);
    }
}

function RadControl_SetIcon(objElement)
{
	var imgs = objElement.getElementsByTagName("IMG");;
	for (var i=0;i<imgs.length;i++) 
	{
		imgs[i].style.width="16px";
		imgs[i].style.height="16px";
		if(imgs[i].src.indexOf(".bmp") != -1)
			imgs[i].style.filter = "Chroma(Color = #c0c0c0)";
	}
}

function RadMenu_ShowPopup(clientID)
{
	var menu = window[clientID];
	if (menu.IsContext)
	{
		var menuElement = document.getElementById(clientID);
		var x = parseInt(menuElement.style.left);
		var y = parseInt(menuElement.style.top);
		menu.Detached = true;
		menu.ShowAt(x, y);
	}
}

function PB_RadStyleReset(calendarID)
{
	PB_RadSetTodayBorder(calendarID);
	
	var oCalendar = document.getElementById(calendarID);
	var oCalendarTop = document.getElementById(calendarID + "_Top");

	var cursor = oCalendar.style.cursor;
	if (cursor == "")
	{
		cursor = "default";
	}
	else if (cursor.substring(0, 3) == "url")
	{
		cursor = cursor.substring(5, cursor.length - 2);
	}
		
	var aTags = oCalendarTop.getElementsByTagName("a");
	if (aTags)
	{
		var boldCalendar = oCalendar.style.fontWeight == "bold" || oCalendar.style.fontWeight == "700";
		
		for (var i = 0; i < aTags.length; i++)
		{
			var bold = aTags[i].parentNode.style.fontWeight;
			var underline = aTags[i].parentNode.style.textDecoration;
		
			var color = aTags[i].parentNode.style.color;
			var backgroundColor = aTags[i].parentNode.style.backgroundColor;

			if (boldCalendar)
			{
				aTags[i].style.fontWeight = "bold";
			}
			else if (bold)
			{
				aTags[i].style.fontWeight = bold;
			}
			
			if (underline)
			{
				aTags[i].style.textDecoration = underline;
			}

			aTags[i].style.cursor = cursor;
			
			if (color)
			{
				aTags[i].style.color = color;
			}
			
			if (backgroundColor)
			{
				aTags[i].style.backgroundColor = backgroundColor;
			}
		}
	}

	var aTags = oCalendarTop.getElementsByTagName("td");
	if (aTags)
	{
		for (var i = 0; i < aTags.length; i++)
		{
			aTags[i].style.cursor = cursor;
		}
	}
}

function PB_RadSetTodayBorder(calendarID, oCell, mouseOver)
{
	var oToday = document.getElementById(calendarID+'_today');
	if (oToday)
	{
		var tD = new Date(oToday.value);

		var setCss = false;
		if (typeof(oCell) == "undefined")
		{
			var radCalendar = window[calendarID];
			oCell = radCalendar.FindRenderDay([tD.getFullYear(), tD.getMonth() + 1, tD.getDate()]);
			setCss = (oCell != null);
		}
		else
		{
			var newD = new Date(oCell.Date[0], oCell.Date[1] - 1, oCell.Date[2]);
			setCss = (newD.toDateString() == tD.toDateString());

			var backgroundColor = oCell.DomElement.currentStyle.backgroundColor;
			if (backgroundColor)
			{
				var aTags = oCell.DomElement.getElementsByTagName("a");
				if (aTags)
				{
					if (mouseOver)
					{
						oCell.OldCellBackColor = aTags[0].style.backgroundColor;
						aTags[0].style.backgroundColor = backgroundColor;
					}
					else
					{
						aTags[0].style.backgroundColor = oCell.OldCellBackColor;
						oCell.OldCellBackColor = "";
					}
				}
			}
		}

		if (setCss)
		{
			var oTodayCycle = document.getElementById(calendarID+'_tc');
			if (oTodayCycle.value == 'true')
			{
				oCell.DomElement.style.cssText += ';border:solid red 1px';
			}
		}
	}
}

function PB_MessageBoxButtonClick(evt, messageBoxID, buttonID)
{
	__doPostBack(messageBoxID, buttonID);
}

function PB_DecodeHtmlString(str)
{
	return unescape(str.replace("&nbsp;", " "));
}

function PB_AjaxJsHandler(clientID, index)
{
	var oDiv = document.getElementById(clientID);
	if (oDiv)
	{
		var regExp = new RegExp("<script[^>]*>([\\S\\s]*?)<\/script>", "img");
		var jsList = oDiv.innerHTML.match(regExp);
		if (jsList)
		{
			regExp = new RegExp("<script[^>]*>([\\S\\s]*?)<\/script>", "im");
			for (var i = 0; i < jsList.length; i++)
			{
				var addIt = (index > -1) ? (i == index) : true;
				if (addIt)
				{
					eval((jsList[i].match(regExp) || ['', ''])[1]);
				}
			}
		}
	}
}

function PB_AjaxJsLoaded()
{
	if (typeof(Sys) !== 'undefined')
	{
		Sys.Application.notifyScriptLoaded();
	}
}

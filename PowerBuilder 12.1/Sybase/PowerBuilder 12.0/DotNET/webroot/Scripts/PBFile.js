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

var g_UploadFileWin = null;

function PBFile_UploadFiles(staticId, folderPath, bgColor, fileNum, showServerFolder, description, allowExts, callback)
{
	var url = "pbuploadfile.aspx?folder=" + escape(folderPath)
		+ "&bgColor=" + escape(bgColor) + "&fileNum=" + fileNum + "&showServerFolder="
		+ showServerFolder + "&description=" + escape(description) + "&allowExts=" + escape(allowExts)
		+ "&callback=" + callback + "&staticId=" + (staticId == null ? "" : escape(staticId));
	
	if (g_IE)
	{
		var returnValue = window.showModalDialog(url, "", "dialogHeight=100px,dialogWidth=100px,scrollbars=no,status=no,resizable=yes");
		
		PBFile_UploadWindowClose(staticId, callback, returnValue);
	}
	else
	{
		var newWindow = true;
		if (g_UploadFileWin != null)
		{
			if (!g_UploadFileWin.closed)
			{
				newWindow = false;
			}
		}
		
		if (newWindow)
		{
			g_UploadFileWin = window.open(url, "", "height=100px,width=100px,scrollbars=no,status=no,resizable=yes,dialog=yes,modal=yes");
		}
		else
		{
			g_UploadFileWin.focus();
		}
	}
}

function PBFile_UploadWindowClose(staticId, callback, returnValue)
{
	if (staticId != null)
	{
		if (returnValue != "")
		{
		    goStaticManager.OnClick(g_dummyWindowEvent, staticId);
		}
	}
	else if (callback)
	{
		goWindowManager.UploadFiles(returnValue);
	}
	
	g_UploadFileWin = null;
}

function PBFile_DownloadFile(url, open)
{
	var oWin;
	if (open)
	{
		oWin = window.open(url);
	}
	else
	{
		oWin = window.open(url, "_blank", "toolbar=no,menubar=no,location=no,status=no,width=200,height=200");
	}

	if (oWin)
	{
		if (!oWin.closed)
		{
		    try
		    {
		        oWin.focus();
		        oWin.setTimeout("if (!window.closed) window.focus();", 1000);
		    }
		    catch (e)
		    {
		    }			    
		}
	}
	else
	{
		window.alert("A pop-up blocker is on. To view the Web page, turn off the pop-up blocker.");
	}
}

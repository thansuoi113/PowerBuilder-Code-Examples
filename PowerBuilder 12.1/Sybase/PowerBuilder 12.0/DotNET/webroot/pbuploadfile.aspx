<%@ Page language="c#" EnableViewState="false" SmartNavigation="false" Codebehind="pbuploadfile.aspx.cs" AutoEventWireup="false" Inherits="PBWebApp.PBUploadFilePage" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head runat="server">
		<title>Upload Files</title>
		<meta http-equiv="Page-Enter" content="blendTrans(Duration=0.0200)"> 
		<meta name="GENERATOR" Content="Sybase PBWeb.NET Compiler">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
	</head>
	<body id="mainBody" runat="server">
		<form id="Form1" enctype="multipart/form-data" target="PB__UploadDialog" runat="server">
		<input type="hidden" id="hidReturnValue" runat="server"/>
		<input type="hidden" id="hidStaticId" runat="server"/>
		<input type="hidden" id="hidCallback" runat="server"/>
		<input type="hidden" id="hidAllowExts" runat="server"/>
		<table border="0" width="100%" cellpadding="0" cellspacing="0" id="mainTable" runat="server">
			<tr>
				<td align="center" valign="middle">
		<table border="0" cellpadding="2" cellspacing="2" class="table10">
			<tr id="trServerFolderTitle" runat="server">
				<td colspan="2">
					<strong>My Selected Folder at Server</strong>
				</td>
			</tr>
			<tr id="trServerFolder" runat="server">
				<td colspan="2">
					<asp:Label id="lblFolder" runat="server"/>
				</td>
			</tr>
			<tr id="trDescription" runat="server">
				<td colspan="2">
					<asp:Label id="lblDescription" runat="server"/>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<asp:Label id="lblMessage" runat="server" ForeColor="red" />&nbsp;
				</td>
			</tr>
		<asp:Repeater ID="repFile" runat="server">
			<HeaderTemplate>
			</HeaderTemplate>
			<ItemTemplate>
			  <tr>
				<td>
				  <asp:Label runat="server" ID="lblNum" />.
				</td>
				<td>
				  <input type="file" id="inputFile" runat="server" size="51" />
				</td>
			  </tr>
			</ItemTemplate>
			<FooterTemplate>
			</FooterTemplate>
		</asp:Repeater>
			<tr>
				<td align="center" colspan="2">
					<pb:WebInternalButton text="Upload" id="uploadBtn" onclientclick="return checkFile(this.form)" runat="server" />&nbsp;&nbsp;
					<pb:WebInternalButton text="Close" onclientclick="javascript:closeIt(this.form);return false;" runat="server" />
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<b>NOTE:</b> If the file exists with the same name in the folder, it will be overwritten.
				</td>
			</tr>
		</table>
				</td>
			</tr>
		</table>
		</form>
	</body>
</html>

<script language="JavaScript">
<!--
function checkFile(frmThis)
{
	var checkExts = (frmThis.hidAllowExts.value != "");
	var allowExts = frmThis.hidAllowExts.value.toLowerCase().split(";");
	var choosed = false;
	var isAllowExt = false;
	var aInputs = frmThis.getElementsByTagName("INPUT");
	if (aInputs)
	{
		if (aInputs.length)
		{
			for (var i = 0; i < aInputs.length; i++)
			{
				if (aInputs[i].type == "file")
				{
					if (aInputs[i].value != "")
					{
						choosed = true;
						isAllowExt = false;
						
						if (checkExts)
						{
							var ext = aInputs[i].value.substr(aInputs[i].value.lastIndexOf('.')).toLowerCase();
							
							for (var j = 0; j < allowExts.length; j++)
							{
								if (ext == allowExts[j])
								{
									isAllowExt = true;
									break;
								}
							}
						
							if (!isAllowExt)
							{
								alert("You can only upload files of the following types: " + frmThis.hidAllowExts.value);
								return false;
							}
						}
						else
						{
							break;
						}
					}
				}
			}
		}
		else
		{
			if (aInputs.type == "file")
			{
				if (aInputs.value != "")
				{
					choosed = true;

					isAllowExt = false;
					
					if (checkExts)
					{
						var ext = aInputs.value.substr(aInputs.value.lastIndexOf('.')).toLowerCase();
						
						for (var j = 0; j < allowExts.length; j++)
						{
							if (ext == allowExts[j])
							{
								isAllowExt = true;
								break;
							}
						}
					
						if (!isAllowExt)
						{
							alert("You can only upload files of the following types: " + frmThis.hidAllowExts.value);
							return false;
						}
					}
				}
			}
		}
	}

	if (!choosed)
	{
		alert("Please choose a file first!");
		return false;
	}

	return true;
}

function closeIt(frmThis)
{
	window.close();
	
	if (!document.all)
	{
		closeCallBack(frmThis);
	}
}

function closeCallBack(frmThis)
{
	if (window.opener)
	{
		if (!window.opener.closed)
		{
			var staticId = frmThis.hidStaticId.value;
			var callback = (frmThis.hidCallback.value.toLowerCase() == "true");
			var returnValue = frmThis.hidReturnValue.value;
			
			window.opener.PBFile_UploadWindowClose(staticId, callback, returnValue);
		}
	}
}

window.name = "PB__UploadDialog";
window.returnValue = document.forms[0].hidReturnValue.value;

window.onload = function()
{
	var mainTable = document.getElementById("mainTable");
	var width = document.body.scrollWidth;
	var height = mainTable.offsetHeight;

	var dlgWidth;
	if (window.dialogWidth)
	{
		dlgWidth = parseInt(window.dialogWidth);
	}
	else
	{
		dlgWidth = parseInt(window.outerWidth);
	}

	var dlgHeight;
	if (window.dialogHeight)
	{
		dlgHeight = parseInt(window.dialogHeight);
	}
	else
	{
		dlgHeight = parseInt(window.outerHeight);
	}
	
	if ((dlgWidth < width) || (dlgHeight < height))
	{
		var marginSize;
		if (document.body.currentStyle)
		{
			marginSize = parseInt(document.body.currentStyle.margin);
		}
		else
		{
			marginSize = 0;
		}

		var newWidth = (width + (marginSize * 2) + 50);
		var newHeight = (mainTable.offsetHeight + 50);
		
		if (window.dialogWidth)
		{
			window.dialogWidth = newWidth + "px";
			window.dialogHeight = newHeight + "px";
		}
		else
		{
			window.resizeTo(newWidth, newHeight);
		}
	}
}

if (!document.all)
{
	window.onunload = function()
	{
		closeCallBack(document.forms[0]);
	}
}
//-->
</script>


<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserEdit.aspx.cs" Inherits="admin_UserEdit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>User Detail Page</title>
	<link href="../xp.css" type="text/css" rel="stylesheet" />
	<script language="JavaScript" type="text/javascript" src="../scripts/PBCommonUtil.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
		<a href="Users.aspx">Back to Users</a>&nbsp;&nbsp;
		<asp:LoginStatus ID="LoginStatus1" runat="server" />
		<script language="JavaScript">
		<!--
		PB_ShowCloseWindowUrl("..");
		//-->
		</script>
		<p/>
		<table border="0">
			<tr bgcolor="#EFF3FB">
				<th bgcolor="#507CD1"><font color="white">User Name</font></th>
				<td><asp:Label ID="lblUserName" runat="server" Text="Label"></asp:Label></td>
			</tr>
			<tr>
				<th bgcolor="#507CD1"><font color="white">E-mail</font></th>
				<td><asp:TextBox ID="txtEmail" runat="server" /></td>
			</tr>
			<tr bgcolor="#EFF3FB">
				<th bgcolor="#507CD1"><font color="white">Enable</font></th>
				<td><asp:CheckBox ID="chkApproved" runat="server" Text="" /></td>
			</tr>
			<tr>
				<th bgcolor="#507CD1"><font color="white">Admin Role</font></th>
				<td><asp:CheckBox ID="chkAdminRole" runat="server" Text="" /></td>
			</tr>
			<tr>
				<td colspan="2">
					<asp:Button ID="btnUpdate" runat="server" Text="Update User" OnClick="btnUpdate_Click" />
					<asp:Button ID="btnUnlock" runat="server" Text="Unlock User" OnClick="btnUnlock_Click" />
					<asp:Button ID="btnDelete" runat="server" Text="Delete User" OnClick="btnDelete_Click" />
				</td>
			</tr>
			<tr>
				<td colspan="2"><hr size="1"></td>
			</tr>
			<tr>
				<th bgcolor="#507CD1"><font color="white">New Password</font></th>
				<td>
					<asp:TextBox ID="txtNewPassword" runat="server" />
					<asp:Button ID="btnResetPassword" ValidationGroup="resetpwd" runat="server" Text="Reset Password" OnClick="btnResetPassword_Click" />
				</td>
			</tr>
		</table>    
		<asp:HiddenField ID="UserName" runat="server" />
		<asp:RequiredFieldValidator ID="valNewPassword" runat="server" ControlToValidate="txtNewPassword"
			ErrorMessage="Please key in the new password!" ValidationGroup="resetpwd"></asp:RequiredFieldValidator>
    </div>
    </form>
</body>
</html>

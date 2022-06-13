<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Users.aspx.cs" Inherits="admin_Users" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Users Page</title>
	<link href="../xp.css" type="text/css" rel="stylesheet" />
	<script language="JavaScript" type="text/javascript" src="../scripts/PBCommonUtil.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
		<asp:Label ID="Label1" runat="server" Font-Bold="True" Text="User Name:"></asp:Label>
		<asp:TextBox ID="txtUserName" runat="server"></asp:TextBox>
		<asp:Button ID="btnSearch" runat="server" OnClick="btnSearch_Click" Text="Search" />
		&nbsp;&nbsp;<a href="UserAdd.aspx">Create New User</a>&nbsp;&nbsp;
		<asp:LoginStatus ID="LoginStatus1" runat="server" />
		<script language="JavaScript">
		<!--
		PB_ShowCloseWindowUrl("..");
		//-->
		</script>
		<p />
		<asp:GridView ID="grdUsers" AutoGenerateColumns="false" AllowPaging="True" AllowSorting="True"
		DataKeyNames="Username"	PageSize="20" Runat="Server">
			<Columns>
				<asp:BoundField HeaderText="Username" DataField="Username" />
				<asp:BoundField HeaderText="Email" DataField="Email" />
				<asp:BoundField HeaderText="Last Activity Date" 
				 DataField="LastActivityDate" DataFormatString="{0:d}" />
				<asp:CheckBoxField HeaderText="Is Online" DataField="IsOnline" />
				<asp:CheckBoxField HeaderText="Enable" DataField="IsApproved" />
				<asp:CheckBoxField HeaderText="Locked" DataField="IsLockedOut" />
				<asp:HyperLinkField DataNavigateUrlFields="Username" DataNavigateUrlFormatString="UserEdit.aspx?UserName={0}"
				HeaderText="User Details" Text="Edit">
					<ItemStyle HorizontalAlign="Center" />
				</asp:HyperLinkField>
			</Columns>
			<FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
			<RowStyle BackColor="#EFF3FB" />
			<EditRowStyle BackColor="#2461BF" />
			<SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
			<PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
			<HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
			<AlternatingRowStyle BackColor="White" />
		</asp:GridView>    
    </div>
    </form>
</body>
</html>

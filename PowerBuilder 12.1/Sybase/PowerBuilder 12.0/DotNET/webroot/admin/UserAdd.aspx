<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserAdd.aspx.cs" Inherits="admin_UserAdd" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Create User Page</title>
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
		<asp:CreateUserWizard ID="CreateUserWizard1" runat="server" BackColor="#EFF3FB" BorderColor="#B5C7DE"
			BorderStyle="Solid" BorderWidth="1px" OnCreatedUser="CreateUserWizard1_CreatedUser"  FinishDestinationPageUrl="Users.aspx" LoginCreatedUser="False">
			<WizardSteps>
				<asp:CreateUserWizardStep runat="server" EnableTheming="False" Title="Create New User">
				</asp:CreateUserWizardStep>
				<asp:CompleteWizardStep runat="server">
					<ContentTemplate>
						<table border="0" cellpadding="4" cellspacing="4">
							<tr>
								<td align="center" style="font-weight: bold; color: white; background-color: #507cd1">
									Assign Role</td>
							</tr>
							<tr>
								<td align="center">
									<asp:CheckBox ID="chkAdminRole" runat="server" Text="Admin Role" />
								</td>
							</tr>
							<tr>
								<td align="right">
									<asp:Button ID="btnAssignRole" ForeColor="#284E98" BackColor="White"
										BorderColor="#507CD1" BorderWidth="1px" BorderStyle="Solid"
										runat="server" OnClick="btnAssignRole_Click" Text="Finish" />
								</td>
							</tr>
						</table>
					</ContentTemplate>
				</asp:CompleteWizardStep>
			</WizardSteps>
			<TextBoxStyle Width="200" />
			<SideBarStyle BackColor="#507CD1" VerticalAlign="Top" />
			<TitleTextStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
			<SideBarButtonStyle BackColor="#507CD1" ForeColor="White" />
			<NavigationButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
				BorderWidth="1px" ForeColor="#284E98" />
			<HeaderStyle BackColor="#284E98" BorderColor="#EFF3FB" BorderStyle="Solid" BorderWidth="2px"
				Font-Bold="True" ForeColor="White" HorizontalAlign="Center" />
			<CreateUserButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
				BorderWidth="1px" ForeColor="#284E98" />
			<ContinueButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
				BorderWidth="1px" ForeColor="#284E98" />
		</asp:CreateUserWizard>
    </div>
    </form>
</body>
</html>

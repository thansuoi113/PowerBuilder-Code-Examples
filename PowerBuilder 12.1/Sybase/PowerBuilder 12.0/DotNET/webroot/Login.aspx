<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import namespace="Sybase.PowerBuilder.Web" %>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
		PBSession session = PBSession.CurrentSession;
		if (session != null)
		{
			session.InitPermanentUser();
		}
    }
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Login Page</title>
	<link href="xp.css" type="text/css" rel="stylesheet" />
	<script language="JavaScript" type="text/javascript" src="scripts/PBCommonUtil.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
	<asp:LoginView id="LoginView1" runat="server">
		<AnonymousTemplate>
			<script language="JavaScript">
			<!--
			PB_ShowCloseWindowUrl(".");
			//-->
			</script>
			<p/>
			<asp:Login ID="Login1" runat="server" BackColor="#EFF3FB" BorderColor="#B5C7DE" BorderPadding="4"
				BorderStyle="Solid" BorderWidth="1px" 
				ForeColor="#333333" VisibleWhenLoggedIn="False" DestinationPageUrl="Login.aspx">
				<TitleTextStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
				<InstructionTextStyle Font-Italic="True" ForeColor="Black" />
				<TextBoxStyle Width="100" />
				<LoginButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid" BorderWidth="1px"
					 ForeColor="#284E98" />
			</asp:Login>
		</AnonymousTemplate>
		<LoggedInTemplate>
			<b>Welcome</b> <asp:LoginName ID="LoginName1" runat="server" />.
			<asp:LoginStatus ID="LoginStatus1" runat="server" />&nbsp;&nbsp;
			<script language="JavaScript">
			<!--
			PB_ShowCloseWindowUrl(".");
			//-->
			</script>
			<p/>
			<asp:ChangePassword ID="ChangePassword1" runat="server" BackColor="#EFF3FB"
				BorderColor="#B5C7DE" BorderPadding="4" BorderStyle="Solid" BorderWidth="1px"
				ContinueDestinationPageUrl="Login.aspx">
				<CancelButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid" BorderWidth="1px"
					ForeColor="#284E98" />
				<InstructionTextStyle Font-Italic="True" ForeColor="Black" />
				<PasswordHintStyle Font-Italic="True" ForeColor="#507CD1" />
				<ChangePasswordButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
					BorderWidth="1px" ForeColor="#284E98" />
				<ContinueButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
					BorderWidth="1px" ForeColor="#284E98" />
				<TitleTextStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
				<TextBoxStyle />
			</asp:ChangePassword>
		</LoggedInTemplate>
		<RoleGroups>
			<asp:RoleGroup Roles="admin">
				<ContentTemplate>
					<b>Welcome</b> <asp:LoginName ID="LoginName1" runat="server" />.
					<asp:LoginStatus ID="LoginStatus1" runat="server" />&nbsp;&nbsp;
					<a href="admin/Users.aspx">Users</a>&nbsp;&nbsp;
					<script language="JavaScript">
					<!--
					PB_ShowCloseWindowUrl(".");
					//-->
					</script>
					<p/>
					<asp:ChangePassword ID="ChangePassword1" runat="server" BackColor="#EFF3FB"
						BorderColor="#B5C7DE" BorderPadding="4" BorderStyle="Solid" BorderWidth="1px">
						<CancelButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid" BorderWidth="1px"
							ForeColor="#284E98" />
						<InstructionTextStyle Font-Italic="True" ForeColor="Black" />
						<PasswordHintStyle Font-Italic="True" ForeColor="#507CD1" />
						<ChangePasswordButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
							BorderWidth="1px" ForeColor="#284E98" />
						<ContinueButtonStyle BackColor="White" BorderColor="#507CD1" BorderStyle="Solid"
							BorderWidth="1px" ForeColor="#284E98" />
						<TitleTextStyle BackColor="#507CD1" Font-Bold="True" Font-Size="0.9em" ForeColor="White" />
						<TextBoxStyle />
					</asp:ChangePassword>
				</ContentTemplate>
			</asp:RoleGroup>
		</RoleGroups>
	</asp:LoginView>
    </div>
    </form>
</body>
</html>

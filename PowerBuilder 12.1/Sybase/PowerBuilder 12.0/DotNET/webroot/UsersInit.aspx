<%@ Page Language="C#" AutoEventWireup="true" %>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
		CreateRole("admin");
		CreateRole("user");

		MembershipCreateStatus mcs;

		MembershipUser mu = Membership.GetUser("admin");
		if (mu != null)
		{
			Membership.DeleteUser(mu.UserName);
		}

		Membership.CreateUser("admin", "a123456&", "admin@admin",
			"adminquestion", "adminanswer", true, out mcs);
		AddUserToRole("admin", "admin");

		mu = Membership.GetUser("user");
		if (mu != null)
		{
			Membership.DeleteUser(mu.UserName);
		}

		Membership.CreateUser("user", "a123456&", "user@user",
			"userquestion", "useranswer", true, out mcs);
		AddUserToRole("user", "user");
	}

	private void CreateRole(string roleName)
	{
		if (!Roles.RoleExists(roleName))
		{
			Roles.CreateRole(roleName);
		}
	}

	private void AddUserToRole(string userName, string roleName)
	{
		if (!Roles.IsUserInRole(userName, roleName))
		{
			Roles.AddUserToRole(userName, roleName);
		}
	}
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Admin Init Page</title>
	<link href="xp.css" type="text/css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
	Successful!
    </form>
</body>
</html>

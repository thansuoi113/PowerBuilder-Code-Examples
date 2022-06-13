using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class admin_Users : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
	}

	protected void btnSearch_Click(object sender, EventArgs e)
	{
		BindData();
	}

	private void BindData()
	{
		string userName = txtUserName.Text.Trim();

		if (string.IsNullOrEmpty(userName))
		{
			grdUsers.DataSource = Membership.GetAllUsers();
		}
		else
		{
			grdUsers.DataSource = Membership.FindUsersByName(userName);
		}

		grdUsers.DataBind();
	}
}

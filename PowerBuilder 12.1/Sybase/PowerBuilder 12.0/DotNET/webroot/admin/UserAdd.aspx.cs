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

public partial class admin_UserAdd : System.Web.UI.Page
{
	public const string ADMIN_ROLE = "admin";
	public const string USER_ROLE = "user";

    protected void Page_Load(object sender, EventArgs e)
    {

    }
	protected void CreateUserWizard1_CreatedUser(object sender, EventArgs e)
	{
		MembershipUser mu = Membership.GetUser(CreateUserWizard1.UserName);
		if (mu != null)
		{
			if (!Roles.IsUserInRole(mu.UserName, USER_ROLE))
			{
				Roles.AddUserToRole(mu.UserName, USER_ROLE);
			}
		}
	}
	protected void btnAssignRole_Click(object sender, EventArgs e)
	{
		CheckBox chkAdminRole =
				(CheckBox)CreateUserWizard1.CompleteStep.ContentTemplateContainer.FindControl("chkAdminRole");
		if (chkAdminRole.Checked)
		{
			MembershipUser mu = Membership.GetUser(CreateUserWizard1.UserName);
			if (mu != null)
			{
				if (!Roles.IsUserInRole(mu.UserName, ADMIN_ROLE))
				{
					Roles.AddUserToRole(mu.UserName, ADMIN_ROLE);
				}
			}
		}

		Response.Redirect(CreateUserWizard1.FinishDestinationPageUrl);
	}
}

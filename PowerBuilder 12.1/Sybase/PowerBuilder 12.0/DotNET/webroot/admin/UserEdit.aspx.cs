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

public partial class admin_UserEdit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
		if (!Page.IsPostBack)
		{
			BindData();
		}
    }

	protected void btnUpdate_Click(object sender, EventArgs e)
	{
		MembershipUser mu = Membership.GetUser(UserName.Value);
		if (mu != null)
		{
			mu.Email = txtEmail.Text;
			mu.IsApproved = chkApproved.Checked;
			Membership.UpdateUser(mu);

			if (chkAdminRole.Checked)
			{
				if (!Roles.IsUserInRole(mu.UserName, admin_UserAdd.ADMIN_ROLE))
				{
					Roles.AddUserToRole(mu.UserName, admin_UserAdd.ADMIN_ROLE);
				}
			}
			else
			{
				if (Roles.IsUserInRole(mu.UserName, admin_UserAdd.ADMIN_ROLE))
				{
					Roles.RemoveUserFromRole(mu.UserName, admin_UserAdd.ADMIN_ROLE);
				}
			}
		}
	}
	protected void btnUnlock_Click(object sender, EventArgs e)
	{
		MembershipUser mu = Membership.GetUser(UserName.Value);
		if ((mu != null) && mu.IsLockedOut)
		{
			mu.UnlockUser();
		}
	}
	protected void btnDelete_Click(object sender, EventArgs e)
	{
		if (Membership.DeleteUser(UserName.Value))
		{
			Response.Redirect("Users.aspx");
		}
	}
	protected void btnResetPassword_Click(object sender, EventArgs e)
	{
		MembershipUser mu = Membership.GetUser(UserName.Value);
		if (mu != null)
		{
			string temp = mu.ResetPassword();
			mu.ChangePassword(temp, txtNewPassword.Text);
		}
	}

	private void BindData()
	{
		if (string.IsNullOrEmpty(UserName.Value))
		{
			UserName.Value = Request["UserName"];
		}

		MembershipUser mu = Membership.GetUser(UserName.Value);
		if (mu != null)
		{
			btnUnlock.Visible = mu.IsLockedOut;

			lblUserName.Text = mu.UserName;
			txtEmail.Text = mu.Email;
			chkApproved.Checked = mu.IsApproved;

			chkAdminRole.Checked = Roles.IsUserInRole(mu.UserName, admin_UserAdd.ADMIN_ROLE);
		}
		else
		{
			btnUnlock.Visible = false;

			lblUserName.Text = string.Empty;
			txtEmail.Text = string.Empty;
			chkApproved.Checked = false;

			chkAdminRole.Checked = false;
		}
	}
}

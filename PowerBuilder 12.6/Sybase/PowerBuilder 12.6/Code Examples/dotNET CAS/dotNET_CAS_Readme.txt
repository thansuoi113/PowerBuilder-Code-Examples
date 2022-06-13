This sample demonstrates the .NET Code Access Security feature implemented in PowerBuilder .NET Windows Forms targets.

Steps to run this example
=========================
1. Deploy the .NET Windows Forms target.

2. Open the "p_netcas_winform" project in the Project painter

3. Click on the "Security" tab. Make sure the "Full trust" radio button is selected.

4. Run the application. Navigate to all parts of the application to make sure that all pages work correctly.

5. Close the application and open the "Security" tab again.

6. This time, select "Local intranet trust" and run the application again.

7. Examine the security exeception error messages that display when you attempt to execute some of the features on application pages, note the permissions required for the feature executions, and close the application.

8. Open the Project painter "Security" tab again and add the required permissions in the list box under the radio button options, but do not change the radio button selection.

9. Run the application again, making sure that all pages work correctly with the newly added permissions.

10. Repeat the steps 6 to 9 for "Internet trust" and "Custom" security permission zones.

-------------------------

.NET Code Access security includes the following general security zone definitions:

1. Full Trust - Has all permissions to execute. Typically applies to application assemblies executed from a local folder (on the same computer).

2. Local Intranet Trust - Has a minimum set of permissions. Typically applies to application assemblies executed from a shared network folder.

3. Internet Trust - has a minimum set of permissions. Typically applies to application assemblies executed through a URL.

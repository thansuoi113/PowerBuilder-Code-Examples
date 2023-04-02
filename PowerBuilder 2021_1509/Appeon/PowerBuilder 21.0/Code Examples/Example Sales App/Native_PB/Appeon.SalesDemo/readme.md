Welcome to this Sales CRM Demo application!

The application contains the basic function modules about sales order processing. Please use it to experience and learn the following PowerBuilder features:

•	RibbonBar implementation (For the RibbonBar definition file, see the ribbonbar_show.xml in the application folder);

•	UI theme and its customization (For the theme settings, see the Theme folder in the application folder);

•	Loading JavaScript in WebBrowser for reporting (For more information, see the bubble.html, column1.html, line.html, and loader.js files in the application folders). 


Confirming or adjusting the default PowerClient and PowerServer project settings:

The demo application contains default PowerClient and PowerServer projects. Please double check the project settings against your environment, to make sure the projects can work correctly.
With both the PowerClient and PowerServer projects: 

•	Setting up the local web server. The demo project is deployed to local web server by default. If you go with the local server, make sure:
	(1)	IIS is running on the current machine:
	(2)	The “local” web server profile is configured in the Web Server Profile configuration, and Cloud App Launcher is uploaded to the local server. 

With the PowerServer projects: 
•	License settings in the Web APIs tab
	Please import a valid license into the project settings using Auto Import (importing the current PowerBuilder CloudPro or trial license), or Import from File (file from the License Management page on https://account.appeon.com). 

•	Solution location in the Web APIs tab
	The default location is set to [current user]\source\repos. If it does not exist on the current machine, please select a valid one.

•	Web API URL in the Web APIs tab
	Make sure the port setting in the Web API URL is not occupied by another program. Also, if you plan to apply a web debugging proxy tool to debug the deployed application, avoid using “localhost” in the URL. Instead, change to the actual IP address. 

•	Database Configuration in the Web APIs tab
	If you use SQL Anywhere as the demo database, no change is needed to the database configuration. 
	If you use PostgreSQL as the demo database, the default login account is postgres (user)/postgres (password). Please double check the connection. 

